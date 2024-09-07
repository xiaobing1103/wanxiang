<template>

	<view class="ChatTemplate">
		<view class="systemChat">
			<view v-if="model == 'v35'">
				<V35Template />
			</view>
			<view v-if="model == 'v40'">
				<v40Template />
			</view>

			<view v-if="model == 'echarts'">
				<EchartsTemplate @onsendTemMessage="onsendTemMessage" />
			</view>
		</view>
	</view>



</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import V35Template from '@/components/ChatTemplate/V35Template.vue';
	import V40Template from "@/components/ChatTemplate/V40Template.vue"
	import EchartsTemplate from "@/components/ChatTemplate/echartsTemplate.vue"
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
	/* 你的样式 */
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
</style>