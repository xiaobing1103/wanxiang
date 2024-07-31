<template>
	<view class="chatAll">
		<view class="chatInput">
			<image class="chatInput_left" src="@/static/image.svg" mode=""></image>
			<view class="chatInput_input">
				<up-input placeholder="请输入内容" border="surround" v-model="value"></up-input>
			</view>
			<view class="chatInput_right">
				<image @click="SendMessage" class="chatInput_right_image"
					:src="value ? '//file.1foo.com/2024/07/31/00043f53937f16cc083f142cf4cdf257.svg' : '//file.1foo.com/2024/07/31/137536c06dd024e2703c8cb7ec146af9.svg'"
					mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { baseURL } from '../../api/http';
	import { StreamRequest, fetchStream } from '../../api/request';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	const value = ref('')
	const { $api } = useGlobalProperties()
	const SendMessage = async () => {
		// if (value) {

		// }
		const options = {
			url: baseURL + 'api/v1/chat2/v35',
			method: "POST",
			data: {
				params: "[{\"role\":\"user\",\"content\":\"你好\"}]",
				prompt: "请以中文回复我 官方设置的默认角度，适用于日常生活工作的询问与回答，权重均衡",
				type: "Web-推荐对话"
			},
			callback: (chunk) => {
				console.log('Received chunk:', chunk);
			},
			errorback: (error) => {
				console.error('Stream error:', error);
			}
		};
		// #ifdef MP-WEIXIN
		const requestTask = await $api.getStream('api/v1/chat2/v35', options.data, true)
		// const requestTask = await StreamRequest(options)
		requestTask.onHeadersReceived(function (res) {
			console.log(res)
		});
		requestTask.onChunkReceived(function (res) {
			let decoder = new TextDecoder('utf-8');
			let text = decoder.decode(new Uint8Array(res.data));
			console.log(text)
		});
		// #endif

		// #ifdef H5
		await $api.getStream('api/v1/chat2/v35', options.data, true,
			(chunk) => {
				console.log('Received chunk:', chunk);
			},
			(error) => {
				console.error('Stream error:', error);
			})
		// #endif



	}
</script>

<style lang="scss">
	.chatAll {
		display: flex;
		justify-content: center;
		// position: absolute;
		bottom: 20rpx;
		width: 100%;
		overflow: hidden;
	}

	.chatInput {
		width: 100%;
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