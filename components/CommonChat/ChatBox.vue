<template>
	<view class="chatBox">
		<view class="chatBox_main" v-for="item in itemMessages">
			<template v-if="item.messageType === 'text'
				|| item.messageType === 'text2'
				|| item.messageType === 'image'
				|| item.messageType === 'template'">
				<view class="userView">
					<view class="userView_header" :style="{ order: item.target == 'user' ? 2 : 1 }">
						<view class="">
							<p v-if="item.target == 'assistant' || item.target == 'system'">
								<image src="../../static/logo.svg"></image>
							</p>
							<p v-else>我</p>
						</view>

						<view class="" :style="{
							order: item.target === 'user' ? 1 : 2,
							marginLeft: item.target === 'user' ? '0' : '20rpx',
							marginRight: item.target === 'user' ? '20rpx' : '0',
							padding: item.messageType == 'text' ||
								item.messageType == 'text2' ? '10rpx' : '0',
							background: item.messageType == 'template' &&
								item.templateType == 'image' ? 'transparent' : 'white',
						}">
							<template v-if="item.state == 'waite' && item.message.length <= 0">
								<up-loading-page :loading="true"></up-loading-page>
							</template>


							<template class="" v-else>
								<template v-if="item.messageType == 'image'">
									<image :src="item.message" mode=""></image>
								</template>
								<template v-else>
									<template v-if="item.messageType === 'text' || item.messageType === 'text2'">
										<template v-if="item?.target !== 'user' &&
											item?.target == 'assistant' &&
											item.state !== 'waite'">

											<!-- <MessageItem state={item.state} key={item.id} message={item.message}
												setContent={setContent} model={model} /> -->
										</template>
										<template v-if="item?.target == 'user' || model == 'echarts'">
											<div v-html="item.message"></div>
										</template>
										<template v-else>
											<!-- <MessageItem state={item.state} key={item.id} message={item.message}
												setContent={setContent} model={model} /> -->
										</template>

									</template>

									<template>{{ item.message }}</template>

								</template>



							</template>

						</view>
					</view>
				</view>
			</template>

			<template v-else>
				<view>1234567489</view>
			</template>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ItemMessage, chatConfigProps } from '../../type/chatData';
import { defineProps, watch } from 'vue';

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
const createId = (): string => {
	if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID()
	return 'id-' + Date.now().toString(36) + Math.random().toString(36).substring(2)
}
const getMessagesTemplate = () => {
	const messages: ItemMessage[] = []
	if (props.config?.messagesTemplate) {
		props.config.messagesTemplate.map((item) => {
			messages.push({
				id: createId(),
				state: 'ok',
				target: item.role,
				message: item.template,
				messageType: 'template',
				templateType: item.templateType || 'template'
			})
		})

	}
	return messages
}
const itemMessages = ref<ItemMessage[]>([...getMessagesTemplate()])

console.log(itemMessages.value)
</script>

<style lang="scss" scoped>
.userView {
	&_header {}
}
</style>