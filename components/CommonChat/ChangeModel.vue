<template>
	<view class="changeViewBox">
		<view class="changeView">
			<view class="changeView_box" @click="chatStore.setOpenSeletedModel(true)">
				<image class="changeView_images" :src="commonModel[chatStore.model].modelIcon" mode=""></image>
				<text class="changeView_text"> {{commonModel[chatStore.model].title }}</text>
				<image class="changeView_images2" :src="$assets.Change_Model_Icon" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { commonModel } from '@/config/modelConfig';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useChatStore } from '@/store';
	const chatStore = useChatStore()
	const { $assets } = useGlobalProperties()
</script>

<style lang="scss" scoped>
	.changeViewBox {
		width: 100%;
		display: flex;
		justify-content: center;
		position: relative;
		height: 80rpx;
		overflow: hidden;
	}

	.changeView {
		box-shadow: 10rpx 10rpx 10rpx rgba(0, 0, 0, 0.1);
		background-color: white;
		border-radius: 20rpx 20rpx 0 0;
		position: absolute;
		width: 60%;
		display: flex;
		justify-content: center;
		padding: 20rpx 0;

		&_box {
			display: flex;
			align-items: center;
			border: 2rpx solid #eaeaea;
			justify-content: space-evenly;
			border-radius: 20rpx;
			width: 80%;
			padding: 10rpx;
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
			font-size: 25rpx;
		}
	}
</style>