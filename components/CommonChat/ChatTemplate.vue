<template>

	<template v-for="items in selectedTemplate">
		<view class="ChatTemplate">
			<view class="chatRole">
				<template v-if="items.role == 'system'">
					<view class="systemView">
						<image class="systemView_image" src="../../static/logo.svg" mode=""></image>
					</view>
				</template>

			</view>
			<view class="systemChat">
				<view v-if="model == 'v35'">
					<V35Template :onFun="setContent" :onTemplates="checkUserToken" />
				</view>
				<view v-if="model == 'v40'">
					<V35Template :onFun="setContent" :onTemplates="checkUserToken" />
				</view>
			</view>
		</view>

	</template>

</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import V35Template from '../ChatTemplate/V35Template.vue';
	import V40Template from '../ChatTemplate/V40Template.vue'; // 假设你有这个组件
	import useChatStore from '@/store/chat';
	const ChatStore = useChatStore();
	const { model, setModel } = ChatStore;
	const TemplateConfig = {
		v35: {
			messagesTemplate: [
				{
					role: 'system',
					template: V35Template
				},
			]
		},
		v40: {
			messagesTemplate: [
				{
					role: 'system',
					template: V40Template
				}
			]
		}
	};

	const selectedTemplate = computed(() => TemplateConfig[model].messagesTemplate)

	console.log(selectedTemplate.value)
	const setContent = (str : string) => {
		console.log('setContent called with:', str);
	};

	const checkUserToken = (message : string) => {
		console.log('checkUserToken called with:', message);
		// 这里处理 checkUserToken 的逻辑
	};
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
		background-color: white;
		font-size: 30rpx;
		border-radius: 15rpx;
		padding: 10rpx;
		box-sizing: border-box;
	}
</style>