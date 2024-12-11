<template>
	<view class="VideoVipCom">
		<view class="VideoVipCom_header">
			<up-avatar :src="UserStore.userInfo.avatar"></up-avatar>
			<view class="VideoVipCom_headerBox">
				<view class="VideoVipCom_headerBox_name">
					{{UserStore.userInfo.user}}
				</view>
				<view class="VideoVipCom_headerBox_VipName">
					{{UserStore.userInfo.vipType}}
				</view>
				<view class="VideoVipCom_headerBox_VipNums">
					创意AI视频次数剩余： {{showNums}}
				</view>
			</view>
		</view>
		<view class="VideoVipCom_main">
			<view class="VideoVipCom_main_sela">
				优惠套餐
			</view>
			<view class="VideoVipCom_main_showVips">
				<view class="VideoVipCom_main_showVips_box" v-for="(items,index) in showVips" :key="index"
					:class="{VideoVipCom_main_showVips_box :true,videoBoxActive: seletedVips == items.id }"
					@click="changeSeletedId(items.id)">
					<view :class="{VideoVipCom_main_showVips_box_title :true,active: seletedVips == items.id }">
						{{items.name}}
					</view>
					<view class="VideoVipCom_main_showVips_box_content">
						￥{{items.money}}
					</view>
					<view :class="{VideoVipCom_main_showVips_box_desc :true,descActive: seletedVips == items.id }">
						{{items.money + items.discount_price /100}} 超值
					</view>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view class="displayPay">
				<view class="VideoVipCom_main_payItems">
					<view @click="changePayConifg('wechat_scan','jsapi')"
						:class="{VideoVipCom_main_payItems_changes:true,activeSeleted:channel == 'wechat_scan'}">
						<image class="VideoVipCom_main_payItems_changes_images" :src="$assets.wechatPayIcon" mode="">
						</image>微信支付
					</view>
					<view @click="changePayConifg('alipay','h5_yt')"
						:class="{VideoVipCom_main_payItems_changes:true,activeSeleted:channel !== 'wechat_scan'}">
						<image class="VideoVipCom_main_payItems_changes_images" :src="$assets.alipayIcon" mode="">
						</image>支付宝支付
					</view>
				</view>
				<view class="VideoVipCom_main_payContents">
					<template v-if="channel == 'wechat_scan'">
						<image class="VideoVipCom_main_payContents_images" :src="showPayImage" mode=""></image>
					</template>
					<template v-else>
						<up-qrcode class="VideoVipCom_main_payContents_images" :size="150" :val="showPayImage"
							showLoading loadingText="loading..."></up-qrcode>
					</template>
				</view>
			</view>
			<view class="PayPrice">

				<view class="PayPrice_overPrice">
					实付金额：
					<text
						class="PayPrice_overPrice_twice">￥{{showVips.find((items)=>items.id == seletedVips)?.money + showVips.find((items)=>items.id == seletedVips).discount_price /100 }}</text>
				</view>
				<view class="PayPrice_overPrice">
					应付金额： <text
						class="PayPrice_overPrice_second">￥{{showVips.find((items)=>items.id == seletedVips)?.money}}</text>
				</view>
			</view>
			<view class="payButton">
				<up-button @click="queryShopsOrder"
					:customStyle="{width:'50%',height:'70rpx',border:'0rpx',borderRadius:'50rpx',background:'linear-gradient(136deg,#fccf31,#f55555)',color:'white'}">已支付，确认</up-button>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="wechatclickBox">
				<view class="wechat" @click="onCreateOrder('wechat_scan','jsapi')">
					<image class="wechat_image" :src="$assets.weChatIcon" mode=""></image> 微信支付
				</view>
			</view>
			<!-- #endif -->
		</view>

	</view>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useUserStore } from '@/store';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const { $api, $assets } = useGlobalProperties()
	const UserStore = useUserStore()
	const showPayImage = ref('')
	const showNums = ref(0)
	const showVips = ref([])
	const ShopsOrderDatas = ref({})
	const channel = ref('wechat_scan')
	const seletedVips = ref(168)
	onMounted(() => {
		getVipCheckNums()
		getVideoVipShop()

	})
	const onCreateOrder = async (type : string, pay_Id : string) => {
		weChatPay()
	}


	const changePayConifg = (rechannel : string, rePayType : string) => {
		if (rechannel == channel.value) {
			return
		}
		channel.value = rechannel
		h5getCreateShopsOrder(rechannel, rePayType)
	}


	const getVipCheckNums = async () => {
		const countReq = await $api.post('api/v1/video/count', {})
		if (countReq.code == 200) {
			showNums.value = countReq.data
		}
	}


	const queryShopsOrder = async () => {
		const QueryReq = await $api.post('api/v1/vip/queryShopsOrder', { url: ShopsOrderDatas.value.query_url })
		if (QueryReq.code == 200) {
			uni.$u.toast('支付成功！')
			getVipCheckNums()
		} else {
			uni.$u.toast(QueryReq.msg)
		}
	}

	const h5getCreateShopsOrder = async (rechannel : string, repayType : string) => {
		const parmas = {
			app_channel: 'web',
			channel: rechannel,
			num: 1,
			pay_id: repayType,
			shop_id: seletedVips.value
		}
		const ShopsOrder = await $api.post('api/v1/vip/createShopsOrder', parmas)
		if (ShopsOrder.code == 200) {
			showPayImage.value = ShopsOrder.data.pay
			ShopsOrderDatas.value = ShopsOrder.data
		}
	}

	const getVideoVipShop = async () => {
		const showVideoShopReq = await $api.get('api/v1/vip/getShops?showVideoShop=true', {}, {})
		if (showVideoShopReq.code == 200) {
			showVips.value = showVideoShopReq.shops
		}
		// #ifdef H5
		h5getCreateShopsOrder('wechat_scan', 'jsapi')
		// #endif

	}


	const changeSeletedId = (id : number) => {
		seletedVips.value = id
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
				shop_id: seletedVips.value,
				appid: "wx67c8453af19438e3",
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

						getVipCheckNums()
					},
					fail(e) {
						console.log(e)
					}
				}
				uni.requestPayment(parmas)
			}
		}
	}

	// const H5pay = async (type : string, pay_Id : string) => {
	// 	isAlipay.value = false
	// 	const createShopsOrderRes = await $api.post('api/v1/vip/createShopsOrder',
	// 		{

	// 			app_channel: 'web',
	// 			channel: type, num: 1,
	// 			pay_id: pay_Id,
	// 			shop_id: props.seletedVipIds

	// 		})
	// 	if (createShopsOrderRes.code == 200) {
	// 		payQrcode.value = createShopsOrderRes.data.pay
	// 		if (type == 'alipay') {
	// 			isAlipay.value = true
	// 		}
	// 		queryUrl.value = createShopsOrderRes.data.query_url
	// 		openModal.value = true
	// 	}
	// }
