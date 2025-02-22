<template>
	<view class="NewIndexModelChange">
		<view class="NewIndexModelChangeBox">
			<template v-for="(items,index) in showIndexModel" :key="index">
				<view class="items" @click="toChatModel(items)">
					<image class="icon" :src="commonModel[items].modelIcon" mode=""></image>
					<text class="text"> {{commonModel[items].NormalTitle}}</text>
				</view>
			</template>
			<view class="items" @click="opeChangeModel">
				<up-icon name="grid" size="20"></up-icon>
				<text class="text">更多</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { useChatStore } from '../../store';
	import { generateUUID } from '@/tools/uuid';
	import { commonModel } from '@/config/modelConfig';
	import { ModelType } from '@/type/chatData';

	const showIndexModel : ModelType[] = ['v35', 'DeepSeek_V3', 'v40']

	const ChatStore = useChatStore()
	const toChatModel = (model : ModelType) => {
	
	
	
		ChatStore.setModel(model)

		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/index/subPage/AllChatPage/index'
			})
		}, 500)
	}
	const opeChangeModel = () => {
		ChatStore.setOpenSeletedModel(true)
	}
</script>

<style lang="scss" scoped>
	.NewIndexModelChange {
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border-radius: 50rpx;
		min-height: 80rpx;
		margin: 20rpx 30rpx;
		display: flex;
		align-items: center;

		.NewIndexModelChangeBox {
			display: flex;
			align-items: center;
			height: 100%;
			justify-content: space-between;

			.items {
				display: flex;
				align-items: center;
				margin: 0 20rpx;

				.icon {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}

				.text {
					font-size: 26rpx;
				}

			}
		}
	}
</style>