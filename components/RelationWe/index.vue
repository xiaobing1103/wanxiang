<template>
	<up-popup :show="popupShow" @close="close" @open="open" round="15">
		<view class="DeleteAccount">
			<view class="DeleteAccount_header">
				<view class="DeleteAccount_header_text">
					<text class="DeleteAccount_header_text_top">{{title}}</text>
					<text class="DeleteAccount_header_text_buttom">(周日、节假日不定时在线)</text>
				</view>
				<view class="DeleteAccount_header_textdesc">
					早9:30-12:30 下午14:00-18:00 晚19:00-22:00
				</view>
			</view>
			<view class="DeleteAccount_main">
				<view class="DeleteAccount_main_left">
					<image class="DeleteAccount_main_left_img" :src="$assets.weiXinQun" mode=""></image>
					<text class="DeleteAccount_main_left_text">企业微信群</text>
				</view>
				<view class="DeleteAccount_main_left">
					<image class="DeleteAccount_main_left_img" :src="$assets.weiXinKeFu" mode=""></image>
					<text class="DeleteAccount_main_left_text">微信客服</text>
				</view>
			</view>

			<!-- <view class="DeleteAccount_footer">
				<view class="DeleteAccount_footer_button" @click="lianxi">
					确认并删除
				</view>
			</view> -->
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useUserStore } from '../../store';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	const popupShow = defineModel<boolean>('popupShow');
	const { $api } = useGlobalProperties();
	const { $assets } = useGlobalProperties();
	defineProps<{ title : string; titleIcon ?: string }>();
	const UserStore = useUserStore();
	const close = () => {
		popupShow.value = false;
	};
	const open = () => {
		popupShow.value = true;
	};
	const lianxi = () => {
		uni.$u.toast('请联系管理员！');
	}
</script>

<style lang="scss" scoped>
	.DeleteAccount {
		padding: 20rpx;

		&_header {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;

			&_text {

				&_top {
					font-size: 30rpx;
					font-weight: 700;
				}

				&_buttom {
					font-size: 20rpx;
					padding: 0 10rpx;
				}
			}

			&_textdesc {
				font-size: 25rpx;
				text-align: center;
				padding: 20rpx;
			}
		}

		&_main {
			background-color: $aichat-golbal-background;
			border-radius: 20rpx;
			padding: 15rpx;
			font-size: 25rpx;
			display: flex;
			justify-content: space-evenly;

			&_left {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				&_img {
					height: 200rpx;
					width: 200rpx;
				}
				&_text{
					padding: 25rpx 0;
				}
			}
		}

		&_footer {
			padding: 40rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			&_button {
				width: 80%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
				padding: 10rpx 20rpx;
				border-radius: 1.09375rem !important;
				height: 60rpx !important;
				color: #ffffff !important;
				background: linear-gradient(to right, #1cd8ba, #06c0f9);
				cursor: pointer;
			}
		}
	}
</style>