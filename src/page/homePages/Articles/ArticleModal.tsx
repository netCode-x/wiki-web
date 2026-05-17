// ArticleModal.tsx - 全屏状态持久化优化版

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from '@/page/homePages/Articles/ArticleModal.module.scss';
import {fetchArticleDetail} from '@/services/articleService';
import {marked} from 'marked';
import type {Article} from "@/type/publicType";

interface ArticleModalProps {
    article: Article;
    onClose: () => void;
    onUpdateViewCount?: (articleId: number, newViewCount: number) => void;
}

type ViewMode = 'html' | 'markdown';

// localStorage 工具函数
const getStoredViewMode = (): ViewMode => {
    const stored = localStorage.getItem('articleViewMode');
    return stored === 'html' || stored === 'markdown' ? stored : 'html';
};

const storeViewMode = (mode: ViewMode) => {
    localStorage.setItem('articleViewMode', mode);
};




// 从 localStorage 读取全屏状态
const getStoredFullscreenState = (): boolean => {
    const stored = localStorage.getItem('articleFullscreenEnabled');
    return stored !== null ? stored === 'true' : false; // 默认关闭全屏
};

const storeFullscreenState = (isFullscreen: boolean) => {
    localStorage.setItem('articleFullscreenEnabled', String(isFullscreen));
};

// 从 Markdown 提取目录
const extractToc = (markdown: string): Array<{ level: number; text: string; id: string }> => {
    const lines = markdown.split('\n');
    const toc: Array<{ level: number; text: string; id: string }> = [];
    const headingRegex = /^(#{1,6})\s+(.*)$/;

    lines.forEach(line => {
        const match = line.match(headingRegex);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                .replace(/^-+|-+$/g, '');
            toc.push({ level, text, id });
        }
    });

    return toc;
};

