<template>
	<view :style="[setCustomerStyle]"  class="form-cell-item">
		<view class="label-box">
			<slot name="label">
				<text class="label">{{label}}</text>
			</slot>
		</view>
		<view class="desc-box">
			<text class="desc">{{description}}</text>
			<view class="extra"><slot name="extra"></slot></view>
			<up-icon v-if="expand" size="16" color="rgba(185, 191, 207, 1)" name="arrow-right"></up-icon>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Component, computed, toRefs } from 'vue';
	
	interface Props{
		label?:string;
		description?:string;
		url?:string;
		height?:number;
		border?:boolean;
		labelIcon?:Component | string;
		iconSize?:number
		expand?:boolean;
	}
	
	const props = withDefaults(defineProps<Props>(),{
		border:true,
		height:88
	})
	
	const {border} = toRefs(props)
	
	const setCustomerStyle = computed(() =>{
		let style:Record<string,any> = {}
		style['border-bottom'] = border.value ? `1rpx solid rgba(238, 238, 238, 1)` : 'none'
		style['height'] = props.height + 'rpx'
		return style
	})
</script>

<style lang="scss" scoped>
	.form-cell-item{
		width: 100%;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		.label-box{
			.label{
				font-size: 30rpx;
			}
		}
		.desc-box{
			display: flex;
			align-items: center;
			.extra{
				margin-left: 10rpx;
				display: flex;
				font-size: 24rpx;
				align-items: center;
			}
			.desc{
				font-size: 24rpx;
				color: rgba(185, 191, 207, 1);
			}
		}
		&:last-child{
			border-bottom: none!important;
		}
	}
</style>