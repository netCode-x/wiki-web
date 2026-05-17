import React, { useState, useEffect, useRef } from 'react';
import styles from '@/page/homePages/StatsBanner/StatsBanner.module.scss';

interface CarouselItem {
    id: number;
    title: string;
    description: string;
    bgColor: string;
}

const carouselItems: CarouselItem[] = [
    { id: 1, title: '无视 DDOS', description: '智能清洗，秒级响应', bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 2, title: '无视变异 CC', description: '精准识别，零误封', bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 3, title: '稳定云防护', description: '99.99% 可用性 SLA', bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
];

const StatsBanner: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const timerRef = useRef<number | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // 自动轮播
    useEffect(() => {
        startAutoPlay();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startAutoPlay = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
        }, 3000);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        startAutoPlay();
    };

    const nextSlide = () => {
        goToSlide((currentIndex + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        goToSlide((currentIndex - 1 + carouselItems.length) % carouselItems.length);
    };

    // 触摸滑动
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            // 向左滑动
            nextSlide();
        }
        if (touchStart - touchEnd < -50) {
            // 向右滑动
            prevSlide();
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleWebsiteClick = () => {
        window.open('https://www.lanyiyun.com', '_blank');
    };

    return (
        <section className={styles.statsBanner}>
            <div className="container">
                <div className={styles.wrapper}>
                    {/* 左侧统计信息 */}
                    <div className={styles.statsInfo}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                <span className={styles.number}>116,889</span>
                                <span className={styles.label}>总访问量</span>
                            </div>
                            <div className={styles.brand}>
                                <span className={styles.brandName}>蓝易云CDN</span>
                            </div>
                            <div className={styles.description}>
                                <p className={styles.slogan}>无视DDOS攻击、无视一切变异CC</p>
                                <p className={styles.subSlogan}>稳定云防护服务商</p>
                                <p className={styles.detail}>
                                    蓝易云安全专注大攻击防御DDOS、CC，专业的事交给专业的人，
                                    有攻击我们搞定，免备案、不限行业
                                </p>
                            </div>
                            <div className={styles.todayStats}>
                                <div className={styles.todayVisit}>
                                    <span className={styles.todayNumber}>86</span>
                                    <span className={styles.todayLabel}>今日访问</span>
                                </div>
                                <div className={styles.action}>
                                    <button
                                        className={styles.websiteBtn}
                                        onClick={handleWebsiteClick}
                                        type="button"
                                    >
                                        进入官网
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧轮播图 */}
                    <div className={styles.carouselWrapper}>
                        <div
                            className={styles.carouselContainer}
                            ref={carouselRef}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div
                                className={styles.carouselTrack}
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {carouselItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.carouselSlide}
                                        style={{ background: item.bgColor }}
                                    >
                                        <div className={styles.slideContent}>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 左右箭头 */}
                            <button
                                className={`${styles.arrow} ${styles.arrowLeft}`}
                                onClick={prevSlide}
                                aria-label="上一张"
                                type="button"
                            >
                                ‹
                            </button>
                            <button
                                className={`${styles.arrow} ${styles.arrowRight}`}
                                onClick={nextSlide}
                                aria-label="下一张"
                                type="button"
                            >
                                ›
                            </button>

                            {/* 指示点 */}
                            <div className={styles.dots}>
                                {carouselItems.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.dot} ${idx === currentIndex ? styles.active : ''}`}
                                        onClick={() => goToSlide(idx)}
                                        aria-label={`切换到第 ${idx + 1} 张`}
                                        type="button"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsBanner;