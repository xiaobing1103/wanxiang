<template>
	<view class="changeViewBox"
		:style="{ marginTop: ScreenStore.changeVieHeight ? ScreenStore.changeVieHeight + 'px': '15rpx'}">
		<view class="changeView" @click="openModels">
			<view class="changeView_box">
				<image class="changeView_images" :src="commonModel[chatStore.model].modelIcon" mode=""></image>
				<text class="changeView_text"> {{commonModel[chatStore.model].title }}</text>
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
	import { useChatStore, useScreenStore } from '@/store';
	const chatStore = useChatStore()
	const ScreenStore = useScreenStore()

	const { $assets } = useGlobalProperties()
	const openModels = () => {
		chatStore.setOpenSeletedModel(true)
		
	}
	
	
</script>

<style lang="scss" scoped>
	.changeViewBox {
		width: 100%;
		display: flex;
		justify-content: center;
		height: 80rpx;
		overflow: hidden;
		margin-bottom: 9rpx;
		box-sizing: content-box;

	}

	.changeView {
		background-color: white;
		align-items: center;
		position: absolute;
		width: 80%;
		display: flex;
		border-radius: 40rpx;
		padding: 10rpx;
		font-size: 27rpx;
		background-color: #f2f2f2;
		&_text2 {
			width: max-content;
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
			width: max-content;
			min-width: 67%;
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
			font-size: 27rpx;
			color: #4955f5;
		}
	}
</style>