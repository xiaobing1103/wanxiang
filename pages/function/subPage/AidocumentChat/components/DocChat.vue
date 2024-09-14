<template>
	<view class="DocChat">
		<view class="DocChat_header">
			文档对话内容均为文档理解模型生成
		</view>
		<view class="DocChat_main">
			<ChatBox ref="ChatBoxRef" @passToGrandparent="handleValue" />
		</view>
		<view class="DocChat_footer">
			<DocChatInput @onCancel="onCancel" v-model:chatValue="chatValue" @onSend="onSend" />
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import ChatBox from '@/components/CommonChat/ChatBox.vue';
	import { generateUUID } from '@/tools/uuid';
	import { ItemMessage } from '@/type/chatData';
	import { useChatStore } from '@/store';
	import { currentModelReversParmas, exParmas, modelTypes } from '@/pages/chat/chatConfig';
	import { storeToRefs } from 'pinia';
	import { commonModel } from '@/config/modelConfig';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	// import Chat from '@/components/CommonChat/Chat.vue';
	import DocChatInput from './DocChatInput.vue';
	const props = defineProps<{ currentFileSearch : any, scrollToBottom : () => void }>()
	const ChatBoxRef = ref<InstanceType<typeof ChatBox>>(null);
	const ChatStore = useChatStore();
	const { model, selectChatId } = storeToRefs(ChatStore);
	const { setChatInfo } = ChatStore;
	const chatValue = defineModel('chatValue')
	const handleValue = (value : any) => {
		const messages = ChatBoxRef.value.getPrevSingelMessage(value.msgId);
		onSend(messages.message, value);
	};


	const { streamRequest, onCancelRequest } = useStreamHooks();
	const scrollToBottom = () => {
		props.scrollToBottom()
	};
	const onCancel = () => {
		onCancelRequest()
		ChatStore.setLoadingMessage(false)
	}
	const onSend = async (
		val,
		config : { currentAsk : string; msgId : string } = {
			currentAsk: '默认',
			msgId: ''
		}
	) => {
		if (!val) {
			uni.$u.toast('请先输入内容！');
			return;
		}
		const msgId = generateUUID();
		const msgObj : ItemMessage = { id: msgId, state: 'ok', target: 'user', message: val, messageType: 'text' };
		ChatBoxRef.value.addMessage(msgId, msgObj);
		saveHistory(selectChatId.value, msgObj);
		const requestData = [
			{
				role: 'user',
				content: val
			}
		];
		const historyMessages = ChatBoxRef.value.getAllHistoryMessage(requestData, msgId)
		const reqData = {
			// prompt: `请以中文回复我 官方设置的${config.currentAsk}角度，适用于日常生活工作的询问与回答，权重均衡`,
			prompt: null,
			type: modelTypes[model.value],
			...exParmas[model.value],
			[currentModelReversParmas[model.value] || 'params']: historyMessages,
		};
		const options = {
			url: commonModel[model.value].ModelApi,
			method: 'POST',
			data: reqData
		};
		scrollToBottom();
		chatValue.value = '';
		handleStream(options);
	};
	const saveHistory = (id : string, currentMessage : ItemMessage) => {
		setChatInfo(id, currentMessage);
	};
	async function handleStream(options) {
		let result = '';
		const id = generateUUID();
		ChatBoxRef.value.addMessage(id, { id: id, state: 'waite', target: 'assistant', message: result, messageType: 'text' });
		ChatStore.setLoadingMessage(true);
		const LoadingConfig = {
			showLoading: false,
			title: '加载中...'
		};
		const requestOptions = {
			url: options.url,
			data: options.data,
			onmessage: (text : UniApp.RequestSuccessCallbackResult) => {
				result += text;
				ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: result, messageType: 'text' });
				scrollToBottom();
			},
			onerror: (err) => {
				console.log(err);
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				console.log(currentMessage);
				if (currentMessage.state == 'waite') {
					ChatBoxRef.value.deleteMessage(id)
				}
			},
			onfinish: (response) => {
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				// 存历史记录
				saveHistory(selectChatId.value, currentMessage);
				ChatStore.setLoadingMessage(false);
			},
			LoadingConfig
		};
		streamRequest(requestOptions);
	}
	defineExpose({ onSend })
</script>

<style lang="scss" scoped>
	.DocChat {
		height: 100%;
		background-color: rgb(246, 247, 249);

		&_header {
			display: flex;
			justify-content: center;
			font-size: 27rpx;
			padding: 20rpx 0;
			color: $aichat-border-color;
		}

		&_main {
			padding: 25rpx;
			box-sizing: border-box;
			min-height: 70vh;
			overflow: scroll;
		}

		&_footer {
			padding: 10rpx 10rpx;
		}
	}
</style>