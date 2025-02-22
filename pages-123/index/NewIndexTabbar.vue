<template>
	<view class="NewIndexTabbar">
		<template v-for="(items,index) in TabbarConfig" :key="index">
			<view class="NewIndexTabbar_items" @click="changeTemPlate(items.showTemplate)">
				{{items.title}}
				<view
					:style="{background:ChatStore.isShowSearchTabbar == items.showTemplate ? 'rgb(73, 85, 245)' :'rgba(0, 0, 0,0)'}"
					class="NewIndexTabbar_items_lines"></view>
			</view>
		</template>
	</view>
</template>

<script setup lang="ts">
	import { useChatStore } from '@/store';

	const ChatStore = useChatStore()
	const TabbarConfig = [
		{
			title: '对话',
			showTemplate: 'HomeTemPlate'
		},
		{
			title: 'DeepSeek',
			showTemplate: 'DeepSeekTemplate'
		},
		// {
		// 	title: '智能体',
		// 	showTemplate: 'AiAgentTemplate'
		// }
	]
	const changeTemPlate = (tem : string) => {
		ChatStore.setIsShowSearchTabbar(tem)
	}
</script>

<style lang="scss" scoped>
	.NewIndexTabbar {
		padding: 0 40rpx;
		display: flex;
		align-items: flex-end;

		&_items {
			padding-right: 20rpx;
			margin: 20rpx 0;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;

			&_lines {
				width: 100%;
				background-color: $aichat-border-color;
				height: 6rpx;
				border-radius: 6rpx;
				margin-top: 5rpx;
			}
		}
	}
</style>