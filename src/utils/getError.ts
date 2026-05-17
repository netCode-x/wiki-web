import {isAxiosError} from "axios";


export const getErrorMessage = (error: unknown): string => {

    if (isAxiosError(error)) {
        const data = error.response?.data as { msg?: string };
        return data?.msg || '发送傻逼哎，请检查网络连接';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return '发送失败，请检查网络连接'
}