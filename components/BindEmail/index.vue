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
						:placeholder="UserStore.userInfo.email || '请输入邮箱'" v-model="email"></up-input>
				</view>

				<view class="bindPhone_main_inputBox">
					<up-input class="bindPhone_main_input" clearable border="bottom" placeholder="请输入验证码"
						v-model="vierfCode"></up-input>
					<text class="bindPhone_main_input_else" @click="sendCode">
						{{ timerActive ? countdown + '秒后重试' : '获取验证码' }}
					</text>
				</view>
			</view>
			<view class="bindPhone_footer">
				<view class="bindPhone_footer_button" @click="onsendEmail">确定</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useUserStore } from '../../store';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	const popupShow = defineModel<boolean>('popupShow');
	const email = ref('');
	const vierfCode = ref('');
	const { $api } = useGlobalProperties();
	const timerActive = ref(false);
	const countdown = ref(120);
	const checkCode = ref('');
	defineProps<{ title : string; titleIcon ?: string }>();
	const UserStore = useUserStore();
	const close = () => {
		popupShow.value = false;
	};
	const open = () => {
		popupShow.value = true;
	};

	const sendCode = async () => {
		const regu = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
		if (!regu.test(email.value)) {
			uni.$u.toast('你输入的邮箱格式不正确！');
			return;
		}
		const result = await $api.post('api/v1/user/sendEmailCode', { email: email.value });
		if (result.code == 200) {
			uni.$u.toast('发送验证码成功！');
			checkCode.value = result.data;
			startCountdown();
		} else {
			uni.$u.toast(result.msg);
		}
	};

	const onsendEmail = async () => {
		if (!email.value || !vierfCode.value) {
			uni.$u.toast('请输入手机号和验证码再提交！');
			return;
		}
		const result = await $api.post('api/v1/user/bindEmail', {
			check: checkCode.value,
			code: vierfCode.value,
			email: email.value
		});
		if (result.code == 200) {
			uni.$u.toast('绑定邮箱成功！');
			email.value = ''
			vierfCode.value = ''
			close()
			const users = await $api.get('api/v1/user/info');
			if (users.code == 200) {
				UserStore.userInfo = users.data;
			}
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