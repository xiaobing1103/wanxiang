<template>
	<view class="CommonTitle">
		<view class="CommonTitle_titleBox">
			<text class="CommonTitle_titleBox_title">{{title}} </text>
			<view class="CommonTitle_titleBox_bottom"></view>
		</view>

		<view class="CommonTitle_desc">
			<text class="CommonTitle_desc">{{desc}}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue'
	defineProps<{ title : string, desc : string }>()
</script>

<style lang="scss" scoped>
	.CommonTitle {
		width: 100%;
		font-size: 30rpx;
		font-weight: 800;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 0;

		&_titleBox {
			position: relative;

			&_title {
				background: linear-gradient(to right, #1cd8ba, #06c0f9);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-weight: 800;
				font-size: 40rpx;
			}

			&_bottom {
				display: block;
				text-align: center;
				width: 100%;
				position: relative;
				top: -20rpx;
				height: 15rpx;
				background: url(http://file.1foo.com/2024/03/01/721ebd46806b94e15fec65a771c660ca.png);
				background-size: cover;
				background-position: center;
			}
		}


		&_desc {
			display: flex;
			width: 80%;
			justify-content: center;
			text-align: center;
			font-size: 20rpx;
		}
	}
</style>