<template>
	<view class="vip-card">
		<view class="vip-card_vip" v-if="userStore.userInfo?.vip">
			<view class="vip-card_vip_text">
				{{userStore.userInfo?.vipType}}
			</view>
			<image @click="toVipPath" class="vip-card_image" :src="vipCardImg" mode=""></image>
		</view>
		<image @click="toVipPath" class="vip-card_image1" v-else="userStore.userInfo?.vip" :src="NoVipCardImg" mode="">
		</image>
	</view>

</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { AppName } from '@/http'

	const { $assets } = useGlobalProperties()
	import { useUserStore } from '@/store'
	const userStore = useUserStore()

	const vipCardImg = computed(() => {
		return AppName == 'bianjie' ? $assets.bianJieVipCard : $assets.wanXiangVipCard
	})
	const NoVipCardImg = computed(() => {
		return AppName == 'bianjie' ? $assets.bianJieNoVipCard : $assets.wanXiangNoVipCard
	})
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