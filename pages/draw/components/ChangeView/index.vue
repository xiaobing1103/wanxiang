<template>
	<view class="view">
		<view class="changeView">
			<up-tabs :current="activeTabs"  :list="list4" lineWidth="30" :lineWidth="0" :lineHeight="0" :activeStyle="{
				fontSize:'25rpx',
				border: '2rpx solid var(--border-color)',
				background:'var(--primary-color)',
				borderRadius: '15rpx',
				padding: '10rpx',
				color:'var(--white-color)'
			        }" :inactiveStyle="{
			            color: 'var(--primary-color)',
						border: '2rpx solid var(--white-color)',
						display:'flex',
						fontSize:'25rpx',
						padding: '10rpx',
						justifyContent: 'center',
			            transform: 'scale(1)'
			        }" itemStyle="padding: 10rpx; " @click="handlerClick">
			</up-tabs>
		</view>
		<view class="tab-content">
			<template v-if="activeTabs == 0">
				<BaseTem v-model:parmas="parmas" :IamgeTypes='IamgeTypes' />
			</template>
			<template v-if="activeTabs == 1">
				<!-- <ArtStyleCheatSheet /> -->
				<HistoryCreateImages />
			</template>
			<template v-if="activeTabs == 2">
				<OnlinePrompts />
			</template>
		</view>
	</view>

</template>

<script setup lang="ts">
	import BaseTem from './BaseTem'
	import ArtStyleCheatSheet from './ArtStyleCheatSheet'
	import HistoryCreateImages from './HistoryCreateImages'
	import OnlinePrompts from './OnlinePrompts'
	import {
		ref,
		reactive
	} from 'vue';
	import { Image2TextParmas, ImageProjectTypes } from '../../data';
	defineProps<{
		IamgeTypes : ImageProjectTypes
	}>()
	
	const activeTabs = defineModel<number>('activeTabs')
	const parmas = defineModel<Image2TextParmas>("parmas")
	const list4 = reactive([{
		name: '参数设置',
		keyName: 'Tab1',
	},
	{
		name: '历史记录',
		keyName: 'Tab12',
	},
		// {
		// 	name: '在线提示词',
		// 	keyName: 'Tab13',
		// },
	]);
	const handlerClick = (tabs : {
		name : string;
		keyName : string;
		index : number
	}) => {
		activeTabs.value = tabs.index
	}
</script>

<style lang="scss" scoped>
	.view {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		--primary-color: #{$aichat-button-color};
		--white-color : #{$uni-bg-color};
		--border-color : #{$aichat-border-color};

	}

	.changeView {
		display: flex;
		justify-content: center;
		background-color: $uni-bg-color;
		border-radius: 25rpx;
		margin: 25rpx;
		// width: 70%;
	}

	.tab-content {
		width: 100%;
		height: 100%;
	}
</style>