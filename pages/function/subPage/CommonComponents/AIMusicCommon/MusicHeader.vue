<template>
	<view class="MusicHeader" :style="{height: ScreenStore.navBarHeight + 40+ 'px' }">
		<view class="MusicHeader_icons">
			<view class="MusicHeader_leftIcons">
				<up-icon @click="backPage" name="arrow-left"></up-icon>
			</view>
			<view class="MusicHeader_iconsBOX">
				<image class="MusicHeader_icons_images" :src="$assets.AIMusicLogoIcon" />
				<text class="MusicHeader_icons_texts">AI音乐</text>
			</view>
			<view class="">

			</view>
		</view>
		<view class="MusicHeaderTabs">
			<up-tabs lineColor="rgba(0,0,0,0)" :current="currentPages"
				:activeStyle="{background:'linear-gradient(99.36deg, rgba(126, 61, 255, 1) 0%, rgba(252, 106, 201, 1) 100%)',borderRadius:'45rpx',padding:'15rpx',color:'#fff'}"
				:itemStyle="{background:'rgba(0,0,0,0)',borderRadius:'45rpx',margin:'0 15rpx'}" :list="list1"
				@click="changeTabs"></up-tabs>
		</view>
	</view>
	<LevelUpVip />
</template>

<script setup lang="ts">
	import LevelUpVip from '@/components/CommonChat/LevelUpVip.vue';
	import { reactive } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useScreenStore } from '@/store';
	import { storeToRefs } from "pinia"

	const ScreenStore = useScreenStore()
	const currentPages = defineModel('currentPages')
	const list1 = reactive([
		{ name: '自定义作曲' },
		{ name: '自动作曲' },
		{ name: '我的创作' },
	]);
	const changeTabs = ({ index }) => {
		console.log(index)
		currentPages.value = index
	}
	const { $assets } = useGlobalProperties()

	const backPage = () => {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.MusicHeaderTabs {
		width: 100%;
		display: flex;
		margin-top: 20rpx;
		justify-content: center;
		z-index: 1;
	}

	.MusicHeader {
		width: 100%;
		margin: 20rpx 0;
		padding: 0 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		&_iconsBOX {
			align-items: center;
			justify-content: center;
			display: flex;
		}

		&_icons {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&_images {
				width: 60rpx;
				height: 60rpx;
				margin-right: 20rpx;
			}

			&_texts {
				font-size: 35rpx;
				font-weight: 800;
			}
		}
	}
</style>