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
					<up-input class="bindPhone_main_input" clearable border="bottom"
						:placeholder="UserStore.userInfo.phone || '+86 | 手机号码'" v-model="phone"></up-input>
				</view>

				<view class="bindPhone_main_inputBox">
					<up-input class="bindPhone_main_input" clearable border="bottom" placeholder="请输入验证码"
						v-model="passWord"></up-input>
					<text class="bindPhone_main_input_else" @click="sendCode">
						{{ timerActive ? countdown + '秒后重试' : '获取验证码' }}
					</text>
				</view>
			</view>
			<view class="bindPhone_footer">
				<view class="bindPhone_footer_button" @click="submit">确定</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useUserStore } from '../../store';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	const popupShow = defineModel<boolean>('popupShow');

	const phone = ref('');
	const passWord = ref('');
	// 定义一个响应式变量来控制按钮状态和倒计时
	const timerActive = ref(false);
	const countdown = ref(120);
	defineProps<{ title : string; titleIcon ?: string }>();
	const UserStore = useUserStore();
	const close = () => {
		popupShow.value = false;
	};
	const open = () => {
		popupShow.value = true;
	};
	// 验证手机
	const verifyPhoneFn = (phoneNumber : string) => {
		const regu = /^1[3-9][0-9]{9}$/;
		return regu.test(phoneNumber);
	};
	// 验证验证码
	const verifyCodeFn = (code : string) => {
		const regu = /^\d{4,6}$/;
		return regu.test(code);
	};
	const { $api } = useGlobalProperties();
	const submit = async () => {
		if (!verifyPhoneFn(phone.value || '')) {
			uni.$u.toast('请输入正确的手机号再提交！');
			return;
		}
		if (!verifyCodeFn(String(passWord.value))) {
			uni.$u.toast('请输入正确4-6位验证码再提交！');
			return;
		}
		const result = await $api.post('api/v1/user/bindPhone', { phone: phone.value, code: passWord.value });
		if (result.code == 200) {
			uni.$u.toast('绑定手机成功！');
			phone.value = ''
			passWord.value = ''
			close()
			const users = await $api.get('api/v1/user/info');
			if (users.code == 200) {
				UserStore.userInfo = users.data;
			}
		} else {
			uni.$u.toast(result.msg);
		}
	};

	const sendCode = async () => {
		if (!verifyPhoneFn(phone.value || '')) {
			uni.$u.toast('请输入正确的手机号再提交！');
			return;
		}
		if (timerActive.value) {
			uni.$u.toast(`请等待${countdown.value}秒后再试！`);
			return;
		}
		const result = await $api.post('api/v1/user/sendSmsCode', { phone: phone.value });
		if (result.code == 200) {

			startCountdown();
		} else {
			uni.$u.toast(result.msg);
		}
	};

	const startCountdown = () => {
		timerActive.value = true;
		const timer = setInterval(() => {
			if (countdown.value > 0) {
				countdown.value--;
			} else {
				clearInterval(timer);
				countdown.value = 120;
				timerActive.value = false;
			}
		}, 1000);
	};
</script>

<style lang="scss" scoped>
	.bindPhone {
		padding: 20rpx;

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
			&_inputBox {
				display: flex;
				align-items: center;
				padding: 10rpx 0;
			}

			&_input {
				border-bottom: 1rpx solid #ccc;

				&_else {
					color: $u-primary;
					font-size: 27rpx;
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