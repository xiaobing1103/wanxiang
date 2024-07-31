<template>
	<view class="content">
		<CommonHeader />
		对话页面
		<CommonTabbar :indexValue="2" />
	</view>
</template>

<script setup>
	// import api from '@/api/api.ts'
	import CommonTabbar from '@/components/CommonTabbar.vue'
	import CommonHeader from '@/components/CommonHeader.vue'
</script>