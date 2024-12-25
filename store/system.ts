import { defineStore } from 'pinia';
import { computed } from 'vue';

interface SystemState {
	statusBarHeight : any
	menuButtonInfo : any
	navBarHeight : number | string;
	count : number
}
const useCounterStore = defineStore('counter', () => {
	//手机状态栏的高度，这个状态来就是手机顶部的电量啊，信号这些区域的高度，如果是刘海屏，它还会包含刘海屏的高度
	const statusBarHeight = computed(() => uni.getStorageSync('statusBarHeight'))
	//胶囊信息,就是微信小程序自带的那个有关闭，分享按钮的胶囊。
	const menuButtonInfo = computed(() => uni.getMenuButtonBoundingClientRect())
	//状态栏与胶囊按钮中的空隙
	const navBarHeight = computed(() => uni.getStorageSync('navBarHeight'))
	const safeTopHeight = () => {
		let height : number
		// #ifdef H5
		height = 20
		// #endif
		// #ifdef MP-WEIXIN
		height = 88
		// #endif
		// #ifdef APP-PLUS
		height = 99
		// #endif
		return height
	}
	return {
		statusBarHeight,
		menuButtonInfo,
		navBarHeight,
		safeTopHeight
	}
});
export default useCounterStore