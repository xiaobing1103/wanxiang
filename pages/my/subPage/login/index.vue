<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)',
		backgroundImage:'url(http://file.1foo.com/2024/10/14/4a280259e65335bb282318abbd51f889.png)', 
		backgroundRepeat: 'no-repeat',
		padding: '0 30rpx' ,
		backgroundSize: 'cover',
		backgroundPosition: '-700rpx -613rpx'
		}">
		<template #top>
			<CommonHeader noBackGround />
		</template>
		<view class="LoginTitle">
			<view class="LoginTitle_welocome">欢迎回来</view>
			<view class="LoginTitle_NoRegister">未注册的手机号码登录后自动注册账号</view>
		</view>
		<!-- <view class="loginAccount">
			<view class="loginAccount_tabList">
				<up-tabs :activeStyle="{ color: 'rgba(50, 100, 237, 1)', }" :lineWidth="'100rpx'" :lineHeight="'15rpx'"
					:lineColor="`url(${lineBg}) 100% 100%`" :current="current" @change="changeTabs"
					:list="tabList"></up-tabs>
			</view>

			<view class="loginAccount_main">
				<view class="loginAccount_main_input">
					<up-input :customStyle="{ width: '70%', borderRadius: '10rpx', fontSize: '20rpx' }"
						:placeholder="type == 'phone' ? '请输入手机号' : '请输入邮箱或用户名'" border="surround"
						v-model="userComputed"></up-input>
				</view>
				<template v-if="type == 'phone'">
					<view class="loginAccount_main_input">
						<up-input :customStyle="{ width: '70%', borderRadius: '10rpx', fontSize: '20rpx' }"
							placeholder="请输入手机验证码" border="surround" v-model="PhoneLoginParmas.code"></up-input>
						<text class="loginAccount_main_input_code" @click="sendCode">获取验证码</text>
					</view>
				</template>
				<template v-else>
					<view class="loginAccount_main_input">
						<up-input type="password"
							:customStyle="{ width: '70%', borderRadius: '10rpx', fontSize: '20rpx' }"
							placeholder="请输入密码" border="surround" v-model="loginParmas.pass"></up-input>
					</view>
				</template>
				<template v-if="type == 'register'">
					<view class="loginAccount_main_input">
						<up-input type="text" :customStyle="{ width: '70%', borderRadius: '10rpx', fontSize: '20rpx' }"
							placeholder="请输入邀请码" border="surround" v-model="loginParmas.code"></up-input>
					</view>
				</template>
				<view class="vertifyStuas">
					<text @click="changeType">{{ type == 'phone' ? '账户密码登录' : '短信验证码登录' }}</text>
				</view>

				<view class="loginButton">
					<up-button :customStyle="{ width: '100%', borderRadius: '15rpx', marginTop: '40rpx' }"
						@click="onLogin" type="primary" text="立即登录"></up-button>
				</view>
			</view>

		</view>
	 -->
		<template #bottom>
			<LoginDecscriptions v-model:aloneChecked="aloneChecked" />
		</template>
		<up-overlay :show="show">
			<view class="warp">
				<up-loading-icon vertical color="#e8e8e8" text-color="#e8e8e8" text="登录中"
					textSize="18"></up-loading-icon>
			</view>
		</up-overlay>


		<view class="buttonGroup">
			<!-- #ifdef MP-WEIXIN -->
			<up-button shape="circle" :customStyle="{width: '85%',marginBottom:'20rpx'}" size="normal" type="success"
				text="手机号快捷登录" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber"></up-button>
			<!-- #endif -->
			<up-button shape="circle" :hairline="false"
				:customStyle="{width: '85%',borderRadius:'50rpx',border:'1px solid #ccc'}" size="normal" text="账户登录/注册"
				@click="toAccountLogin"></up-button>

		</view>
		<!-- <LoginDecscriptions /> -->
	</z-paging>
</template>

