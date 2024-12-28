<template>
	<up-popup mode="left" :show="ScreenStore.openGolbalList" @close="ScreenStore.setOpenGolbalList(false)">
		<view class="CommonTabbar">
			<view class="overPagesPop" :style="{height: ScreenStore.navBarHeight + 'px' }">
				<image class="overPagesPop_logos" :style="{ width:AppName == 'bianjie' ? '120px' : '100px' }"
					:src="AppName == 'bianjie'  ?  '/static/logo.svg' : '/static/wanxianglogo.svg'" mode="">
				</image>
			</view>
			<view class="overPagesPop_content">
				<template v-for="(items,index) in PageList" :key="index">
					<view class="overPagesPop_content_items" @click="toSwitchPath(items.pagePath)">
						{{items.text}}
					</view>
				</template>
			</view>
		</view>
	</up-popup>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { useScreenStore } from '@/store';
	import { AppName } from '@/http';
	const ScreenStore = useScreenStore()
	const PageList = [
		{
			pagePath: "/pages/index/index",
			text: "ai对话"
		},
		{
			pagePath: "/pages/draw/index",
			text: "ai绘画"

		},
		{
			pagePath: "/pages/function/index",
			text: "功能库"

		},
		{
			pagePath: "/pages/my/index",
			text: "我的"
		}
	]
	const toSwitchPath = (url : string) => {
		uni.switchTab({
			url
		})
	}
</script>

<style lang="scss" scoped>
	.CommonTabbar {
		width: 70vw;
		display: flex;
		flex-direction: column;
	}

	.overPagesPop {
		display: flex;
		align-items: center;
		margin: 30rpx 0;
		justify-content: center;

		&_logos {
			height: 50rpx;
		}

		&_content {
			&_items {
				height: 70rpx;
			}
		}
	}
</style>