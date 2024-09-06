<template>
	<view class="chatAll">
		<view class="chatInput">
			<image class="chatInput_left" src="@/static/image.svg" mode=""></image>
			<view class="chatInput_input">
				<up-input placeholder="请输入内容" border="surround" v-model="chatValue"></up-input>
			</view>
			<view class="chatInput_right">
				<image @click="SendMessage" class="chatInput_right_image"
					:src="chatValue ? 
					'//file.1foo.com/2024/07/31/00043f53937f16cc083f142cf4cdf257.svg' : 
					ChatStore.loadingMessage ?  'http://file.1foo.com/2024/08/21/4f18ab8afa893936ecea4d431ab42f82.svg': '//file.1foo.com/2024/07/31/137536c06dd024e2703c8cb7ec146af9.svg'"
					mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineModel } from 'vue';
	import { useChatStore } from '@/store';
	const chatValue = defineModel<string>("chatValue")
	const ChatStore = useChatStore()
	const emit = defineEmits<{
		(e : 'onSend', val : string) : void
		(e : 'onCancel') : void
	}>()
	const SendMessage = async () => {
		if (ChatStore.loadingMessage) {
			emit('onCancel')
			ChatStore.setLoadingMessage(false)
		} else {
			emit('onSend', chatValue.value)
		}

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
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.chatInput {
		width: 100%;
		display: flex;
		background-color: white;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		align-items: center;
		border-radius: 30rpx;

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
			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 0 15rpx;
			}
		}
	}
</style>