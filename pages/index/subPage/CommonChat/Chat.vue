<template>
	<view class="chatAll">
		<view class="chatInput">
			<view class="chatInput_left">
				<image @click="toImageModel" class="chatInput_left_image" src="@/static/image.svg" mode=""></image>
			</view>
			<view class="chatInput_input">
				<textarea :adjust-position="false" :show-confirm-bar="false" auto-height :disable-default-padding="true"
					@keyboardheightchange="keyboardheightchange"
					:style="{overflow: 'scroll',maxHeight:'100rpx', width:'100%'}" maxlength="-1" placeholder="请输入内容"
					v-model="chatValue"></textarea>
			</view>
			<view class="chatInput_right">
				<image @click="SendMessage" class="chatInput_right_image" :src="chatValue ? 
					activeSend : ChatStore.loadingMessage ?  stop : send" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import activeSend from '@/static/activeSend.svg'
	import stop from '@/static/stop.svg'
	import send from '@/static/send.svg'
	import { useChatStore, useScreenStore } from '@/store';
	const chatValue = defineModel<string>("chatValue")
	const keyboardHeight = defineModel<number>("keyboardHeight")
	const ChatStore = useChatStore()
	const ScreenStore = useScreenStore()
	const isIOS = ref(false)
	// 检查平台
	// // #ifdef MP-WEIXIN 
	// onLoad(() => {
	// 	const system = uni.getSystemInfoSync()
	// 	isIOS.value = system.platform === 'ios'
	// })
	// // #endif 
	const emit = defineEmits<{
		(e : 'onSend', val : string) : void
		(e : 'onCancel') : void
	}>()

	const keyboardheightchange = (event : any) => {

		// let num = 0
		// // #ifdef MP-WEIXIN || APP 
		// if (isIOS && event.detail.height) {
		// 	num = event.detail.height - ScreenStore.systemInfo.statusBarHeight
		// }
		// // #endif 
		keyboardHeight.value = event.detail.height
		console.log('键盘高度', keyboardHeight.value)

	}
	const SendMessage = async () => {
		// 走暂停逻辑
		if (ChatStore.loadingMessage) {
			emit('onCancel')
			ChatStore.setLoadingMessage(false)
		} else {
			// showOverlay.value = false
			console.log('onSend', chatValue.value)
			emit('onSend', chatValue.value)
		}
	}
	const toImageModel = () => {
		uni.navigateTo({
			url: "/pages/index/subPage/imageModel/index"
		})
	}
</script>

<style lang="scss" scoped>
	.chatAll {
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		padding: 0 30rpx;
		margin-bottom: 15rpx;
		max-height: 90rpx;
		z-index: 900;
	}

	.chatInput {
		width: 100%;
		display: flex;
		background-color: #fff;
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.1);
		border-radius: 40rpx;
		align-items: center;

		&_left {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 100%;

			&_image {
				height: 40rpx;
				width: 40rpx;
				padding: 25rpx 25rpx;
			}
		}

		&_input {
			width: 100%;
			flex: 1;
			background-color: white;
			overflow: hidden;
			height: auto;
			padding: 20rpx 0;

		}

		&_right {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 100%;

			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 20rpx 20rpx;
			}
		}
	}

	.showOverlaychatAll {
		display: flex;
		position: absolute;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 90rpx;
		margin-bottom: 56px;
		/* #ifdef MP-WEIXIN  */
		margin-bottom: 84px
			/* #endif */

	}

	.overlay {
		height: 100vh;
		display: flex;
		flex-direction: column;

		&_top {
			flex: 1;
		}
	}

	.chatInputBox {
		width: 95%;
		display: flex;
		background-color: #fff;
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.1);
		border-radius: 40rpx;
		align-items: center;
	}
</style>