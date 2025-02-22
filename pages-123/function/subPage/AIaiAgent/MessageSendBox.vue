<template>
	<view class="MessageSendBox">
		<view class="MessageSendBox_left">
			<image @click="openUpload" class="MessageSendBox_left_image" :src="$assets.uploadFileIcon" mode=""></image>
		</view>
		<view class="MessageSendBox_input">
			<up-textarea height="40" maxlength="-1" v-model="mainParmas.chatValue"
				placeholder="请输入你的问题或需求"></up-textarea>
		</view>
		<view class="MessageSendBox_right">
			<image @click="SendMessage" class="MessageSendBox_right_image" :src="mainParmas.chatValue ?
				activeSend : mainParmas.isRecive ?  stop: send" mode=""></image>
		</view>
	</view>

</template>

<script setup lang="ts">
	import activeSend from '@/static/activeSend.svg'
	import stop from '@/static/stop.svg'
	import send from '@/static/send.svg'
	import { useChatStore } from '@/store';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { MainPagesInterFace } from '@/store/aiAgentChats';
	import { ref } from 'vue';
	const emit = defineEmits<{
		(e : 'onSend', val : string) : void
	}>()
	const mainParmas = defineModel<MainPagesInterFace>('mainParmas')
	const { $assets } = useGlobalProperties()
	const SendMessage = async () => {
		// 走暂停逻辑
		if (mainParmas.value.isRecive) {
			mainParmas.value.onCancelRequest()
			mainParmas.value.setIsRecive(false)
		} else {
			emit('onSend', mainParmas.value.chatValue)
		}

	}
	const openUpload = () => {
		mainParmas.value.openUpLoadFileModal = true
	}
</script>

<style lang="scss" scoped>
	.MessageSendBox {
		width: 100%;
		background-color: #fff;
		box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 25rpx;
		overflow: hidden;

		&_left {
			padding: 10rpx 20rpx;
			z-index: 10;
			display: flex;
			align-items: center;

			&_image {
				width: 50rpx;
				height: 50rpx;
			}
		}

		&_input {
			flex: 1;
			overflow: hidden;
		}

		&_right {
			z-index: 10;
			padding: 10rpx 20rpx;
			display: flex;
			align-items: center;

			&_image {
				width: 50rpx;
				height: 50rpx;
			}
		}

	}
</style>