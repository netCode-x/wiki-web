import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '@/page/homePages/Topbar/Topbar.module.scss';
import LoginModal from '@/page/homePages/Login/LoginModal';

const navItems = [
    {name: '首页', key: '/home'},
    {name: '文章', key: '/articles'},
    {name: '随记', key: '/notes'},
    {name: '下载', key: '/downloads'},
    {name: '图库', key: '/gallery'},
    {name: '关于', key: '/about'},
];

type Theme = 'light' | 'dark';

interface User {
    name: string;
    avatar?: string;
    userId?: number;
    email?: string;
}

// 默认头像组件（圆形灰色）
const DefaultAvatarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

const Topbar = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved && (saved === 'light' || saved === 'dark')) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const [searchValue, setSearchValue] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const avatarWrapperRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef(true);

    // 主题切换
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 滚动隐藏效果
    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(() => {
                    const currentY = window.scrollY;
                    if (currentY > 50 && currentY > lastScrollY.current) {
                        setIsVisible(false);
                        setShowDropdown(false);
                    } else {
                        setIsVisible(true);
                    }
                    lastScrollY.current = currentY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 清理定时器和挂载状态
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            isMounted.current = false;
        };
    }, []);

    // 从 localStorage 恢复用户信息
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');
        if (token && userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                // 使用 requestAnimationFrame 延迟状态更新
                requestAnimationFrame(() => {
                    if (isMounted.current) {
                        setUser({
                            name: parsedUser.username,
                            avatar: parsedUser.avatar,
                            userId: parsedUser.userId,
                            email: parsedUser.email
                        });
                    }
                });
            } catch (e) {
                console.error('解析用户信息失败', e);
            }
        }
    }, []);

    // 鼠标悬停显示菜单
    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setShowDropdown(true);
    };

    // 鼠标离开延迟关闭
    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setShowDropdown(false);
            hoverTimeoutRef.current = null;
        }, 200);
    };

    // 菜单区域鼠标进入（取消关闭）
    const handleDropdownMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    // 菜单区域鼠标离开（延迟关闭）
    const handleDropdownMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setShowDropdown(false);
            hoverTimeoutRef.current = null;
        }, 200);
    };

    const toggleTheme = () => setTheme(prev => (
        prev === 'light' ? 'dark' : 'light'
    ));

    const handleNavClick = (key: string) => {
        navigate(key);
    };

    const handleSearch = () => {
        if (searchValue.trim()) {
            console.log("搜索内容:", searchValue);
        } else {
            alert('请输入搜索内容');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleLoginSuccess = (userData: User) => {
        setUser(userData);
        setShowLoginModal(false);
        setShowDropdown(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
        setShowDropdown(false);
    };

    const handleNavigation = (path: string) => {
        setShowDropdown(false);
        navigate(path);
    };

    return (
        <>
            <nav className={`${styles.topbar} ${!isVisible ? styles.hidden : ''}`}>
                <div className={`${styles.topBarContainer} container`}>
                    <div className={styles.logo}>
                        <span className={styles.logoText}>neter</span>
                    </div>
                    <ul className={styles.navMenu}>
                        {navItems.map(item => (
                            <li key={item.key}>
                                <button
                                    className={styles.navLink}
                                    onClick={() => handleNavClick(item.key)}
                                    type="button"
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.actions}>
                        <div className={styles.searchWrapper}>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="搜索文章、随记..."
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className={styles.searchBtn} onClick={handleSearch}>🔍</button>
                        </div>
                        <button className={styles.themeToggle} onClick={toggleTheme}>
                            {theme === 'light' ? <span>🌙</span> : <span>☀️</span>}
                            <span className={styles.themeText}>{theme === 'light' ? '暗色' : '亮色'}</span>
                        </button>

                        {/* 用户菜单区域 */}
                        <div className={styles.userArea}>
                            {user ? (
                                <div
                                    ref={avatarWrapperRef}
                                    className={styles.avatarWrapper}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button
                                        className={styles.avatarButton}
                                        aria-label="用户菜单"
                                        aria-expanded={showDropdown}
                                    >
                                        <div className={styles.avatar}>
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name}/>
                                            ) : (
                                                <span>{user.name.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span
                                            className={`${styles.chevron} ${showDropdown ? styles.chevronRotated : ''}`}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path
                                                    d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
                                            </svg>
                                        </span>
                                    </button>

                                    {showDropdown && (
                                        <div
                                            ref={dropdownRef}
                                            className={styles.dropdown}
                                            onMouseEnter={handleDropdownMouseEnter}
                                            onMouseLeave={handleDropdownMouseLeave}
                                        >
                                            <div className={styles.dropdownHeader}>
                                                <div className={styles.signedIn}>当前登录账号</div>
                                                <div className={styles.userInfo}>
                                                    <div className={styles.userAvatar}>
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name}/>
                                                        ) : (
                                                            <span>{user.name.charAt(0).toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <div className={styles.userDetails}>
                                                        <div className={styles.userName}>{user.name}</div>
                                                        {user.email && (
                                                            <div className={styles.userEmail}>{user.email}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.dropdownDivider}/>

                                            <div className={styles.dropdownSection}>
                                                <button
                                                    className={styles.dropdownItem}
                                                    onClick={() => handleNavigation('/profile')}
                                                >
                                                    <span className={styles.itemIcon}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16"
                                                             fill="currentColor">
                                                            <path
                                                                d="M10.561 8.073a6 6 0 01-5.122 0 6 6 0 015.122 0zM8 7a2 2 0 100-4 2 2 0 000 4z"/>
                                                            <path fillRule="evenodd"
                                                                  d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                                                        </svg>
                                                    </span>
                                                    后台管理
                                                </button>
                                                <button
                                                    className={styles.dropdownItem}
                                                    onClick={() => handleNavigation('/personal-center')}
                                                >
                                                    <span className={styles.itemIcon}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16"
                                                             fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M1.5 2.5a.5.5 0 01.5-.5h12a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5v-10zm1 .5v4h11V3h-11zm11 5h-11v4h11V8z"/>
                                                        </svg>
                                                    </span>
                                                    个人中心
                                                </button>
                                                <button
                                                    className={styles.dropdownItem}
                                                    onClick={() => handleNavigation('/settings')}
                                                >
                                                    <span className={styles.itemIcon}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16"
                                                             fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.447.222.877.264 1.288.156l1.061-.279c.11-.029.198.009.231.054a6.637 6.637 0 01.809 1.264c.043.102.021.2-.025.296l-.574 1.01c-.297.522-.297 1.127 0 1.649l.574 1.01c.046.096.068.194.025.296a6.64 6.64 0 01-.809 1.264c-.033.045-.121.083-.231.054l-1.061-.279c-.411-.108-.841-.066-1.288.156-.447.222-.85.629-.997 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.605 6.605 0 01-1.142 0c-.036-.003-.108-.036-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189-.447-.222-.877-.264-1.288-.156l-1.061.279c-.11.029-.198-.009-.231-.054a6.634 6.634 0 01-.809-1.264c-.043-.102-.021-.2.025-.296l.574-1.01c.297-.522.297-1.127 0-1.649l-.574-1.01c-.046-.096-.068-.194-.025-.296a6.636 6.636 0 01.809-1.264c.033-.045.121-.083.231-.054l1.061.279c.411.108.841.066 1.288-.156.447-.222.85-.629.997-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/>
                                                        </svg>
                                                    </span>
                                                    设置
                                                </button>
                                            </div>

                                            <div className={styles.dropdownDivider}/>

                                            <div className={styles.dropdownSection}>
                                                <button className={styles.dropdownItem} onClick={toggleTheme}>
                                                    <span className={styles.itemIcon}>
                                                        {theme === 'light' ? (
                                                            <svg width="16" height="16" viewBox="0 0 16 16"
                                                                 fill="currentColor">
                                                                <path fillRule="evenodd"
                                                                      d="M8 11a3 3 0 100-6 3 3 0 000 6zm0 1a4 4 0 100-8 4 4 0 000 8z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg width="16" height="16" viewBox="0 0 16 16"
                                                                 fill="currentColor">
                                                                <path fillRule="evenodd"
                                                                      d="M7.5 1v1h1V1h-1zm0 13v1h1v-1h-1zM3 3.5L2.5 4 3 4.5 3.5 4 3 3.5zm10 0L12.5 4 13 4.5 13.5 4 13 3.5zM3 12.5L2.5 13 3 13.5 3.5 13 3 12.5zm10 0L12.5 13 13 13.5 13.5 13 13 12.5zM1 7.5H0v1h1v-1zm13 0h1v1h-1v-1zM4 8a4 4 0 118 0 4 4 0 01-8 0z"/>
                                                            </svg>
                                                        )}
                                                    </span>
                                                    {theme === 'light' ? '暗色模式' : '亮色模式'}
                                                    <span className={styles.itemShortcut}>
                                                        {theme === 'light' ? '🌙' : '☀️'}
                                                    </span>
                                                </button>
                                            </div>

                                            <div className={styles.dropdownDivider}/>

                                            <div className={styles.dropdownSection}>
                                                <button
                                                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                                                    onClick={handleLogout}
                                                >
                                                    <span className={styles.itemIcon}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16"
                                                             fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M3 2.5a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-1h1v1h8v-11h-8v1h-1v-1z"/>
                                                            <path fillRule="evenodd" d="M7.5 8l-2-2v1h-3v2h3v1l2-2z"/>
                                                        </svg>
                                                    </span>
                                                    退出登录
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    className={styles.loginBtn}
                                    onClick={() => setShowLoginModal(true)}
                                    type="button"
                                >
                                    <div className={styles.loginAvatar}>
                                        <DefaultAvatarIcon/>
                                    </div>
                                    <span className={styles.loginText}>登录</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    );
};

export default Topbar;