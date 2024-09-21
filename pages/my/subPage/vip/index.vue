<template>
	<z-paging :show-scrollbar="false" ref="srollRef"
		:pagingStyle="{ background: 'url(http://file.1foo.com/2024/09/18/309765e7bc6ba5cc1d0bf16c6f2892cc.png) no-repeat', padding: '0' }">
		<view class="header" :style="{height:navBarHeight  + 'px'}">
			<view class="header_weixin-header" :style="{paddingTop:menuButtonInfo?.top + 'px'}">
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
		<PayItemView :payMode='payMode' :seletedVipIds="seletedVipIds" />
		<VipNumberSteps :seletedVipIds="seletedVipIds" v-model:buChaJiaModal="buChaJiaModal" />
		<template #bottom>
		</template>
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
	import { computed, onMounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { toCopyText } from '@/utils';
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
</style>