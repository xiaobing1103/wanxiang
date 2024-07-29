<template>
	<view class="user" :style="{paddingTop:screenStore.safeTopHeight+'px'}">
		<up-avatar :size="50"></up-avatar>
		<view class="info">
			<text class="user-name">万象用户GQxm2a</text>
			<view v-if="userStore.showVip" class="vip-info">
				<text class="vip">高级办公会员</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { useUserStore } from '@/store/index'
	import {useScreenStore} from '@/store/index'
	
	const screenStore = useScreenStore()
	const userStore = useUserStore()
	
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
</style>