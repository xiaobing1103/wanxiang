<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<ChatBox ref="ChatBoxRef" />

		<template #bottom>
			<!-- 气泡选择 -->
			<ChatInputToolTipVue @change="sendValue" />
			<!-- 聊天输入框 -->
			<Chat v-model:chatValue="chatValue" @onSend="onSend" v-model:dataValue="data" @update="changeData" />
			<!-- <up-input v-model="chatValue" @changeData="changeData">修改子组件的数据</up-input> -->
		</template>
	</z-paging>
	<CommonModelSeleted />
	<HistoryMessage />
</template>

<script setup lang="ts">
	import Chat from "@/components/CommonChat/Chat.vue"
	import CommonModelSeleted from "@/components/CommonChat/CommonModelSeleted.vue"
	import HistoryMessage from "@/components/CommonChat/HistoryMessage.vue"
	import CommonHeader from '@/components/CommonHeader.vue'
	import ChatInputToolTipVue from '@/components/CommonChat/ChatInputToolTip.vue'
	import { nextTick, onMounted, ref, watch } from "vue";
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	import { TemplateConfig } from '../chat/chatConfig'
	import { useChatStore } from "../../store";
	import { ItemMessage, MessageItems, MessageType, MessagesTemplate, StateType, TargetType, chatConfigProps } from "../../type/chatData";
	import { GenNonDuplicateID } from "../../tools/uuid";
	import ChatBox from '@/components/CommonChat/ChatBox.vue'
	import { HttpStatusMessage } from "../../api/http";
	import { storeToRefs } from "pinia"
	import { ToolTipItem } from "../../api/types"
	import { commonModel } from "../../config/modelConfig"
	const { $api } = useGlobalProperties()
	const ChatStore = useChatStore();
	const { model, setModel } = storeToRefs(ChatStore);

	const chatValue = ref('')

	const data = ref("Hello World")
	const ChatBoxRef = ref<InstanceType<typeof ChatBox>>(null)
	// 通过调用该事件完成修改数据的操作
	const changeData = (value : string) => {
		data.value = value
	}
	const srollRef = ref(null)
	onMounted(() => {
		scrollToBottom()
	})
	const scrollToBottom = () => {
		nextTick(() => {
			if (srollRef.value) {
				srollRef.value.scrollToBottom()
			}
		})
	}
	// 创建一个气泡ID
	const createId = () => {
		return GenNonDuplicateID(472427503);
	}
	const sendValue = (val : ToolTipItem) => {
		onSend(val.prompt)
	}
	// const getMessagesTemplate = () => {
	// 	const messages : MessageItems = new Map()
	// 	if (TemplateConfig[model]?.messagesTemplate) {
	// 		const id = createId()
	// 		TemplateConfig[model]?.messagesTemplate.map((item : MessagesTemplate) => {
	// 			messages.set(id, {
	// 				id: id,
	// 				state: 'waite',
	// 				target: item.role,
	// 				message: item.message || item.template,
	// 				messageType: item.messageType || 'template',
	// 			})
	// 		})

	// 	}
	// 	return messages
	// }
	// const itemMessages = ref<MessageItems>(getMessagesTemplate())

	// const addMessage = (state : StateType, target : TargetType, message : any, messageType : MessageType = 'text', id ?: string,) => {
	// 	id = id ? id : createId()
	// 	itemMessages.value = [...itemMessages.value, { id: id, state, target, message, messageType }]
	// 	scrollToBottom();
	// 	return id
	// }
	// const setItemMessage = () => {

	// }

	const onSend = async (val) => {
		if (!val) {
			uni.$u.toast('请先输入内容！')
			return
		}

		ChatBoxRef.value.addMessage(createId(),
			{ id: createId(), state: "ok", target: 'user', message: val, messageType: 'text' },
		)
		const requestData = [{
			role: 'user',
			content: val
		}]

		const options = {
			url: commonModel[model.value].ModelApi,
			method: "POST",
			data: {
				params: JSON.stringify(requestData),
				prompt: "请以中文回复我 官方设置的默认角度，适用于日常生活工作的询问与回答，权重均衡",
				type: "Web-推荐对话"
			}
		};
		scrollToBottom()
		chatValue.value = ''

		handleStream(options)
	}

	const onLoad = () => {
		console.log(123)
	}
	// 解析当前流得判断成分
	const handlerCurrentStream = (currentMessages : ItemMessage) => {
		const linesmsg = currentMessages.message
		if (linesmsg.replaceAll(',', '') === '[SUCCESS]') {
			uni.$u.toast('网络异常，请重启路由器后重试。')
		} else if (linesmsg.startsWith('[NO_COUNT]')) {
			const errorMessage = linesmsg.split(',')[1]
			uni.$u.toast(errorMessage)

		}
	}
	// 流在进行中进行判断逻辑 	
	const StreamLoading = (msg : string) => {
		// let newMsg = msg.replaceAll('\n', '')

		if (msg !== '[SUCCESS]') {
			return msg
		}

	}


	async function handleStream(options) {
		let result = ''
		let newMsg = ''
		const id = createId()
		ChatBoxRef.value.addMessage(id, { id: id, state: 'waite', target: 'assistant', message: result, messageType: 'text' })

		//#ifdef MP-WEIXIN
		const requestTask = await $api.getStream(options.url, options.data, true,
			(response : Promise<UniApp.RequestSuccessCallbackResult>) => {
				response.then((res) => {
					if (res.statusCode == 200) {
						const currentMessage = ChatBoxRef.value.getSingelMessage(id)
						handlerCurrentStream(currentMessage)
					} else {
						uni.$u.toast('请先登录账户！')
						ChatBoxRef.value.deleteMessage(id)
					}
				})

			},
			(err) => { console.log(err) });
		// requestTask.onHeadersReceived((res) => {

		// });
		requestTask.onChunkReceived(async (res) => {
			let decoder = new TextDecoder('utf-8');
			let text = decoder.decode(new Uint8Array(res.data));

			const lines = text.split('\n')
			result += lines;
			for (let i = 0; i < lines.length; i++) {
				if (lines[i]) {
					const chunk = lines[i].replaceAll('\\n', '\n')
					if (result.length != 0 && chunk !== '[SUCCESS]') {
						newMsg += StreamLoading(chunk)
					}
				}
			}

			ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: newMsg, messageType: 'text' })

			scrollToBottom()
		});
		// #endif
		//#ifdef H5
		await $api.getStream(options.url, options.data, true,
			(chunk) => {
				result += chunk
				scrollToBottom()
				if (chunk !== null) {
					newMsg = StreamLoading(result)
					ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: newMsg, messageType: 'text' })
				}
				if (chunk == null) {
					console.log('H5端流获取完成')
				}
			},
			(error) => {
				uni.$u.toast(error)
				ChatBoxRef.value.deleteMessage(id)
			});
		//#endif
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column
	}
</style>