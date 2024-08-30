<template>
	<view class="header">
		<view :style="{height:navBarHeight  + 'px'}">
			<view class="weixin-header" :style="{paddingTop:menuButtonInfo?.top + 'px'}">
				<template v-if="curRoute == 'pages/index/index'">
					<up-navbar :left-icon="'clock'" @leftClick="leftClick">
						<template v-slot:center>
							<view>
								<image src="/static/logo.svg" style=" height: 25px;"></image>
							</view>
						</template>
					</up-navbar>
				</template>
				<template v-else>
					<template
						v-if="curRoute == 'pages/draw/index' || curRoute == 'pages/function/index'  || curRoute == 'pages/my/index'">
						<up-navbar>
							<template v-slot:left>
								{{""}}
							</template>
							<template v-slot:center>
								<view>
									<image src="/static/logo.svg" style=" height: 25px;"></image>
								</view>
							</template>
						</up-navbar>
					</template>
					<template v-else>
						<up-navbar :left-icon="'arrow-left'" @leftClick="backpage">
							<template v-slot:center>
								<view class="" v-if="defindTitle">
									{{defindTitle}}
								</view>
								<view v-else>
									<image src="/static/logo.svg" style=" height: 25px;"></image>
								</view>
							</template>
						</up-navbar>
					</template>
				</template>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useChatStore, useCounterStore } from '@/store';
	// import useCounterStore from '../store/system';
	import { storeToRefs } from "pinia"

	const curRoute = computed(() => {
		const routers = getCurrentPages();
		return routers[routers.length - 1].route
	})
	const props = defineProps<{ backPageNum ?: number, defindTitle ?: string, defindPath ?: 'string' }>()
	const chatStore = useChatStore()
	//  #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { statusBarHeight, menuButtonInfo, navBarHeight } = storeToRefs(system)
	statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight
	menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
	navBarHeight.value = menuButtonInfo.value.height + statusBarHeight.value + 10
	// #endif
	const leftClick = () => {
		chatStore.setopenHistoryModel(true)
	};
	const backpage = () => {
		const filterArr = ["/pages/index/index", "/pages/draw/index", "/pages/chat/index", "/pages/function/index", "/pages/my/index"]
		if (props.defindPath) {
			if (filterArr.includes(props.defindPath)) {
				uni.switchTab({
					url: props.defindPath,
				})
			} else {
				uni.navigateTo({
					url: props.defindPath
				})
			}


		} else {
			uni.navigateBack({
				delta: props.backPageNum || 1,//返回层数，2则上上页
			})
		}

	}
	const onload = () => {
		console.log(12)
	}
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