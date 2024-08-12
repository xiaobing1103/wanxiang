<template>
	<view class="view">
		<Teleport to="body">
			<!-- 	<up-loading-page :loading="true">
				<view>4158641561561</view>
			</up-loading-page> -->
		</Teleport>
		<view class="changeView">
			<up-tabs :list="list4" lineWidth="30" :lineWidth="0" :lineHeight="0" :activeStyle="{
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
				<BaseTem />
			</template>
			<template v-if="activeTabs == 1">
				<ArtStyleCheatSheet />
			</template>
			<template v-if="activeTabs == 2">
				<OnlinePrompts />
			</template>
		</view>
	</view>

	<view class="footer">
		<view class="footer_box">
			<up-button class="footerButton" text="AI生成(消耗1次)"></up-button>
		</view>
	</view>

</template>

<script setup lang="ts">
	import BaseTem from './BaseTem'
	import ArtStyleCheatSheet from './ArtStyleCheatSheet'
	import OnlinePrompts from './OnlinePrompts'
	import {
		ref,
		reactive
	} from 'vue';
	const activeTabs = ref(0)
	const list4 = reactive([{
		name: '基础',
		keyName: 'Tab1',
	},
	{
		name: '艺术风格速查表',
		keyName: 'Tab12',
	},
	{
		name: '在线提示词',
		keyName: 'Tab134',
	},
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
		width: 70%;
	}

	.tab-content {
		width: 100%;
		height: 100%;
	}

	.footer {
		position: sticky;
		bottom: 0;
		z-index: 1;
		height: 80rpx;
		width: 100%;
		background: $aichat-golbal-background;
		display: flex;
		justify-content: center;
		align-items: center;

		&_box {
			width: 60%;

		}
	}

	.footerButton {
		border-radius: 35rpx !important;
		height: 60rpx !important;
		color: $uni-bg-color !important;
		background: linear-gradient(to right, #1cd8ba, #06c0f9)
	}
</style>