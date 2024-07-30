<template>
	<view class="chatAll">
		<view class="chatInput">
			<image class="chatInput_left" src="@/static/image.svg" mode=""></image>

			<view class="chatInput_input">
				<up-input placeholder="请输入内容" border="surround" v-model="value" @change="change"></up-input>
			</view>

			<view class="chatInput_right">
				<image class="chatInput_right_image" src="@/static/send.svg" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';

	const value = ref('')
	const change = (e) => {
		console.log(e)
	}
</script>

<style lang="scss">
	.chatAll {
		display: flex;
		justify-content: center;
		width: 100%;
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.chatInput {
		width: 90%;
		display: flex;
		background-color: white;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		align-items: center;
		border-radius: 30rpx;

		&_left {
			height: 40rpx;
			width: 40rpx;
			padding: 0 20rpx;

		}

		&_input {
			width: 100%;
			flex: 1;
			box-sizing: border-box;
			background-color: white;

		}

		&_right {
			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 0 15rpx;
			}
		}
	}
</style>