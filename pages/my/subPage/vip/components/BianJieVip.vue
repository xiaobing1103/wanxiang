<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'linear-gradient(to bottom, rgb(250,234,210), rgb(235, 214, 186))', padding: '0' }">
		<view class="header">
			<view class="header_weixin-header" :style="{marginTop:ScreenStore.navBarHeight + 'px'}">
				<up-icon @click="backview" name="arrow-left" size="20"></up-icon>
				<view class="header_btngrp">
					<view class="buchajia" @click="buChaJiaModal = true">
						<image class="buchajia_image"
							src="http://file.1foo.com/2024/03/12/1a8bd8642a2892e02a4d822cd5c33116.png" mode="">
						</image> 补差价升级
					</view>
					<view class="buchajia" @click="jiHuoMaModal = true">
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
						<image class="imagesBox_avatar_bottomText_img"
							:style="{display:UserStore.userInfo?.vip == 0 ? 'none' : 'block'}" :src="$assets.vipIcon"
							mode=""></image>
						<text>{{UserStore.userInfo?.vipType}}</text>
					</view>
				</view>
			</view>
			<!-- #ifdef APP -->
			<view class="historyOrder" @click="tohistoryOrder">
				历史订单查询
			</view>
			<!-- #endif -->
		</view>

		<view class="vipTptySeleted">
			<view @click="changeItems(0,58)" :class="{
			'vipTptySeleted_items': true,
			 'activeVipItems': activeItems === 0}">
				热门推荐
			</view>
			<view @click="changeItems(1,78)" :class="{
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
		<PayItemView :payMode='payMode' :seletedVipIds="seletedVipIds" />
		<!-- #ifdef APP -->
		<up-button :customStyle="buttonStyles" class="applepayButton" @click="applePay">
			<image class="imgae" :src="$assets.appleStoreIcons" mode=""></image>
			<text class="buttontext">App Store支付</text>

		</up-button>
		<!-- #endif -->
		<VipNumberSteps :seletedVipIds="seletedVipIds" v-model:buChaJiaModal="buChaJiaModal" />

		<up-modal :show="buChaJiaModal" :showConfirmButton='false'>
			<view class="buChaJiaModal">
				<view class="buChaJiaModal_header">
					联系客服
				</view>
				<view class="buChaJiaModal_main">
					<view class="buChaJiaModal_main_topText">
						使用微信扫一扫，联系您的专属客服
					</view>
					<view class="buChaJiaModal_main_middleText">
						<image class="buChaJiaModal_main_middleText_image"
							src="//file.1foo.com/2023/10/28/bab81d65016a5d265a1a01a2b898371b.png" mode=""></image>
					</view>
					<view class="buChaJiaModal_main_bottomText">
						客服邮箱:202829657@qq.com
					</view>
					<view class="buChaJiaModal_main_bottomText">
						工作日9:00-12:00 14:00-18:00 20:00-22:30
					</view>

					<view class="buChaJiaModal_main_bottomText">
						休息时间不定时处理消息
					</view>
				</view>
				<view class="buChaJiaModal_footer">
					<view class="buChaJiaModal_footer_button1" @click="buChaJiaModal = false">
						取消
					</view>
					<view class="buChaJiaModal_footer_button2" @click="toCopyText('wuww9879')">
						复制微信号
					</view>
				</view>
			</view>
		</up-modal>
		<up-modal :customClass="'buChaJiaModal'" :show="jiHuoMaModal" showCancelButton @confirm="jihuoCode"
			@cancel="jiHuoMaModal=false">
			<view class="buChaJiaModal">
				<view class="buChaJiaModal_header">
					激活码激活
				</view>
				<view class="buChaJiaModal_main">
					<up-input fontSize="11" :customStyle="{width:'100%',padding:'0'}" class="buChaJiaModal_main_input"
						placeholder="请输入激活码" v-model="code"></up-input>
				</view>

			</view>
		</up-modal>
	</z-paging>
</template>

