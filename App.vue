<script lang="ts" setup>
	import { onLaunch } from '@dcloudio/uni-app'
	import { useScreenStore, useChatStore } from '@/store'
	const screenStore = useScreenStore()
	const ChatStore = useChatStore()
	const initPageSystem = async () => {
		const systemInfo = await uni.getSystemInfo()
		// #ifdef MP-WEIXIN
		const buttonInfo = uni.getMenuButtonBoundingClientRect()
		screenStore.menuButtonInfo = buttonInfo
		// #endif
		screenStore.systemInfo = systemInfo
	}
	// #ifndef MP-WEIXIN
	uni.onTabBarMidButtonTap(() => {
		console.log('asas')
	})
	// #endif
	// 初始化对话
	onLaunch(() => {
		//初始化页面信息
		initPageSystem()
		ChatStore.initChatInfo()
	})
</script>

<style lang="scss" scoped>
	// @import url("uview-plus/theme.scss");
</style>