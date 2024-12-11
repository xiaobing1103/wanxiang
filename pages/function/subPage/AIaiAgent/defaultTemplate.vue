<template>
	<view class="defaultTemplate">
		<template v-if="agentItem">
			<view class="defaultTemplate_info">
				<view class="defaultTemplate_info_imageBox">
					<image class="defaultTemplate_info_image" :src="agentItem?.avatar" mode=""></image>
				</view>
				<view class="defaultTemplate_info_title">{{agentItem?.name}}</view>
				
			</view>
			<view class="defaultTemplate_promptList">
				<template v-for="(items,index) in agentItem?.starter_prompts" :key="index">
					<view class="defaultTemplate_promptList_items" @click="addMsg(items)">
						<text>{{items}}</text>
						<view @click.stop="setValue(items)">
							<up-icon name="edit-pen"></up-icon>
						</view>
					</view>
				</template>
			</view>
			<view class="defaultTemplate_desc">
				{{agentItem?.description}}
			</view>
		</template>
		<template v-else>
			<view class="skeleton">
				<up-skeleton rows="5" loading animate rowsHeight="50"></up-skeleton>
			</view>
		</template>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useAiAgentChats } from '@/store'
	const emit = defineEmits(['setContent', 'addMessageOver'])
	const AiAgentChats = useAiAgentChats()
	const agentItem = computed(() => AiAgentChats.agentItem)
	const setValue = (msg : string) => {
		emit('setContent', msg)
	}
	const addMsg = (msg : string) => {
		emit('addMessageOver', msg)
	}
</script>

<style scoped lang="scss">
	.skeleton {
		height: 100%;
		width: 100%;
		padding: 50rpx;
	}

	.defaultTemplate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 0 50rpx;

		&_info {
			display: flex;
			flex-direction: column;
			align-items: center;

			&_imageBox {
				position: relative;
			}

			&_image1 {
				position: absolute;
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				margin: 20rpx;
				filter: blur(40px);
			}

			&_image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				margin: 20rpx;
				z-index: 1;
				display: inherit;
			}

			&_title {
				font-weight: 900;
			}

			&_desc {
				padding-top: 20rpx;
				font-size: 27rpx;
			}
		}

		&_promptList {
			display: flex;
			flex-direction: column;
			width: 100%;

			&_items {
				width: 100%;
				display: flex;
				align-items: center;
				cursor: pointer;
				justify-content: space-between;
				border-radius: .75rem;
				border-width: 1px;
				box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
				background-color: rgb(255 255 255);
				padding: 20rpx 20rpx;
				text-align: left;
				margin-top: 30rpx;
				font-size: 27rpx;

			}
		}

		&_desc {
			padding-top: 30rpx;
			font-size: 24rpx;
		}
	}
</style>