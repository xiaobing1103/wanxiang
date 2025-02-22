<template>
	<view class="ChatTemplate">
		<view class="systemChat">
			<view v-if="model == 'v35'">
				<view class="V35Template">
					👋你好啊，我是{{AppStrName}}AI,很高兴认识你！我可厉害了😎 对话、绘画、写作什么的统统不在话下，想试试吗？
				</view>
			</view>
			<view v-if="model == 'echarts'">
				<EchartsTemplate @onsendTemMessage="onsendTemMessage" />
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { AppStrName } from '@/http';
	import { computed, ref } from 'vue';
	import EchartsTemplate from "@/components/ChatTemplate/EchartsTemplate.vue"
	import useChatStore from '@/store/chat';
	import { storeToRefs } from "pinia"
	const ChatStore = useChatStore();
	const { model } = storeToRefs(ChatStore);
	const emit = defineEmits(['ChatTemplateOnSend']);
	const onsendTemMessage = (val : string) => {
		emit('ChatTemplateOnSend', val)
	}
</script>

<style scoped lang="scss">
	.chatRole {
		display: flex;
	}

	.ChatTemplate {}

	.systemView {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		padding: 10rpx 0;

		&_image {
			width: 100rpx;
			height: 40rpx;
		}
	}

	.systemChat {
		font-size: 30rpx;
		border-radius: 15rpx;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.V35Template {
		background-color: white;
		padding: 15rpx;
		border-radius: 10rpx;
	}
</style>