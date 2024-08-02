<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<ChatBox ref="ChatBoxRef" :config="reactiveConfig[model]" />

		<template #bottom>
			<!-- 气泡选择 -->
			<ChatInputToolTipVue />
			<!-- 聊天输入框 -->
			<Chat v-model:chatValue="chatValue" @onSend="onSend" v-model:dataValue="data" @update="changeData" />
			<!-- <up-input v-model="chatValue" @changeData="changeData">修改子组件的数据</up-input> -->
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import Chat from "@/components/CommonChat/Chat.vue"
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonChat from '@/components/CommonChat/index.vue'
	import ChatInputToolTipVue from '@/components/CommonChat/ChatInputToolTip.vue'
	import { nextTick, onMounted, ref, watch } from "vue";
	import { useGlobalProperties } from '../../hooks/useGlobalHooks';
	import { TemplateConfig } from '../chat/chatConfig'
	import { useChatStore } from "../../store";
	import { ItemMessage, MessageItems, MessageType, MessagesTemplate, StateType, TargetType } from "../../type/chatData";
	import { GenNonDuplicateID } from "../../tools/uuid";
	import ChatBox from '@/components/CommonChat/ChatBox.vue'
	const { $api } = useGlobalProperties()
	const { model, setModel } = useChatStore();
	const chatValue = ref('')
	const reactiveConfig = ref(TemplateConfig)
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
		ChatBoxRef.value.addMessage(createId(),
			{ id: createId(), state: "ok", target: 'user', message: val, messageType: 'text' },
		)
		const requestData = [{
			role: 'user',
			content: val
		}]

		const options = {
			url: 'api/v1/chat2/v35',
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

	async function handleStream(options) {
		let result = ''
		const id = createId()
		ChatBoxRef.value.addMessage(id, { id: id, state: 'waite', target: 'assistant', message: result, messageType: 'text' })


		//#ifdef MP-WEIXIN
		const requestTask = await $api.getStream(options.url, options.data, true,
			(res) => {
				console.log(res)
				if (res.statusCode == 200) {
					console.log('小程序流获取完成')
				} else {
					uni.$u.toast('请先登录账户！')
					ChatBoxRef.value.deleteMessage(id)
				}
			},
			(err) => { console.log(err) });
		// requestTask.onHeadersReceived((res) => {

		// });
		requestTask.onChunkReceived((res) => {
			let decoder = new TextDecoder('utf-8');
			let text = decoder.decode(new Uint8Array(res.data));
			result += text
			ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: result, messageType: 'text' })
			scrollToBottom()
		});

		// #endif
		//#ifdef H5
		await $api.getStream(options.url, options.data, true,
			(chunk) => {
				result += chunk
				ChatBoxRef.value.setMessage(id, { id: id, state: 'ok', target: 'assistant', message: result, messageType: 'text' })
				scrollToBottom()
				if (chunk == null) {
					console.log('H5端流获取完成')
				}
			},
			(error) => {
				console.error('Stream error:', error);
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