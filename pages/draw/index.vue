<template>
	<view class="content">
		<CommonHeader />
		绘画
		<CommonTabbar :indexValue="1"/>
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