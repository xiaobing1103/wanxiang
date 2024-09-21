<template>
	<view class="myback">
		<z-paging :pagingStyle="{padding:'0 30rpx'}">
			<template #top>
				<!-- 顶部用户信息 -->
				<UserInfo />
				<!-- 会员卡片 -->
				<template v-if="userStore.userInfo">
					<VipCard v-model:showOverlay="showOverlay" />
				</template>
			</template>
			<!-- 菜单列表 -->
			<MenuList v-model:openPop="openPop" v-model:openPop1="openPop1" v-model:popupShow6="popupShow6" />
		</z-paging>

	</view>
	<handlerSeletedPop v-model:openPop="openPop" text1="修改密码" text2="注销用户" @handler1="handlerPassword"
		@handler2="handlerUser" />
	<handlerSeletedPop v-model:openPop="openPop1" text1="用户协议" text2="隐私协议" @handler1="openUser"
		@handler2="openprivade" />
	<ResetPassWord v-model:popupShow="popupShow4" title="修改密码" :titleIcon="$assets.resetPassWordLock" />
	<DeleteAccount v-model:popupShow="popupShow5" title="注销账号" />
	<RelationWe v-model:popupShow="popupShow6" title="联系客服" />
	<DataViews v-model:showOverlay="showOverlay" />
</template>

<script setup lang="ts">
	import CommonTabbar from '@/components/CommonTabbar.vue'
	import MenuList from './components/menuList/index.vue'
	import VipCard from './components/vipCard/index.vue'
	import UserInfo from './components/userInfo/index.vue'
	import DataViews from './components/DataViews.vue'
	import ResetPassWord from '@/components/ResetPassWord/index.vue';
	import handlerSeletedPop from '@/components/handlerSeletedPop/index.vue';
	import DeleteAccount from '@/components/DeleteAccount/index.vue';
	import RelationWe from '@/components/RelationWe/index.vue';
	import { useUserStore } from '@/store/index'
	import { ref } from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	const { $assets } = useGlobalProperties();
	const userStore = useUserStore()
	const showOverlay = ref(false)

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
</script>

<style lang="scss">
	.myback {
		background-image: url('http://file.1foo.com/2024/07/29/af36f8c0ba1944af16deba5328d73e0d.png');
		background-position: -303px -478px;
		width: 100vw;
		overflow: hidden;
		height: calc(100vh - 100rpx);
	}
</style>