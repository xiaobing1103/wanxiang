<template>
	<view class="tipBox">
		<scroll-view :show-scrollbar="false" style="flex-1" scroll-x>
			<view class="NewChatInputToolTip">
				<view v-for="(items,index) in seletedModels" :key="index">
					<view class="NewChatInputToolTip_items" @click="topath(items)">
						<view class="isNew" v-if="items.isNews">new</view>
						<image class="NewChatInputToolTip_items_image" :src="items.icon" alt="" />
						<text>{{items.title}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { useChatStore } from '@/store';
	import { seletedModels } from '@/config/modelConfig';
	const ChatStore = useChatStore()
	const topath = (items : any) => {
		if (items.path) {
			uni.navigateTo({
				url: items.path
			})
		}
		if (items.isDeepSeekModelTag) {
			ChatStore.setOpenDeepSeekModel(true)
		}
	}
</script>

<style lang="scss" scoped>
	.tipBox {
		display: flex;
		width: 100%;
		margin: 10rpx 0;
		flex-direction: column;
		padding: 0 30rpx;

		/* 隐藏滚动条但保持可滚动 */
		::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;

			-webkit-appearance: none;
			background: transparent;
		}

		/* 兼容 Firefox */
		scrollbar-width: none;

		/* 兼容 IE */
		-ms-overflow-style: none;
	}

	.NewChatInputToolTip {
		display: flex;
		flex-wrap: nowrap;
		gap: 20rpx;

		&_items {
			position: relative;
			display: flex;
			justify-content: flex-start;
			width: max-content;
			overflow: hidden;
			font-size: 22rpx;
			justify-content: center;
			align-items: center;
			border: 2rpx solid rgba(230, 230, 230, 1);
			padding: 10rpx 20rpx;
			border-radius: 15rpx;
			border-radius: 30rpx;

			&_image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}
	}

	.isNew {
		position: absolute;
		top: 0;
		right: 0;
		background-color: red;
		font-size: 18rpx;
		border-radius: 0 15rpx 0 15rpx;
		color: white;
		padding: 2rpx 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>