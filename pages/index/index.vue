<template>
	<z-paging ref="srollRef" :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 30rpx' }">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<ChatBox ref="ChatBoxRef" @passToGrandparent="handleValue" />
		<!--  v-model:currentAsk="currentAsk"  -->
		<template #bottom>
			<!-- 气泡选择 -->
			<ChatInputToolTipVue @change="sendValue" />
			<!-- 聊天输入框 -->
			<Chat @onCancel="onCancel" v-model:chatValue="chatValue" @onSend="onSend" />
			<!-- <up-input v-model="chatValue" @changeData="changeData">修改子组件的数据</up-input> -->
			<!-- <button @click="abort">取消·请求</button> -->
		</template>
	</z-paging>
	<CommonModelSeleted />
	<HistoryMessage />
</template>

<script setup lang="ts">
	import Chat from '@/components/CommonChat/Chat.vue';
	import CommonModelSeleted from '@/components/CommonChat/CommonModelSeleted.vue';
	import HistoryMessage from '@/components/CommonChat/HistoryMessage.vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import ChatInputToolTipVue from '@/components/CommonChat/ChatInputToolTip.vue';
	import { nextTick, onMounted, reactive, ref, watch } from 'vue';
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	import { useChatStore } from '../../store';
	import { ItemMessage } from '../../type/chatData';
	import { generateUUID } from '../../tools/uuid';
	import ChatBox from '@/components/CommonChat/ChatBox.vue';
	import { storeToRefs } from 'pinia';
	// import { angelItem } from "@/config/modelConfig"
	import { commonModel } from '../../config/modelConfig';
	import { ToolTipItem } from '@/type/userTypes';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { currentModelReversParmas, exParmas, modelTypes } from '../chat/chatConfig';
	const { $api } = useGlobalProperties();
	const ChatStore = useChatStore();
	const { setChatInfo } = ChatStore;
	const { model, selectChatId } = storeToRefs(ChatStore);
	const chatValue = ref('');
	const { streamRequest, isRecive, onCancelRequest } = useStreamHooks();
	const ChatBoxRef = ref<InstanceType<typeof ChatBox>>(null);

	const srollRef = ref(null);

	// 当前选择回答角度
	// const currentAsk = ref('默认')
	onMounted(() => {
		const initMessage = ChatStore.getCurrentInfo(ChatStore.selectChatId);
		if (initMessage.data.length > 0) {
			const newMap = new Map();
			initMessage.data.forEach((item : ItemMessage) => {
				newMap.set(item.id, item);
			});
			ChatBoxRef.value.messageList = newMap;
		} else {
			ChatBoxRef.value.clearAllMessage();
		}
		scrollToBottom();
	});

	const handleValue = (value) => {
		// console.log(ChatBoxRef.value.messageList)
		const messages = ChatBoxRef.value.getPrevSingelMessage(value.msgId);
		onSend(messages.message, value);
	};
	const scrollToBottom = () => {
		nextTick(() => {
			if (srollRef.value) {
				srollRef.value.scrollToBottom();
			}
		});
	};

	const sendValue = (val : ToolTipItem) => {
		onSend(val.prompt);
	};
	const onCancel = () => {
		onCancelRequest()
		ChatStore.setLoadingMessage(false)
	}
	const saveHistory = (id : string, currentMessage : ItemMessage) => {
		setChatInfo(id, currentMessage);
	};
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
		// 获取所有历史记录拼装data
		const historyMessages = ChatBoxRef.value.getAllHistoryMessage(requestData, msgId)

		const reqData = {
			prompt: `请以中文回复我 官方设置的${config.currentAsk}角度，适用于日常生活工作的询问与回答，权重均衡`,
			type: modelTypes[model.value],
			...exParmas[model.value],
			// Dynamically assign the params key
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
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
	}
</style>