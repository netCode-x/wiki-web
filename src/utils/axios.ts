import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig} from "axios";
import type {BaseResponse} from "@/type/api";
import {API_PREFIX, apiConfig} from "@/config/api.config.ts";


/**
 * 创建实例
 */
const instance = axios.create({
    baseURL: apiConfig.baseUrl+API_PREFIX,
    timeout: apiConfig.timeout,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        const excludeAuthPaths = [
            "/api/auth/register",
            "/api/auth/login",
            "/api/password/forget",
            "/api/password/reset"
        ];

        const shouldSkipAuth =excludeAuthPaths.some(path =>
            config.url === path
        );
        if (!shouldSkipAuth  && !config.headers.Authorization){
            const token = localStorage.getItem("token");
            if (token){
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        // 允许某些请求不加 _t
        if (config.method === 'get' && !config.params?.disableCache) {
            config.params = {
                ...config.params,
              //  _t: Date.now()
            };
        }
        return config;
    }
);


instance.interceptors.response.use(
    (res) => {
        const { code, msg } = res.data;
        if (code === 200 || code === 0) {
            return res.data;   // 注意：这里返回的是 res.data，即 BaseResponse
        } else {
            return Promise.reject(new Error(msg || '请求失败'));
        }
    },
    (error: AxiosError) => {
        // 非 2xx 状态码（网络错误、超时、5xx 等）进入这里
        let message:string;
        if (error.response) {
            // 服务器返回了错误状态码
            const status = error.response.status;
            switch (status) {
                case 400:
                    message = '请求错误';
                    break;
                case 401:
                    message = '未授权，请重新登录';
                    // 可在此处跳转登录页
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    message = '拒绝访问';
                    break;
                case 404:
                    message = '请求资源不存在';
                    break;
                case 500:
                    message = '服务器内部错误';
                    break;
                default:
                    message = `连接错误 ${status}`;
            }
        } else if (error.request) {
            // 请求已发出但没有收到响应
            message = '网络异常，请检查网络连接';
        } else {
            message = error.message;
        }
        console.error('响应错误：', message);
        // 可在此处统一展示错误提示
        return Promise.reject(new Error(message));
    }
);
/**
 * ===== 关键：重载 service 的类型，使 get/post 等方法返回 Promise<BaseResponse<T>> =====
 */
type ServiceType = {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>>;
    // 可继续添加其他方法...
} & AxiosInstance;

/**
 * =instance 是通过 axios.create() 创建的，它的默认类型是 AxiosInstance，这里即使通过断言的方式 配置类型=
 */
const service = instance as ServiceType;

export default service;