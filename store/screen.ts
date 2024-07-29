import {defineStore} from 'pinia'
import {ref,computed} from 'vue'

const useScreenStore = defineStore("screen",() =>{
	const statusBarHeight = ref<string | undefined>()
	const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes>()
	const systemInfo = ref<UniApp.GetSystemInfoResult>()
	
	return {
		statusBarHeight,
		menuButtonInfo,
		systemInfo
	}
},{unistorage:{paths:['statusBarHeight','menuButtonInfo','systemInfo']}})
export default useScreenStore