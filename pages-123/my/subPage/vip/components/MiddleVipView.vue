<template>
	<view class="middleVipView">
		<view class="middleVipView_topText">
			会员尊享 · 最新模型
		</view>
		<view class="middleVipView_bottomText">
			AI换脸、AI写真、写代码、写文稿等能力重磅升级
		</view>
	</view>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
	.middleVipView {
		padding: 25rpx;

		&_topText {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			font-weight: 800;
			background: linear-gradient(90deg, #e2941c, #b05112);
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			width: 100%;
			/* 视情况而定 */
			font-size: 30rpx;

			&:before,
			&:after {
				content: '';
				flex: 1;
				height: 1px;
				margin: 0 20rpx;
				background: linear-gradient(90deg, #e2941c, #b05112);
			}


		}

		&_bottomText {
			display: flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(90deg, #612c08, #bf5b02);
			font-weight: 500;
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			font-size: 24rpx;
			padding: 10rpx 0;
		}
	}
</style>