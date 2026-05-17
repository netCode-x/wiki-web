

// 后端原始笔记条目
export interface RawNote {
    id: number;
    content: string;
    createDate: string;
    updateDate: string;
    authorId: number;
    authorName: string;
    isPrivate: boolean;
    status: number;
}

// 前端渲染用的 Note
export interface Note {
    id: number;
    dateTime: string;
    title: string;
    content: string;
    summary: string;
}



// 后端原始的article
export interface AritcleItem {
    summary: string;
    commentCounts: number;
    authorName: string;
    viewCounts: number;
    weight: number;
    id: number;
    title: string;
    authorId: number;
    categoryId: number;
    createDate: string;
    subCategory?: string;   // 改为可选
}

// 前端渲染的article
export  interface Article {
    id: number;
    title: string;
    date: string;
    description?: string;
    category: string;
    subCategory?: string;
    stats: {
        comments?: number;
        views?: number;
    }
    timeRange?: string | null;
    content?: string;
    contentHtml?: string;
}

export  interface BackendPageData {
    total: number;
    pageNum: number;
    pageSize: number;
    totalPages: number;
    list: AritcleItem[];
}

export  interface DetailResponse {
    code: number;
    msg: string;
    data: ArticleDetail;
}

// 定义后端返回的文章详情结构（包含正文）
// 文章详情内容（后端返回）
// 建议将 ArticleDetail 定义完善，与后端实际返回字段匹配
export interface ArticleDetail {
    id: number;
    title: string;
    summary?: string;
    content?: string;
    contentHtml?: string;
    authorId?: number;
    authorName?: string;
    categoryId?: number;
    categoryName?: string | null;
    commentCounts?: number;
    viewCounts?: number;
    weigth?: number;      // 后端字段名如此
    status?: number;
    createDate?: string;
    updateDate?: string;
}