<template>
	<view class="loginAccount">
		<z-paging :pagingStyle="{padding:'0 30rpx'}">
			<template #top>

				<view class="loginAccount_header">
					<image class="loginAccount_header_image" src="../../static/logo.svg" mode=""></image>
				</view>
				<view class="loginAccount_tabList">
					<up-tabs :list="tabList"></up-tabs>
				</view>

				<view class="loginAccount_main">
					<view class="loginAccount_main_input">
						<up-input :customStyle="{width:'70%',borderRadius:'35rpx',
						fontSize:'20rpx'}" :placeholder="isMessageLogin ? '请输入手机号' : '请输入邮箱或用户名'" border="surround"
							v-model="userComputed"></up-input>
					</view>


					<template v-if="isMessageLogin">
						<view class="loginAccount_main_input">
							<up-input :customStyle="{width:'70%',borderRadius:'35rpx',
							fontSize:'20rpx'}" placeholder="请输入手机验证码" border="surround" v-model="password"></up-input>
							<text class="loginAccount_main_input_code">获取验证码</text>
						</view>
					</template>
					<template v-else>
						<view class="loginAccount_main_input">
							<up-input type="password" :customStyle="{width:'70%',borderRadius:'35rpx',
							fontSize:'20rpx'}" placeholder="请输入密码" border="surround" v-model=" loginParmas.pass"></up-input>

						</view>
					</template>


					<view class="vertifyStuas">
						<text
							@click="()=> isMessageLogin = !isMessageLogin">{{isMessageLogin ? '账户密码登录' : '短信验证码登录'}}</text>
					</view>
					<LoginDecscriptions />
					<view class="loginButton">
						<up-button size="small" :customStyle="{width:'100%',borderRadius:'35rpx',marginTop:'30rpx'}"
							type="primary" text="确定"></up-button>
					</view>
				</view>
			</template>



		</z-paging>
	</view>

</template>

<script setup lang="ts">
	import { computed, reactive, ref } from 'vue';
	import LoginDecscriptions from '@/components/LoginCom/LoginDecscriptions.vue'
	const userComputed = computed(() => isMessageLogin ? loginParmas.user : PhoneLoginParmas.phone)
	const loginParmas = reactive({
		user: 'xiaobing1103',
		pass: '',

	})
	const PhoneLoginParmas = reactive({
		phone: '15386003374',
		code: ''
	})
	const isMessageLogin = ref(false)
	const tabList = ref([
		{ name: '账户登录' },
		{ name: '注册账户' },
	]
	)
	const password = ref('')
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
					font-size: 23rpx;

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
		font-size: 25rpx;
		color: $u-primary ;
		justify-content: flex-end;
	}
</style>