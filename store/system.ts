import {
	defineStore
} from 'pinia';

interface SystemState{
	statusBarHeight:any
	menuButtonInfo:any
	navBarHeight:number | string;
	count:number
}
export const useCounterStore = defineStore('counter', {
	state: ():SystemState => {
		return {
			count: 0,
			//手机状态栏的高度，这个状态来就是手机顶部的电量啊，信号这些区域的高度，如果是刘海屏，它还会包含刘海屏的高度
			statusBarHeight: uni.getStorageSync('statusBarHeight'),
			//胶囊信息,就是微信小程序自带的那个有关闭，分享按钮的胶囊。
			menuButtonInfo: uni.getMenuButtonBoundingClientRect(),
			//状态栏与胶囊按钮中的空隙
			navBarHeight: uni.getStorageSync('navBarHeight')
		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		//顶部安全距离
		safeTopHeight(state:SystemState){
			let height:number
			// #ifdef H5
				height = 20
			// #endif
			// #ifdef MP-WEIXIN
				height = 88
				console.log(state,"ssssssssss")
			// #endif
			// #ifdef APP-PLUS
				height = 99
			// #endif
			return height
		},
		increment() {
			this.count++;
		},
	},
});