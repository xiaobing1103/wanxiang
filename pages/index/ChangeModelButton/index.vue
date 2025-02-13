<template>
	<view class="ChangeModelButton">
		<view class="ChangeModelButton_box">
			<view class="ChangeModelButton_box_button"
				:style="{  background: chatStore.seletedModel  == chatStore.model ?  'rgb(223, 236, 255)' : '',color: chatStore.seletedModel  == chatStore.model ?'#4955f5':''}"
				@click="openPicker">
				<image class="ChangeModelButton_box_image" :src="$assets.DeepSeekModalThinkIngIcon" mode=""></image>
				{{ commonModel[chatStore.seletedModel].title}}
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { useChatStore } from '@/store';
	import { generateUUID } from '@/tools/uuid';
	import { CommonModelKeys } from '@/config/assets.config';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { columns, commonModel } from '@/config/modelConfig';
	import { ref, reactive, watch } from 'vue';

	const chatStore = useChatStore()
	const { $assets } = useGlobalProperties()

	watch(() => chatStore.model, (val) => {
		const reName = columns.find((item) => {
			return item.modelKey == val
		})
		if (reName) {
			chatStore.setSeletedModel(val)
		} else {
			chatStore.seletedModel = 'DeepSeek_R1'
		}

	})
	const cancel = () => {
		chatStore.setOpenDeepSeekModel(false)
	}

	const openPicker = (key : string) => {
		chatStore.setOpenDeepSeekModel(true)
	}
	const changeModel = (key : string) => {
		if (key == chatStore.model) {
			return
		}
		chatStore.addchats({
			id: generateUUID(),
			iconUrl: commonModel[key].modelIcon,
			title: commonModel[key].title,
			data: [],
			model: key
		})
		// chatStore.setModel(key)
		cancel()
	}
</script>

<style lang="scss" scoped>
	.ChangeModelButton {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		padding: 0 40rpx;

		&_box {
			width: 35%;
			font-size: 20rpx;
			margin-right: 20rpx;

			&_button {
				height: 55rpx;
				border-radius: 50rpx;
				border: 0rpx;
				width: max-content;
				font-size: 22rpx;
				background: rgb(231, 231, 231);
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding: 15rpx;
			}

			&_image {
				padding-right: 10rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
</style>