import React, { useState, useMemo } from 'react';
import styles from './NotesDiary.module.scss';

const NotesDiary: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // 使用 useMemo 派生日历数据，依赖 currentDate
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0=周日
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const prevMonthDays = startDayOfWeek;
        const totalCells = 42; // 6行*7列
        const days: { date: number; isCurrentMonth: boolean }[] = [];

        // 上个月
        const prevMonthDate = new Date(year, month, 0);
        const prevMonthDaysCount = prevMonthDate.getDate();
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            days.push({ date: prevMonthDaysCount - i, isCurrentMonth: false });
        }

        // 当前月
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: i, isCurrentMonth: true });
        }

        // 下个月
        const remaining = totalCells - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ date: i, isCurrentMonth: false });
        }

        // 分割成二维数组 (6行x7列)
        const rows: { date: number; isCurrentMonth: boolean }[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            rows.push(days.slice(i, i + 7));
        }
        return rows;
    }, [currentDate]);

    const isToday = (day: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return false;
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const goPrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const goNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const articleContent = `
    前几天广州迎来一波寒潮，好冷，这是今年以来到目前最冷的一波寒流，我还没有穿上我的羽绒服。
    我跟美说，如果这波寒流我没有穿羽绒服，那么今年我应该是不再有机会穿上羽绒服了。
    前两年我穿过，都是短暂的几天，我觉得前几天的冷是可以穿羽绒服了。
    可是看了看手机上的天气预报，也就冷两天就回温，等羽绒服撤出来还没有穿热就又没机会穿，最后还得洗，有些浪费。
    也是我也不觉得冷到还需要穿羽绒服的温度。周末就出太阳暖和起来。广州还是没有冬天，从一个多雪的地方待过，再来到广州总会想念白雪覆盖的世界。
    虽然冷，却是会有不一样的兴奋。暖冬也好，还能看到那树上开着的花朵。
    周末去打了排球，在广药体育馆，管理一个小空间种了一颗木棉树现在都已经开花了，它是不是已错了时节，这会应该是冬...
  `;

    return (
        <section className={styles.notesDiary}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.calendarSection}>
                        <div className={styles.calendarCard}>
                            <div className={styles.header}>
                                <h2 className={styles.title}>随笔随记</h2>
                                <p className={styles.subtitle}>我的日常记录...</p>
                            </div>

                            <div className={styles.calendar}>
                                <div className={styles.calendarHeader}>
                                    <button className={styles.monthBtn} onClick={goPrevMonth} type="button">
                                        ‹
                                    </button>
                                    <span className={styles.monthYear}>
                                        {year}年 {month}月
                                    </span>
                                    <button className={styles.monthBtn} onClick={goNextMonth} type="button">
                                        ›
                                    </button>
                                </div>

                                <div className={styles.weekdays}>
                                    {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                                        <div key={day} className={styles.weekday}>
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.calendarGrid}>
                                    {calendarDays.map((row, rowIndex) => (
                                        <div key={rowIndex} className={styles.calendarRow}>
                                            {row.map((day, colIndex) => (
                                                <div
                                                    key={`${rowIndex}-${colIndex}`}
                                                    className={`${styles.calendarDay} ${
                                                        !day.isCurrentMonth ? styles.otherMonth : ''
                                                    } ${isToday(day.date, day.isCurrentMonth) ? styles.today : ''}`}
                                                >
                                                    {day.date}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.articleSection}>
                        <div className={styles.articleCard}>
                            <h3 className={styles.articleTitle}>今天</h3>
                            <div className={styles.articleContent}>
                                <p>{articleContent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotesDiary;