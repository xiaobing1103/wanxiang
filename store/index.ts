import useUserStore from "./user";
import useScreenStore from "./screen";
import useChatStore from "./chat";
import useCounterStore from "./system";
import useDrawStore from "./draw";

import { createPinia } from 'pinia'
import { createUnistorage } from '@/uni_modules/pinia-plugin-unistorage/index.js'

//注册pinia
const setupStore = (app) => {
	const pinia = createPinia()//创建实列
	pinia.use(createUnistorage())//持久化数据
	app.use(pinia)//注册pinia
}
//导出其他store
export {
	useUserStore,
	useScreenStore,
	useChatStore,
	useCounterStore,
	useDrawStore
}
//默认导出注册函数
export default setupStore;