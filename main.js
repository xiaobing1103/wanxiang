import App from './App'
import assetsConfig from '@/config/assets.config.ts'
import setupStore from '@/store/index.ts'
import api from '@/http/';
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
	app.config.globalProperties.$assets = assetsConfig
	app.config.globalProperties.$api = api
	return {
		app,
		Pinia
	}
}
// #endif