<script setup lang="ts">
	import { computed, onActivated, onMounted, onUnmounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { toCopyText } from '@/utils';
	import { useCounterStore, useScreenStore, useUserStore } from '@/store';
	import HotVips from './HotVips.vue';
	import OfficeWorkVips from './OfficeWorkVips.vue';
	import VipNumberSteps from './VipNumberSteps.vue';
	import PayItemView from './PayItemView.vue';
	import MiddleVipView from './MiddleVipView.vue';
	import { storeToRefs } from "pinia"
	import { vipTypes, vipDatasType, payModeType } from "../data"
	// #ifdef APP
	import { useIAPPayment, transactionType } from '@/hooks/iapPayment';
	// #endif
	const ScreenStore = useScreenStore()
	const activeItems = ref(0)
	const vipDatas = ref<vipDatasType[] | []>([])
	const payMode = ref<payModeType[] | []>([])
	const UserStore = useUserStore()
	const { $assets, $api } = useGlobalProperties();
	const filterAppleProductId = []
	const HotVipDatas = computed(() => {
		return vipDatas.value.slice(0, 5)
	})
	const buttonStyles = {
		display: 'flex',
		width: '50%',
		border: '0',
		borderRadius: '15rpx'
	}
	const buChaJiaModal = ref(false)
	const jiHuoMaModal = ref(false)
	const code = ref('')
	const seletedVipIds = ref(200)
	const changeVipId = (index : number) => {
		seletedVipIds.value = index
	}
	const refreshInfo = async () => {
		const users = await $api.get('api/v1/user/info')
		if (users.code == 200) {
			UserStore.userInfo = users.data;
			uni.$u.toast('支付成功！');
		}
	}
	const jihuoCode = async () => {
		const codeRes = await $api.post('api/v1/vip/cardActive', { card: code.value })
		if (codeRes.code == 200) {
			uni.$u.toast('激活码激活会员成功！');
			jiHuoMaModal.value = false
			refreshInfo()
		} else {
			uni.$u.toast(codeRes.msg);
		}
	}
	const OfficeWorkVipDatas = computed(() => {
		return vipDatas.value.slice(5, 7)
	})
	const changeItems = (index : number, vipIds : number) => {
		activeItems.value = index
		seletedVipIds.value = vipIds
	}
	// #ifdef APP
	const {
		initIAPChannel,
		getProducts,
		requestPayment,
		restoreIAPPurchases,
		finishTransaction,
		getUnfinishedTransactions,
		bianjieVipId,
		verifyAndProcessReceipt,
		createOrderTable
	} = useIAPPayment();

	const getAppleOrder = async (id : number) : Promise<string> => {
		return new Promise(async (resolve, reject) => {
			const createAppleOrder = await $api.post('https://api.ai1foo.com/api/v1/pay/apple.create', {
				"shop_id": id
			})
			if (createAppleOrder.code == 200) {
				resolve(createAppleOrder.data)
			} else {
				uni.$u.toast('获取订单号出错，请重试！');
				reject(false)
			}
		})
	}

	const applePay = async () => {
		// 先拿到订单号
		const AppleOrderId : string = await getAppleOrder(seletedVipIds.value)
		if (AppleOrderId) {
			const productId = bianjieVipId[seletedVipIds.value]
			const productRes = await getProducts([productId])
			const result = await requestPayment(productId, AppleOrderId)
			if (result) {
				const verifyResult : boolean = await verifyAndProcessReceipt(result, AppleOrderId);
				if (verifyResult) {
					refreshInfo()
					createOrderTable(verifyResult)
					console.log('刷新用户信信息', verifyResult);
				}
			}
		}
	}
	const tohistoryOrder = () => {
		uni.navigateTo({
			url: '/pages/my/subPage/appleHistory/index'
		})
	}

	// #endif

	const backview = () => {
		uni.navigateBack()
	}

	onMounted(() => {
		const isrise = ScreenStore.IsRise ? '?rise=true' : ''
		$api.get('api/v1/vip/getShops' + isrise).then(async vipRes => {
			if (vipRes.code == 200) {
				payMode.value = vipRes.payMode as payModeType[]
				vipDatas.value = vipRes.shops as vipDatasType[]
				changeItems(0, 58)
				// #ifdef APP
				await initIAPChannel()
				// await restoreIAPPurchases()
				// #endif
			} else {
				uni.$u.toast(vipRes.msg);
			}
		});
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
			justify-content: flex-start;

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
		display: flex;
		justify-content: space-between;
		align-items: center;

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

				&_img {
					width: 30rpx;
					height: 40rpx;
					margin-right: 13rpx;
				}
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


	.buChaJiaModal {
		font-size: 27rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		&_header {
			font-weight: 800;
			width: 100%;
			font-size: 30rpx;
		}

		&_main {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			border: 1rpx solid #ccc;
			border-radius: 10rpx;
			padding: 6rpx 9rpx;
			margin: 20rpx 0;

			&_input {}

			&_topText {
				padding: 20rpx 0;
			}

			&_middleText {

				&_image {
					width: 500rpx;
					height: 500rpx;
				}

			}

			&_bottomText {
				display: flex;
				width: 100%;
				font-size: 24rpx;
				padding: 5rpx 0;
				color: $uni-color-primary;
				flex-direction: column;
				justify-content: flex-start;
			}
		}

		&_footer {
			display: flex;
			justify-content: flex-end;
			margin-top: 25rpx;

			&_button1 {
				padding: 15rpx 20rpx;
				background-color: #ccc;
				border-radius: 15rpx;
				margin-right: 15rpx;
				color: #FFF9F0;
			}

			&_button2 {
				padding: 15rpx 20rpx;
				background-color: $uni-color-primary;
				border-radius: 15rpx;
				color: #FFF9F0;
			}
		}
	}

	.applepayButton {
		display: flex;

		.imgae {
			width: 50rpx;
			height: 50rpx;
			margin-right: 15rpx;
		}

		.buttontext {
			font-size: 25rpx;
		}
	}

	.historyOrder {
		z-index: 100;
		font-size: 25rpx;
	}
</style>