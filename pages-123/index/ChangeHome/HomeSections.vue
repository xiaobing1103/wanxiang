<template>
	<view class="ChatHomePage_header">
		<text> 你好,用户 {{UserStore?.userInfo?.nick || '' }}</text>
		<text> 准备好了吗？我随时可以开始哦！</text>
	</view>
	<view class="ChatHomePage_section">
		<template v-for="(items,index) in showHomeDatas" :key="index">
			<view class="ChatHomePage_section_item" @click="toPath(items)">
				<view class="left">
					<image class="icon" :src="items.icon" mode=""></image>
				</view>
				<view class="right">
					<text class="text1">{{items.title}}</text>
					<text class="text2">{{items.desc}}</text>
				</view>
			</view>
		</template>
		<view v-if="!isclickMoreData" class="ChatHomePage_section_item" @click="isclickMoreData = true">
			<view class="left">
				<image class="icon" :src="$assets.moreHomeIndexIcon" mode=""></image>
			</view>
			<view class="right">
				<text class="text1">更多</text>
				<text class="text2">点击展示更多技能</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { useChatStore, useUserStore } from '@/store';
	import ChangeModelVue from '@/components/CommonChat/ChangeModel.vue';
	import { seletedModels } from '@/config/modelConfig';
	import { computed, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const { $assets } = useGlobalProperties()
	const ChatStore = useChatStore()
	const UserStore = useUserStore()
	const isclickMoreData = ref(false)
	const showHomeDatas = computed(() => {
		if (isclickMoreData.value) {
			return seletedModels.slice(1)
		}
		return seletedModels.slice(1, 8)
	})
	const toPath = (items : { title : string, icon : string, isDeepSeekModelTag ?: boolean, path ?: string, isNews ?: boolean, desc ?: string, isTop ?: boolean }) => {
		if (items.isDeepSeekModelTag) {
			ChatStore.setOpenDeepSeekModel(true)
		}
		if (items.path) {
			uni.navigateTo({ url: items.path })
		}
	}
</script>

<style lang="scss" scoped>
	.ChatHomePage {
		&_header {
			padding: 10rpx 30rpx;
			display: flex;
			flex-direction: column;
			font-size: 800;
			font-size: 30rpx;
		}

		&_section {
			margin: 30rpx;
			display: grid;
			gap: 15rpx;
			grid-template-columns: repeat(2, 1fr);

			&_item {
				display: flex;
				align-items: flex-start;
				border: 1rpx solid #ccc;
				border-radius: 15rpx;
				padding: 20rpx;

				.left {
					margin-right: 12rpx;

					.icon {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.right {
					display: flex;
					flex-direction: column;

					.text1 {
						font-weight: 800;
						font-size: 28rpx;

					}

					.text2 {
						font-size: 24rpx;
						color: #888;
					}
				}
			}
		}
	}
</style>