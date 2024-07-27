<template>
	<view class="CommonChat">
		<!-- <ChatTemplate />
		<FastSelectedModel /> -->

		<ChatBox :config="TemplateConfig[model]" />

	</view>
</template>

<script setup lang="ts">
	import ChatTemplate from '@/components/CommonChat/ChatTemplate.vue'
	import FastSelectedModel from '@/components/CommonChat/FastSelectedModel.vue'
	import ChatBox from '@/components/CommonChat/ChatBox.vue'
	import { ModelType, chatConfigProps } from '../../type/chatData';
	import { useChatStore } from '@/store/chat.ts';
	const { model, setModel } = useChatStore();
	const config : chatConfigProps = {
		placeholder: '有问题尽管问，知无不答~',
		setting: true,
		template: ''
	}

	const TemplateConfig : Record<ModelType, chatConfigProps> = {
		'v35': {
			placeholder: '有问题尽管问，知无不答~',
			messagesTemplate: [
				{
					role: 'system',
					template: 'v35Template',
					MessageType: 'template'
				},
				{
					role: 'system',
					MessageType: 'image',
					message: '//file.1foo.com/2023/12/01/02ae98729cafef3cc0ea0fca1c632101.jpg'
				},
				{
					role: 'user',
					MessageType: 'text',
					message: '你好',
				},
				{
					role: 'system',
					MessageType: 'text',
					message: '我是人工智能助手,请问有什么帮助的吗？',
				},
			]
		},
		'v40': {
			messagesTemplate: [
				{
					role: 'system',
					template: 'V40Template'
				}
			]
		},
		'net': {
			messagesTemplate: [
				{
					role: 'system',
					template: 'netTemplate'
				}
			]
		},
	};
</script>

<style scoped lang="scss">
	.CommonChat {
		background-color: rgb(246, 247, 249);
		height: calc(100vh - 88rpx);
		padding: 20rpx;
		box-sizing: border-box;
	}
</style>