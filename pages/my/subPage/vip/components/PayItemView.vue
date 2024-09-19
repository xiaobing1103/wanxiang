<template>
	<view class="PayItemView">
		<view class="PayItemView_header">
			<view class="PayItemView_header_zhifubao" @click="onCreateOrder('alipay','h5_yt')">
				<image class="PayItemView_header_zhifubao_image" :src="$assets.zhiFuBaoIcon" mode=""></image> 支付宝支付
			</view>
			<view class="PayItemView_header_wechat" @click="onCreateOrder('wechat_scan','jsapi')">
				<image class="PayItemView_header_wechat_image" :src="$assets.weChatIcon" mode=""></image> 微信支付
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useGlobalProperties } from '../../../../../hooks/useGlobalHooks';
	import { payModeType } from '../data'
	const { $api, $assets } = useGlobalProperties()
	const shops = ref([])

	const props = defineProps<{ payMode : payModeType[], seletedVipIds : number }>()
	const onCreateOrder = async (type : string, pay_Id : string) => {
		props.seletedVipIds
		const OrdersRes = await $api.post('api/v1/vip/createShopsOrder', {
			app_channel: "web",
			channel: type,
			num: 1,
			pay_id: pay_Id,
			shop_id: 58
		})

		console.log(OrdersRes)

		// uni.requestPayment({
		// 	timeStamp: new Date(),

		// })
	}
</script>

<style scoped lang="scss">
	.PayItemView {
		&_header {
			display: flex;
			color: white;
			justify-content: center;

			&_zhifubao {
				padding: 13rpx 20rpx;
				background: #03a6f4;
				border-radius: 8rpx;
				cursor: pointer;

				&_image {
					width: 24rpx;
					height: 24rpx;
				}
			}

			&_wechat {
				padding: 13rpx 20rpx;
				background: #1edcb4;
				border-radius: 8rpx;
				cursor: pointer;
				margin-left: 25rpx;

				&_image {
					width: 24rpx;
					height: 24rpx;
				}
			}
		}
	}
</style>