// About.tsx
import styles from '@/page/homePages/About/AboutPage.module.scss';
import { personalInfo, skills, tools, bookmarks, highlights, stats } from '@/page/homePages/About/aboutData.tsx';
import SimpleLayout from "@/page/homePages/MainPage/SimpleLayout.tsx";


const About = () => {
    return (
        <div className={styles.aboutContainer}>
            <SimpleLayout />
            <main className={styles.aboutContent}>
                {/* 左侧个人信息卡片 */}
                <aside className={styles.profileSidebar}>
                    <div className={styles.profileCard}>
                        <div className={styles.avatarWrapper}>
                            <img src={personalInfo.avatar} alt="avatar" className={styles.avatar} />
                            <span className={styles.statusDot}></span>
                        </div>
                        <h2 className={styles.profileName}>{personalInfo.name}</h2>
                        <p className={styles.profileNickname}>@{personalInfo.nickname}</p>
                        <p className={styles.profileRole}>{personalInfo.role}</p>
                        <p className={styles.profileLocation}>{personalInfo.location}</p>
                        <div className={styles.profileBio}>
                            <p>{personalInfo.bio}</p>
                        </div>
                        <div className={styles.contactLinks}>
                            <a href={`mailto:${personalInfo.email}`} className={styles.contactLink}>
                                📧 {personalInfo.email}
                            </a>
                            <a
                                href={`https://${personalInfo.github}`}
                                className={styles.contactLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                💻 {personalInfo.github}
                            </a>
                        </div>
                    </div>

                    <div className={styles.bookmarksCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardIcon}>🔖</span>
                            <h3>所有书签</h3>
                            <span className={styles.badge}>{bookmarks.length}</span>
                        </div>
                        <ul className={styles.bookmarksList}>
                            {bookmarks.map((bookmark) => (
                                <li key={bookmark.title}>
                                    <a href={bookmark.url} className={styles.bookmarkItem}>
                                        <span className={styles.bookmarkIcon}>{bookmark.icon}</span>
                                        <span className={styles.bookmarkTitle}>{bookmark.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.statsCard}>
                        <div className={styles.statsGrid}>
                            {stats.map((stat) => (
                                <div className={styles.statItem} key={stat.label}>
                                    <div className={styles.statIcon}>{stat.icon}</div>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* 右侧详情区域 */}
                <section className={styles.detailsArea}>
                    <div className={`${styles.infoCard}`}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.titleIcon}>🛠️</span> 实用工具配置 & 技术体系
                        </h3>
                        <div className={styles.skillsCloud}>
                            {skills.map((skill) => (
                                <div key={skill.name} className={styles.skillTag} data-category={skill.category}>
                                    {skill.name}
                                    {skill.level && (
                                        <span className={styles.skillLevel} style={{ width: `${skill.level}%` }}></span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className={styles.toolsList}>
                            <span className={styles.toolsLabel}>常用工具：</span>
                            {tools.map((tool) => (
                                <span key={tool} className={styles.toolBadge}>
                  {tool}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.infoCard} ${styles.highlightsSection}`}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.titleIcon}>🎬</span> 视频创作 & 技术分享
                            </h3>
                            <span className={styles.sectionSub}>近期热榜</span>
                        </div>
                        <div className={styles.highlightsGrid}>
                            {highlights.map((item) => (
                                <div key={item.title} className={styles.highlightCard}>
                                    <div className={styles.highlightType}>
                                        {item.type === 'video' ? '🎬 视频' : '📄 文章'}
                                    </div>
                                    <h4 className={styles.highlightTitle}>{item.title}</h4>
                                    <p className={styles.highlightDesc}>{item.description}</p>
                                    <div className={styles.highlightTags}>
                                        {item.tags.map((tag) => (
                                            <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.infoCard} ${styles.interestsSection}`}>
                        <h3 className={styles.sectionTitle}>
                            <span className={styles.titleIcon}>✨</span> 探索领域 & 生活趣味
                        </h3>
                        <div className={styles.interestTags}>
                            <span className={styles.interestTag}>🌍 旅行</span>
                            <span className={styles.interestTag}>📊 技术总结</span>
                            <span className={styles.interestTag}>🚀 产品设计</span>
                            <span className={styles.interestTag}>🎨 UI/UX</span>
                            <span className={styles.interestTag}>🎵 音乐制作</span>
                            <span className={styles.interestTag}>📖 开源贡献</span>
                        </div>
                        <div className={styles.quoteBlock}>
                            <p className={styles.quoteText}>
                                “技术不仅是为了解决问题，更是创造价值的艺术。持续学习，保持好奇，分享让成长更有意义。”
                            </p>
                            <p className={styles.quoteAuthor}>—— 具雪雲 / neter</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;