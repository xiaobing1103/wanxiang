<template>
	<up-popup :show="chatStore.openSeletedModel" :round="15" mode="bottom" @close="close" @open="open">
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
						<view class="hotmodel" v-if="item.hotDesc">
							{{item.hotDesc}}
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

	<up-popup :show="chatStore.openDeepSeekModel" round="15" @close="cancel ">
		<view class="DeepSeekModel">
			<view class="DeepSeekModel_heaader">
				<image class="DeepSeekModel_heaader_image"
					src="https://file.1foo.com/2025/02/09/d531aaca2351b8e47fd1390487204bd8.png" mode="aspectFit">
				</image>
			</view>
			<view class="DeepSeekModel_heaaderDesc">
				<text>请选择深度思考（R1）模型</text>
			</view>
			<view class="overContent">
				<view class="DeepSeekModel_Content" v-for="(items,index) in columns" :key="index"
					@click="confirm(items.modelKey)">
					<view class="DeepSeekModel_Content_top">
						{{items.hot}}
					</view>
					<view class="DeepSeekModel_Content_right">
						<image class="DeepSeekModel_Content_right_image" :src="$assets.DeepSeekModelIcon" mode="">
						</image>
					</view>
					<view class="DeepSeekModel_Content_left">
						<text class="DeepSeekModel_Content_left_modelName"> {{items.label}} </text>
						<text class="DeepSeekModel_Content_left_modeldesc"> {{items.desc}} </text>
						<view class="DeepSeekModel_Content_left_tag">
							<view v-for="(tags,index) in items.tag" :style="{marginRight:'10rpx'}" :key="index">
								<up-tag :style="{fontSize:'10rpx'}" borderColor="rgba(0,0,0,0)" :bgColor="tags.bgcolor"
									size="mini" :text="tags.title" :color="tags.color"></up-tag>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
	</up-popup>

</template>

<script setup lang="ts">
	import { commonModel, columns } from '@/config/modelConfig';
	import { ComputedRef, computed, reactive, ref } from 'vue';
	import { useChatStore } from '@/store';
	import { CommonModelKeys, ModelConfig } from '../../config/type';
	import { generateUUID } from '../../tools/uuid';
	import { noHistoryArr } from '@/pages/chat/chatConfig';
	import { ModelType, chatConfigProps } from '@/type/chatData';
	const chatStore = useChatStore()
	const confirm = (key : string) => {
		changeModel(key)
		chatStore.setSeletedModel(key)
		chatStore.setOpenDeepSeekModel(false)
	}

	const cancel = () => {
		chatStore.setOpenDeepSeekModel(false)
	}
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
		close()
		cancel()
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
			padding: 10rpx 0;
			color: #bcbcbc;
		}

		&_view {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			box-sizing: border-box;
			padding: 20rpx;
			border: 1rpx solid #ccc;
			border-radius: 15rpx;
			margin-top: 10rpx;
			// overflow: hidden;

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
				max-width: 270px;
			}
		}
	}

	.hotmodel {
		position: absolute;
		top: 0;
		right: 0;
		color: white;
		background-color: red;
		font-size: 18rpx;
		padding: 5rpx;
		border-radius: 0rpx 10rpx 0rpx 10rpx;
	}


	.DeepSeekModel {
		display: flex;
		flex-direction: column;



		&_heaaderDesc {
			padding: 0 20rpx;
			font-size: 32rpx;
			font-weight: 800;
		}

		&_heaader {
			display: flex;
			flex-direction: column;
			border-radius: 15rpx;
			position: relative;
			min-height: 200rpx;
			overflow: hidden;

			&_image {
				width: 100%;
				position: absolute;
				height: 200rpx;
				top: -10rpx;

			}
		}

		&_Content {
			padding: 25rpx;
			display: flex;
			align-items: center;
			// border: 1rpx solid #ccc;
			position: relative;

			&_top {
				position: absolute;
				top: 0;
				right: 0;
				background: linear-gradient(99.36deg, rgb(126, 61, 255) 0%, rgb(252, 106, 201) 100%);
				;
				font-size: 18rpx;
				padding: 8rpx 20rpx;
				border-radius: 0 15rpx;
				color: white;
			}

			&_right {

				&_image {
					width: 80rpx;
					height: 80rpx;
				}
			}

			&_left {
				padding-left: 20rpx;

				&_modelName {
					padding-bottom: 10rpx;
					font-size: 29rpx;
					font-weight: 500;

				}

				&_tag {
					padding: 10rpx 0;
					display: flex;
				}

				&_modeldesc {
					font-size: 24rpx;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
					word-wrap: break-word;
					width: 100%;
					line-height: 1.5;
					color: #888;
				}
			}
		}
	}

	.overContent {
		overflow: scroll;
		height: 800rpx;
	}
</style>