<template>
	<up-popup :show="chatStore.openSeletedModel" :round="25" mode="bottom" @close="close" @open="open">
		<view class="viewBox">
			<view class="viewBox_changeHeader">
				<text class="viewBox_changeHeader_top">选择模型</text>
				<text class="viewBox_changeHeader_desc">全网首个超十种多模型/多语言/多媒体大模型</text>
			</view>
			<view class="CommonPopup">
				<view class="CommonPopup_header">
					大语言模型（AICHAT/LLM/NLP）
				</view>
				<template v-for="(item,key) in filteredCommonModel" :key="key">
					<view :style="{background:key == chatStore.model ? '#eaeaea':''}" class="CommonPopup_view"
						@click="changeModel(key)">
						<image class="CommonPopup_view_image" :src="item.modelIcon" mode=""></image>
						<view class="CommonPopup_view_right">
							<text class="CommonPopup_view_text"> {{item.title}}</text>
							<text class="CommonPopup_view_desc"> {{item.modelDesc}}</text>
						</view>
					</view>
				</template>
				<view class="CommonPopup_header">
					多媒体模型（自研技术打通万物理解）
				</view>
				<template v-for="(item,key) in filteredMedieModel" :key="key">
					<view :style="{background:key == chatStore.model ? '#eaeaea':''}" class="CommonPopup_view"
						@click="topath(item?.ModelPath)">
						<image class="CommonPopup_view_image" :src="item.modelIcon" mode=""></image>
						<view class="CommonPopup_view_right">
							<text class="CommonPopup_view_text"> {{item.title}}</text>
							<text class="CommonPopup_view_desc"> {{item.modelDesc}}</text>
						</view>
					</view>
				</template>
			</view>
		</view>
	</up-popup>


</template>

<script setup lang="ts">
	import { commonModel } from '@/config/modelConfig';
	import { ComputedRef, computed, ref } from 'vue';
	import { useChatStore } from '@/store';
	import { CommonModelKeys, ModelConfig } from '../../config/type';
	import { generateUUID } from '../../tools/uuid';
	import { noHistoryArr } from '@/pages/chat/chatConfig';
	import { ModelType, chatConfigProps } from '@/type/chatData';
	const chatStore = useChatStore()
	const filteredCommonModel : ComputedRef<Record<ModelType, chatConfigProps> | any> = computed(() =>
		Object.keys(commonModel).filter(key => !noHistoryArr.includes(key)).reduce((obj, key) => {
			obj[key] = commonModel[key];
			return obj;
		}, {})
	)
	const filteredMedieModel : ComputedRef<Record<ModelType, chatConfigProps> | any> = computed(() =>
		Object.keys(commonModel).filter(key => noHistoryArr.includes(key)).reduce((obj, key) => {
			obj[key] = commonModel[key];
			return obj;
		}, {})
	)

	const popup = ref(null)
	const open = () => {
		chatStore.setOpenSeletedModel(true)

	}
	const topath = (path : string) => {
		console.log(path)
		uni.navigateTo({
			url: path
		})
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
			box-sizing: border-box;

			&_top {
				font-size: 35rpx;
				font-weight: 700;
			}

			&_desc {


				font-size: 27rpx;
				padding-top: 25rpx;
			}
		}
	}

	.CommonPopup {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
		box-sizing: border-box;
		width: 100%;
		max-height: 50vh;
		overflow: scroll;

		&_header {
			font-size: 30rpx;
			color: #bcbcbc;
		}

		&_view {

			display: flex;
			align-items: center;
			justify-content: flex-start;
			box-sizing: border-box;
			padding: 20rpx;
			border: 1rpx solid #ccc;
			border-radius: 15rpx;
			margin-top: 10rpx;

			&_image {
				height: 40rpx;
				width: 40rpx;
				padding: 0 10rpx;
			}

			&_right {
				display: flex;
				flex-direction: column;
				overflow: hidden;


			}

			&_text {
				font-weight: 800;
				font-size: 25rpx;
			}

			&_desc {
				font-size: 20rpx;
				color: #989898;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
</style>