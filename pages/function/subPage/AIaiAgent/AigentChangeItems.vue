<template>
	<up-popup round="10" :show="AiAgentChats.showAgentChangeBox" @close="AiAgentChats.setShowAgentChangeBox(false)">
		<view class="AigentChangeItemsTemtitle">
			选择智能体
		</view>
		<view class="AigentChangeItemsTem">
			<template v-for="(items,index) in AiAgentChats.agentMenus" :key="index">
				<view class="AigentChangeItemsTem_items" @click="toPath(items.path)">
					<image class="AigentChangeItemsTem_items_image" :src="items.cover" mode=""></image>
					<view class="AigentChangeItemsTem_items_text">
						{{items.title}}
					</view>
				</view>
			</template>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { useAiAgentChats } from '@/store';
	const AiAgentChats = useAiAgentChats()
	const toPath = (url : string) => {

		const localUrl = url.split('?id=')[1]
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const id = currentPage.options?.id
		if (id !== localUrl) {
			AiAgentChats.setCurrentConversation_id(null)
			AiAgentChats.setShowAgentChangeBox(false)
			AiAgentChats.setAgentId(localUrl)
			AiAgentChats.setAgentItem(null)
			uni.navigateTo({ url })
		} else {
			uni.$u.toast('请不要选择重复的智能体！');
		}

	}
</script>

<style scoped lang="scss">
	.AigentChangeItemsTemtitle {
		padding: 30rpx;
		font-weight: 800;
	}

	.AigentChangeItemsTem {
		padding: 30rpx;
		height: 600rpx;
		overflow: scroll;


		&_items {
			display: flex;
			padding: 15rpx 30rpx;
			align-items: center;
			border-radius: 20rpx;
			margin-bottom: 15rpx;
			border: 1rpx solid #ccc;

			&_image {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
		}
	}
</style>