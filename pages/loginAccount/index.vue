<template>
	<view class="loginAccount">
		<z-paging :pagingStyle="{ padding: '0 30rpx' }">
			<template #top>
				<view class="loginAccount_header">
					<image class="loginAccount_header_image" src="../../static/logo.svg" mode=""></image>
				</view>
				<view class="loginAccount_tabList">
					<up-tabs :current="current" @change="changeTabs" :list="tabList"></up-tabs>
				</view>
				<view class="loginAccount_main">
					<view class="loginAccount_main_input">
						<up-input :customStyle="{ width: '70%', borderRadius: '35rpx', fontSize: '20rpx' }"
							:placeholder="type == 'phone' ? '请输入手机号' : '请输入邮箱或用户名'" border="surround"
							v-model="userComputed"></up-input>
					</view>
					<template v-if="type == 'phone'">
						<view class="loginAccount_main_input">
							<up-input :customStyle="{ width: '70%', borderRadius: '35rpx', fontSize: '20rpx' }"
								placeholder="请输入手机验证码" border="surround" v-model="PhoneLoginParmas.code"></up-input>
							<text class="loginAccount_main_input_code" @click="sendCode">获取验证码</text>
						</view>
					</template>
					<template v-else>
						<view class="loginAccount_main_input">
							<up-input type="password"
								:customStyle="{ width: '70%', borderRadius: '35rpx', fontSize: '20rpx' }"
								placeholder="请输入密码" border="surround" v-model="loginParmas.pass"></up-input>
						</view>
					</template>
					<template v-if="type == 'register'">
						<view class="loginAccount_main_input">
							<up-input type="password"
								:customStyle="{ width: '70%', borderRadius: '35rpx', fontSize: '20rpx' }"
								placeholder="请输入邀请码" border="surround" v-model="loginParmas.code"></up-input>
						</view>
					</template>
					<view class="vertifyStuas">
						<text @click="changeType">{{ type == 'phone' ? '账户密码登录' : '短信验证码登录' }}</text>
					</view>
					<LoginDecscriptions v-model:aloneChecked="aloneChecked" />
					<view class="loginButton">
						<up-button size="small"
							:customStyle="{ width: '100%', borderRadius: '35rpx', marginTop: '30rpx' }" @click="onLogin"
							type="primary" text="确定"></up-button>
					</view>
				</view>
			</template>
			<up-overlay :show="show">
				<view class="warp">
					<up-loading-icon vertical color="#e8e8e8" text-color="#e8e8e8" text="登录中"
						textSize="18"></up-loading-icon>
				</view>
			</up-overlay>
		</z-paging>
	</view>
</template>

<script setup lang="ts">
	import { computed, reactive, ref, watch } from 'vue';
	import LoginDecscriptions from '@/components/LoginCom/LoginDecscriptions.vue';
	import { useUserStore } from '../../store';
	import { verifyPhoneFn } from '../../utils/verifyPhoneFn';
	// import api from '../../api/api';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	const userStore = useUserStore();
	const aloneChecked = ref(false);
	const show = ref(false);
	const veifytime = ref(120);
	const timerActive = ref(false);
	const tabList = ref([
		{ name: '账户登录', value: 'login' },
		{ name: '注册账户', value: 'register' }
	]);
	const current = ref(0);
	const type = ref<'login' | 'register' | 'phone'>('login');
	watch([veifytime, timerActive], ([newVeifytime, newTimerActive]) => {
		let timer = null;
		if (newTimerActive && newVeifytime > 0) {
			timer = setTimeout(() => {
				veifytime.value -= 1;
			}, 1000);
		} else if (newVeifytime === 0) {
			timerActive.value = false;
		}
		return () => clearTimeout(timer);
	});
	const userComputed = computed({
		get() {
			return isMessageLogin.value ? PhoneLoginParmas.phone : loginParmas.user;
		},
		set(value) {
			if (isMessageLogin.value) {
				PhoneLoginParmas.phone = value;
			} else {
				loginParmas.user = value;
			}
		}
	});
	const { $api } = useGlobalProperties();

	const loginParmas = reactive({
		user: '',
		pass: '',
		code: ''
	});
	const changeTabs = (val) => {
		current.value = val.index;
		type.value = val.value;
	};
	const PhoneLoginParmas = reactive({
		phone: '',
		code: ''
	});
	const isMessageLogin = ref(false);
	const changeType = () => {
		isMessageLogin.value = !isMessageLogin.value;
		isMessageLogin.value ? (type.value = 'phone') : (type.value = 'login');
		current.value = 0;
	};

	const onLogin = async () => {
		//  判断是否勾选隐私协议
		console.log(aloneChecked.value);
		if (!aloneChecked.value) {
			uni.$u.toast('请勾选隐私协议后再进行！');
			return;
		}
		const parmas = isMessageLogin.value ? PhoneLoginParmas : loginParmas;

		// 验证登录方式
		if (type.value == 'phone') {
			if (!PhoneLoginParmas.phone || !PhoneLoginParmas.code) {
				uni.$u.toast('请输入手机号和验证码后登录！');
				return;
			}
		}
		if (type.value == 'login' || type.value == 'register') {
			if (!loginParmas.user || !loginParmas.pass) {
				uni.$u.toast('请输入用户名和密码后登录！');
				return;
			}
		}
		// show.value = true
		const data = await userStore.login(parmas, type.value);

		if (data.code == 200) {
			show.value = false;
			userStore.token = data?.data?.token;
			userStore.userInfo = data.data;
			// const users = await api.userInfo(null)
			const users = await $api.get('api/v1/user/info');
			if (users.code == 200) {
				userStore.userInfo = users.data;
				uni.switchTab({
					url: '/pages/my/index'
				});
				uni.$u.toast('登录成功！')
			}

		} else {
			show.value = false;
			uni.$u.toast(data.msg);
		}
	};

	const sendCode = async () => {
		if (!verifyPhoneFn(PhoneLoginParmas.phone || '')) {
			uni.$u.toast('请输入正确的手机号！');
			return;
		}
		if (timerActive.value) {
			uni.$u.toast('请等待2分钟后再试！');
			return;
		}
		// 发送验证码的逻辑
		timerActive.value = true;
		veifytime.value = 60;

		// const result = await api.sendSmsCode({ phone: PhoneLoginParmas.phone })
		const result = await $api.post('api/v1/user/sendSmsCode', { phone: PhoneLoginParmas.phone });
		if (result.code == 200) {
			uni.$u.toast('发送验证码成功，请注意查收！');
		} else {
			uni.$u.toast(result.msg);
		}
	};
</script>

<style lang="scss" scoped>
	.loginAccount {
		&_tabList {
			padding: 20rpx 0;
			display: flex;
			justify-content: center;
		}

		&_header {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&_image {
				width: 200rpx;
				height: 100rpx;
				padding: 70rpx;
			}
		}

		&_main {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&_input {
				width: 88%;
				display: flex;
				border-radius: 30rpx;
				justify-content: center;
				align-items: center;
				background-color: #f7f7f7;
				margin: 20rpx 0;

				&_code {
					color: rgb(192, 196, 204);
					padding: 0 15rpx;
					font-size: 30rpx;
				}
			}
		}
	}

	.loginButton {
		width: 88%;
	}

	.vertifyStuas {
		display: flex;
		width: 88%;
		font-size: 27rpx;
		color: $u-primary;
		justify-content: flex-end;
	}

	.warp {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.rect {
		width: 200px;
		height: 200px;
		background-color: #fff;
	}
</style>