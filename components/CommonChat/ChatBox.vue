<template>
	<view class="chatBox">
		<view class="chatBox_main" v-for="[key, item] in messageList" :key="key">
			<template v-if="item.messageType">
				<view class="chatBox_main_View"
					:style="{ alignItems: item.target == 'user' ? 'flex-end' : 'flex-start' }">
					<view class="chatBox_main_View_header">
						<template
							v-if="item.target == 'assistant' || (item.target == 'system' && messageList.size == 1)">
							<image class="chatBox_main_View_header_image" src="../../static/logo.svg"></image>
						</template>
						<template v-else>
							<!-- <view class="avatar">
											刘
										</view> -->
						</template>
					</view>
					<!-- 如果为模板得情况 -->
					<template v-if="item.target == 'system'">
						<view v-if="messageList.size == 1" class="chatBox_main_View_main">
							<template v-if="item.messageType == 'template'">
								<V35Template @onFun="receivedFun" @onTemplates="onTemplates" />
							</template>
							<template v-if="item.messageType == 'image'">
								<view class="iamge_album">
									<up-album class="iamge_album_sty" :urls="[item.message]" keyName="src2"></up-album>
								</view>
							</template>
							<template v-if="item.messageType == 'text2'">
								<view class="messageTemplate">
									{{ item.message }}
								</view>
							</template>
						</view>
					</template>
					<!-- 如果不为模板的情况 -->

					<template v-else>
						<view class="chatBox_main_View_main" :class="{
								chatBox_main_View_main_userMessage: item.target == 'user',
								chatBox_main_View_main_systemMessage: item.target == 'assistant',
								chatBox_main_View_main_echarts: model == 'echarts'
							}" :style="{
								marginLeft: item.target === 'user' ? '0' : '20rpx',
								marginRight: item.target === 'user' ? '20rpx' : '0',
								padding: item.messageType == 'text' || item.messageType == 'text2' ? '15rpx' : '0',
								background: item.messageType == 'template' || item.messageType == 'image' ? 'transparent' : 'white',
								minWidth: item.messageType == 'template' || item.messageType == 'image' ? '1%' : '100%',
								wordBreak: 'break-all'
							}">
							<template v-if="item.state == 'waite' && item.message.length <= 0">
								<!-- 在消息为等待请求完成时候 -->
								<up-loading-icon mode="semicircle"></up-loading-icon>
							</template>
							<template v-else>
								<!-- 模版类型为image -->
								<template v-if="item.messageType == 'image'">
									<view class="iamge_album">
										<up-album class="iamge_album_sty" :urls="[item.message]"
											keyName="src2"></up-album>
										<!-- <image :src="item.message" fade-show></image> -->
									</view>
								</template>
								<!-- 模版类型不为image -->
								<template v-else>
									<!-- 模版类型为text 和 text2 -->
									<template v-if="item.messageType === 'text' || item.messageType === 'text2'">
										<!-- 消息不为用户 且 消息是系统发送的 需要遍历循环消息显示的 且消息状态不为等待 -->
										<template v-if="item.target == 'assistant' && item.state !== 'waite'">
											<view style="width: 100%">

												<MessageItem :content="item.message" />


												<!-- 模版下面逻辑组件 -->
												<ChatEelseHandler ref="ChatEelseHandlerRef" @passUp="handlePassUp"
													:msgId="item.id" :text="item.message" />
												<!--  v-model:currentAsk="currentAsk"  -->
											</view>
										</template>
										<template v-else>
											<!-- 如果消息为用户而且 模式为图表模式的 -->
											<template v-if="item.target == 'user' || model == 'echarts'">
												<view v-html="item.message"></view>
											</template>
											<template v-else>
												<view style="width: 100%">
													<MessageItem :content="item.message" />
												</view>
											</template>
										</template>
									</template>
								</template>
							</template>
						</view>
					</template>
				</view>
			</template>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import useChatStore from '@/store/chat';
	import V35Template from '@/components/ChatTemplate/V35Template.vue';
	import MessageItem from '@/components/CommonChat/MessageItem.vue';
	import ChatEelseHandler from '@/components/CommonChat/ChatEelseHandler.vue';
	import { ItemMessage, MessageItems } from '../../type/chatData';
	import { onMounted, ref, watch } from 'vue';
	import { generateUUID } from '../../tools/uuid';
	import { storeToRefs } from 'pinia';
	import { TemplateConfig, noHistoryArr } from '../../pages/chat/chatConfig';
	const ChatStore = useChatStore();
	const { model, selectChatId } = storeToRefs(ChatStore);
	const emit = defineEmits(['passToGrandparent']);
	const handlePassUp = (value) => {
		emit('passToGrandparent', value);
	};
	const ChatEelseHandlerRef = ref(null);
	const onTemplates = (e) => {
		console.log(e);
	};
	// 获取初始消息模版
	const getInitTemplate = () => {
		const maps = new Map();
		TemplateConfig[model.value].messagesTemplate.map((item, index) => {
			const id = generateUUID();
			item.id = id;
			maps.set(item.id, {
				id: id,
				state: 'ok',
				target: item.role,
				message: item.message || item.template,
				messageType: item.messageType || 'template'
			});
		});
		return maps;
	};
	//所有的消息集合
	const messageList = ref<MessageItems>(new Map());
	// 切换模型的监听
	// watch(model, (val) => {
	// 	messageList.value = getInitTemplate()
	// }, { immediate: true })

	//清空全部message
	const clearAllMessage = () => {
		// messageList.value.clear()
		messageList.value = getInitTemplate();
	};

	watch(
		selectChatId,
		(val) => {
			if (noHistoryArr.includes(model.value)) return
			const currentMsg = ChatStore.chats.find((item) => item.id == val).data;
			if (currentMsg.length > 0) {
				messageList.value.clear();
				setTimeout(() => {
					currentMsg.forEach((item : ItemMessage, index : number) => {
						messageList.value.set(item.id, item);
					});
				}, 500);
			} else {
				messageList.value = getInitTemplate();
			}
		},
		{ immediate: true }
	);

	//新增一个消息
	const addMessage = (id : string, value : ItemMessage) => {
		messageList.value.set(id, value);
	};
	//改变message内容
	const setMessage = (id : string, setItems : ItemMessage) => {
		const currentMessage = messageList.value.get(id);
		if (!currentMessage) return;
		const newMessage : ItemMessage = {
			message: currentMessage.message + setItems.message,
			...setItems
		};
		messageList.value.set(id, newMessage);
	};
	//删除一个message
	const deleteMessage = (id : string) => {
		messageList.value.delete(id);
	};

	// 获取单个消息
	const getSingelMessage = (id : string) => {
		return messageList.value.get(id);
	};

	// 获取上一个消息
	const getPrevSingelMessage = (id) => {
		let prevMessage = null; // 用来存储上一个消息
		for (let [key, value] of messageList.value) {
			if (key === id) {
				return prevMessage; // 如果找到当前消息，返回上一个消息
			}
			prevMessage = value; // 更新上一个消息为当前的 value
		}
		return null; // 如果没找到返回 null
	};

	// 获取所有消息历史记录并拼装
	const getAllHistoryMessage = (requestData : {
		role : string;
		content : string;
	}[], id : string) => {
		const historyData = []
		messageList.value.forEach((value, key) => {
			// 过滤掉 role 等于 system 的数据
			if (value.target !== 'system' && id !== key) {
				const paramItem = {
					role: value.target,
					content: value.message
				};
				historyData.push(paramItem);
			}
		});
		const combinedData = [...historyData, ...requestData];
		const paramsString = JSON.stringify(combinedData);
		return paramsString
	}


	onMounted(() => {
		messageList.value = getInitTemplate();

	});
	defineExpose({
		addMessage,
		deleteMessage,
		clearAllMessage,
		setMessage,
		getSingelMessage,
		messageList,
		getPrevSingelMessage,
		getAllHistoryMessage
	});
</script>

<style lang="scss" scoped>
	.chatBox {
		height: 100%;
		position: relative;
		padding: 20rpx 0;
		box-sizing: border-box;
	}

	.chatBox_main_View {
		display: flex;
		flex-direction: column;

		&_header {
			display: flex;
			padding: 10rpx;

			&_image {
				height: 30rpx;
				width: 100rpx;
			}
		}

		&_main {
			display: flex;
			box-sizing: border-box;
			font-size: 27rpx;
			border-radius: 10rpx;

			&_userMessage {
				min-width: 4% !important;
				max-width: 70% !important;
				background: #95ec69 !important;
			}

			&_systemMessage {
				max-width: 80% !important;
				min-width: 6% !important;
			}

			&_echarts {
				min-width: 80% !important;
			}

			&_image {
				height: 200rpx;
				width: 300rpx;
			}

			&_view {
				display: flex;
			}
		}
	}

	.iamge_album {
		height: max-content;
		width: 500rpx;
	}

	.messageTemplate {
		background-color: white;
		padding: 10rpx;
		border-radius: 10rpx;
	}

	.avatar {
		background-color: #a324ec;
		font-size: 30rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: wheat;
		height: 60rpx !important;
		width: 60rpx !important;
	}
</style>