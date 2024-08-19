<template>
	<z-paging>
		<template #top>
		   <up-navbar :fixed="false"   :autoBack="true"></up-navbar>			
		</template>
		<view class="body">
			<text class="title">AI长文写作系统</text>
			<text class="description">人工智能写作系统，让你用喝一口咖啡的时间完成高质量公众号文章、营销广告或者其它任何文案创作，AI写作生成器·即刻解放你的双手!!</text>
			<image class="icon" src="http://file.1foo.com/2024/08/19/3c1f4cb00ed8072511bccbf168ae457a.svg"></image>
			<view class="btn">
				<u-button @click="onAiCreate" :customStyle="{border:'none!important',outLine:'none!important'}" :hairline="false" shape="circle" type="primary">开始创作</u-button>
			</view>
			<view class="action-list">
				<view v-for="(item,index) in actionList" :key="index" class="action-item">
					<text :style="{background:item.color}" class="title">{{item.name}}</text>
					<text class="description">{{item.desc}}</text>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	const actionList = [
		{
			name:'缺乏写作灵感',
			desc:'我时刻保持创作灵感,避免文章的内容单调，耗费脑力',
			color:'#ddfced'
		},
		{
			name:'缺乏写作灵感',
			desc:'我时刻保持创作灵感,避免文章的内容单调，耗费脑力',
			color:'#fdf8db'
		},
		{
			name:'缺乏写作灵感',
			desc:'我时刻保持创作灵感,避免文章的内容单调，耗费脑力',
			color:'#ddf0f6'
		},
		{
			name:'缺乏写作灵感',
			desc:'我时刻保持创作灵感,避免文章的内容单调，耗费脑力',
			color:'#f4e4fe'
		}
	]
	
	const onAiCreate = () =>{
		uni.navigateTo({
			url:'/pages/function/subPage/longText/write'
		})
	}
</script>

<style lang="scss" scoped>
	.body{
		margin: 20rpx 30rpx;
		.title{
			font-size: 38rpx;
			display: block;
			text-align: center;
			font-weight: 700;
		}
		.description{
			display: block;
			font-size: 28rpx;
			line-height: 50rpx;
			margin-top: 40rpx;
		}
		.icon{
			height: 500rpx;
		}
		.action-list{
			display: grid;
			grid-template-columns: repeat(2,1fr);
			gap:30rpx;
			.action-item{
				height: 200rpx;
				display: flex;
				flex-direction: column;
				padding: 20rpx 40rpx;
				box-sizing: border-box;
				justify-content: center;
				border-radius: 20rpx;
				background: white;
				box-shadow: 0rpx 0rpx 16rpx rgba(0, 0, 0, 0.1);
				backdrop-filter: blur(10rpx);
				align-items: center;
				.title{
					font-size: 26rpx;
					font-weight: 700;
					display:block;
					padding:20rpx;
					border-radius: 10rpx;
				}
				.description{
					margin-top: 10rpx;
					line-height: 35rpx;
					font-size: 20rpx;
					color:$uni-text-color-disable;
				}
			}
		}
		.btn{
			display: flex;
			justify-content: center;
			margin: 60rpx auto;
			width: 80%;
		}
		
	}
</style>