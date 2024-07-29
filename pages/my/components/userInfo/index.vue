<template>
	<view class="user" :style="{paddingTop:screenStore.safeTopHeight+'px'}">
		<up-avatar :size="50"></up-avatar>
		<view class="info">
			<text class="user-name">
				<template v-if="!token">
					<text class="LoginButton" @click="LoginFn">
						登录/注册
					</text>
				</template>
				<template v-else>
					{{userInfo?.nick || '万象用户GQxm2a'}}
				</template>

			</text>
			<view v-if="showVip" class="vip-info">
				<text class="vip">高级办公会员</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { storeToRefs } from 'pinia';
	import { useUserStore } from '@/store/index'
	import { useScreenStore } from '@/store/index'

	const screenStore = useScreenStore()
	const UserStore = useUserStore()
	const { userInfo, showVip, token } = storeToRefs(UserStore)
	
	const LoginFn = () => {
		console.log('sssssss')
		uni.navigateTo({
			url: '/pages/login/index',
		})

	}
</script>

<style lang="scss" scoped>
	.user {
		display: flex;
		align-items: center;


		.info {
			padding-left: 30rpx;
			line-height: 50rpx;

			.user-name {
				font-weight: 700;
				font-size: 35rpx;
			}
		}
	}

	.LoginButton {
		height: 50rpx;
	}
</style>