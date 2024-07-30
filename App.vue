
<script lang="ts" setup>
	import {onLaunch,onLoad,onHide,onShow} from '@dcloudio/uni-app'
	import {useScreenStore} from '@/store'
	const screenStore = useScreenStore()
	
	const initPageSystem = async () =>{
		const systemInfo = await uni.getSystemInfo()
		// #ifdef MP-WEIXIN
			const buttonInfo = uni.getMenuButtonBoundingClientRect()
			screenStore.menuButtonInfo = buttonInfo
		// #endif
		screenStore.systemInfo = systemInfo
	}
	uni.onTabBarMidButtonTap(() =>{
		console.log('asas')
	})
	onLaunch(() =>{
		//初始化页面信息
		initPageSystem()
	})
</script>

<style lang="scss" scoped>
	/*每个页面公共css */
	@import url("@/assets/css/index.scss");
</style>