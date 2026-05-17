interface ImportMetaEnv{
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_TIMEOUT_MS: never;
}


interface  ImportMeta{
    readonly env: ImportMetaEnv;
}