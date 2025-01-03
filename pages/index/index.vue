<template>
	<z-paging fixed ref="srollRef" safe-area-inset-bottom
		:pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0'}">
		<template #top>
			<CommonHeader />
			<ChangeModel :style="{width:'100%'}" />
		</template>
		<ChatBox ref="ChatBoxRef" @passToGrandparent="handleValue" @echartsOnsendMessage="echartsOnsendMessage"
			v-model:IsHasChatOverMessage="IsHasChatOverMessage" />
		<template #bottom>
			<view class="chatBoxLayout">
				<template v-if="IsHasChatOverMessage">
					<ChatInputToolTipVue @change="sendValue" />
				</template>
				<Chat @onCancel="onCancel" v-model:chatValue="chatValue" @onSend="onSend" />
			</view>
			<m-tabbar native safeBottom></m-tabbar>
		</template>
	</z-paging>
	<CommonModelSeleted />
	<HistoryMessage />

	<!-- #ifdef APP -->
	<up-popup round="10" :show="ChatStore.shareButton" @close="ChatStore.setShareButton(false)">
		<ShareBtn :sharedataTemp="ChatStore.sharedata"></ShareBtn>
	</up-popup>
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>
<script setup lang="ts">
	// #ifdef APP
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	import ShareBtn from '@/components/ShareBtn.vue';
	// #endif
	import ChangeModel from '@/components/CommonChat/ChangeModel.vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import Chat from '@/components/CommonChat/Chat.vue';
	import CommonModelSeleted from '@/components/CommonChat/CommonModelSeleted.vue';
	import HistoryMessage from '@/components/CommonChat/HistoryMessage.vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import ChatInputToolTipVue from '@/components/CommonChat/ChatInputToolTip.vue';
	import { nextTick, onMounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useChatStore, useUserStore } from '@/store';
	import { ItemMessage } from '@/type/chatData';
	import { generateUUID } from '@/tools/uuid';
	import ChatBox from '@/components/CommonChat/ChatBox.vue';
	import { storeToRefs } from 'pinia';
	import { commonModel } from '@/config/modelConfig';
	import { ToolTipItem } from '@/type/userTypes';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { currentModelReversParmas, exParmas, modelTypes, noHistoryArr } from '../chat/chatConfig';
	const { streamRequest, isRecive, onCancelRequest, streamSpark
		// #ifdef APP
		, openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks();
	const { $api } = useGlobalProperties();
	const ChatStore = useChatStore();
	const UserStore = useUserStore()
	const { setChatInfo } = ChatStore;
	const { model, selectChatId } = storeToRefs(ChatStore);
	const chatValue = ref('');

	const ChatBoxRef = ref<InstanceType<typeof ChatBox>>(null);
	const IsHasChatOverMessage = ref(false)
	const srollRef = ref(null);
	onShow(() => {
		if (noHistoryArr.includes(model.value)) {
			ChatStore.seletedFirstChats()
			return
		}
	})

	const onBeforeChange = (next, index) => {
		uni.showModal({
			title: '非法进入',
			content: `你点击了第${index}个tab,被系统拦截了,是否继续`,
			success: function (res) {
				if (res.confirm) {
					next()
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		})
	}


	onMounted(() => {
		const initMessage = ChatStore.getCurrentInfo(ChatStore.selectChatId);
		ChatStore.setModel(initMessage.model)
		if (initMessage.data.length > 0) {
			const newMap = new Map();
			initMessage.data.forEach((item : ItemMessage) => {
				newMap.set(item.id, item);
			});
			ChatBoxRef.value.messageList = newMap;
		} else {
			ChatBoxRef.value?.clearAllMessage();
		}
		scrollToBottom();
	});
	onLoad((options : any) => {
		if (options.invite_code) {
			UserStore.setInvite_code(options.invite_code)
		}
		// uni.hideTabBar()
		console.log('apppppppp -----------------------', options)
	})
	const echartsOnsendMessage = (val : any) => {
		const { messages, uchartsType } = val
		onSend(messages[1].content, {
			currentAsk: '默认',
			msgId: '',
			isEcharts: true
		}, [messages[0]], uchartsType)
	}
	const handleValue = (value) => {
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
		config : { currentAsk : string; msgId : string, isEcharts : boolean } = {
			currentAsk: '默认',
			msgId: '',
			isEcharts: false
		},
		extraMessage ?: any,
		echartsType ?: string
	) => {
		if (!val) {
			uni.$u.toast('请先输入内容！');
			return;
		}
		const msgId = generateUUID();
		IsHasChatOverMessage.value = false
		const msgObj : ItemMessage = { id: msgId, state: 'ok', target: 'user', message: val, messageType: 'text' };
		ChatBoxRef.value.addMessage(msgId, msgObj);
		saveHistory(selectChatId.value, msgObj);
		const requestData = [
			...(Array.isArray(extraMessage) && extraMessage.length ? extraMessage : []),
			{
				role: 'user',
				content: val
			}
		];
		// 获取所有历史记录拼装data
		const historyMessages = ChatBoxRef.value.getAllHistoryMessage(requestData, msgId)
		const reqData = {
			prompt: model.value == 'net' ? undefined : `请以中文回复我 官方设置的${config.currentAsk}角度，适用于日常生活工作的询问与回答，权重均衡`,
			type: modelTypes[model.value],
			...exParmas[model.value],
			[currentModelReversParmas[model.value] || 'params']: model.value == 'net' ? { messages: historyMessages } : historyMessages,
		};
		const options = {
			url: commonModel[model.value].ModelApi,
			method: 'POST',
			data: reqData,
			echartsType
		};
		scrollToBottom();
		chatValue.value = '';
		console.log(options)
		handleStream(options);
	};

	async function handleStream(options) {
		let result = '';
		let newStr = ''
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
			onmessage: async (text : UniApp.RequestSuccessCallbackResult) => {
				newStr += text
				result = await streamSpark(newStr)
				console.log(result)
				ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: result, messageType: 'text', echartsType: options.echartsType });
				scrollToBottom();
			},
			onerror: (err) => {
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				if (currentMessage.state == 'waite') {
					ChatBoxRef.value.deleteMessage(id)
				}
				if (err?.includes('请升级会员')) {
					uni.hideTabBar({
						success: () => {
							ChatStore.setShowLevelUpVipContent(err)
							ChatStore.setShowlevelUpVip(true)
						}
					})
				}
			},
			onfinish: (response) => {
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				saveHistory(selectChatId.value, currentMessage);
				ChatStore.setLoadingMessage(false);
			},
			LoadingConfig,
		};
		console.log(requestOptions)
		streamRequest(requestOptions);
	}
</script>

<style scoped lang="scss">
	.chatBoxLayout {
		overflow: hidden;
		padding: 30rpx 0;
		/* #ifdef MP-WEIXIN */
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	// .changemodels {
	// 	height: max-content;
	// 	display: flex;
	// }
</style>