<template>
	<view class="chatAll">
		<view class="chatInput">
			<image @click="toImageModel" class="chatInput_left" src="@/static/image.svg" mode=""></image>
			<view class="chatInput_input">
				<up-input maxlength="8000" placeholder="请输入内容" border="surround" v-model="chatValue"></up-input>
			</view>
			<view class="chatInput_right">
				<image @click="SendMessage" class="chatInput_right_image" :src="chatValue ? 
					activeSend : ChatStore.loadingMessage ?  stop: send" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">

	import activeSend from '@/static/activeSend.svg'
	import stop from '@/static/stop.svg'
	import send from '@/static/send.svg'
	import { useChatStore } from '@/store';
	const chatValue = defineModel<string>("chatValue")
	const ChatStore = useChatStore()
	const emit = defineEmits<{
		(e : 'onSend', val : string) : void
		(e : 'onCancel') : void
	}>()
	const SendMessage = async () => {
		// 走暂停逻辑
		if (ChatStore.loadingMessage) {
			emit('onCancel')
			ChatStore.setLoadingMessage(false)
		} else {
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
		// position: absolute;
		bottom: 20rpx;
		width: 100%;
		// overflow: hidden;
		margin-bottom: 20rpx;

	}

	.chatInput {
		width: 100%;
		display: flex;
		background-color: white;
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.1);
		align-items: center;
		border-radius: 30rpx;
		height: 75rpx;

		&_left {
			height: 40rpx;
			width: 40rpx;
			padding: 0 20rpx;
		}

		&_input {
			width: 100%;
			flex: 1;
			box-sizing: border-box;
			background-color: white;

		}

		&_right {
			display: flex;
			align-items: center;
			justify-content: center;

			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 0 15rpx;
			}
		}
	}
</style>