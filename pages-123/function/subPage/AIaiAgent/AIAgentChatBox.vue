<template>
	<view class="AIAgentChatBox">
		<template v-if="AiAgentChats.messageList.length > 0">
			<template v-for="(items,index) in AiAgentChats.messageList" :key="index">
				<template v-if="items.role =='system'">
					<ChatSystemMsg :isCurrent="index == AiAgentChats.messageList.length - 1" :msg="items"
						@onsendTemMessage="onsendTemMessage" :loaddingKeyword="loaddingKeywords"
						:loadingWebPage="loadingWebPage" :keywords="threeKeywords" :isRecive="mainParmas.isRecive" />
				</template>
				<template v-else>
					<ChatUserMsg :msg="items" />
				</template>
			</template>
		</template>
		<template v-else>
			<view class="AIAgentChatBox_main">
				<DefaultTemplate @setContent="setContent" @addMessageOver="addMessageOver" />
			</view>
		</template>
	</view>
</template>

<script setup lang="ts">
	import ChatSystemMsg from './ChatSystemMsg.vue'
	import ChatUserMsg from './ChatUserMsg.vue'
	import { computed, onMounted, ref, watch } from 'vue'
	import { useAiAgentChats, useUserStore, useChatStore } from '@/store'
	import DefaultTemplate from './defaultTemplate.vue'
	import { AChat, Agent, AgentIdMap, AgentKeyEnum, CreateImageDrawComplete, CreateImageDrawLoadding, FileItem, MainPagesInterFace } from '@/store/aiAgentChats'
	import { generateUUID } from '@/tools/uuid';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { storeToRefs } from 'pinia'
	const AiAgentChats = useAiAgentChats()
	const { messageList } = storeToRefs(AiAgentChats);
	const ChatStore = useChatStore()
	const { $api } = useGlobalProperties()
	const agentItem = computed(() => AiAgentChats.agentItem)
	const mainParmas = defineModel<MainPagesInterFace>('mainParmas')
	const UserStore = useUserStore()
	const loaddingKeywords = ref<boolean>(false)//三个问题加载
	const loadingWebPage = ref<boolean>(false)
	const threeKeywords = ref<string[]>([])//三个问题
	const agentId = ref('')
	watch(() => AiAgentChats.currentConversation_id, (val : string | null) => {
		if (!val) {
			AiAgentChats.setMessageList([])
		}
	})
	const setContent = (val : string) => {

		mainParmas.value.chatValue = val
	}
	const addMessageOver = (val : string) => {
		onSendMessage(val)
	}


	const onsendTemMessage = (val : string, list ?: FileItem[]) => {
		onSendMessage(val, list)
	}
	//模版
	// <PPtTemplate setFileList= { setFileList } setContent={ setContent } addMessage={ onSendMessage } />
	// <DrawTemplate setContent={ setContent } addMessage = { onSendMessage } />
	const TemplateArr : AChat.AgentTmplate = {
		[AgentIdMap[AgentKeyEnum.PPT]]: {
			template: 'PPtTemplate'
		},
		[AgentIdMap[AgentKeyEnum.IMAGE]]: {
			template: 'DrawTemplate'
		}
	}
	//发送消息
	const onSendMessage = async (value : string, list ?: FileItem[] = []) => {
		if (AiAgentChats.chatList[AiAgentChats.agentId]) {
			let keysLength = Object.keys(AiAgentChats.chatList[AiAgentChats.agentId]).length;
			if (keysLength >= 6) {
				uni.$u.toast('历史记录对应的智能体历史记录不能超过五条，请你清除一条后继续对话！');
				return
			}
		}
		if (!UserStore.userInfo?.token) {
			//如果没有登录则去登录
			uni.navigateTo({
				url: "/pages/my/subPage/login/index"
			})
			return
		}
		if (mainParmas.value.isRecive) {
			//如果正在恢复
			uni.$u.toast('正在回复中,请结束后在进行提问！')
			return
		}
		if (!value) {
			uni.$u.toast('请先输入问题！')
			return
		}
		const fileList = mainParmas.value.fileList
		try {
			const messageItem = addMessage('user', value)
			if (list && list.length > 0) {
				//如果有自带的直接发送的则直接发送 需要进行判断如果有一个未完成则不允许发送
				let hasAllUpload = list.every((item) => item.id)
				if (!hasAllUpload) {
					uni.$u.toast('文件未上传成功请重新上传！')
					mainParmas.value.setIsRecive(false)
					return
				}
				messageItem.files = [...list]
			} else {
				//否则从输入框里面取出文件
				fileList.length > 0 && (messageItem.files = [...fileList])
			}
			AiAgentChats.addMessageList(messageItem)
			const ChatBody : Agent.ChatBody = {
				messages: [{ role: 'user', content: value }],
				assistant_id: AiAgentChats.agentId,
				conversation_id: AiAgentChats.currentConversation_id,
				file_id: list.map((items) => items.id)
			}
			onSend(ChatBody)
			threeKeywords.value = []
		} catch (err) {
			mainParmas.value.setIsRecive(false)
		}
	}
	const addMessage = (role : 'user' | 'system', value : string) => {
		const message : AChat.MessageItem = role == 'user' ? {
			role: 'user',
			id: generateUUID(),
			content: value,
			files: [],
			conversation_id: AiAgentChats.currentConversation_id
		} : {
			role: 'system',
			content: value,
			icon: AiAgentChats.agentItem.avatar,
			id: generateUUID(),
			conversation_id: AiAgentChats.currentConversation_id,
			name: AiAgentChats.agentItem.name,
			description: AiAgentChats.agentItem.description,
			SearchTitle: '',
			aiAgentSearchList: null
		};
		return message
	}
	const onSend = (ChatBody : Agent.ChatBody) => {
		const messageItem = addMessage('system', '')
		const chatMessage = AiAgentChats.messageList
		AiAgentChats.addMessageList(messageItem)
		mainParmas.value.fileList = []
		mainParmas.value.chatValue = ''
		let newStr = ''
		const streamOptions = {
			url: 'https://open.aichatapi.com/api/v1/chat/zhipu.assistant/yfoo.chat',
			data: ChatBody,
			onmessage: async (text : string | { SearchTitle : string } | { aiAgentSearchList : { content : string, link : string, title : string }[] }) => {
				const length = chatMessage.length - 1
				if (typeof text === 'object' && text !== null && 'SearchTitle' in text) {
					loadingWebPage.value = true
					AiAgentChats.changeMessageListSearchTitle(text.SearchTitle)
				}
				if (typeof text === 'object' && text !== null && 'aiAgentSearchList' in text) {
					loadingWebPage.value = false
					AiAgentChats.changeMessageListSAiAgentSearchList(text.aiAgentSearchList)
				}
				if (typeof text == 'string') {
					if (chatMessage[length]?.content.includes(CreateImageDrawLoadding())) {
						AiAgentChats.replaceMessageLists(CreateImageDrawLoadding(), CreateImageDrawComplete())
					}
					const index = messageList.value.length - 1
					newStr += text
					messageList.value[index].content = await mainParmas.value.streamSpark(newStr)
					
				}
			},
			onfinish() {
				console.log('成功')
				AiAgentChats.createNewChatList(AiAgentChats.currentConversation_id)
				getThreeWords()
			},
			onerror(err) {
				if (err?.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
					AiAgentChats.PopMessageList()
				}
				console.log(err, "错误")
			},
			checkNumsType: 'assistant',
			isAiAigent: true
		}
		mainParmas.value.streamRequest(streamOptions)
	}
	const getThreeWords = async () => {
		threeKeywords.value = []
		loaddingKeywords.value = true
		const parmas = {
			assistant_id: AiAgentChats.agentId,
			conversation_id: AiAgentChats.currentConversation_id
		}
		const suggestReq = await $api.post('https://open.aichatapi.com/api/v1/chat/zhipu.assistant/yfoo.suggest', parmas)
		if (suggestReq.code == 200) {

			threeKeywords.value = suggestReq.data
			loaddingKeywords.value = false
		}
	}

	defineExpose({
		onSendMessage
	});
</script>

<style scoped lang="scss">
	.AIAgentChatBox {
		font-size: 27rpx;
	}
</style>