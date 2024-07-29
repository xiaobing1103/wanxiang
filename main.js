import App from './App'
import assetsConfig from '@/config/assets.config.ts'
import setupStore from '@/store/index.ts'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import uviewPlus from 'uview-plus'
import * as Pinia from 'pinia';
export function createApp() {
	const app = createSSRApp(App)
	setupStore(app)
	app.use(uviewPlus)
	app.config.globalProperties.$assets = assetsConfig//挂载全局获取图片路径方法
	return {
		app,
		Pinia, // 此处必须将 Pinia 返回
	}
}
// #endif