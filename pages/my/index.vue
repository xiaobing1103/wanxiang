<template>
	<view class="myback">
		<z-paging :pagingStyle="{padding:'0 30rpx'}">
			<template #top>
				<!-- 顶部用户信息 -->
				<UserInfo />
				<!-- 会员卡片 -->
				<VipCard v-if="userStore.showVip" />
			</template>
			<!-- 菜单列表 -->
			<MenuList />
<!-- 			<template #bottom>
				<CommonTabbar :indexValue="4" />
			</template> -->
		</z-paging>
	</view>
</template>

<script setup lang="ts">
	import CommonTabbar from '@/components/CommonTabbar.vue'
	import MenuList from './components/menuList/index.vue'
	import VipCard from './components/vipCard/index.vue'
	import UserInfo from './components/userInfo/index.vue'
	import { useUserStore } from '@/store/index'
	const userStore = useUserStore()
</script>

<style lang="scss">
	.myback {
		background-image: url('http://file.1foo.com/2024/07/29/af36f8c0ba1944af16deba5328d73e0d.png');
		background-position: -303px -478px;
		width: 100vw;
		height: 100vh;
	}
</style>