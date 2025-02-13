import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export interface lastDayDatasTypes {
	button : string
	content_1 : string
	content_2 : string
	content_3 : string
	end : boolean
	end_time : number
	rule : string
	shop_id : number
	shop_name : string
	shop_price : number
	shop_price_2 : number
	start_time : number
	time : number
	tips : string
	title : string
}
const useScreenStore = defineStore("screen", () => {
	const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes>()
	const systemInfo = ref<UniApp.GetSystemInfoResult>()
	const NotificationSign = ref('')
	const saveTime = ref(0)
	const lastModalisOpen = ref(false)
	const lastDayDatas = ref<lastDayDatasTypes>(null)
	const openGolbalList = ref<boolean>(false)
	const setOpenGolbalList = (val : boolean) => {
		openGolbalList.value = val
	}

	const navBarHeight = computed(() => {
		// #ifdef MP-WEIXIN
		return 44 + systemInfo.value.statusBarHeight
		// #endif
		// #ifdef APP
		return systemInfo.value.safeArea.top + 44
		// #endif
		return 44
	})


	const safeTopHeight = computed(() => {
		let height : number = 0
		// #ifdef H5
		height = 20
		// #endif
		// #ifdef MP-WEIXIN
		height = menuButtonInfo.value.top + menuButtonInfo.value.height
		// #endif
		// #ifdef APP-PLUS
		height = systemInfo.value.statusBarHeight + systemInfo.value.safeArea.top
		// #endif
		return height
	})

	// changeVieHeight 
	const changeVieHeight = computed(() => {
		let height : number = 0
		// #ifdef H5
		height = 7
		// #endif
		// #ifdef MP-WEIXIN
		height = 7
		// #endif
		// #ifdef APP-PLUS
		height = 10
		// #endif
		return height
	})

	const setSystemInfo = (val : UniApp.GetSystemInfoResult) => {
		systemInfo.value = val
	}
	const setMenuButtonInfo = (val : UniApp.GetMenuButtonBoundingClientRectRes) => {
		menuButtonInfo.value = val
	}
	const setNotificationSign = (val : string) => {
		NotificationSign.value = val
	}
	const setSaveTime = (val : number) => {
		saveTime.value = val
	}

	const setLastDayDatas = (lastDatas : lastDayDatasTypes) => {
		lastDayDatas.value = lastDatas
	}
	const setLastModalisOpen = (val : boolean) => {
		lastModalisOpen.value = val
	}
	return {
		safeTopHeight,
		menuButtonInfo,
		systemInfo,
		setNotificationSign,
		NotificationSign,
		saveTime,
		setSaveTime,
		lastModalisOpen,
		setLastModalisOpen,
		setLastDayDatas,
		lastDayDatas,
		setMenuButtonInfo,
		setSystemInfo,
		changeVieHeight,
		setOpenGolbalList,
		openGolbalList,
		navBarHeight
	}
}, { unistorage: { paths: ['statusBarHeight', 'menuButtonInfo', 'systemInfo', 'NotificationSign', 'saveTime', 'lastModalisOpen', 'lastDayDatas'] } })
export default useScreenStore