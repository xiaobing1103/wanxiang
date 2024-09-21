<template>
	<view class="user" :style="{ paddingTop: screenStore.safeTopHeight + 'px' }">
		<up-avatar :src="UserStore?.userInfo?.avatar" :size="50"></up-avatar>
		<view class="info">
			<text class="user-name">
				<template v-if="!token">
					<text class="LoginButton" @click="LoginFn">登录/注册</text>
				</template>
				<template v-else>
					{{ userInfo?.nick || '未登录' }}
				</template>
			</text>
			<view v-if="showVip" class="vip-info">
				<image v-if="userInfo && userInfo?.vipType !== '普通用户'" class="vip-info_image" :src="$assets.vipIcon" mode=""></image>
				<text class="vip-info_text" :style="{color:userInfo?.vipType == '普通用户' ?'' :'#FE6938'}">
					{{ userInfo?.vipType }}
				</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { storeToRefs } from 'pinia';
	import { useUserStore } from '@/store/index';
	import { useScreenStore } from '@/store/index';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';

	const screenStore = useScreenStore();
	const UserStore = useUserStore();
	const { userInfo, showVip, token } = storeToRefs(UserStore);
	const { $assets } = useGlobalProperties()
	const LoginFn = () => {
		uni.navigateTo({
			url: '/pages/login/index'
		});
	};
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

	.vip-info {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		&_image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 20rpx;
		}
		&_text{
			font-size: 27rpx;
		}
	}
</style>