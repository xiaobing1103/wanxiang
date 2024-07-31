<template>
	<view class="chatBox">
		<view class="chatBox_main" v-for="item in itemMessages" :key="item.id">
			<template v-if="item.messageType === 'text'
				|| item.messageType === 'text2'
				|| item.messageType === 'image'
				|| item.messageType === 'template'">
				<view class="chatBox_main_View"
					:style="{ alignItems: item.target == 'user' ? 'flex-end' : 'flex-start' }">
					<view class="chatBox_main_View_header">
						<template v-if="item.target == 'assistant' || item.target == 'system'">
							<image class="chatBox_main_View_header_image" src="../../static/logo.svg"></image>
						</template>
						<template v-else>
							<!-- <view class="avatar">
								刘
							</view> -->
						</template>
					</view>
					<view class="chatBox_main_View_main" :class="{'chatBox_main_View_main_userMessage':item.target == 'user',
					 'chatBox_main_View_main_systemMessage' : item.target == 'assistant' || item.target =='system',
					 'chatBox_main_View_main_echarts': model == 'echarts' 
					 }
					" :style="{
							marginLeft: item.target === 'user' ? '0' : '20rpx',
							marginRight: item.target === 'user' ? '20rpx' : '0',
							padding: item.messageType == 'text' || item.messageType == 'text2' ? '15rpx' : '0',
							background: item.messageType == 'template' ||	item.messageType == 'image' ? 'transparent' : 'white',
							minWidth: item.messageType =='template' || item.messageType == 'image' ? '1%' :'100%'
						}">
						<template v-if="item.state == 'waite' && item.message.length <= 0">
							<up-loading-page :loading="true"></up-loading-page>
						</template>
						<template class="" v-else>
							<!-- 模版类型为image -->
							<template v-if="item.messageType == 'image'">
								<view class="iamge_album">
									<up-album :urls="[item.message]"></up-album>
								</view>
							</template>
							<!-- 模版类型不为image -->
							<template v-else>
								<!-- 模版类型为text 和 text2 -->
								<template v-if="item.messageType === 'text' || item.messageType === 'text2'">
									<!-- 消息不为用户 且 消息是系统发送的 需要遍历循环消息显示的 且消息状态不为等待 -->
									<template
										v-if="item?.target !== 'user' && item?.target == 'assistant' && item.state !== 'waite'">
										{{item.message}}
										<!-- <MessageItem state={item.state} key={item.id} message={item.message}
												setContent={setContent} model={model} /> -->
									</template>
									<template v-else>
										<!-- 如果消息为用户而且 模式为图表模式的 -->
										<template v-if="item?.target == 'user' || model == 'echarts'">
											<view v-html="item.message"></view>
										</template>
										<template v-else>
											<!-- <MessageItem state={item.state} key={item.id} message={item.message}
													setContent={setContent} model={model} /> -->
											{{item.message}}
										</template>
									</template>
								</template>
								<!-- 模版类型不为text 和 text2 直接渲染-->
								<template v-else>
									<!-- 渲染判断初始化模版 -->
									<template v-if="item.message == 'v35Template'">
										<V35Template />
									</template>
									<template v-if="item.message == 'v40Template'">
										<V40Template />
									</template>
								</template>
							</template>
						</template>
					</view>
				</view>
			</template>
			<template v-else>
				{{item.message}}
			</template>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { ItemMessage, MessagesTemplate, chatConfigProps } from '../../type/chatData';
	import { defineProps, watch } from 'vue';
	import useChatStore from '@/store/chat';
	import V35Template from "@/components/ChatTemplate/V35Template.vue"
	import V40Template from "@/components/ChatTemplate/V40Template.vue"

	import { GenNonDuplicateID } from '../../tools/uuid';
	const { model } = useChatStore()
	const props = defineProps({
		config: {
			type: Object,
			required: true
		}
	});
	// 使用 watch 来监视 config 的变化
	watch(() => props.config, (newConfig) => {
		console.log('Config updated:', newConfig);
	}, { deep: true, immediate: true });

	// 创建一个气泡ID
	const createId = () => {
		return GenNonDuplicateID(472427503);
	}
	const getMessagesTemplate = () => {
		const messages : ItemMessage[] = []
		if (props.config?.messagesTemplate) {
			props.config.messagesTemplate.map((item : MessagesTemplate) => {
				messages.push({
					id: createId(),
					state: 'waite',
					target: item.role,
					message: item.message || item.template,
					messageType: item.MessageType || 'template',
				})
			})

		}
		return messages
	}
	const itemMessages = ref<ItemMessage[]>([...getMessagesTemplate()])

	console.log(itemMessages.value)
</script>

<style lang="scss" scoped>
	.chatBox {
		height: 100%;
		position: relative;
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
			font-size: 25rpx;
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