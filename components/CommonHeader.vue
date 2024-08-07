<template>
	<view class="header">
		<!-- #ifdef MP-WEIXIN -->
		<view :style="{height:navBarHeight + 'px'}">
			<view class="weixin-header" :style="{paddingTop:menuButtonInfo?.top + 'px'}">
				<up-navbar left-icon="clock" @leftClick="leftClick">
					<template v-slot:center>
						<view>
							<image src="/static/logo.svg" style=" height: 25px;"></image>
						</view>
					</template>
				</up-navbar>
			</view>
		</view>
		<!--  #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<up-navbar placeholder left-icon="clock" @leftClick="leftClick">
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
	import { useChatStore, useCounterStore } from '@/store';
	import { storeToRefs } from "pinia"
	const chatStore = useChatStore()
	//  #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { statusBarHeight, menuButtonInfo, navBarHeight } = storeToRefs(system).
		statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight
	menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
	navBarHeight.value = menuButtonInfo.value.height + statusBarHeight.value + 10
	// #endif
	const leftClick = () => {
		console.log('fewfe3244332121 ', chatStore.openHistoryModel + '')
		chatStore.setopenHistoryModel(true)
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