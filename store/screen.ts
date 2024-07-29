import {defineStore} from 'pinia'
import {ref,computed} from 'vue'

const useScreenStore = defineStore("screen",() =>{
	const statusBarHeight = ref<string | undefined>()
	const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes>()
	const systemInfo = ref<UniApp.GetSystemInfoResult>()
	
	//顶部安全距离
	const safeTopHeight = computed(() =>{
		let height:number = 0
		// #ifdef H5
			height = 10
		// #endif
		// #ifdef MP-WEIXIN
		   height = menuButtonInfo.value.top+menuButtonInfo.value.height
		// #endif
		// #ifdef APP-PLUS
			height = systemInfo.value.statusBarHeight
		// #endif
		return height
	})
	return {
		statusBarHeight,
		safeTopHeight,
		menuButtonInfo,
		systemInfo
	}
},{unistorage:{paths:['statusBarHeight','menuButtonInfo','systemInfo']}})
export default useScreenStore