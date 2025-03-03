/// <reference types="vite/client" />

declare interface Window {
    signLink: string
}

declare module 'uview-plus'
declare module 'weixin-js-sdk'

declare module 'css-color-function'

declare module 'markdown-it-math'

declare module 'js-mp3'

interface ImportMetaEnv {
  VITE_APP_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
