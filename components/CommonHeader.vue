<template>
	<view class="header" :style="{background: noBackGround ?  '' : 'white'}">
		<view class="headerItems" :style="{height: ScreenStore.navBarHeight + 'px' }">
			<view class="weixin-header">
				<template v-if="curRoute == 'pages/index/index'">
					<up-navbar :bgColor="bgColor">
						<template v-slot:left>
							<up-icon :color="chatStore.openHistoryModel ? '#4955f5' :''"
								@click="chatStore.setopenHistoryModel(true)" name="clock" size="22"></up-icon>
						</template>
						<template v-slot:center>
							<view>
								<image :src="AppName =='bianjie' ? '/static/logo.svg' :'/static/wanxianglogo.svg'"
									:style="{height: '25px',width:AppName =='bianjie'? '120px': '100px'}">
								</image>
							</view>
						</template>
					</up-navbar>
				</template>
				<template v-else>
					<template
						v-if="curRoute == 'pages/draw/index' || curRoute == 'pages/function/index'  || curRoute == 'pages/my/index'">
						<up-navbar :bgColor="bgColor">
							<template v-slot:left>
								{{""}}
							</template>
							<template v-slot:center>
								<view>
									<image :src="AppName =='bianjie' ? '/static/logo.svg' : '/static/wanxianglogo.svg'"
										:style="{height: '25px',width:AppName =='bianjie'? '120px': '100px'}">
									</image>
								</view>
							</template>
						</up-navbar>
					</template>
					<template v-else>
						<up-navbar :bgColor="bgColor" :left-icon="'arrow-left'" @leftClick="backpage">
							<template v-slot:center>
								<view class="" v-if="defindTitle">
									{{defindTitle}}
								</view>
								<view v-else>
									<image :src="AppName =='bianjie' ? '/static/logo.svg' :'/static/wanxianglogo.svg'"
										:style="{height: '25px',width:AppName =='bianjie'? '120px': '100px'}">
									</image>
								</view>
							</template>
						</up-navbar>
					</template>
				</template>
			</view>
		</view>
		<template v-if="!noRenderLastModal">
			<GolbalModals />
		</template>
		<CommonTabbar />
	</view>
	<LevelUpVip />


</template>

<script setup lang="ts">
	import LevelUpVip from '@/components/CommonChat/LevelUpVip.vue';
	import GolbalModals from './GolbalModals.vue';
	import CommonTabbar from './CommonTabbar.vue';
	import { computed, reactive } from 'vue';
	import { AppName } from '@/http';
	import { useChatStore, useScreenStore } from '@/store';
	import { storeToRefs } from "pinia"
	const curRoute = computed(() => {
		const routers = getCurrentPages();
		return routers[routers.length - 1].route
	})
	const chatStore = useChatStore()
	const ScreenStore = useScreenStore()

	const props = defineProps<{ backPageNum ?: number, defindTitle ?: string, defindPath ?: 'string', noBackGround ?: boolean, backFunction ?: Function, noRenderLastModal ?: boolean }>()
	const bgColor = props.noBackGround ? 'rgb(255,255,255,0)' : 'rgb(255,255,255)'


	const openPageList = () => {
		ScreenStore.setOpenGolbalList(true)
	}

	const backpage = () => {
		if (props.backFunction) {
			props.backFunction()
		} else {
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
	}
	const onload = () => {
		console.log(12)
	}
</script>

<style lang="scss" scoped>
	.header {
		// background-color: white;
	}

	.headerItems {
		display: flex;
		align-items: center;
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