// 为 HTML 标题添加 ID
const addHeadingIds = (html: string, markdown: string): string => {
    const toc = extractToc(markdown);
    if (toc.length === 0) return html;

    let resultHtml = html;
    toc.forEach(item => {
        const headingTag = `h${item.level}`;
        const escapedText = item.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`<${headingTag}([^>]*)>${escapedText}</${headingTag}>`, 'i');
        resultHtml = resultHtml.replace(regex, `<${headingTag}$1 id="${item.id}">${item.text}</${headingTag}>`);
    });

    return resultHtml;
};

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, onUpdateViewCount }) => {
    // 状态管理
    const [contentHtml, setContentHtml] = useState<string>('');
    const [contentMarkdown, setContentMarkdown] = useState<string>('');
    const [markdownHtml, setMarkdownHtml] = useState<string>('');
    const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(getStoredFullscreenState); // 从 localStorage 读取全屏状态
    const [tocItems, setTocItems] = useState<Array<{ level: number; text: string; id: string }>>([]);
    const [activeTocId, setActiveTocId] = useState<string>('');

    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);


    // 计算最终统计数据
    const showToc = viewMode === 'markdown' && tocItems.length > 0 && !loading && !error;

    // ESC 关闭 - 全屏状态下先退出全屏，再关闭模态框
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isFullscreen) {
                    // 如果处于全屏状态，先退出全屏
                    toggleFullscreen();
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isFullscreen, onClose]);

    // 防止 body 滚动
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Markdown 转换和目录提取
    useEffect(() => {
        if (!contentMarkdown) {
            setMarkdownHtml('');
            setTocItems([]);
            return;
        }

        let cancelled = false;
        const convert = async () => {
            try {
                const toc = extractToc(contentMarkdown);
                if (!cancelled) setTocItems(toc);

                let html = await marked.parse(contentMarkdown);
                html = addHeadingIds(html, contentMarkdown);
                if (!cancelled) setMarkdownHtml(html);
            } catch (err) {
                console.error('Markdown 解析失败:', err);
                if (!cancelled) setMarkdownHtml('<p>Markdown 解析错误</p>');
            }
        };

        convert();
        return () => { cancelled = true; };
    }, [contentMarkdown]);

    // 获取文章详情
    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const loadArticle = async () => {
            setLoading(true);
            setError(null);

            try {
                const detail = await fetchArticleDetail(article.id);
                const newViewCount = detail.viewCounts;

                setContentHtml(detail.contentHtml || '');
                setContentMarkdown(detail.content || '');

                // 通知父组件更新视图计数
                if (onUpdateViewCount && newViewCount !== undefined) {
                    onUpdateViewCount(article.id, newViewCount);
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'CanceledError') return;
                if (err && typeof err === 'object' && 'code' in err && err.code === 'ERR_CANCELED') return;
                console.error('获取文章详情失败:', err);
                setError('网络错误，请稍后重试');
            } finally {
                setLoading(false);
                abortControllerRef.current = null;
            }
        };

        loadArticle();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [article.id, onUpdateViewCount]);

    // 滚动到指定标题
    const scrollToHeading = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element && bodyRef.current) {
            const container = bodyRef.current;
            const elementTop = element.offsetTop - container.offsetTop - 20;
            container.scrollTo({ top: elementTop, behavior: 'smooth' });
            setActiveTocId(id);
        }
    }, []);

    // 设置 IntersectionObserver 监听标题可见性
    const setupObserver = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        if (!bodyRef.current || tocItems.length === 0) return;

        const headings = tocItems
            .map(item => document.getElementById(item.id))
            .filter((el): el is HTMLElement => el !== null);

        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries.find(entry => entry.isIntersecting);
                if (visibleEntry && visibleEntry.target.id) {
                    setActiveTocId(visibleEntry.target.id);
                } else if (bodyRef.current) {
                    let closestId = '';
                    let minDistance = Infinity;
                    const scrollTop = bodyRef.current.scrollTop;

                    headings.forEach(heading => {
                        const distance = Math.abs(heading.offsetTop - scrollTop);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestId = heading.id;
                        }
                    });

                    if (closestId) setActiveTocId(closestId);
                }
            },
            {
                root: bodyRef.current,
                threshold: 0.25,
                rootMargin: '0px 0px -30% 0px',
            }
        );

        headings.forEach(heading => observer.observe(heading));
        observerRef.current = observer;
    }, [tocItems]);

    // 监听 Markdown 渲染完成，设置观察器
    useEffect(() => {
        if (viewMode === 'markdown' && markdownHtml && tocItems.length > 0) {
            const timer = setTimeout(() => {
                setupObserver();
            }, 100);

            return () => {
                clearTimeout(timer);
                if (observerRef.current) {
                    observerRef.current.disconnect();
                }
            };
        }
    }, [viewMode, markdownHtml, tocItems, setupObserver]);

    // 内容加载完成后检查滚动条
    useEffect(() => {
        if (!loading && !error && bodyRef.current) {
            const timer = setTimeout(() => {
                if (bodyRef.current) {
                    bodyRef.current.style.overflow = 'auto';
                }
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [loading, error, viewMode, fontSize, contentHtml, markdownHtml]);

    // 事件处理
    const toggleViewMode = () => {
        setViewMode(prev => {
            const newMode = prev === 'html' ? 'markdown' : 'html';
            storeViewMode(newMode);
            return newMode;
        });
    };



    // 全屏切换函数 - 同时更新状态和 localStorage
    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => {
            const newState = !prev;
            storeFullscreenState(newState); // 保存到 localStorage
            return newState;
        });
    }, []);

    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 10, 130));
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 10, 80));
    const resetFontSize = () => setFontSize(100);
    const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // 渲染内容
    const renderContent = useMemo(() => {
        if (viewMode === 'html') {
            return (
                <div
                    className={styles.articleContent}
                    style={{ fontSize: `${fontSize}%` }}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            );
        }
        return (
            <div
                className={styles.articleContent}
                style={{ fontSize: `${fontSize}%` }}
                dangerouslySetInnerHTML={{ __html: markdownHtml || '暂无内容' }}
            />
        );
    }, [viewMode, fontSize, contentHtml, markdownHtml]);

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div
                className={`${styles.modalContent} ${isFullscreen ? styles.fullscreen : ''} ${showToc ? styles.withToc : ''}`}
                onClick={handleContentClick}
            >
                {/* 顶部按钮区域 */}
                <div className={styles.modalHeaderRight}>
                    <div className={styles.fontControls}>
                        <button className={styles.fontBtn} onClick={decreaseFontSize} title="减小字体" type="button">A-</button>
                        <span className={styles.fontSizeIndicator}>{fontSize}%</span>
                        <button className={styles.fontBtn} onClick={increaseFontSize} title="增大字体" type="button">A+</button>
                        <button className={styles.fontBtn} onClick={resetFontSize} title="重置字体大小" type="button">
                            ↺
                        </button>
                    </div>

                    <button className={styles.fullscreenBtn} onClick={toggleFullscreen} type="button">
                        {isFullscreen ? '📖 退出全屏' : '📖 全屏阅读'}
                    </button>

                    <button className={styles.modeToggleBtn} onClick={toggleViewMode} type="button">
                        {viewMode === 'html' ? '📝 Markdown' : '✨ HTML'}
                    </button>

                    <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">×</button>
                </div>

                {/* 大纲侧边栏 */}
                {showToc && (
                    <div className={styles.tocSidebar}>
                        <div className={styles.tocTitle}>📑 目录</div>
                        <ul className={styles.tocList}>
                            {tocItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        className={`${styles.tocItem} ${styles[`tocLevel${item.level}`]} ${activeTocId === item.id ? styles.active : ''}`}
                                        onClick={() => scrollToHeading(item.id)}
                                        type="button"
                                    >
                                        {item.text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 右侧内容区域 */}
                <div className={styles.rightPanel}>
                    <div className={styles.modalHeader}>
                        <h2>{article.title}</h2>
                        {article.timeRange && <span className={styles.timeRange}>{article.timeRange}</span>}
                    </div>

                    <div className={styles.modalDate}>{article.date}</div>

                    {article.description && (
                        <div className={styles.modalDescription}>
                            <p>{article.description}</p>
                        </div>
                    )}

                    <div className={styles.modalBody} ref={bodyRef}>
                        {loading && <div className={styles.loading}>内容加载中...</div>}
                        {error && <div className={styles.error}>{error}</div>}
                        {!loading && !error && renderContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;