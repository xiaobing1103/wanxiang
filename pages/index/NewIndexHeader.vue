<template>
	<view class="NewIndexHeader">
		<view class="headerItems">
			<view class="OverSearchBox" @tap="handleSearchTap">
				<view class="placeHolder">搜索300+热门AI功能</view>
				<up-icon color="rgba(61,61,61)" class="OverSearchBox_icon" name="search" size="28"></up-icon>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { useChatStore, useScreenStore } from '@/store';
	const ScreenStore = useScreenStore()
	
	// 修改跳转方法
	const handleSearchTap = () => {
		// 使用 setTimeout 确保在安卓端正常工作
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/index/subPage/SearchPage/index',
				fail: (err) => {
					console.error('导航失败:', err)
					// 备用跳转方案
					uni.switchTab({
						url: '/pages/index/index',
						success: () => {
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/index/subPage/SearchPage/index'
								})
							}, 100)
						}
					})
				}
			})
		}, 50)
	}
</script>

<style lang="scss" scoped>
	.NewIndexHeader {
		z-index: 100;
		margin: 30rpx 0;

		.headerItems {
			display: flex;
			align-items: center;
			padding: 0 40rpx;
			box-sizing: border-box;
			width: 100%;

			.OverSearchBox {
				display: flex;
				border: 4rpx solid $color-blogal-borderColor;
				border-radius: 15rpx;
				width: 100%;
				justify-content: space-between;
				align-items: center;
				padding: 16rpx 20rpx;
				background-color: white;

				.placeHolder {
					flex: 1;
					display: flex;
					color: $uni-text-color-placeholder;
					height: 50rpx;
					font-size: 28rpx;
					align-items: center;
				}

				.icon-wrapper {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0 10rpx;

					/* #ifdef MP-WEIXIN */
					// 确保图标在微信小程序中正确显示
					:deep(.up-icon) {
						display: flex;
						align-items: center;
						justify-content: center;
					}

					/* #endif */
				}

				&_icon {
					padding: 0 10rpx;
				}
			}
		}
	}
</style>