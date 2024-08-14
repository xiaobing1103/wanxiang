// shims-vue.d.ts
import { ComponentCustomProperties } from "vue";
import assetsConfig from "@/config/assets.config";
import api from "@/http/";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $assets: typeof assetsConfig;
    $api: typeof api;
  }
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
// 将声明文件声明为模块，以便 TypeScript 处理它
export {};
