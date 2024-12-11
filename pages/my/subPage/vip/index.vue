<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'url(http://file.1foo.com/2024/09/18/309765e7bc6ba5cc1d0bf16c6f2892cc.png) no-repeat', padding: '0' }">
		<template v-if="AppName == 'bianjie'">
			<BianJieVip />
		</template>
		<template v-else>
			<WangXiangVip />
		</template>

	</z-paging>
</template>

<script setup lang="ts">
	import BianJieVip from './components/BianJieVip.vue';
	import WangXiangVip from './components/WangXiangVip.vue';
	import { AppName } from '@/http';
</script>

<style scoped lang="scss">
	.header {
		width: 100%;
		height: 40rpx;
		margin: 20rpx 0;
		padding: 0 30rpx;

		&_weixin-header {
			display: flex;
			justify-content: flex-start;

		}

		&_btngrp {
			display: flex;
			z-index: 2;

		}
	}

	.vipBox {
		&_header {
			display: flex;
			flex-direction: column;
			padding: 25rpx 0;

			&_top {
				font-weight: 700;

			}

			&_bottom {
				font-size: 25rpx;
				padding: 20rpx 0;
			}
		}
	}

	.backGroundImages {
		position: absolute;
		top: -100rpx;
		right: -200rpx;

		&_images {
			width: 500rpx;
			height: 400rpx;

		}
	}

	.buchajia {
		background-color: #FFF9F0;
		border-radius: 10rpx;
		padding: 10rpx;
		font-size: 25rpx;
		color: $aichat-golbal-vipText;
		margin-left: 20rpx;
		display: flex;
		align-items: center;

		&_image {
			width: 30rpx;
			margin-right: 10rpx;
			height: 26rpx;
		}
	}

	.imagesBox {
		padding: 25rpx 30rpx;

		&_rightBox {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
		}

		&_avatar {
			display: flex;

			&_topText {
				display: flex;
				color: $aichat-golbal-vipText;
				align-items: center;
				font-size: 27rpx;
				font-weight: 700;

				&_imgs {
					width: 35rpx;
					height: 35rpx;
					margin-right: 10rpx;
				}
			}

			&_bottomText {
				color: $aichat-golbal-vipText;
				display: flex;
				align-items: center;
				font-size: 27rpx;

				&_img {
					width: 30rpx;
					height: 40rpx;
					margin-right: 13rpx;
				}
			}

			&_images {

				// border: 4rpx solid #FFF9F0;
			}
		}
	}

	.vipTptySeleted {
		width: 100%;
		display: flex;
		z-index: 2;
		position: relative;
		background: url('http://file.1foo.com/2024/09/19/a408ac7528e5bf182ac45b896b5846c4.png');
		background-size: cover;

		&_items {
			padding: 20rpx 0;
			display: flex;
			justify-content: center;
			width: 50%;
			background-size: cover;
			font-size: 27rpx;

		}

	}

	.activeVipItems {
		background: url('http://file.1foo.com/2024/09/19/993d94ed834b1b86df933e5a47d0e50f.png') no-repeat;
		background-size: cover;
		font-weight: 700;
		color: $aichat-golbal-vipActiveText;
	}

	.activeVipItems1 {
		background: url('http://file.1foo.com/2024/09/19/d811c39a85ef80ef8e730616ff85ecdc.png') no-repeat;
		background-size: cover;
		font-weight: 700;
		color: $aichat-golbal-vipActiveText;
	}

	.noActiveVipItems {}


	.buChaJiaModal {
		font-size: 27rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		&_header {
			font-weight: 800;
			width: 100%;
			font-size: 30rpx;
		}

		&_main {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: 1rpx solid #ccc;
			border-radius: 10rpx;
			padding: 6rpx 9rpx;
			margin: 20rpx 0;

			&_input {}

			&_topText {
				padding: 20rpx 0;
			}

			&_middleText {

				&_image {
					width: 500rpx;
					height: 500rpx;
				}

			}

			&_bottomText {
				display: flex;
				width: 100%;
				font-size: 24rpx;
				padding: 5rpx 0;
				color: $uni-color-primary;
				flex-direction: column;
				justify-content: flex-start;
			}
		}

		&_footer {
			display: flex;
			justify-content: flex-end;
			margin-top: 25rpx;

			&_button1 {
				padding: 15rpx 20rpx;
				background-color: #ccc;
				border-radius: 15rpx;
				margin-right: 15rpx;
				color: #FFF9F0;
			}

			&_button2 {
				padding: 15rpx 20rpx;
				background-color: $uni-color-primary;
				border-radius: 15rpx;
				color: #FFF9F0;
			}
		}
	}
</style>