<template>
	<view class="chatBox">
		<view class="chatBox_main" v-for="[key, item] in messageList" :key="key">
			<template v-if="item.messageType">
				<view class="chatBox_main_View"
					:style="{ alignItems: item.target == 'user' ? 'flex-end' : 'flex-start' }">
					<view class="chatBox_main_View_header">
						<template
							v-if="item.target == 'assistant' || (item.target == 'system' && messageList.size == 1)">
							<image v-if="!ChatStore.isDeepSeekModels.includes(model)"
								class="chatBox_main_View_header_image"
								:style="{width:AppName == 'bianjie' ? '50rpx' : '50rpx'}"
								:src="commonModel[model].modelIcon">
							</image>
							<template v-else>
								<view class="OverdeepSeekThinkBox">
									<view class="OverdeepSeekThinkBox_top">
										<image style="width:80rpx;height:50rpx;" :src="commonModel[model].modelIcon"
											mode="">
										</image>
										<template v-if="ChatStore.isDeepSeekR1ChatModels.includes(model)">
											<view class="deepSeekThinkBox"
												v-if="item.reasoning_assistant && item.reasoning_assistant !=='noStart'">
												<image class="deepSeekThinkBox_SvgIcon"
													:src="$assets.DeepSeekModalThinkIngIcon" mode=""></image>
												<text class="deepSeekThinkBox_text"
													@click="item.isShowDeepSeekThinks = !item.isShowDeepSeekThinks">
													<template v-if="item.reasoning_assistant == 'isLoading'">
														{{ '深度思考中 ......'  }}
													</template>
													<template v-if="item.reasoning_assistant == 'done'">
														{{ `已深度思考（用时${item.thinkTime || 0}秒）` }}
													</template>
												</text>
												<up-icon size="12" class="deepSeekThinkBox_icon"
													:name="item.isShowDeepSeekThinks?'arrow-down':'arrow-up'"></up-icon>
											</view>
										</template>
									</view>
									<view class="OverdeepSeekThinkBox_Bottom" v-if="item.isShowDeepSeekThinks">
										{{item.reasoning_content}}
									</view>
								</view>
							</template>
						</template>
						<template v-else>
							<!-- <view class="avatar">刘立</view> -->
						</template>
					</view>
					<!-- 如果为模板得情况 -->
					<template v-if="item.target == 'system'">
						<view v-if="messageList.size == 1" class="chatBox_main_View_main">
							<template v-if="item.messageType == 'template'">
								<ChatTemplate @ChatTemplateOnSend="ChatTemplateOnSend" />
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
								padding: item.messageType == 'text' || item.messageType == 'text2' ? '10rpx' : '0',
								background: item.messageType == 'template' || item.messageType == 'image' ? 'transparent' : 'transparent',
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
												<MessageItem :uType="item.echartsType" :content="item.message" />
												<!-- 模版下面逻辑组件 -->
												<ChatEelseHandler @passUp="handlePassUp" :msgId="item.id"
													:text="item.message" />
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
													<MessageItem :uType="item.echartsType" :content="item.message" />
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
	import ChatTemplate from './ChatTemplate.vue';
	import MessageItem from './MessageItem.vue';
	import ChatEelseHandler from './ChatEelseHandler.vue';
	import { ItemMessage, MessageItems } from '@/type/chatData';
	import { onMounted, ref, watch } from 'vue';
	import { generateUUID } from '@/tools/uuid';
	import { storeToRefs } from 'pinia';
	import { AppName } from '@/http';
	import { commonModel } from '@/config/modelConfig';
	import { TemplateConfig, noHistoryArr } from '@/pages/chat/chatConfig';
	const ChatStore = useChatStore();
	const { model, selectChatId, messageList } = storeToRefs(ChatStore);
	const emit = defineEmits(['passToGrandparent', 'echartsOnsendMessage']);
	const handlePassUp = (value) => {
		emit('passToGrandparent', value);
	};
	const IsHasChatOverMessage = defineModel('IsHasChatOverMessage')

	const openThinkMessages = () => {
		console.log(123123)
	}

	// 切换模型的监听
	const uType = ref('')

	const ChatTemplateOnSend = (val : any) => {
		const { uchartsType } = val
		uType.value = uchartsType
		emit('echartsOnsendMessage', val)
	}

	//清空全部message
	const clearAllMessage = () => {
		// messageList.value.clear()
		messageList.value = ChatStore.getInitTemplate();
	};

	watch(
		model,
		(val) => {
			if (noHistoryArr.includes(model.value)) return
			messageList.value = ChatStore.getInitTemplate();

		},
		{ immediate: true }
	);

	// watch(
	// 	selectChatId,
	// 	(val) => {
	// 		if (noHistoryArr.includes(model.value)) return
	// 		messageList.value = getInitTemplate();
	// 		IsHasChatOverMessage.value = true
	// 		const currentMsg = ChatStore.chats.find((item) => item.id == val).data;
	// 		if (currentMsg.length > 0) {
	// 			messageList.value.clear();
	// 			setTimeout(() => {
	// 				currentMsg.forEach((item : ItemMessage, index : number) => {
	// 					messageList.value.set(item.id, item);
	// 				});
	// 				IsHasChatOverMessage.value = false
	// 			}, 1000);
	// 		} else {
	// 			messageList.value = getInitTemplate();
	// 			IsHasChatOverMessage.value = true
	// 		}
	// 	},
	// 	{ immediate: true }
	// );


	//新增一个消息
	const addMessage = (id : string, value : ItemMessage) => {
		messageList.value.set(id, value);
		// ChatStore.addchats({
		// 	id: generateUUID(),
		// 	iconUrl: commonModel[model.value].modelIcon,
		// 	title: commonModel[model.value].title,
		// 	data: [],
		// 	model: model.value
		// })
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
		let paramsString : any = combinedData
		if (!ChatStore.isDeepSeekModels.includes(model.value)) {
			paramsString = JSON.stringify(combinedData);
		}

		return paramsString
	}


	onMounted(() => {
		messageList.value = ChatStore.getInitTemplate();
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
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.chatBox_main_View {
		display: flex;
		flex-direction: column;

		&_header {
			display: flex;
			padding: 10rpx;
			width: 100%;

			&_image {
				height: 50rpx;
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
				max-width: 94% !important;
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
		width: max-content;
		min-width: 200rpx;
		overflow: hidden;
		border-radius: 10rpx;

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

	.deepSeekThinkBox {
		display: flex;
		margin: 5rpx 20rpx;
		padding: 10rpx 20rpx;
		background-color: #e5e5e5;
		border-radius: 10rpx;
		align-items: center;

		&_SvgIcon {
			width: 30rpx;
			height: 40rpx;
			padding-right: 20rpx;
		}

		&_text {
			font-size: 24rpx;
		}

		&_icon {
			padding-left: 20rpx;
		}
	}

	.OverdeepSeekThinkBox {
		display: flex;
		flex-direction: column;
		width: 100%;

		&_top {
			width: 100%;
			display: flex;
		}

		&_Bottom {
			color: #8b8b8b;
			white-space: pre-wrap;
			margin: 0;
			padding: 0 0 0 13px;
			line-height: 40rpx;
			position: relative;
			font-size: 24rpx;
			border-left: 5rpx solid #d0d0d0;
			width: 100%;
			overflow-wrap: break-word;
			/* 优先在单词内换行 */
			word-break: break-word;
			/* 兼容性处理 */
			hyphens: auto;
			/* 启用连字符（需lang属性支持） */
			max-width: 100%;
			/* 容器宽度约束 */
		}
	}
</style>