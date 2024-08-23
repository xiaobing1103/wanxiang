<template>
	<up-popup :show="popupShow" @close="close" @open="open" round="15">
		<view class="DeleteAccount">
			<view class="DeleteAccount_header">
				<view class="DeleteAccount_header_text">
					{{title}}
				</view>
			</view>
			<view class="DeleteAccount_main">
				<view class="DeleteAccount_main_header">
					操作之前,您可能需要了解以下风险
				</view>
				<view class="DeleteAccount_main_content">
					<text class="DeleteAccount_main_header">无法登录</text>
					<text>账户删除后，您将永远无法使用此账户或此账户关联的任何登录方式登录</text>
				</view>
				<view class="DeleteAccount_main_content">
					<text class="DeleteAccount_main_header">权益失效</text>
					<text>若此账户在我们的产品上开通了会员，您的会员身份将随您的账户从我们的服务器上一并删除，且无法找回或转移，您需要自行承担可能带来的相关损失由于此操作不可逆，您的所有相关数据将无法找回</text>
				</view>

			</view>

			<view class="DeleteAccount_footer">
				<view class="DeleteAccount_footer_button" @click="lianxi">
					确认并删除
				</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useUserStore } from '../../store';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	const popupShow = defineModel<boolean>('popupShow');
	const NickName = ref('');

	const { $api } = useGlobalProperties();

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
			align-items: center;
			font-size: 30rpx;
			font-weight: 700;
		}

		&_main {
			background-color: $aichat-golbal-background;
			border-radius: 20rpx;
			padding: 15rpx;
			font-size: 25rpx;

			&_header {
				font-weight: 800;
				padding: 5rpx 0;
			}

			&_content {
				display: flex;
				flex-direction: column;
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