<template>
	<view class="HotVips">
		<template v-for="(items,index) in vipDatas" :key="index">
			<view class="HotVips_vipDatasBox" @click="changeVips(index,items.id)" :style="{border:vip == index ? '1px solid #fb4d3d': '1px solid rgba(240, 201, 146, 1)',
						background:vip == index ? 'linear-gradient(90deg, rgba(255, 248, 232, 1) 0%, rgba(251, 225, 185, 1) 100%)' : 'rgba(254, 250, 238, 1)'
				}">
				<view class="HotVips_vipDatasBox_headers"
					:style="{background: vipShowModals[items.id].content ? vipShowModals[items.id].background :'',color:vipShowModals[items.id].color,display:vip == index ?'block':'none'}">
					{{vipShowModals[items.id].content}}
				</view>
				<view class="HotVips_vipDatasBox_title">
					{{items.name}}
				</view>
				<view class="HotVips_vipDatasBox_price">
					<text>￥</text>
					<text class="HotVips_vipDatasBox_price_content">{{items?.price / 100}}</text>
				</view>
				<view class="HotVips_vipDatasBox_noPrice">
					<text>原价 ￥</text>
					<text>{{items?.discount_price / 100}}</text>
				</view>
				<view class="HotVips_vipDatasBox_saveMoney"
					:style="{background:vip  == index ? 'rgba(244, 69, 69, 0.1)' : 'rgba(235, 236, 241, 1)'}">
					节省 {{Math.abs(items.price / 100 - items.discount_price / 100)}} 元
				</view>
				<view class="filexdImg" :style="{display:vip  == index ? 'block' : 'none' }">
					<img class="filexdImg_img"
						src="http://file.1foo.com/2024/08/02/3dfa92f1b95f32b3873be962b41baeb1.png" />
				</view>
			</view>
		</template>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { vipDatasType, vipShowModals } from "../data"
	defineProps<{ vipDatas : vipDatasType[] | [] }>()
	const vip = ref(0)
	const emit = defineEmits(['changeVipId'])
	const changeVips = (index : number, vipId : number) => {
		vip.value = index
		emit('changeVipId', vipId)
	}
</script>

<style lang="scss" scoped>
	.HotVips {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		overflow-x: scroll;
		margin: 20rpx 10rpx;

		&_vipDatasBox {
			padding: 20rpx;
			position: relative;
			display: flex;
			align-items: center;
			flex-direction: column;
			font-size: 25rpx;
			margin: 15rpx;
			width: 250rpx;
			border-radius: 24rpx;
			box-sizing: border-box;

			&_headers {
				position: absolute;
				top: 0;
				left: 0;
				color: #fff;
				padding: 7rpx 10rpx;
				font-size: 14rpx;
				border-radius: 15rpx 0;
			}

			&_title {
				font-size: 27rpx;
				padding-top: 20rpx;
				font-weight: 800;
				background: linear-gradient(90deg, #612c08, #bf5b02);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}

			&_price {
				padding: 20rpx 0;
				background: linear-gradient(90deg, #612c08, #bf5b02);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;

				&_content {
					font-weight: 900;
					font-size: 40rpx;
				}
			}

			&_noPrice {
				background: linear-gradient(90deg, #612c08, #bf5b02);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				position: relative;
				display: inline-block;

				&:before {
					content: "";
					position: absolute;
					width: calc(100% + 10px);
					height: 1px;
					left: -4px;
					top: 50%;
					background-color: #c46e2f;
				}
			}

			&_saveMoney {
				padding: 6rpx;
				margin-top: 20rpx;
				border-radius: 8rpx;
				box-sizing: border-box;
				font-weight: 300;
				font-size: 24rpx;
			}
		}
	}

	.filexdImg {
		position: absolute;
		right: 0px;
		bottom: -8rpx;

		&_img {
			width: 50rpx;
			height: 50rpx;
		}
	}
</style>