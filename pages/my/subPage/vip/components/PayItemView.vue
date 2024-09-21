<template>
	<view class="PayItemView">
		<view class="PayItemView_header">
			<!-- #ifdef H5 -->
			<view class="PayItemView_header_zhifubao" @click="onCreateOrder('alipay','h5_yt')">
				<image class="PayItemView_header_zhifubao_image" :src="$assets.zhiFuBaoIcon" mode=""></image> 支付宝支付
			</view>
			<!-- #endif -->
			<view class="PayItemView_header_wechat" @click="onCreateOrder('wechat_scan','jsapi')">
				<image class="PayItemView_header_wechat_image" :src="$assets.weChatIcon" mode=""></image> 微信支付
			</view>
		</view>
	</view>
	<up-modal :show="openModal" :showConfirmButton="false">
		<view class="payModal">
			<view class="payModal_seleted">
				当前选择 {{vipShowModals[seletedVipIds]?.name}}
			</view>
			<up-qrcode class="payModal_image" v-if="isAlipay" :size="200" :val="payQrcode" showLoading
				loadingText="loading..."></up-qrcode>
			<image v-else class="payModal_image" :src="payQrcode" mode="aspectFit"></image>
			<view class="payModal_buttons">
				<view class="payModal_buttons_left" @click="payOver">
					支付完成
				</view>
				<view class="payModal_buttons_right" @click="seletedElse">
					重选套餐
				</view>
			</view>
		</view>

	</up-modal>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useGlobalProperties } from '../../../../../hooks/useGlobalHooks';
	import { payModeType, vipShowModals } from '../data'
	import { useUserStore } from '@/store';
	const { $api, $assets } = useGlobalProperties()
	const UserStore = useUserStore()
	const shops = ref([])
	const openModal = ref(false)
	const payQrcode = ref('')
	const queryUrl = ref('')
	const isAlipay = ref(false)
	const props = defineProps<{ payMode : payModeType[], seletedVipIds : number }>()
	const onCreateOrder = async (type : string, pay_Id : string) => {
		// #ifdef MP-WEIXIN
		weChatPay()
		// #endif

		// #ifdef H5
		H5pay(type, pay_Id)
		// #endif
	}
	const refreshInfo = async () => {
		const users = await $api.get('api/v1/user/info')
		if (users.code == 200) {
			UserStore.userInfo = users.data;
			uni.$u.toast('支付成功！');
		}
	}
	const payOver = async () => {
		const queryRes = await $api.post('api/v1/vip/queryShopsOrder', {
			url: queryUrl.value
		})
		if (queryRes.code == 200) {
			refreshInfo()
			openModal.value = false
		} else {
			uni.$u.toast(queryRes.msg);
		}
	}
	const seletedElse = () => {
		openModal.value = false

	}
	const H5pay = async (type : string, pay_Id : string) => {
		isAlipay.value = false
		const createShopsOrderRes = await $api.post('api/v1/vip/createShopsOrder', { app_channel: 'web', channel: type, num: 1, pay_id: pay_Id, shop_id: props.seletedVipIds })
		if (createShopsOrderRes.code == 200) {
			payQrcode.value = createShopsOrderRes.data.pay
			if (type == 'alipay') {
				isAlipay.value = true
			}
			queryUrl.value = createShopsOrderRes.data.query_url
			openModal.value = true
		}
	}

	const weChatPay = async () => {
		const userCode = await UserStore.getUserCode()
		const res = await $api.get('api/v1/wechat/code2Session', { code: userCode })
		if (res.openid) {
			const createShopsOrderRes = await $api.post('api/v1/vip/createShopsOrder', {
				app_channel: "web",
				channel: "wechat",
				num: 1,
				pay_id: 'js',
				shop_id: props.seletedVipIds,
				appid: "wx493b9b967a6f410c",
				openid: res.openid,
			})
			if (createShopsOrderRes.code == 200) {
				const { pay } = createShopsOrderRes.data
				const parmas = {
					provider: "wxpay",
					timeStamp: String(pay.time),
					nonceStr: pay.nonceStr,
					package: pay.prepay_id,
					paySign: pay.sign,
					signType: pay.signType,
					success(res) {
						refreshInfo()

					},
					fail(e) {
						console.log(e)
					}
				}
				uni.requestPayment(parmas)
			}
		}
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

	.payModal {
		display: flex;
		flex-direction: column;
		padding: 20rpx;

		&_seleted {
			padding: 0 30rpx;
			font-size: 27rpx;
			font-weight: 700;
		}

		&_image {
			padding: 20rpx 0;
		}

		&_buttons {
			padding: 0 30rpx;
			display: flex;
			justify-content: center;

			&_left {
				font-size: 27rpx;
				padding: 10rpx 20rpx;
				background-color: $u-primary;
				color: $uni-bg-color;
				border-radius: 15rpx;
				margin: 0 20rpx;
			}

			&_right {
				font-size: 27rpx;
				padding: 10rpx 20rpx;
				background-color: $uni-border-color;
				color: $uni-bg-color;
				border-radius: 15rpx;
				margin: 0 20rpx;
			}
		}
	}
</style>