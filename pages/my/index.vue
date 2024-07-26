<template>
	<view class="content">
		<CommonHeader />
		我的页面
		<CommonTabbar :indexValue="4"/>
	</view>
</template>

<script setup>
	import api from '@/api/api.ts'
	import CommonTabbar from '@/components/CommonTabbar.vue'
	import CommonHeader from '@/components/CommonHeader.vue'

	api.login().then(res => {
		console.log(res)
	})
</script>