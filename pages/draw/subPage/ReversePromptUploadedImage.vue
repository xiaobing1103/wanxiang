<template>
	<view class="ReversePromptUploadedImage" @click="toPath">
		<view class="ReversePromptUploadedImage_main">
			<view class="ReversePromptUploadedImage_left">
				<up-icon name="plus" size="20"></up-icon>
			</view>
			<view class="ReversePromptUploadedImage_right">
				<text class="ReversePromptUploadedImage_right_topText">可上传图片反推提示词</text>
				<text class="ReversePromptUploadedImage_right_bottomText">算法反推适用于潜在扩散模型上进行绘制的提示词</text>
			</view>
		</view>

	</view>
</template>

<script setup lang="ts">
	const toPath = () => {
		uni.navigateTo({
			url: '/pages/draw/subPage/reserveWordIcons/index'
		})
	}
</script>

<style lang="scss">
	.ReversePromptUploadedImage {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		&_main {
			width: 80%;
			border: 2rpx dashed $u-info-dark;
			background-color: $uni-bg-color;
			border-radius: 20rpx;
			padding: 25rpx;
			display: flex;
			font-size: 27rpx;
			align-items: center;
		}

		&_left {
			width: 20%;
		}

		&_right {
			display: flex;
			flex-direction: column;

			&_topText {
				font-weight: 600;
				color: $u-main-color;
			}

			&_bottomText {
				padding-top: 10rpx;
				color: $u-tips-color;
			}

		}
	}
</style>