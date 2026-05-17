// src/services/articleService.ts
import service from '@/utils/axios';
import type {  } from '@/type/api';
import type {DetailResponse} from "@/type/publicType";

/**
 * 获取文章详情（包含正文、浏览量等）
 * @param articleId - 文章ID
 * @returns Promise 解析为 DetailResponse 中的 data 字段（文章详情对象）
 */
export const fetchArticleDetail = async (articleId: number) => {
    const response = await service.get(`articles/${articleId}`);

    // 兼容响应结构
    let apiResult: DetailResponse;
    if (response && typeof response === 'object') {
        if ('data' in response && response.data && typeof response.data === 'object' && 'code' in response.data) {
            apiResult = response.data as DetailResponse;
        } else if ('code' in response) {
            apiResult = response as DetailResponse;
        } else {
            throw new Error('响应格式异常：缺少 code 字段');
        }
    } else {
        throw new Error('响应格式异常：响应不是对象');
    }

    if (apiResult.code !== 200) {
        throw new Error(apiResult.msg || '获取文章详情失败');
    }

    return apiResult.data; // 直接返回文章详情对象
};