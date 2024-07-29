<template>
	<z-paging :show-scrollbar="false">
		<template #top>
			<CommonHeader />
		</template>
		<view class="body">
			<MenuCardItem @change="toPage(item)" v-for="(item,index) in menuList" :key="index" :data="item"/>
		</view>
		<text class="desc">未完功能持续上线中...</text>
<!-- 		<template #bottom>
			<CommonTabbar :indexValue="3"/>
		</template> -->
	</z-paging>
</template>

<script setup lang="ts">
	import CommonTabbar from '@/components/CommonTabbar.vue'
	import CommonHeader from '@/components/CommonHeader.vue'
	import MenuCardItem from '@/pages/function/comoonents/menuItem.vue'
	import {useGlobalProperties} from '@/hooks/useGlobalHooks'
	
	import  type {MenuItem} from '@/pages/function/type.ts'
	
	const {$assets} = useGlobalProperties()
	const menuList = [
		{
			cover:$assets.xgst_cover,
			title:'线稿上色',
			description:'线稿一键变画作',
			path:''
		},
		{
			cover:$assets.tpzkt_cover,
			title:'图片转卡通',
			description:'一张图片制作你的Q版卡通形象',
			path:''
		},
		{
			cover:$assets.aihl_cover,
			title:'AI换脸',
			description:'一账图片让你当明星',
			path:''
		},
		{
			cover:$assets.paintAixz_cover,
			title:'AI写真',
			description:'在线写真馆',
			path:''
		},
		{
			cover:$assets.tpst_cover,
			title:'图片生图',
			description:'导入照片,AI百变风格',
			path:''
		},
		{
			cover:$assets.wzst_cover,
			title:'文字生图',
			description:'一句话,AI帮你写',
			path:''			
		},
		{
			cover:$assets.jbzh_cover,
			title:'局部重绘',
			description:'想改哪里改哪里',
			path:''			
		},
		{
			cover:$assets.rxkt_cover,
			title:'人像抠图',
			description:'只能提取人像，精确到发丝',
			path:''			
		}						
	]
	
	const toPage = (item:MenuItem) =>{
		if(!item.path){
			uni.$u.toast('尚未开放')
			return
		}
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
	.desc{
		font-size: 24rpx;
		text-align: center;
		display: block;
		width: 100%;
		color:$u-info-disabled;
	}	
</style>