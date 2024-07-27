<template>
	<view class="header">
		<!-- #ifdef MP-WEIXIN -->
		<view :style="{height:navBarHeight + 'px'}">
			<view class="weixin-header" :style="{paddingTop:menuButtonInfo?.top + 'px'}">
				<!-- <view class="weixin-header_left">
					<image class="weixin-header_left_Image"
						src="//file.1foo.com/2024/07/25/45ceb337b8a9c661fa7ed7992f04e7ea.svg" alt="history" />
				</view>
				<view class="weixin-header_main">
					<image class="weixin-header_main_mainImage" src="/static/logo.svg"></image>
				</view> -->
				<up-navbar left-icon="clock" @rightClick="rightClick" :autoBack="true">
					<template v-slot:center>
						<view>
							<image src="/static/logo.svg" style=" height: 25px;"></image>
						</view>
					</template>
				</up-navbar>

			</view>
		</view>
		<!--  #endif -->
		<!-- #ifdef H5 -->
		<!-- 		<view class="h5-header">
			<view class="h5-header-left">
				<image class="h5-header-leftImage" src="//file.1foo.com/2024/07/25/45ceb337b8a9c661fa7ed7992f04e7ea.svg"
					alt="history" />
			</view>
			<view class="h5-header-main">
				<image class="h5-header-mainImage" src="/static/logo.svg"></image>
			</view>
		</view> -->
		<up-navbar placeholder left-icon="clock" @rightClick="rightClick" :autoBack="true">
			<template v-slot:center>
				<view>
					<image src="/static/logo.svg" style="height: 25px;"></image>
				</view>
			</template>
		</up-navbar>
		<!--  #endif -->
	</view>
</template>

<script setup lang="ts">
	import { useCounterStore } from '../store/system';
	import { storeToRefs } from "pinia"
	//  #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { statusBarHeight, menuButtonInfo, navBarHeight } = storeToRefs(system)
	statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight
	menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
	navBarHeight.value = menuButtonInfo.value.height + statusBarHeight.value + 10
	// #endif
	const rightClick = () => {
		console.log('rightClick');
	};

	const leftClick = () => {
		console.log('leftClick');
	};
</script>

<style lang="scss">
	.header {
		background-color: white;
	}

	.h5-header {
		display: flex;
		justify-content: space-between;
		height: 120rpx;
		align-items: center;

		.h5-header-left {
			.h5-header-leftImage {
				height: 40rpx;
				width: 40rpx;
			}
		}

		.h5-header-main {
			.h5-header-mainImage {
				height: 60rpx;
			}
		}

	}


	.weixin-header {
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		align-items: center;

		&_left {
			&_Image {
				height: 40rpx;
				width: 40rpx;
				padding-left: 10px;
				// box-sizing: border-box;
			}
		}

		&_main {
			&_mainImage {
				max-height: 60rpx;
			}
		}
	}
</style>