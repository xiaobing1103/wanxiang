<template>
	<z-paging :pagingStyle="{padding:'0 30rpx',background:'#F6F7F6'}">
		<template #top>
			<!-- 顶部用户信息 -->			
			<UserInfo/>
			<!-- 会员卡片 -->
			<VipCard v-if="userStore.showVip"/>
		</template>
		<!-- 菜单列表 -->
		<MenuList/>
		<template #bottom>
			<!-- 底部自定义tabar -->
			<CommonTabbar :indexValue="4" />
		</template>
	</z-paging>
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

</style>