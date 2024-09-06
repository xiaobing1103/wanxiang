<template>
	<up-popup :show="popupShow" @close="close" @open="open" round="15">
		<view class="bindPhone">
			<view class="bindPhone_header">
				<template v-if="titleIcon">
					<image class="bindPhone_header_img" :src="titleIcon" mode=""></image>
				</template>
				<text class="bindPhone_header_text">{{ title }}</text>
			</view>
			<view class="bindPhone_main">
				<view class="bindPhone_main_inputBox">
					<up-input :customStyle="{width:'100%'}" class="bindPhone_main_input" clearable border="bottom"
						placeholder="新密码" v-model="passWord"></up-input>
					<text class="bindPhone_main_text">密码由6-16位任意字符组成</text>
				</view>
			</view>
			<view class="bindPhone_main">
				<view class="bindPhone_main_inputBox">
					<up-input :customStyle="{width:'100%'}" class="bindPhone_main_input" clearable border="bottom"
						placeholder="确认新密码" v-model="newPassWord"></up-input>

				</view>
			</view>
			<view class="bindPhone_footer">
				<view class="bindPhone_footer_button" @click="resetNickName">确定</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useUserStore } from '../../store';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	const popupShow = defineModel<boolean>('popupShow');
	const passWord = ref('');
	const newPassWord = ref('');

	const { $api } = useGlobalProperties();

	defineProps<{ title : string; titleIcon ?: string }>();
	const UserStore = useUserStore();
	const close = () => {
		popupShow.value = false;
	};
	const open = () => {
		popupShow.value = true;
	};
	function validatePassword(password) {
		const regex = /^.{6,16}$/;
		return regex.test(password);
	}
	const resetNickName = async () => {
		if (passWord.value !== newPassWord.value) {
			uni.$u.toast('两次输入密码不一致,请重新输入！');
			return
		}
		if (!validatePassword(newPassWord.value)) {
			uni.$u.toast('密码由6-16位任意字符组成！');
			return
		}


		const result = await $api.post('api/v1/user/editPass', { newPass: newPassWord.value });
		if (result.code == 200) {
			uni.$u.toast('修改密码成功！');
			passWord.value = ''
			newPassWord.value = ''
			close()
		} else {
			uni.$u.toast(result.msg);
		}
	};
</script>

<style lang="scss">
	.bindPhone {
		padding: 20rpx;
		width: 100%;

		&_header {
			display: flex;
			align-items: center;

			&_img {
				width: 35rpx;
				height: 35rpx;
				margin-right: 20rpx;
			}

			&_text {
				font-size: 30rpx;
				font-weight: 700;
			}
		}

		&_main {
			width: 100%;

			&_inputBox {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 100%;
				padding: 10rpx 0;
			}

			&_input {
				width: 100%;
				border-bottom: 1rpx solid #ccc;
				font-size: 27rpx;

				&_else {
					color: $u-primary;
					font-size: 27rpx;
				}
			}

			&_text {

				padding: 0 40rpx;
				width: 100%;
				font-size: 27rpx;
				color: $uni-text-color-disable;
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