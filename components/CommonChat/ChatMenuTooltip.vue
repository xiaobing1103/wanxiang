<template>
	<view class="wrapper">
		<scroll-view  :show-scrollbar="false" scroll-x style="flex-1">
			<view class="tooltip">
				<view class="row">
					<view :style="{background:item.color}" v-for="(item,index) in rows.firstArray" :key="index" class="toolip-item">
						<text class="name">{{item.text}}</text>
					</view>
				</view>
				<view class="row">
					<view :style="{background:item.color}" v-for="(item,index) in rows.secondArray" :key="index" class="toolip-item">
						<text class="name">{{item.text}}</text>
					</view>						
				</view>
			</view>
		</scroll-view>		
	</view>
</template>

<script setup lang="ts">
	import {computed} from 'vue'
	interface ToolipItem{
		icon:string;
		text:string;
		color:string;
		path:string;
		iconType:'text' | "url"
	}
	const tooTipList:ToolipItem[] = [
		{
			icon:'',
			text:'AI长论文写作',
			color:'#ECF7EF',
			path:'💯',
			iconType:"text"
		},
		{
			icon:'',
			text:'一键生成PPT',
			color:'#FCF2E7',
			path:'',
			iconType:"url"
		},
		{
			icon:'',
			text:'图片转卡通',
			color:'#EEF5FD',
			path:'',
			iconType:"url"
		},
		{
			icon:'',
			text:'AI换脸',
			color:'#FCEDF2',
			path:'',
			iconType:"url"
		},
		{
			icon:'',
			text:'图表生成',
			color:'#ECF7EF',
			path:'',
			iconType:"url"
		},
		{
			icon:'',
			text:'AI写真',
			color:'#FCF2E7',
			path:''	,
			iconType:"url"
		},
		{
			icon:'',
			text:'联网搜索',
			color:'#EEF5FD',
			path:'',
			iconType:"url"
		},
		{
			icon:'',
			text:'工作总结',
			color:'#FCF2E7',
			path:'',
			iconType:"url"
		},
		{
			icon:'',
			text:'图片上色',
			color:'#ECF7EF',
			path:'',
			iconType:"url"
		},
		{
			icon:'',
			text:'思维导图',
			color:'#EEF5FD',
			path:'',
			iconType:"url"
		}													
	]
	
	const rows = computed<{
		firstArray:ToolipItem[]
		secondArray:ToolipItem[]
	}>(() =>{
		const middle = Math.ceil(tooTipList.length / 2)
		const firstArray = tooTipList.slice(0,middle)
		const secondArray = tooTipList.slice(middle)
		return {
			firstArray,
			secondArray
		}
	})
</script>

<style scoped lang="scss">
	.wrapper{
		width: 100%;
		margin-top: 10rpx;
		display: flex;
		.tooltip{
			display: flex;
			flex-wrap: wrap;
			.row{
				flex-shrink: 0;
				display: flex;
				flex-wrap: nowrap;
			}
			.toolip-item{
				padding: 10rpx 20rpx;
				margin: 10rpx;
				flex-shrink: 0;
				font-size: 20rpx;
				border-radius: 40rpx;
			}
		}	
	}
</style>