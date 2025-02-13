<template>
	<view class="NewIndexHeader">
		<view class="headerItems" :style="{marginTop: ScreenStore.navBarHeight + 'px' }">
			<view class="OverSearchBox">
				<up-icon class="OverSearchBox_icon" name="search" size="28"></up-icon>
				<view class="placeHolder">搜索300+热门AI功能</view>
				<up-icon class="OverSearchBox_icon" name="camera" size="28"></up-icon>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import OverSearchBoxVue from './OverSearchBox.vue';
	import { useChatStore, useScreenStore } from '@/store';
	const ScreenStore = useScreenStore()
</script>

<style lang="scss" scoped>
	.NewIndexHeader {
		// background-color: $aichat-border-color;

		.headerItems {
			display: flex;
			align-items: center;
			padding: 0 40rpx;

			.OverSearchBox {
				display: flex;
				border: 4rpx solid #888;
				border-radius: 15rpx;
				width: 100%;
				justify-content: space-between;
				align-items: center;
				padding: 10rpx;
				background-color: white;
				.placeHolder {
					flex: 1;
					display: flex;
					color: rgb(191, 191, 191);
					height: 50rpx;
					font-size: 28rpx;
					align-items: center;
				}

				&_icon {
					padding: 0 10rpx;
					
				}
			}
		}
	}
</style>