<script setup lang="ts">
	import { reactive, ref, watch, computed } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useUserStore, useScreenStore, } from '@/store';
	// import LoginDecscriptions from '@/components/LoginCom/LoginDecscriptions.vue';
	const toAccountLogin = () => {
		uni.navigateTo({
			url: '/pages/my/subPage/loginAccount/index'
		})
	}
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const ScreenStore = useScreenStore();
	const UserStore = useUserStore()
	const { $api } = useGlobalProperties();
	const decryptPhoneNumber = async (e) => {
		const phoneNumberReq = await $api.post('api/v1/wechat/getPhoneNumber', { "code": e.detail.code })
		if (phoneNumberReq.phone_info) {
			const { phoneNumber } = phoneNumberReq.phone_info
			const parmas = { "code": e.detail.code, "phone": phoneNumber, invite_code: UserStore.invite_code }
			const data = await UserStore.login(parmas, 'wechat')
			if (data.code == 200) {
				UserStore.token = data?.data?.token;
				UserStore.userInfo = data.data;
				const users = await $api.get('api/v1/user/info');
				if (users.code == 200) {
					UserStore.token = data?.data?.token;
					UserStore.userInfo = users.data;
					await getLastdayInfo()
					uni.switchTab({
						url: '/pages/my/index'
					});
					uni.$u.toast('登录成功！')
				}
			} else {
				uni.$u.toast(data.msg);
			}
		} else {
			if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
				uni.$u.toast('用户取消登录！');
			}
		}
		console.log(e.detail.code)  // 动态令牌
		console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
		console.log(e.detail.errno)  // 错误码（失败时返回）
	}

	const getLastdayInfo = async () => {
		if (!ScreenStore.saveTime) {
			ScreenStore.setSaveTime(Math.floor(Date.now() / 1000))
		}
		const lastDatReq = await $api.post('https://open-app.1foo.com/api/v1/activity/last.day/info', {
			appid: UserStore.userInfo.appid,
			time: ScreenStore.saveTime,
			uid: UserStore.userInfo.id,
			vt: UserStore.userInfo.vip
		})
		if (lastDatReq.code == 200) {
			if (lastDatReq.data.end == false) {
				ScreenStore.setLastDayDatas(lastDatReq.data)
				ScreenStore.setLastModalisOpen(true)
			}
		}
	}



	// const lineBg = `http://file.1foo.com/2024/10/14/6cd06f2c1b04a9677b0124fa40d698cc.png`
	// const userStore = useUserStore();
	// const aloneChecked = ref(false);
	// const show = ref(false);
	// const veifytime = ref(120);
	// const timerActive = ref(false);
	// const tabList = ref([
	// 	{ name: '账户登录', value: 'login' },
	// 	{ name: '注册账户', value: 'register' }
	// ]);
	// const verifyPhoneFn = (phoneNumber : string) => {
	// 	const regu = /^1[3-9][0-9]{9}$/
	// 	return regu.test(phoneNumber)
	// }
	// const current = ref(0);
	// const type = ref<'login' | 'register' | 'phone'>('login');
	// watch([veifytime, timerActive], ([newVeifytime, newTimerActive]) => {
	// 	let timer = null;
	// 	if (newTimerActive && newVeifytime > 0) {
	// 		timer = setTimeout(() => {
	// 			veifytime.value -= 1;
	// 		}, 1000);
	// 	} else if (newVeifytime === 0) {
	// 		timerActive.value = false;
	// 	}
	// 	return () => clearTimeout(timer);
	// });
	// const backLogin = () => {
	// 	uni.switchTab({
	// 		url: '/pages/my/index'
	// 	})
	// }
	// // 验证手机

	// const userComputed = computed({
	// 	get() {
	// 		return isMessageLogin.value ? PhoneLoginParmas.phone : loginParmas.user;
	// 	},
	// 	set(value) {
	// 		if (isMessageLogin.value) {
	// 			PhoneLoginParmas.phone = value;
	// 		} else {
	// 			loginParmas.user = value;
	// 		}
	// 	}
	// });

	// const loginParmas = reactive({
	// 	user: '',
	// 	pass: '',
	// 	code: userStore.invite_code
	// });
	// const changeTabs = (val) => {
	// 	current.value = val.index;
	// 	type.value = val.value;
	// };
	// const PhoneLoginParmas = reactive({
	// 	phone: '',
	// 	code: ''
	// });
	// const isMessageLogin = ref(false);
	// const changeType = () => {
	// 	isMessageLogin.value = !isMessageLogin.value;
	// 	isMessageLogin.value ? (type.value = 'phone') : (type.value = 'login');
	// 	current.value = 0;
	// };

	// const onLogin = async () => {
	// 	//  判断是否勾选隐私协议
	// 	console.log(aloneChecked.value);
	// 	if (!aloneChecked.value) {
	// 		uni.$u.toast('请勾选隐私协议后再进行！');
	// 		return;
	// 	}
	// 	const parmas = isMessageLogin.value ? PhoneLoginParmas : loginParmas;
	// 	if (userStore.invite_code) {
	// 		parmas.code = userStore.invite_code
	// 	}
	// 	// 验证登录方式
	// 	if (type.value == 'phone') {
	// 		if (!PhoneLoginParmas.phone || !PhoneLoginParmas.code) {
	// 			uni.$u.toast('请输入手机号和验证码后登录！');
	// 			return;
	// 		}
	// 	}
	// 	if (type.value == 'login' || type.value == 'register') {

	// 		if (!loginParmas.user || !loginParmas.pass) {
	// 			uni.$u.toast('请输入用户名和密码后登录！');
	// 			return;
	// 		}
	// 	}
	// 	// show.value = true
	// 	const data = await userStore.login(parmas, type.value);
	// 	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	// 	if (data.code == 200) {
	// 		show.value = false;
	// 		userStore.token = data?.data?.token;
	// 		userStore.userInfo = data.data;
	// 		// const users = await api.userInfo(null)
	// 		const users = await $api.get('api/v1/user/info');
	// 		if (users.code == 200) {
	// 			userStore.userInfo = users.data;
	// 			await getLastdayInfo()
	// 			uni.switchTab({
	// 				url: '/pages/my/index'
	// 			});
	// 			uni.$u.toast('登录成功！')
	// 		}

	// 	} else {
	// 		show.value = false;
	// 		uni.$u.toast(data.msg);
	// 	}
	// };

	// const sendCode = async () => {
	// 	if (!verifyPhoneFn(PhoneLoginParmas.phone || '')) {
	// 		uni.$u.toast('请输入正确的手机号！');
	// 		return;
	// 	}
	// 	if (timerActive.value) {
	// 		uni.$u.toast('请等待2分钟后再试！');
	// 		return;
	// 	}
	// 	// 发送验证码的逻辑
	// 	timerActive.value = true;
	// 	veifytime.value = 60;

	// 	// const result = await api.sendSmsCode({ phone: PhoneLoginParmas.phone })
	// 	const result = await $api.post('api/v1/user/sendSmsCode', { phone: PhoneLoginParmas.phone });
	// 	if (result.code == 200) {
	// 		uni.$u.toast('发送验证码成功，请注意查收！');
	// 	} else {
	// 		uni.$u.toast(result.msg);
	// 	}
	// };
