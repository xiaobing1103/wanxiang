<template>
	<z-paging fixed ref="srollRef" safe-area-inset-bottom :show-scrollbar="false"
		:pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0'}">
		<template #top>
			<CommonHeader />
			<view class="chatHeader">
				<ChangeModel :style="{width:'100%'}" />
				<up-icon size="20" :customStyle="{margin:'0 20rpx'}" @click="ChatStore.setopenHistoryModel(true)"
					color="#4955f5" name="clock"></up-icon>
			</view>
		</template>
		<view class="content-wrapper">
			<ChatBox ref="ChatBoxRef" @passToGrandparent="handleValue" @echartsOnsendMessage="echartsOnsendMessage"
				v-model:IsHasChatOverMessage="IsHasChatOverMessage" />
		</view>
		<template #bottom>
			<view class="input-container" :style="{ bottom: keyboardHeight + 'px' }">
				<view class="chatBoxLayout">
					<NewChatInputToolTip />
					<Chat v-model:keyboardHeight="keyboardHeight" @onCancel="onCancel" v-model:chatValue="chatValue"
						@onSend="onSend" />
					<ChatModelButton />
				</view>
			</view>
		</template>
	</z-paging>
	<CommonModelSeleted />
	<HistoryMessage />
	<!-- #ifdef APP -->
	<up-popup round="10" :show="ChatStore.shareButton" @close="ChatStore.setShareButton(false)">
	</up-popup>
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>
<script setup lang="ts">
	// #ifdef APP
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	// #endif
	import ChatModelButton from '../../ChangeModelButton/index.vue'
	import { nextTick, onMounted, onUnmounted, reactive, ref, computed } from 'vue';
	import ChangeModelButton from './ChangeModelButton/index.vue'
	import ChangeModel from '../CommonChat/ChangeModel.vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import Chat from '../CommonChat/Chat.vue';
	import ChatBox from '../CommonChat/ChatBox.vue';
	import HistoryMessage from '../CommonChat/HistoryMessage.vue';
	import ChatInputToolTipVue from '../CommonChat/ChatInputToolTip.vue';
	import NewChatInputToolTip from '../CommonChat/NewChatInputToolTip.vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import CommonModelSeleted from '@/components/CommonChat/CommonModelSeleted.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useChatStore, useUserStore } from '@/store';
	import { ItemMessage, ModelType, TextSegment, searchItems, searchItemsContent, textDeepSeekType } from '@/type/chatData';
	import { generateUUID } from '@/tools/uuid';
	import { storeToRefs } from 'pinia';
	import { commonModel } from '@/config/modelConfig';
	import { ToolTipItem } from '@/type/userTypes';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { currentModelReversParmas, exParmas, modelTypes, noHistoryArr } from './chatConfig';
	import { MainPagesInterFace } from "@/store/aiAgentChats";
	import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
	import { globalKeyboard } from "@/hooks/useKeyBoard";
	import { isString } from "util";
	const keyboardHeight = ref(0)
	onShareAppMessage((res) => {
		const shareInfo = {
			title: '快来和AI对话吧',
			path: '/pages/index/AllModelChatCom',
			imageUrl: '',
		}
		if (res.from === 'button' && res.target?.dataset?.content) {
			shareInfo.title = res.target.dataset.content
		}
		return shareInfo
	})
	onShareTimeline(() => {
		return {
			title: '快来和AI对话吧',
			query: '',
			imageUrl: ''
		}
	})
	const { streamRequest, isRecive, onCancelRequest, streamSpark, setIsRecive
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
		nextTick(() => {
			if (ChatBoxRef.value) {
				const initMessage = ChatStore.getCurrentInfo(ChatStore.selectChatId)
				if (initMessage?.data?.length > 0) {
					const newMap = new Map()
					initMessage.data.forEach((item : ItemMessage) => {
						newMap.set(item.id, item)
					})
					ChatBoxRef.value.messageList = newMap
				}
				scrollToBottom()
			}
		})
	})
	onUnmounted(() => {
		ChatStore.changeSelectChatId('')
	})
	onLoad((options : any) => {
		// #ifdef MP-WEIXIN
		uni.showShareMenu({})
		// #endif
		if (options.invite_code) {
			UserStore.setInvite_code(options.invite_code)
		}
		if (options.keywords && options.keywords !== 'null') {
			setTimeout(() => {
				onSend(options.keywords)
			}, 2000)
		}
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
		if (ChatStore.loadingMessage) {
			uni.$u.toast('请先等待对话结束后继续发送！');
			return
		}
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
		// 确保 ChatBoxRef 已经准备好
		if (!ChatBoxRef.value) {
			console.error('ChatBoxRef not ready')
			return
		}
		// 如果没有当前的对话id 就添加一条对话id进行对话
		if (!ChatStore.selectChatId) {
			ChatStore.addchats({
				id: generateUUID(),
				iconUrl: commonModel[model.value].modelIcon,
				title: val,
				data: [],
				model: model.value
			})
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
		// 如果开启了联网搜索
		let reqData : { prompt : any, type : ModelType, params : any, internet ?: boolean, messages ?: { role : string, content : string }[] } = null
		if (ChatStore.openLianWangModel) {
			reqData = {
				prompt: '你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。',
				internet: true,
				messages: historyMessages
			}
		} else {
			reqData = {
				prompt: model.value == 'net' ? undefined : `请以中文回复我 官方设置的${config.currentAsk}角度，适用于日常生活工作的询问与回答，权重均衡`,
				type: modelTypes[model.value],
				...exParmas[model.value],
				[currentModelReversParmas[model.value] || 'params']: model.value == 'net' ? { messages: historyMessages } : historyMessages,
			};
		}

		const options = {
			url: ChatStore.openLianWangModel ? commonModel.deepseek_r1_qwen_32b.ModelApi : commonModel[model.value].ModelApi,
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
		let reasoning_assistant = 'noStart'
		let result = '';
		let newStr = '';
		let reasoning_contentRe = ''
		let thinkTime = 0
		const id = generateUUID();
		ChatBoxRef.value.addMessage(id,
			{
				id: id,
				state: 'waite',
				target: 'assistant',
				message: result,
				messageType: 'text',
				isShowDeepSeekThinks: true,
			});
		ChatStore.setLoadingMessage(true);
		const LoadingConfig = {
			showLoading: false,
			title: '加载中...'
		};
		const requestOptions = {
			url: options.url,
			data: options.data,
			onmessage: async (text : string | searchItems | textDeepSeekType) => {
				let currentMessage = ChatBoxRef.value.getSingelMessage(id);
				if (text?.tool == 'search') {
					reasoning_assistant = text?.reasoning_assistant
					if (!currentMessage.searchItems) {
						currentMessage.searchItems = []
					}
					ChatBoxRef.value.setMessage(id, {
						...currentMessage,
						state: reasoning_assistant == 'isLoading' ? 'waite' : 'ok',
						target: 'assistant',
						messageType: 'text',
						echartsType: options?.echartsType,
						reasoning_assistant,
						searchItems: [...currentMessage.searchItems, text.content],
						thinkTime,
						isShowSrearchBox: true,
						isThisChatOpenLianWangSearch: true
					});
					return
				}
				if (text?.reasoning_assistant) {
					reasoning_assistant = text?.reasoning_assistant
					reasoning_assistant == 'isLoading' ? reasoning_contentRe += text?.content : newStr += text?.content
					thinkTime = text?.thinkTime
					let newRes = await streamSpark(newStr)
					// let newObj = null
					if (currentMessage.searchItems) {
						reasoning_contentRe = await renderTextWithPopover(reasoning_contentRe, currentMessage.searchItems)
						newRes = await renderTextWithPopover(newRes, currentMessage.searchItems)
						// newObj = await renderTextWithPopover(newRes, currentMessage.searchItems)
					}
					ChatBoxRef.value.setMessage(id, {
						...currentMessage, // 保留原有的所有属性，包括 isShowDeepSeekThinks
						state: reasoning_assistant == 'isLoading' ? 'waite' : 'ok',
						target: 'assistant',
						message: newRes,
						reasoning_content: reasoning_contentRe,
						messageType: 'text',
						echartsType: options?.echartsType,
						reasoning_assistant,
						thinkTime,
						// segments: newObj.segments
					});
					scrollToBottom();
					return
				}
				newStr += text
				result = await streamSpark(newStr)
				ChatBoxRef.value.setMessage(id, {
					...currentMessage, // 保留原有的所有属性，包括 isShowDeepSeekThinks
					state: 'ok',
					target: 'assistant',
					message: result,
					messageType: 'text',
					echartsType: options.echartsType,
					reasoning_assistant,
					reasoning_content: reasoning_contentRe,
					thinkTime
				});
				scrollToBottom();
			},
			onerror: (err) => {
				console.log(err)
				let currentMessage = ChatBoxRef.value.getSingelMessage(id);
				if (currentMessage && currentMessage.state == 'waite') {
					ChatBoxRef.value.deleteMessage(id)
				}
				if (err?.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
					ChatStore.setLoadingMessage(false)
				}


			},
			onfinish: (response) => {
				const currentMessage = ChatBoxRef.value.getSingelMessage(id);
				saveHistory(selectChatId.value, currentMessage);
				ChatStore.setLoadingMessage(false);
				// IsHasChatOverMessage.value = true
			},
			LoadingConfig,
		};
		console.log(requestOptions)
		streamRequest(requestOptions);
	}


	const renderTextWithPopover = (text : string, searchList : any[]) : Promise<string> => {
		return new Promise((resolve) => {
			const regex = /【(\d+)†source】/g;
			let processed = text;
			const matches = Array.from(text.matchAll(regex));

			for (const match of matches.reverse()) {
				const index = parseInt(match[1]);
				const item = searchList[index - 1];
				if (item) {
					const replacement = `<a href="${item.link}">【${index}</a>】`;
					processed = processed.slice(0, match.index) +
						replacement +
						processed.slice(match.index + match[0].length);
				}
			}
			resolve(processed);
		});
	};

	// const renderTextWithPopover = (text : string, searchList : any[]) : Promise<{ segments : TextSegment[]; rawText : string }> => {
	// 	return new Promise((resolve) => {
	// 		const regex = /【(\d+)†source】/g;
	// 		const segments : TextSegment[] = [];
	// 		let lastIndex = 0;
	// 		let processed = text;
	// 		const matches = Array.from(text.matchAll(regex));
	// 		matches.forEach((match) => {
	// 			const index = parseInt(match[1]);
	// 			const item = searchList[index - 1];
	// 			if (match.index > lastIndex) {
	// 				segments.push({
	// 					type: 'text',
	// 					content: text.slice(lastIndex, match.index)
	// 				});
	// 			}
	// 			if (item) {
	// 				segments.push({
	// 					type: 'marker',
	// 					content: match[0],
	// 					index: index,
	// 					sourceData: item
	// 				});
	// 			}
	// 			lastIndex = match.index + match[0].length;
	// 		});

	// 		if (lastIndex < text.length) {
	// 			segments.push({
	// 				type: 'text',
	// 				content: text.slice(lastIndex)
	// 			});
	// 		}
	// 		resolve({
	// 			segments,
	// 			rawText: processed
	// 		});
	// 	});
	// };
</script>

<style scoped lang="scss">
	.content-wrapper {
		// 添加底部间距，确保内容不被输入框遮挡

		margin-bottom: calc(127px + env(safe-area-inset-bottom)); // 根据实际输入框高度调整
	}

	.input-container {
		position: fixed;
		left: 0;
		right: 0;
		transition: all 0.3s;
		z-index: 999;
		/* #ifdef MP-WEIXIN  || APP */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
		background-color: rgb(246, 247, 249);
	}

	.chatBoxLayout {
		overflow: hidden;
		background-color: rgb(246, 247, 249);
		// box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.chatHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.search-marker {
		background-color: #ccc;
		font-size: 27rpx;
	}

	// ::-webkit-scrollbar {
	// 	width: 0;
	// 	height: 0;
	// 	background-color: transparent;
	// }	
</style>