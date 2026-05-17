// src/types/api.ts

/**
 * 定义 API 响应的基础结构
 */
export interface BaseResponse<T = unknown> {
    msg: string;
    code: number;
    data: T;
}


export interface  SendEmailRequest {
    email: string;
}

/**
 * 登录和注册响应体
 */
export interface LoginOrRegisterResponse {
    token: string;
    username: string;
    userId: number;  // 注意是 number 还是 string
    expiresIn?: number;
}

export interface  LoginOrRegisterRequest {
    username: string;
    password: string;

}
export interface ResetPasswordRequest {
    username: string;
    newPassword: string;
    email: string;
    emailCode: string;
    confirmPassword: string;
}








