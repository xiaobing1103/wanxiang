<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)',
		backgroundImage:'url(http://file.1foo.com/2024/10/14/4a280259e65335bb282318abbd51f889.png)', 
		backgroundRepeat: 'no-repeat',
		padding: '0 30rpx' ,
		backgroundSize: 'cover',
		backgroundPosition: '-700rpx -613rpx'
		}">
		<template #top>
			<!-- 顶部用户信息 -->
			<UserInfo />
			<!-- 会员卡片 -->
			<template v-if="userStore.userInfo ">
				<!-- #ifndef APP -->
				<template v-if="isIos">
					<VipCard />
				</template>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<template v-if="userStore.Ios_control">
					<VipCard />
				</template>
				<!-- #endif -->
			</template>
		</template>
		<!-- 菜单列表 -->
		<MenuList :isIos="isIos" v-model:showOverlay="showOverlay" v-model:openPop="openPop" v-model:openPop1="openPop1"
			v-model:popupShow6="popupShow6" />
		<template #bottom>
			<m-tabbar native safeBottom>
				<template v-slot:tabbar_index_2>
					<view class="custom_style">
						<view class="custom_style_icon">
							<image class="custom_style_icon_image" :src="$assets.DeepSeekModelIcon" mode=""></image>
							<image class="custom_style_icon_hotimage" :src="$assets.IndexHotIcon" mode=""></image>
						</view>
					</view>
				</template>
			</m-tabbar>
		</template>
	</z-paging>

	<handlerSeletedPop v-model:openPop="openPop" text1="修改密码" text2="注销用户" @handler1="handlerPassword"
		@handler2="handlerUser" />
	<handlerSeletedPop v-model:openPop="openPop1" text1="用户协议" text2="隐私协议" @handler1="openUser"
		@handler2="openprivade" />
	<ResetPassWord v-model:popupShow="popupShow4" title="修改密码" :titleIcon="$assets.resetPassWordLock" />
	<DeleteAccount v-model:popupShow="popupShow5" title="注销账号" />
	<RelationWe v-model:popupShow="popupShow6" title="联系客服" />
	<DataViews v-model:showOverlay="showOverlay" />
	<GolbalModals />
</template>

<script setup lang="ts">
	import GolbalModals from '@/components/GolbalModals.vue'
	import MenuList from './components/menuList/index.vue'
	import VipCard from './components/vipCard/index.vue'
	import UserInfo from './components/userInfo/index.vue'
	import DataViews from './components/DataViews.vue'
	import ResetPassWord from '@/components/ResetPassWord/index.vue';
	import handlerSeletedPop from '@/components/handlerSeletedPop/index.vue';
	import DeleteAccount from '@/components/DeleteAccount/index.vue';
	import RelationWe from '@/components/RelationWe/index.vue';
	import { useUserStore } from '@/store/index'
	import { onMounted, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	const { $assets, $api } = useGlobalProperties();
	const userStore = useUserStore()
	const showOverlay = ref(false)
	const isIos = ref(false)
	onMounted(() => {
		getIosEnv()
	})
	const getIosEnv = () => {
		$api.get(`api/v1/vip/xcx_pay?version_code=2.3.2.5`, {}, {}).then((res) => {
			if (res.code == 200) {
				isIos.value = true
			} else {
				isIos.value = false
			}
		})
	}

	const popupShow4 = ref(false);
	const popupShow5 = ref(false)
	const popupShow6 = ref(false)
	const openPop = ref(false)
	const openPop1 = ref(false)
	const handlerPassword = () => {
		openPop.value = false;
		popupShow4.value = true;
	}
	const handlerUser = () => {
		openPop.value = false;
		popupShow5.value = true
	}
	const openUser = () => {
		uni.navigateTo({
			url: "/pages/my/subPage/UserAgreement/index"
		})
	}
	const openprivade = () => {
		uni.navigateTo({
			url: "/pages/my/subPage/PrivacyPolicy/index"
		})
	}
	// onLoad((options : any) => {
	// 	uni.hideTabBar()
	// })
</script>

<style lang="scss">
	.myback {
		background-image: url('http://file.1foo.com/2024/07/29/af36f8c0ba1944af16deba5328d73e0d.png');
		background-position: -303px -478px;
		width: 100vw;
		overflow: hidden;
		height: calc(100vh - 100rpx);
	}

	.custom_style {
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;

		&_icon {
			// font-size: 80rpx;
			width: 90rpx;
			height: 90rpx;
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			// margin-top: -40rpx;
			&_image {
				width: 98rpx;
				height: 70rpx;
			}

			&_hotimage {
				position: absolute;
				width: 32rpx;
				height: 20rpx;
				right: -20rpx;
				top: -5rpx;
			}
		}
	}
</style>