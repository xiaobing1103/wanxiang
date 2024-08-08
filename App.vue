<script lang="ts" setup>
	import { onLaunch, onLoad, onHide, onShow } from '@dcloudio/uni-app'
	import { useScreenStore, useChatStore, useUserStore } from '@/store'
	import { generateUUID } from './tools/uuid';
	import { commonModel } from './config/modelConfig';
	const screenStore = useScreenStore()
	const ChatStore = useChatStore()
	const UserStore = useUserStore()
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
	/*每个页面公共css */
	@import url("@/assets/css/index.scss");
</style>