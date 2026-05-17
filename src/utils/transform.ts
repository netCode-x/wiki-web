import type {} from "@/type/api";
import type {AritcleItem, Article, Note, RawNote} from "@/type/publicType";
/**
 * 将 后端文章查询结构转为前端文章结构 article
 * @param raw
 */
export const transformArticle = (raw: AritcleItem): Article => {
    const summary = raw.summary || '';
    const description = summary.slice(0, 30).trim() + (summary.length > 50 ? '...' : '');
    const titleRaw = raw.title || '';
    const title = titleRaw.slice(0, 20).trim() + (titleRaw.length > 25 ? '...' : '');
    const category = getCategoryNameById(raw.categoryId);
    return {
        id: raw.id,
        title,
        date: raw.createDate || '',
        description,
        category,
        stats: {
            comments: raw.commentCounts ?? 0,
            views: raw.viewCounts ?? 0,
        },
        subCategory: raw.subCategory,
    };
};

const getCategoryNameById = (categoryId: number): string => {
    const map: Record<number, string> = { 1: '旅行', 2: '总结', 3: '产品' };
    return map[categoryId] || '文章';
};

/**
 * 将后端格式转为前端格式 note
 * @param raw
 */
export  const transformNote = (raw: RawNote): Note => {
    const title = raw.content.slice(0, 20).trim() + (raw.content.length > 20 ? '...' : '');
    const summary = raw.content.slice(0, 50).trim() + (raw.content.length > 50 ? '...' : '');
    return {
        id: raw.id,
        dateTime: raw.createDate,
        title,
        content: raw.content,
        summary,
    };
};



