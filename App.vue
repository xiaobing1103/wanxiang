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
		// ChatStore.initChatInfo()
		UserStore.getIsShowVipuI()
		// getInviteCode()
		console.log('App Launch');
		// #ifdef APP-PLUS
		plus.screen.lockOrientation("portrait-primary");
		// #endif
		// #ifdef MP-WEIXIN
		updateBan()
		// #endif
	})

	const updateBan = () => {
		const updateManager = uni.getUpdateManager()
		// 检查更新
		updateManager.onCheckForUpdate((res) => {
			console.log('是否有新版本：', res.hasUpdate)

			if (!res.hasUpdate) return

			// 显示更新提示
			uni.showLoading({
				title: '检查更新中...'
			})
		})
		// 更新包下载完成
		updateManager.onUpdateReady(() => {
			uni.hideLoading()
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				confirmText: '立即重启',
				cancelText: '稍后重启',
				success: (res) => {
					if (res.confirm) {
						// 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
		// 更新失败
		updateManager.onUpdateFailed((err) => {
			uni.hideLoading()

			uni.showModal({
				title: '更新提示',
				content: '新版本下载失败，请检查网络后重试',
				confirmText: '重试',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						// 重新检查更新
						updateBan()
					}
				}
			})
		})
	}
	// const getInviteCode = async () => {
	// 	const queryLink = await $api.post('api/v1/wechat/query_urllink', {
	// 		"url_link": "https://wxaurl.cn/H18iwCo0X2p",
	// 		"query_type": 0
	// 	})
	// 	console.log(queryLink)
	// }
</script>

<style lang="scss">
	// @import url("uview-plus/theme.scss");
	// * {
	// 	overflow: hidden;
	// 	/* 隐藏所有元素的滚动条 */
	// }

	// ::-webkit-scrollbar {
	// 	width: 0;
	// 	height: 0;
	// 	background-color: transparent;
	// }
	.custom_style {
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;

		&_icon {
			font-size: 80rpx;
			width: 120rpx;
			height: 120rpx;
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: -40rpx;
		}
	}
</style>