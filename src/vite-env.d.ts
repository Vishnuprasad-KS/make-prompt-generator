/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEBHOOK_URL: string
    readonly VITE_WEBFLOW_API_URL: string
    readonly VITE_WEBFLOW_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}