import React from 'react';
import styles from '@/page/homePages/Home/Home.module.scss';

const Home: React.FC = () => {
    const handleMessageWallClick = () => {
        alert('跳转到留言墙（实际可集成路由）');
        // 实际项目中可替换为路由跳转
    };

    return (
        <div className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <h1 className={styles.mainTitle}>neter</h1>
                    <p className={styles.conjunction}>的</p>
                    <h2 className={styles.subTitle}>慢下脚步</h2>
                    <p className={styles.description}>让心灵照亮前行的路</p>
                    <button
                        className={styles.messageBtn}
                        onClick={handleMessageWallClick}
                        type="button"
                    >
                        留言墙
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;