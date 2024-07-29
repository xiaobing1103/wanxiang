<template>
	<z-paging :show-scrollbar="false">
		<template #top>
			<CommonHeader />
		</template>
		<view class="body">
			<MenuCardItem @click="toPage(item)" v-for="(item,index) in menuList" :key="index" :data="item"/>
		</view>
		<template #bottom>
			<CommonTabbar :indexValue="3"/>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonTabbar from '@/components/CommonTabbar.vue'
	import CommonHeader from '@/components/CommonHeader.vue'
	import MenuCardItem from './comoonents/menuItem.vue'
	import {useGlobalProperties} from '@/hooks/useGlobalHooks'
	
	import  type {MenuItem} from './type.ts'
	const {$assets} = useGlobalProperties()
	
	const menuList = [
		{
			cover:$assets.ppt_cover,
			title:'一键生成PPT',
			description:'海量PPT末班任你选择',
			path:'/pages/function/subPage/ppt/index'
		},
		{
			cover:$assets.aixz_cover,
			title:'AI长论文写作',
			description:'千字大纲，万字毕业课题论文',
			path:''
		},
		{
			cover:$assets.gzzj_cover,
			title:'AI工作总结',
			description:'超实用,AI帮写周报月报总结',
			path:''
		},
		{
			cover:$assets.swdt_cover,
			title:'AI思维导图',
			description:'理解重点,生成可视化思维导图',
			path:''
		},
		{
			cover:$assets.wzyh_cover,
			title:'AI文章纠正',
			description:'AI帮你纠正语句错误,优化内容',
			path:''
		},
		{
			cover:$assets.wddh_cover,
			title:'AI文档对话',
			description:'通过Ai对话快速获取文档信息',
			path:''			
		}		
	]
	
	const toPage = (item:MenuItem) =>{
		console.log(item)
		uni.navigateTo({
			url:item.path
		})
	}
</script>
<style lang="scss" scoped>
	.body{
		display: grid;
		grid-template-columns: repeat(2,1fr);
		gap: 20rpx;
		box-sizing: border-box;
		padding: 30rpx;
	}
</style>