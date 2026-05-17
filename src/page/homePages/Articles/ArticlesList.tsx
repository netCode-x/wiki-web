import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from '@/page/homePages/Articles/ArticlesList.module.scss';
import ArticleModal from '@/page/homePages/Articles/ArticleModal';
import Topbar from "@/page/homePages/Topbar/Topbar.tsx";
import type {BaseResponse} from "@/type/api";
import service from "@/utils/axios";
import {transformArticle} from "@/utils/transform";
import type {Article, BackendPageData} from "@/type/publicType";

const ITEMS_PER_PAGE = 6;

const ArticlesList: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('全部');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    // 存储所有文章（原始数据）
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories = ['全部', '旅行', '总结', '产品'];
    const abortControllerRef = useRef<AbortController | null>(null);

    // 一次性获取所有文章（pageSize 足够大）
    const fetchAllArticles = useCallback(async () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);
        try {
            // 这里设置一个足够大的 pageSize 来获取全部文章（如 1000），
            // 如果文章总数较多，可以考虑递归分页获取，但根据截图只有11篇，一次获取即可。
            const response = await service.get('/articles/page', {
                params: { pageNum: 1, pageSize: 1000 },
                signal: controller.signal,
            });

            let apiResult: BaseResponse<BackendPageData>;
            if (response && typeof response === 'object') {
                if ('data' in response && response.data && typeof response.data === 'object' && 'code' in response.data) {
                    apiResult = response.data as BaseResponse<BackendPageData>;
                } else if ('code' in response) {
                    apiResult = response as BaseResponse<BackendPageData>;
                } else {
                    throw new Error('响应格式异常：缺少 code 字段');
                }
            } else {
                throw new Error('响应格式异常：响应不是对象');
            }

            if (apiResult.code === 200) {
                const pageData = apiResult.data;
                if (pageData && Array.isArray(pageData.list)) {
                    const transformed = pageData.list.map(transformArticle);
                    setAllArticles(transformed);
                } else {
                    throw new Error('返回数据格式错误：list 不是数组');
                }
            } else {
                setError(apiResult.msg || '获取文章失败');
                setAllArticles([]);
            }
        } catch (err: unknown) {
            if (err && typeof err === 'object' && ('name' in err) && (err.name === 'CanceledError' || err.name === 'ERR_CANCELED')) {
                return;
            }
            console.error('请求文章接口出错:', err);
            setError('网络错误或数据解析失败，请稍后重试');
            setAllArticles([]);
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, []);

    useEffect(() => {
        fetchAllArticles();
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [fetchAllArticles]);

    // 根据当前分类过滤文章
    const filteredArticles = useMemo(() => {
        if (activeCategory === '全部') return allArticles;
        return allArticles.filter(article => article.category === activeCategory);
    }, [allArticles, activeCategory]);

    // 当前页显示的文章（前端分页）
    const paginatedArticles = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredArticles.slice(start, end);
    }, [filteredArticles, currentPage]);

    // 总页数
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
    const totalItems = filteredArticles.length;

    // 每个分类的文章数量（基于全部文章）
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { '全部': allArticles.length };
        categories.slice(1).forEach(cat => {
            counts[cat] = allArticles.filter(article => article.category === cat).length;
        });
        return counts;
    }, [allArticles, categories]);

    const handleCategoryChange = (cat: string) => {
        if (cat === activeCategory) return;
        setActiveCategory(cat);
        setCurrentPage(1); // 切换分类后重置到第一页
    };

    // 保证每行固定6个卡片（不足用占位）
    const pageCards = useMemo(() => {
        return Array.from({ length: ITEMS_PER_PAGE }, (_, i) => paginatedArticles[i] || null);
    }, [paginatedArticles]);

    const handleCardClick = (article: Article) => {
        setSelectedArticle(article);
    };

    const closeModal = () => {
        setSelectedArticle(null);
    };

    // 同步浏览量（当文章详情页更新浏览量后，更新 allArticles 中的对应值）
    const handleUpdateViewCount = useCallback((articleId: number, newViewCount: number) => {
        setAllArticles(prev =>
            prev.map(art => {
                if (art.id === articleId && art.stats.views !== newViewCount) {
                    return { ...art, stats: { ...art.stats, views: newViewCount } };
                }
                return art;
            })
        );
    }, []);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const delta = 2;
        const pages: (number | string)[] = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    return (
        <section className={styles.articles}>
            <Topbar />
            <div className="container">
                <div className={styles.categories}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                            type="button"
                        >
                            {cat} {categoryCounts[cat] > 0 ? `(${categoryCounts[cat]})` : ''}
                        </button>
                    ))}
                </div>

                {loading && <div className={styles.loading}>加载中...</div>}
                {error && <div className={styles.error}>{error}</div>}
                {!loading && !error && allArticles.length === 0 && <div className={styles.empty}>暂无文章</div>}

                <div className={styles.articlesGrid}>
                    {pageCards.map((article, index) => {
                        if (!article) {
                            return <article key={`placeholder-${currentPage}-${index}`} className={styles.articleCard} style={{ visibility: 'hidden', pointerEvents: 'none' }} />;
                        }
                        return (
                            <article key={article.id} className={styles.articleCard} onClick={() => handleCardClick(article)}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.title}>{article.title}</h3>
                                    {article.timeRange && <span className={styles.timeRange}>{article.timeRange}</span>}
                                </div>
                                <div className={styles.date}>{article.date}</div>
                                {article.description && <p className={styles.description}>{article.description}</p>}
                                <div className={styles.meta}>
                                    <div className={styles.categoryTags}>
                                        <span className={styles.category}>{article.category}</span>
                                        {article.subCategory && <span className={styles.subCategory}>{article.subCategory}</span>}
                                    </div>
                                    <div className={styles.stats}>
                                        <span>💬 {article.stats.comments ?? 0}</span>
                                        <span>👁️ {article.stats.views ?? 0}</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button className={styles.pageBtn} onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>上一页</button>
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                className={`${styles.pageBtn} ${page === currentPage ? styles.activePage : ''} ${page === '...' ? styles.ellipsis : ''}`}
                                onClick={() => typeof page === 'number' && goToPage(page)}
                                disabled={page === '...'}
                            >
                                {page}
                            </button>
                        ))}
                        <button className={styles.pageBtn} onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>下一页</button>
                        <span className={styles.pageInfo}>{currentPage} / {totalPages} 页（共 {totalItems} 篇）</span>
                    </div>
                )}
            </div>

            {selectedArticle && (
                <ArticleModal
                    article={selectedArticle}
                    onClose={closeModal}
                    onUpdateViewCount={handleUpdateViewCount}
                />
            )}
        </section>
    );
};

export default ArticlesList;