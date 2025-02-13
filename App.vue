<script lang="ts" setup>
	import { onLaunch } from '@dcloudio/uni-app'
	import { useScreenStore, useChatStore, useUserStore } from '@/store'
	import { useGlobalProperties } from './hooks/useGlobalHooks';
	const { $api } = useGlobalProperties();
	const screenStore = useScreenStore()
	const UserStore = useUserStore()
	const ChatStore = useChatStore()
	const initPageSystem = async () => {
		const systemInfo = await uni.getSystemInfo()
		console.log(systemInfo)
		// #ifdef MP-WEIXIN
		const buttonInfo = uni.getMenuButtonBoundingClientRect()
		screenStore.setMenuButtonInfo(buttonInfo)
		// #endif
		screenStore.setSystemInfo(systemInfo)

	}
	// #ifndef MP-WEIXIN
	uni.onTabBarMidButtonTap(() => {
		console.log('asas')
	})
	// #endif
	// 初始化对话
	onLaunch(async () => {
		//初始化页面信息
		await initPageSystem()
		ChatStore.initChatInfo()
		UserStore.getIsShowVipuI()
		// getInviteCode()
		console.log('App Launch');
		// #ifdef APP-PLUS
		plus.screen.lockOrientation("portrait-primary");
		// #endif
	})


	// const getInviteCode = async () => {
	// 	const queryLink = await $api.post('api/v1/wechat/query_urllink', {
	// 		"url_link": "https://wxaurl.cn/H18iwCo0X2p",
	// 		"query_type": 0
	// 	})
	// 	console.log(queryLink)
	// }
</script>

<style lang="scss" scoped>
	// @import url("uview-plus/theme.scss");
</style>