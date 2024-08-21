<template>
	<up-popup :show="chatStore.openSeletedModel" :round="25" mode="bottom" @close="close" @open="open">

		<view class="viewBox">
			<view class="viewBox_changeHeader">
				<text class="viewBox_changeHeader_top">选择模型</text>
				<text class="viewBox_changeHeader_desc">全网首个超十种多模型/多语言/多媒体大模型</text>

			</view>

			<view class="CommonPopup">
				<template v-for="(item,key) in commonModel" :key="key">
					<view :style="{background:key == chatStore.model ? '#eaeaea':''}" class="CommonPopup_view"
						@click="changeModel(key)">
						<image class="CommonPopup_view_image" :src="item.modelIcon" mode=""></image>
						<text class="CommonPopup_view_text"> {{item.title}}</text>
					</view>
				</template>
			</view>
		</view>
	</up-popup>


</template>

<script setup lang="ts">
	import { commonModel } from '@/config/modelConfig';
	import { computed, ref } from 'vue';
	import { useChatStore } from '@/store';
	import { CommonModelKeys } from '../../config/type';
	import { generateUUID } from '../../tools/uuid';
	const chatStore = useChatStore()
	const popup = ref(null)
	const open = () => {
		chatStore.setOpenSeletedModel(true)

	}
	const close = () => {
		chatStore.setOpenSeletedModel(false)
	}
	const changeModel = (key : CommonModelKeys) => {
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
		close()
	}
</script>

<style lang="scss" scoped>
	.viewBox {
		display: flex;
		flex-direction: column;

		&_changeHeader {
			display: flex;
			justify-content: flex-start;
			font-size: 30rpx;
			padding: 25rpx 30rpx;
			flex-direction: column;

			&_top {
				font-size: 35rpx;
				font-weight: 700;
			}

			&_desc {
				font-size: 25rpx;
				padding-top: 25rpx;
			}
		}
	}

	.CommonPopup {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		padding: 30rpx;

		&_view {

			display: flex;
			align-items: center;
			justify-content: flex-start;
			box-sizing: border-box;
			padding: 25rpx;
			border: 1rpx solid #ccc;
			border-radius: 15rpx;
			margin-top: 10rpx;

			&_image {

				height: 40rpx;
				width: 40rpx;
				padding: 0 20rpx;
			}

			&_text {
				font-size: 25rpx;
			}
		}
	}
</style>