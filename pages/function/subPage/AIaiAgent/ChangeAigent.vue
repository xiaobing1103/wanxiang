<template>
	<view class="changeViewBox">
		<view class="changeView" @click="AiAgentChats.setShowAgentChangeBox(true)">
			<view class="changeView_box">
				<image class="changeView_images" :src="icon" mode=""></image>
				<text class="changeView_text">{{title}}</text>
			</view>
			<view class="changeView_box2">
				<image class="changeView_images2" :src="$assets.Change_Model_Icon" mode=""></image>
				<text class="changeView_text2">切换</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { commonModel } from '@/config/modelConfig';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useAiAgentChats, useChatStore } from '@/store';
	const AiAgentChats = useAiAgentChats()
	const props = defineProps<{ title : string, icon : string }>()
	const { $assets } = useGlobalProperties()
</script>

<style lang="scss" scoped>
	.changeViewBox {
		width: 100%;
		display: flex;
		justify-content: center;
		z-index: 100;
		height: 80rpx;
		overflow: hidden;
		margin-top: 15rpx;
		margin-bottom: 9rpx;
		box-sizing: content-box;
		// background-color: #e2e2e2;

	}

	.changeView {
		background-color: white;
		align-items: center;
		position: absolute;
		width: 71%;
		display: flex;
		border-radius: 40rpx;
		padding: 10rpx;
		font-size: 27rpx;
		// background-color: #e2e2e2;

		&_text2 {
			font-size: 27rpx;
			color: #9292a9;
		}

		&_box {
			display: flex;
			background: linear-gradient(90deg, #dd88ff1a, #1b44e21a);
			align-items: center;
			border: 2rpx solid #eaeaea;
			justify-content: center;
			border-radius: 30rpx;
			width: 67%;
			padding: 10rpx;
		}

		&_box2 {
			display: flex;
			flex: 1;
			justify-content: center;
			align-items: center;
		}

		&_images {
			height: 30rpx;
			width: 30rpx;
			padding: 0 10rpx;
		}

		&_images2 {
			height: 30rpx;
			width: 30rpx;
			padding: 0 10rpx;
		}

		&_text {
			max-width: 250rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			font-size: 27rpx;
			color: #4955f5;
		}
	}
</style>