</script>

<style lang="scss" scoped>
	.VideoVipCom {
		padding: 0 30rpx;

		&_header {
			padding: 30rpx 0;
			display: flex;
			align-items: center;
		}

		&_headerBox {
			margin-left: 40rpx;

			&_name {
				color: #703206;
				font-weight: 800;
			}

			&_VipName {
				color: #703206;
				font-size: 27rpx;
			}

			&_VipNums {
				color: #703206;
				font-size: 27rpx;
			}
		}

		&_main {
			display: flex;
			flex-direction: column;

			&_sela {
				color: #f6674f;
				font-weight: 800;
			}

			&_showVips {
				display: flex;
				overflow-x: scroll;
				margin: 20rpx 0;

				&_box {
					display: flex;
					flex-direction: column;
					min-width: 200rpx;
					border-radius: 15rpx;
					border: 3rpx solid #fccf31;
					display: flex;
					align-items: center;

					overflow: hidden;
					margin: 0 10rpx;

					&_title {
						background-color: #fccf31;
						font-size: 24rpx;
						font-weight: 800;
						width: 100%;
						overflow: hidden;
						display: flex;
						justify-content: center;
						padding: 5rpx 0;
					}

					&_content {
						padding: 40rpx 0;
						color: red;
					}

					&_desc {
						text-decoration: line-through;
						margin-top: 6rpx;
						display: block;
						background: #fbc1354d;
						padding: 0 14rpx;
						font-size: 22rpx;
						border-radius: 5rpx;
						margin: 30rpx 0;

					}
				}
			}

			&_payItems {
				display: flex;
				width: 100%;

				&_changes {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 70rpx;
					width: 50%;

					&_images {
						width: 40rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}
				}

			}

			&_payContents {
				background-color: #fff;
				display: flex;
				justify-content: center;
				padding: 20rpx;

				&_images {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 350rpx;
					height: 350rpx;
				}
			}
		}
	}

	.active {
		background: #fb4d3d !important;
		color: #fff;
	}

	.descActive {
		background: #ee766d !important;
		color: #fff;
	}

	.videoBoxActive {
		border-color: #fb4d3d !important;
	}

	.activeSeleted {
		background-color: white;
		border-radius: 15rpx 15rpx 0rpx 0rpx;
	}

	.displayPay {
		margin: 20rpx 0;
	}

	.PayPrice {
		font-size: 27rpx;

		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		&_overPrice {


			&_twice {
				text-decoration: line-through;
			}

			&_second {
				font-size: 35rpx;
				font-weight: 800;
				color: red;
			}
		}
	}

	.payButton {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.wechat {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50%;
		padding: 13rpx 20rpx;
		background: #1edcb4;
		border-radius: 8rpx;
		cursor: pointer;
		margin-left: 25rpx;

		&_image {
			width: 40rpx;
			height: 40rpx;
			padding: 0 24rpx;
		}
	}

	.wechatclickBox {
		display: flex;
		color: white;
		padding: 30rpx 0;
		justify-content: center;
		width: 100%;
	}
</style>