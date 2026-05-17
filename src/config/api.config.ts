
export const apiConfig={
    baseUrl:  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888',
    timeout:  Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
}
export const API_PREFIX ='/api'


