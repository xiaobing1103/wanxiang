<template>
	<view class="chatAll">
		<view class="chatInput">
			<image class="chatInput_left" src="@/static/image.svg" mode=""></image>
			<view class="chatInput_input">
				<up-input placeholder="请输入内容" border="surround" v-model="value" @change="change"></up-input>
			</view>
			<view class="chatInput_right">
				<image @click="SendMessage" class="chatInput_right_image" src="@/static/send.svg" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import api from '../../api/api';
	import { useChatStore } from '../../store';
	import { baseURL } from '../../api/http';
	import { streamRequest } from '../../api/request';
	const chatstore = useChatStore()
	const value = ref('')
	const change = (e) => {
		console.log(e)
	}
	const SendMessage = async () => {
		const options = {
			url: baseURL + 'api/v1/chat2/v35', // 你的流式数据的URL
			method: "POST", // HTTP 方法
			eventStream: true, // 标识这是一个流请求
			data: {
				params: "[{\"role\":\"user\",\"content\":\"你好\"}]",
				prompt: "请以中文回复我 官方设置的默认角度，适用于日常生活工作的询问与回答，权重均衡",
				type: "Web-推荐对话"
			},
			callback: (chunk : string) => {
				// 实时处理每个数据块
				console.log("Received chunk:", chunk);
			},
			errorback: (error : any) => {
				// 处理错误
				console.error("Stream error:", error);
			}
		};


		// 	const result = await api[chatstore.model](
		// 		{
		// 			params: "[{\"role\":\"user\",\"content\":\"你好\"}]",
		// 			prompt: "请以中文回复我 官方设置的默认角度，适用于日常生活工作的询问与回答，权重均衡",
		// 			type: "Web-推荐对话"
		// 		},
		// 		(chunk : string) => {
		// 			// 实时处理每个数据块
		// 			console.log("Received chunk:", chunk);
		// 		},
		// 		(error : any) => {
		// 			// 处理错误
		// 			console.error("Stream error:", error);
		// 		})

		// 	console.log(result)

		streamRequest(options)
			.then(() => {
				console.log("Stream processing completed.");
			})
			.catch((error) => {
				console.error("Stream request failed:", error);
			});
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