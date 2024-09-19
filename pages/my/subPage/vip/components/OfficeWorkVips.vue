<template>
	<view class="OfficeWorkVips">
		<template v-for="(items,index) in vipDatas" :key="index">
			<view :style="{border:vip == index ? '1px solid #fb4d3d': '1px solid rgba(240, 201, 146, 1)',
						background:vip == index ? 'linear-gradient(90deg, rgba(255, 248, 232, 1) 0%, rgba(251, 225, 185, 1) 100%)' : 'rgba(254, 250, 238, 1)'
				}" class="OfficeWorkVips_items" @click="changeVips(index,items.id)">
				<view class="OfficeWorkVips_items_headers"
					:style="{background: vipShowModals[items.id].content ? vipShowModals[items.id].background :'',color:vipShowModals[items.id].color,display:vip == index ?'block':'none'}">
					{{vipShowModals[items.id].content}}
				</view>
				<view class="OfficeWorkVips_items_leftContent">
					{{items.name}} + 永久有效 =
				</view>
				<view class="OfficeWorkVips_items_content">
					<view class="OfficeWorkVips_items_content_top">
						<text>￥</text>
						<text>{{items.price / 100}}</text>
					</view>
					<view class="OfficeWorkVips_items_content_bottom">
						<text>￥</text>
						<text>{{items.discount_price / 100}}</text>
					</view>
				</view>

			</view>
		</template>

	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { vipDatasType, vipShowModals } from '../data';
	const props = defineProps<{ vipDatas : vipDatasType[] | [] }>()
	const changeVips = (index : number, vipId : number) => {
		vip.value = index
		if (index) {
			emit('changeVipId', vipId)
		} else {
			emit('changeVipId', vipId)
		}

	}
	const vip = ref(0)
	const emit = defineEmits(['changeVipId'])
</script>

<style lang="scss" scoped>
	.OfficeWorkVips {
		display: grid;
		padding: 25rpx;

		&_items {
			position: relative;
			width: 100%;
			display: flex;
			min-height: 160rpx;
			align-items: center;
			border-radius: 15rpx;
			margin: 10rpx 0;
			justify-content: center;
			border: 1rpx solid #f0c992;
			background: #fefaee;

			&_headers {
				position: absolute;
				top: 0;
				left: -2rpx;
				color: #fff;
				padding: 7rpx 10rpx;
				font-size: 17rpx;
				border-radius: 15rpx 0;
			}

			&_leftContent {
				font-size: 27rpx;
				background: linear-gradient(90deg, #612c08, #bf5b02);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-weight: 800;
			}

			&_content {
				font-size: 27rpx;
				background: linear-gradient(90deg, #612c08, #bf5b02);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				display: flex;
				flex-direction: column;
				align-items: center;

				&_top {
					font-size: 35rpx;
					font-weight: 800;
				}

				&_bottom {
					font-size: 27rpx;
					background: linear-gradient(90deg, #612c08, #bf5b02);
					background-clip: text;
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					position: relative;
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
			}
		}
	}
</style>