interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly VITE_OPENAI_KEY?: string
    readonly VITE_OPENAI_MODEL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}