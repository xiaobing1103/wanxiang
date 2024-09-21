<template>
	<view class="vip-card">
		<view class="vip-card_vip" v-if="userStore.userInfo?.vip">
			<view class="vip-card_vip_text">
				{{userStore.userInfo?.vipType}}
			</view>
			<image @click="showOverlay = true" class="vip-card_image" :src="$assets.vipCard" mode=""></image>
		</view>
		<image @click="toVipPath" class="vip-card_image1" v-else="userStore.userInfo?.vip" :src="$assets.noVipCard"
			mode=""></image>
	</view>

</template>

<script setup lang="ts">
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	const { $assets } = useGlobalProperties()
	import { useUserStore } from '@/store'
	const userStore = useUserStore()
	const showOverlay = defineModel<boolean>('showOverlay')
	const toVipPath = () => {
		uni.navigateTo({
			url: '/pages/my/subPage/vip/index'
		})
	}
</script>

<style lang="scss" scoped>
	.vip-card {
		width: 100%;
		padding: 30rpx 0;
		background-size: cover;


		&_vip {
			position: relative;
			
			&_text {
				position: absolute;
				top: 31rpx;
				left: 29rpx;
				z-index: 2;
				color: $uni-bg-color;
				font-size: 24rpx;
			}
		}

		&_image {
			height: 244rpx;
			width: 100%;
		}

		&_image1 {
			width: 100%;
			height: 350rpx;
		}
	}
</style>