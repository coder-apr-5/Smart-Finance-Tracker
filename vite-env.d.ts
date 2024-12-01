/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INFURA_PROJECT_ID: string
  readonly VITE_INFURA_PROJECT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}