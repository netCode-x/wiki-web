import React, { useEffect, useRef, useState } from 'react';
import styles from '@/page/homePages/Login/LoginModal.module.scss';
import service from '@/utils/axios.ts';
import type { LoginOrRegisterRequest, LoginOrRegisterResponse, ResetPasswordRequest, SendEmailRequest } from "@/type/api";
import { message } from 'antd';
import { isAxiosError } from "axios";

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: (user: { name: string }) => void;
}

type ModalMode = 'login' | 'register' | 'forgot';

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [registerEmail, setRegisterEmail] = useState(''); // 注册用的邮箱
    const [emailCode, setEmailCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [mode, setMode] = useState<ModalMode>('login');
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const countdownInterval = useRef<number | null>(null);

    // 生成验证码
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    // 倒计时清理
    useEffect(() => {
        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        };
    }, []);

    // 开始倒计时
    const startCountdown = (seconds: number = 60) => {
        setCountdown(seconds);
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }
        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (countdownInterval.current) {
                        clearInterval(countdownInterval.current);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // 发送找回密码邮箱验证码
    const handleSendEmailCode = async () => {
        if (!email) {
            message.warning('请输入邮箱地址');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            message.warning('请输入有效的邮箱地址');
            return;
        }

        if (sendingCode || countdown > 0) return;

        setSendingCode(true);
        try {
            const requestData: SendEmailRequest = {
                email: email.trim(),
            };

            const response = await service.post<SendEmailRequest>('/password/forget', requestData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.code === 200) {
                message.success('验证码已发送到您的邮箱');
                startCountdown(60);
            } else {
                message.error('发送失败，请重试');
            }
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const errorMsg = (error.response?.data as { msg?: string })?.msg;
                message.error(errorMsg || '发送失败，请检查网络连接');
            }
        } finally {
            setSendingCode(false);
        }
    };

    // 重置密码提交
    const handleResetPassword = async () => {
        if (!username) {
            message.warning('请输入用户名');
            return;
        }
        if (!email) {
            message.warning('请输入邮箱地址');
            return;
        }
        if (!emailCode) {
            message.warning('请输入邮箱验证码');
            return;
        }
        if (!newPassword) {
            message.error('请输入新密码');
            return;
        }
        if (newPassword !== confirmPassword) {
            message.error('两次输入的密码不一致');
            return;
        }
        if (newPassword.length < 6) {
            message.error('密码长度至少为6位');
            return;
        }

        setLoading(true);
        try {
            const requestData: ResetPasswordRequest = {
                username: username.trim(),
                email: email.trim(),
                emailCode: emailCode.trim(),
                newPassword: newPassword,
                confirmPassword: confirmPassword
            };

            const response = await service.post<LoginOrRegisterResponse>('/password/reset', requestData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.code === 200) {
                message.success('密码重置成功，请使用新密码登录');
                resetForm();
                setMode('login');
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                message.error(response.msg || '密码重置失败');
                generateCaptcha();
                setCaptchaValue('');
            }
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const errorMsg = (error.response?.data as { msg?: string })?.msg;
                message.error(errorMsg || '重置失败，请重试');
            }
            generateCaptcha();
            setCaptchaValue('');
        } finally {
            setLoading(false);
        }
    };

    // 登录提交
    const handleLogin = async () => {
        if (!captchaValue.trim()) {
            message.warning('请输入验证码');
            return;
        }
        if (captchaValue.toLowerCase() !== captcha.toLowerCase()) {
            message.error('验证码错误，请重新输入');
            setCaptchaValue('');
            generateCaptcha();
            return;
        }

        setLoading(true);
        try {
            const requestData: LoginOrRegisterRequest = {
                username: username.trim(),
                password: password.trim()
            };

            const response = await service.post<LoginOrRegisterResponse>('/auth/login', requestData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("获取返回状态码: "+ response.code)

            if (response.code === 200) {
                const { token, username: userName, userId } = response.data;

                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('userInfo', JSON.stringify({
                        username: userName || username,
                        userId: userId,
                        loginTime: Date.now()
                    }));
                    service.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                message.success(`登录成功，欢迎 ${userName || username}！`);
                onLoginSuccess({ name: userName || username });

                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error: unknown) {
         /*  if (isAxiosError(error)) {
               const errorMsg = (error.response?.data as { msg?: string })?.msg;
               console.error('登录错误: ', errorMsg)
               message.error(error.response?.data.msg || '登录失败')
           }*/
           message.error("登录失败: "+ error);
            generateCaptcha();
            setCaptchaValue('');
        } finally {
            setLoading(false);
        }
    };

    // 注册提交（只增加邮箱字段，不需要验证码）
    const handleRegister = async () => {
        if (!captchaValue.trim()) {
            message.warning('请输入验证码');
            return;
        }
        if (captchaValue.toLowerCase() !== captcha.toLowerCase()) {
            message.error('验证码错误，请重新输入');
            setCaptchaValue('');
            generateCaptcha();
            return;
        }
        if (!username) {
            message.warning('请输入用户名');
            return;
        }
        if (!password) {
            message.warning('请输入密码');
            return;
        }
        if (password.length < 6) {
            message.error('密码长度至少为6位');
            return;
        }
        if (!registerEmail) {
            message.warning('请输入邮箱地址');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerEmail)) {
            message.warning('请输入有效的邮箱地址');
            return;
        }

        setLoading(true);
        try {
            const requestData: LoginOrRegisterRequest & { email?: string } = {
                username: username.trim(),
                password: password.trim(),
                email: registerEmail.trim()
            };

            const response = await service.post<LoginOrRegisterResponse>('/auth/register', requestData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.code === 200) {
                message.success('注册成功，请登录');
                console.log("注册成功")
                resetForm();
                setMode('login');
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                console.log("注册失败");
                message.error(response.msg || '注册失败');
                generateCaptcha();
                setCaptchaValue('');
            }
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const errorMsg = (error.response?.data as { msg?: string })?.msg;
                console.error('注册错误:', errorMsg);
                message.error(error.response?.data?.msg || '注册失败');
            }
            message.error("注册失败: " + error);
            generateCaptcha();
            setCaptchaValue('');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (mode === 'login') {
            await handleLogin();
        } else if (mode === 'register') {
            await handleRegister();
        } else if (mode === 'forgot') {
            await handleResetPassword();
        }
    };

    const handleCaptchaRefresh = () => {
        generateCaptcha();
        setCaptchaValue('');
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setRegisterEmail('');
        setEmailCode('');
        setNewPassword('');
        setConfirmPassword('');
        setCaptchaValue('');
        generateCaptcha();
        setCountdown(0);
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }
    };

    const handleSwitchMode = (newMode: ModalMode) => {
        setMode(newMode);
        resetForm();
    };

    const getTitle = () => {
        switch (mode) {
            case 'login': return '登录';
            case 'register': return '注册';
            case 'forgot': return '找回密码';
            default: return '登录';
        }
    };

    const renderFormFields = () => {
        if (mode === 'login') {
            return (
                <>
                    <div className={styles.formGroup}>
                        <label>用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                            autoFocus
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>验证码</label>
                        <div className={styles.captchaWrapper}>
                            <input
                                type="text"
                                value={captchaValue}
                                onChange={e => setCaptchaValue(e.target.value)}
                                placeholder="请输入验证码"
                                className={styles.captchaInput}
                                disabled={loading}
                            />
                            <div className={styles.captchaDisplay} onClick={!loading ? handleCaptchaRefresh : undefined}>
                                <span className={styles.captchaText}>{captcha}</span>
                                <button
                                    type="button"
                                    className={styles.refreshBtn}
                                    aria-label="刷新验证码"
                                    disabled={loading}
                                >
                                    🔄
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (mode === 'register') {
            return (
                <>
                    <div className={styles.formGroup}>
                        <label>用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                            autoFocus
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="请输入密码（至少6位）"
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>邮箱地址</label>
                        <input
                            type="email"
                            value={registerEmail}
                            onChange={e => setRegisterEmail(e.target.value)}
                            placeholder="请输入邮箱地址"
                            disabled={loading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>验证码</label>
                        <div className={styles.captchaWrapper}>
                            <input
                                type="text"
                                value={captchaValue}
                                onChange={e => setCaptchaValue(e.target.value)}
                                placeholder="请输入验证码"
                                className={styles.captchaInput}
                                disabled={loading}
                            />
                            <div className={styles.captchaDisplay} onClick={!loading ? handleCaptchaRefresh : undefined}>
                                <span className={styles.captchaText}>{captcha}</span>
                                <button
                                    type="button"
                                    className={styles.refreshBtn}
                                    aria-label="刷新验证码"
                                    disabled={loading}
                                >
                                    🔄
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        // 找回密码模式
        return (
            <>
                <div className={styles.formGroup}>
                    <label>用户名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="请输入您的用户名"
                        autoFocus
                        disabled={loading}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>邮箱地址</label>
                    <div className={styles.emailWrapper}>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="请输入绑定的邮箱"
                            className={styles.emailInput}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className={styles.sendCodeBtn}
                            onClick={handleSendEmailCode}
                            disabled={loading || sendingCode || countdown > 0}
                        >
                            {countdown > 0 ? `${countdown}秒后重试` : (sendingCode ? '发送中...' : '获取验证码')}
                        </button>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>邮箱验证码</label>
                    <input
                        type="text"
                        value={emailCode}
                        onChange={e => setEmailCode(e.target.value)}
                        placeholder="请输入邮箱验证码"
                        disabled={loading}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>新密码</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="请输入新密码（至少6位）"
                        disabled={loading}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>确认新密码</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="请再次输入新密码"
                        disabled={loading}
                    />
                </div>
            </>
        );
    };

    const getSubmitButtonText = () => {
        if (loading) return '提交中...';
        switch (mode) {
            case 'login': return '登录';
            case 'register': return '注册';
            case 'forgot': return '重置密码';
            default: return '提交';
        }
    };

    const renderFooterLinks = () => {
        if (mode === 'login') {
            return (
                <div className={styles.footerLinks}>
                    <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => handleSwitchMode('forgot')}
                        disabled={loading}
                    >
                        忘记密码？
                    </button>
                    <span className={styles.separator}>|</span>
                    <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => handleSwitchMode('register')}
                        disabled={loading}
                    >
                        立即注册
                    </button>
                </div>
            );
        }

        if (mode === 'register') {
            return (
                <p className={styles.switchMode}>
                    已有账号？
                    <button
                        type="button"
                        className={styles.switchBtn}
                        onClick={() => handleSwitchMode('login')}
                        disabled={loading}
                    >
                        去登录
                    </button>
                </p>
            );
        }

        if (mode === 'forgot') {
            return (
                <p className={styles.switchMode}>
                    <button
                        type="button"
                        className={styles.switchBtn}
                        onClick={() => handleSwitchMode('login')}
                        disabled={loading}
                    >
                        返回登录
                    </button>
                </p>
            );
        }

        return null;
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <h2>{getTitle()}</h2>
                <form onSubmit={handleSubmit}>
                    {renderFormFields()}
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {getSubmitButtonText()}
                    </button>
                </form>
                {renderFooterLinks()}
            </div>
        </div>
    );
};

export default LoginModal;