<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'url(http://file.1foo.com/2024/09/18/309765e7bc6ba5cc1d0bf16c6f2892cc.png) no-repeat', padding: '0' }">
		<view class="header" :style="{height:navBarHeight  + 'px'}">
			<view class="header_weixin-header" :style="{paddingTop:menuButtonInfo?.top + 'px'}">
				<up-icon @click="backview" name="arrow-left" size="20"></up-icon>
				<view class="header_btngrp">
					<view class="buchajia">
						<image class="buchajia_image"
							src="http://file.1foo.com/2024/03/12/1a8bd8642a2892e02a4d822cd5c33116.png" mode="">
						</image> 补差价升级
					</view>
					<view class="buchajia">
						<image class="buchajia_image"
							src="http://file.1foo.com/2024/03/12/014e42e0370a6eaeaba022e69f368d6d.png" mode="">
						</image>使用激活码激活
					</view>
				</view>

			</view>
		</view>
		<view class="backGroundImages">
			<image class="backGroundImages_images"
				src="http://file.1foo.com/2024/09/18/a1f9093bbc81ef51347a0e41038e9913.png" mode=""></image>
		</view>
		<view class="imagesBox">
			<view class="imagesBox_avatar">
				<up-avatar class="imagesBox_avatar_images" :src="UserStore.userInfo?.avatar" :size="40"></up-avatar>
				<view class="imagesBox_rightBox">
					<view class="imagesBox_avatar_topText">
						{{UserStore.userInfo?.nick}}
					</view>
					<view class="imagesBox_avatar_bottomText">
						<image :style="{display:UserStore.userInfo?.vip == 0 ? 'none' : 'block'}" :src="$assets.vipIcon"
							mode=""></image>
						<text>{{UserStore.userInfo?.vipType}}</text>
					</view>
				</view>

			</view>
		</view>

		<view class="vipTptySeleted">
			<view @click="changeItems(0,200)" :class="{
			'vipTptySeleted_items': true,
			 'activeVipItems': activeItems === 0}">
				热门推荐
			</view>
			<view @click="changeItems(1,203)" :class="{
			'vipTptySeleted_items': true,  
			'activeVipItems1': activeItems === 1}">
				办公会员
			</view>
		</view>

		<template v-if="activeItems == 0">
			<HotVips @changeVipId="changeVipId" :vipDatas="HotVipDatas" />
		</template>
		<template v-if="activeItems == 1">
			<OfficeWorkVips @changeVipId="changeVipId" :vipDatas="OfficeWorkVipDatas" />
		</template>
		<MiddleVipView />
		<PayItemView :payMode='payMode' :seletedVipIds="seletedVipIds"/>
		<VipNumberSteps />
		<template #bottom>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useCounterStore, useUserStore } from '@/store';
	import HotVips from './components/HotVips.vue';
	import OfficeWorkVips from './components/OfficeWorkVips.vue';
	import VipNumberSteps from './components/VipNumberSteps.vue';
	import PayItemView from './components/PayItemView.vue';
	import MiddleVipView from './components/MiddleVipView.vue';
	import { storeToRefs } from "pinia"
	import { vipTypes, vipDatasType, payModeType } from "./data"
	const activeItems = ref(0)
	const UserStore = useUserStore()
	const { $assets, $api } = useGlobalProperties();
	const HotVipDatas = computed(() => {
		return vipDatas.value.slice(0, 6)
	})
	const seletedVipIds = ref(200)
	const changeVipId = (index : number) => {
		seletedVipIds.value = index
	}

	const OfficeWorkVipDatas = computed(() => {
		return vipDatas.value.slice(6, 8)
	})
	//  #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { statusBarHeight, menuButtonInfo, navBarHeight } = storeToRefs(system)
	statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight
	menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
	navBarHeight.value = menuButtonInfo.value.height + statusBarHeight.value + 10
	// #endif
	const changeItems = (index : number, vipIds : number) => {
		activeItems.value = index
		seletedVipIds.value = vipIds
	}

	const backview = () => {
		uni.navigateBack()
	}
	const vipDatas = ref<vipDatasType[] | []>([])
	const payMode = ref<payModeType[] | []>([])
	onMounted(async () => {
		const vipRes = await $api.get('api/v1/vip/getShops',)
		if (vipRes.code == 200) {
			payMode.value = vipRes.payMode as payModeType[]
			vipDatas.value = vipRes.shops as vipDatasType[]
		}
	})
</script>

<style scoped lang="scss">
	.header {
		width: 100%;
		height: 40rpx;
		margin: 20rpx 0;

		padding: 0 30rpx;

		&_weixin-header {
			display: flex;
			justify-content: space-between;

		}

		&_btngrp {
			display: flex;
			z-index: 2;

		}
	}

	.vipBox {
		&_header {
			display: flex;
			flex-direction: column;
			padding: 25rpx 0;

			&_top {
				font-weight: 700;

			}

			&_bottom {
				font-size: 25rpx;
				padding: 20rpx 0;
			}
		}
	}

	.backGroundImages {
		position: absolute;
		top: -100rpx;
		right: -200rpx;

		&_images {
			width: 500rpx;
			height: 400rpx;

		}
	}

	.buchajia {
		background-color: #FFF9F0;
		border-radius: 10rpx;
		padding: 10rpx;
		font-size: 25rpx;
		color: $aichat-golbal-vipText;
		margin-left: 20rpx;
		display: flex;
		align-items: center;

		&_image {
			width: 30rpx;
			margin-right: 10rpx;
			height: 26rpx;
		}
	}

	.imagesBox {
		padding: 25rpx 30rpx;

		&_rightBox {
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
		}

		&_avatar {
			display: flex;

			&_topText {
				display: flex;
				color: $aichat-golbal-vipText;
				align-items: center;
				font-size: 27rpx;
				font-weight: 700;

				&_imgs {
					width: 35rpx;
					height: 35rpx;
					margin-right: 10rpx;
				}
			}

			&_bottomText {
				color: $aichat-golbal-vipText;
				display: flex;
				align-items: center;
				font-size: 27rpx;
			}

			&_images {

				// border: 4rpx solid #FFF9F0;
			}
		}
	}

	.vipTptySeleted {
		width: 100%;
		display: flex;
		z-index: 2;
		position: relative;
		background: url('http://file.1foo.com/2024/09/19/a408ac7528e5bf182ac45b896b5846c4.png');
		background-size: cover;

		&_items {
			padding: 20rpx 0;
			display: flex;
			justify-content: center;
			width: 50%;
			background-size: cover;
			font-size: 27rpx;

		}

	}

	.activeVipItems {
		background: url('http://file.1foo.com/2024/09/19/993d94ed834b1b86df933e5a47d0e50f.png') no-repeat;
		background-size: cover;
		font-weight: 700;
		color: $aichat-golbal-vipActiveText;
	}

	.activeVipItems1 {
		background: url('http://file.1foo.com/2024/09/19/d811c39a85ef80ef8e730616ff85ecdc.png') no-repeat;
		background-size: cover;
		font-weight: 700;
		color: $aichat-golbal-vipActiveText;
	}

	.noActiveVipItems {}
</style>