</script>

<style lang="scss" scoped>
	.loginViewText {
		margin-top: 60rpx;

		&_header {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			&_logo {
				height: 60rpx;
				width: 180rpx;
				padding: 30rpx 0;
			}

			&_text {
				font-weight: 800;
				margin-left: 20rpx;
			}
		}

		&_desc {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&_top {
				font-size: 27rpx;
				padding: 10rpx 0;
			}

			&_main {
				font-size: 15rpx;
			}
		}
	}

	.loginView {
		display: flex;
		padding: 50rpx;
		box-sizing: border-box;

		&_image {
			// height: 500rpx;
		}
	}

	.buttonGroup {
		padding: 20rpx 0 !important;
	}

	.LoginTitle {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 200rpx 0;

		&_welocome {
			font-size: 40rpx;
			font-weight: 800;
		}

		&_NoRegister {
			padding-top: 25rpx;
			font-size: 27rpx;
		}
	}
	// .loginAccount {
	// 	display: flex;
	// 	flex-direction: column;
	// 	padding: 100rpx 0;

	// 	&_tabList {
	// 		padding: 20rpx 0;
	// 		display: flex;
	// 		justify-content: center;
	// 	}

	// 	&_header {
	// 		display: flex;
	// 		flex-direction: column;
	// 		justify-content: center;
	// 		align-items: center;

	// 		&_image {
	// 			width: 200rpx;
	// 			height: 100rpx;
	// 			padding: 70rpx;
	// 		}
	// 	}

	// 	&_main {
	// 		display: flex;
	// 		flex-direction: column;
	// 		align-items: center;
	// 		justify-content: center;

	// 		&_input {
	// 			width: 88%;
	// 			display: flex;
	// 			border-radius: 15rpx;
	// 			justify-content: center;
	// 			align-items: center;
	// 			background-color: #f7f7f7;
	// 			margin: 20rpx 0;

	// 			&_code {
	// 				color: rgb(192, 196, 204);
	// 				padding: 0 15rpx;
	// 				font-size: 30rpx;
	// 			}
	// 		}
	// 	}
	// }

	// .loginButton {
	// 	width: 88%;
	// }

	// .vertifyStuas {
	// 	display: flex;
	// 	width: 88%;
	// 	font-size: 27rpx;
	// 	color: $u-primary;
	// 	justify-content: flex-end;
	// }

	// .warp {
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: center;
	// 	justify-content: center;
	// 	height: 100%;
	// }

	// .rect {
	// 	width: 200px;
	// 	height: 200px;
	// 	background-color: #fff;
	// }
</style>