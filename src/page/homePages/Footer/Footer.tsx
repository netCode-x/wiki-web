import React from 'react';
import styles from '@/page/homePages/Footer/Footer.module.scss';

interface FriendLink {
    name: string;
    description: string;
    url?: string;
}

const friendLinks: FriendLink[] = [
    {
        name: "Kiwi2333's Blog",
        description: '一个正在学习的独立开发者',
        url: '#',
    },
    {
        name: 'ZLX STUDIO',
        description: '为音乐创作发电！',
        url: '#',
    },
    {
        name: '菜卡云',
        description: '致力于提供稳定可靠、安全可信、可持续创新的云...',
        url: '#',
    },
];

const Footer: React.FC = () => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            // 可以添加提示，这里简单 console
            console.log(`${label} 已复制: ${text}`);
        }).catch(() => {
            console.error('复制失败');
        });
    };

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    {/* 左侧：友情链接区域 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>友情链接</h2>
                        <div className={styles.friendLinks}>
                            {friendLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    className={styles.friendCard}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <h3 className={styles.linkName}>{link.name}</h3>
                                    <p className={styles.linkDesc}>{link.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 右侧：新布局 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>关注我们</h2>
                        <div className={styles.rightContent}>
                            {/* 社交媒体图标区 */}
                            <div className={styles.socialIcons}>
                                <a
                                    href="https://github.com/yangkaihu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.iconLink}
                                    aria-label="GitHub"
                                >
                                    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                                <a
                                    href="https://"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.iconLink}
                                    aria-label="哔哩哔哩"
                                >
                                    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.223 3.086c-1.333 0-2.417.8-3.043 1.657-.517.707-.85 1.6-1.01 2.5-.105-.6-.263-1.2-.473-1.78-.315-.9-.798-1.7-1.448-2.34-.653-.64-1.476-1.03-2.32-1.03-1.443 0-2.7.8-3.433 1.97-.334.53-.583 1.13-.734 1.77-.152.64-.21 1.3-.178 1.96.03.66.13 1.31.303 1.95.172.64.414 1.25.73 1.81.317.56.707 1.07 1.157 1.51.45.44.962.81 1.53 1.1.566.29 1.19.5 1.84.62.65.12 1.32.16 1.99.13.67-.03 1.33-.13 1.98-.3.65-.17 1.28-.43 1.86-.78.58-.35 1.1-.8 1.55-1.32.45-.52.82-1.12 1.1-1.77.28-.65.47-1.34.56-2.05.09-.71.09-1.43 0-2.15-.09-.72-.28-1.42-.56-2.07-.28-.65-.65-1.25-1.1-1.77-.45-.52-.97-.97-1.55-1.32-.58-.35-1.21-.61-1.86-.78-.65-.17-1.31-.27-1.98-.3-.67-.03-1.33.01-1.99.13-.65.12-1.28.33-1.84.62-.57.29-1.08.66-1.53 1.1-.45.44-.84.95-1.157 1.51-.316.56-.558 1.17-.73 1.81-.173.64-.273 1.29-.303 1.95-.03.66.026 1.32.178 1.96.151.64.4 1.24.734 1.77.733 1.17 1.99 1.97 3.433 1.97.844 0 1.667-.39 2.32-1.03.65-.64 1.133-1.44 1.448-2.34.21-.58.368-1.18.473-1.78.16.9.493 1.793 1.01 2.5.626.857 1.71 1.657 3.043 1.657 1.458 0 2.704-.9 3.427-2.08.316-.55.553-1.15.722-1.78.17-.63.257-1.29.273-1.95.016-.66-.046-1.32-.188-1.96-.142-.64-.354-1.25-.64-1.81-.286-.56-.65-1.07-1.087-1.51-.436-.44-.95-.81-1.522-1.1-.572-.29-1.192-.5-1.842-.62-.65-.12-1.318-.16-1.985-.13-.667.03-1.327.13-1.977.3-.65.17-1.28.43-1.86.78-.58.35-1.1.8-1.55 1.32-.45.52-.82 1.12-1.1 1.77-.28.65-.47 1.34-.56 2.05-.09.71-.09 1.43 0 2.15.09.72.28 1.42.56 2.07.28.65.65 1.25 1.1 1.77.45.52.97.97 1.55 1.32.58.35 1.21.61 1.86.78.65.17 1.31.27 1.98.3.67.03 1.33-.01 1.99-.13.65-.12 1.28-.33 1.84-.62.57-.29 1.08-.66 1.53-1.1.45-.44.84-.95 1.157-1.51.316-.56.558-1.17.73-1.81.173-.64.273-1.29.303-1.95.03-.66-.026-1.32-.178-1.96-.151-.64-.4-1.24-.734-1.77-.733-1.17-1.99-1.97-3.433-1.97z"/>
                                    </svg>
                                </a>
                                <a
                                    href="https://weibo.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.iconLink}
                                    aria-label="微博"
                                >
                                    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.82 8.41c-.22-.23-.48-.35-.78-.35-.35 0-.61.12-.78.35-.17.23-.26.53-.26.9 0 .37.09.67.26.9.17.23.43.35.78.35.3 0 .56-.12.78-.35.17-.23.26-.53.26-.9 0-.37-.09-.67-.26-.9zm-1.4-2.6c-1.08-.96-2.5-1.5-4.25-1.5-1.68 0-3.12.5-4.31 1.5-1.19 1-1.78 2.28-1.78 3.84 0 1.58.59 2.87 1.78 3.87 1.19 1 2.63 1.5 4.31 1.5 1.68 0 3.12-.5 4.31-1.5 1.19-1 1.78-2.29 1.78-3.87 0-1.56-.59-2.84-1.78-3.84zM7.18 14.31c-1.86.18-3.62.06-5.28-.36-1.66-.42-2.85-1.05-3.57-1.89-.72-.84-1.08-1.78-1.08-2.82 0-1.23.48-2.28 1.44-3.15.96-.87 2.19-1.35 3.69-1.44-.08.3-.12.6-.12.9 0 1.3.5 2.4 1.5 3.3 1 .9 2.26 1.35 3.78 1.35.33 0 .66-.03.99-.09.27-.06.54-.15.81-.27.27-.12.53-.27.78-.45.25-.18.47-.39.66-.63.19-.24.34-.51.45-.81.11-.3.17-.63.18-.99.01-.36-.03-.72-.12-1.08-.09-.36-.24-.72-.45-1.08-.21-.36-.48-.69-.81-.99-.33-.3-.72-.54-1.17-.72-.45-.18-.96-.27-1.53-.27-1.15 0-2.14.32-2.97.96-.83.64-1.33 1.44-1.5 2.4-.17.96-.09 1.86.24 2.7.33.84.9 1.5 1.71 1.98.81.48 1.8.78 2.97.9 1.17.12 2.34.09 3.51-.09 1.17-.18 2.22-.51 3.15-.99.93-.48 1.68-1.11 2.25-1.89.57-.78.93-1.65 1.08-2.61.15-.96.12-1.92-.09-2.88-.21-.96-.6-1.83-1.17-2.61-.57-.78-1.29-1.41-2.16-1.89-.87-.48-1.83-.78-2.88-.9-1.05-.12-2.07-.06-3.06.18-.99.24-1.86.66-2.61 1.26-.75.6-1.32 1.35-1.71 2.25-.39.9-.57 1.92-.54 3.06.03 1.14.24 2.22.63 3.24.39 1.02.96 1.92 1.71 2.7.75.78 1.68 1.38 2.79 1.8 1.11.42 2.34.63 3.69.63 1.29 0 2.52-.21 3.69-.63 1.17-.42 2.19-1.02 3.06-1.8.87-.78 1.53-1.68 1.98-2.7.45-1.02.66-2.1.63-3.24-.03-1.14-.27-2.22-.72-3.24-.45-1.02-1.08-1.92-1.89-2.7z"/>
                                    </svg>
                                </a>
                            </div>

                            {/* 个人信息 + 二维码区域 */}
                            <div className={styles.infoQr}>
                                <div className={styles.contactInfo}>
                                    <div className={styles.contactItem}>
                                        <span className={styles.contactLabel}>微信：</span>
                                        <span
                                            className={styles.contactValue}
                                            onClick={() => handleCopy('yangkaihu', '微信号')}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCopy('yangkaihu', '微信号')}
                                        >
                                            yangkaihu
                                        </span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <span className={styles.contactLabel}>QQ：</span>
                                        <span
                                            className={styles.contactValue}
                                            onClick={() => handleCopy('13048981034', 'QQ号')}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCopy('13048981034', 'QQ号')}
                                        >
                                            13048981034
                                        </span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <span className={styles.contactLabel}>邮箱：</span>
                                        <span
                                            className={styles.contactValue}
                                            onClick={() => handleCopy('yangkaihu@163.com', '邮箱')}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCopy('yangkaihu@163.com', '邮箱')}
                                        >
                                            yangkaihu@163.com
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.qrCode}>
                                    <div className={styles.qrPlaceholder}>
                                        <span>微信<br/>二维码</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 备案信息 */}
                <div className={styles.copyright}>
                    <p>备案/许可证 粤ICP备19012866号</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;