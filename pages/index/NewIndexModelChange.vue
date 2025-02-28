<template>
	<view class="NewIndexModelChange">
		<view class="NewIndexModelChangeBox">
			<template v-for="(items,index) in showIndexModel" :key="index">
				<view class="items" @click="toChatModel(items)">
					<image class="icon" :src="commonModel[items].modelIcon" mode=""></image>
					<text class="text"> {{commonModel[items].NormalTitle}}</text>
				</view>
			</template>
			<view class="items ChangeItems" @click="opeChangeModel">
				<!-- <up-icon name="grid" size="20"></up-icon> -->
				<image class="modelIcon" :src="$assets.Change_Model_Icon" mode=""></image>
				<text class="text">切换</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { useChatStore } from '../../store';
	import { generateUUID } from '@/tools/uuid';
	import { commonModel } from '@/config/modelConfig';
	import { ModelType } from '@/type/chatData';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';

	const { $assets } = useGlobalProperties()
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
		box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.13);
		border-radius: 50rpx;
		min-height: 80rpx;
		margin: 20rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.NewIndexModelChangeBox {
			display: flex;
			align-items: center;
			height: 100%;
			justify-content: space-between;

			.ChangeItems {
				color: $aichat-placeholader-color;

				.modelIcon {
					height: 20rpx;
					width: 20rpx;
					padding: 0 5rpx;
				}
			}

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