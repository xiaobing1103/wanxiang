<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'linear-gradient(to bottom, rgb(250,234,210), rgb(235, 214, 186))', padding: '0' }">
		<template #top>
			<view class="header" :style="{height:ScreenStore.navBarHeight  + 'px'}">
				<view class="header_weixin-header">
					<up-icon @click="backview" name="arrow-left" size="20"></up-icon>
					<view class="VideoVip">
						视频会员
					</view>
					<view class=""></view>
				</view>
			</view>
			<view class="backGroundImages">
				<image class="backGroundImages_images"
					src="http://file.1foo.com/2024/09/18/a1f9093bbc81ef51347a0e41038e9913.png" mode=""></image>
			</view>
		</template>
		<VideoVipCom />
	</z-paging>
</template>

<script setup lang="ts">
	import { useCounterStore, useScreenStore } from '@/store';
	import VideoVipCom from './VideoVipCom.vue'
	import { storeToRefs } from "pinia"
	const ScreenStore = useScreenStore()

	const backview = () => {
		uni.navigateBack()
	}
	const confirmPay = () => {

	}
</script>

<style lang="scss" scoped>
	.backGroundImages {
		position: absolute;
		top: -100rpx;
		right: -200rpx;

		&_images {
			width: 500rpx;
			height: 400rpx;

		}
	}

	.header {
		width: 100%;
		height: 40rpx;
		margin: 20rpx 0;
		padding: 0 30rpx;
		display: flex;
		align-items: center;

		&_weixin-header {
			width: 100%;
			display: flex;
			justify-content: space-between;

		}
	}

	.VideoVip {
		font-weight: 1000;
		font-size: 30rpx;
		background: linear-gradient(to right, #314cd7, #ae1dfd);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	// .bottomButton {
	// 	padding: 20rpx;
	// }
</style>