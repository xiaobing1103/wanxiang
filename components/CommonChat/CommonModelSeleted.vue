<template>
	<up-popup :show="chatStore.openSeletedModel" :round="15" mode="bottom" @close="close" @open="open" closeable>
		<view class="model-popup">
			<view class="model-header">
				<text class="title">选择模型</text>
				<text class="subtitle">全网首个超十种多模型/多语言/多媒体大模型</text>
			</view>
			<scroll-view scroll-y class="model-content">
				<view class="model-section">
					<view class="section-title">
						大语言模型（AICHAT/LLM/NLP）
					</view>
					<view class="model-list">
						<view v-for="(item, key) in filteredCommonModel" :key="key" class="model-item"
							:class="{'model-item--active': key === chatStore.model}" @click="changeModel(key)">

							<view class="model-item__header">
								<image class="model-icon" :src="item.modelIcon" mode="aspectFit" />
								<text class="model-name">{{item.title}}</text>

							</view>
							<text class="model-desc">{{item.modelDesc}}</text>
							<view v-if="item.hotDesc" class="hot-tag">{{item.hotDesc}}</view>
						</view>
					</view>
				</view>

				<!-- 多媒体模型部分 -->
				<view class="model-section">
					<view class="section-title">
						多媒体模型（自研技术打通万物理解）
					</view>
					<view class="model-list">
						<view v-for="(item, key) in filteredMedieModel" :key="key" class="model-item"
							:class="{'model-item--active': key === chatStore.model}" @click="topath(item?.ModelPath)">
							<view class="model-item__header">
								<image class="model-icon" :src="item.modelIcon" mode="aspectFit" />
								<text class="model-name">{{item.title}}</text>
							</view>
							<text class="model-desc">{{item.modelDesc}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
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
	import { url } from 'inspector';
	const chatStore = useChatStore()
	const confirm = (key : string) => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...');
			return
		}
		changeModel(key)
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
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...');
			return
		}

		if (!chatStore.isDeepSeekModels.includes(key)) {
			chatStore.setopenLianWangModel(false)
		}
		chatStore.setModel(key)
		chatStore.changeSelectChatId('')
		const pages = getCurrentPages(); // 获取页面栈
		const currentPage = pages[pages.length - 1]; // 获取当前页面对象
		const currentRoute = '/' + currentPage.route; // 获取当前页面路径
		if (currentRoute == '/pages/index/index') {
			uni.navigateTo({
				url: '/pages/index/subPage/AllChatPage/index'
			})
		}
		close()
		cancel()
	}
</script>

<style lang="scss" scoped>
	.model-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); // 自适应列宽
		gap: 20rpx;
	}

	.model-item {
		background: #fff;
		border-radius: 15rpx;
		padding: 10rpx 20rpx; 
		border: 1rpx solid #f0f0f0;
		display: flex;
		flex-direction: column;
		position: relative;

		&--active {
			background: #dee0e1;
			border-color: #646566;
			border: 5rpx solid #646566;
		}

		&__header {
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;
		}
	}

	.model-icon {
		width: 40rpx;
		height: 40rpx;
		border-radius: 12rpx;
		margin-right: 16rpx;
	}

	.model-name {
		flex: 1;
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.model-desc {
		font-size: 24rpx;
		color: #666;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		line-height: 1.3;
	}

	.hot-tag {
		position: absolute;
		right: 0;
		top: 0;
		background: #ff4d4f;
		color: #fff;
		font-size: 18rpx;
		padding: 4rpx 12rpx;
		border-radius: 0 15rpx 0 15rpx;
		display: flex;
		align-items: center;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		padding: 20rpx 10rpx;
	}

	// 弹窗整体样式
	.model-popup {
		max-height: 80vh;
		background: #fff;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;
	}

	.model-header {
		padding: 40rpx;
		text-align: center;
		border-bottom: 1rpx solid #f5f5f5;

		.title {
			display: flex;
			font-size: 36rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 16rpx;
		}

		.subtitle {
			font-size: 28rpx;
			display: flex;
			color: #666;
		}
	}

	.model-content {
		max-height: calc(80vh - 200rpx);
	}

	.model-section {
		padding: 30rpx;
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
		padding: 0 0rpx;


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
			border-radius: 25rpx;

			&_top {
				position: absolute;
				top: 0;
				right: 0;
				background: linear-gradient(99.36deg, rgb(126, 61, 255) 0%, rgb(252, 106, 201) 100%);
				font-size: 18rpx;
				padding: 8rpx 20rpx;
				border-radius: 0 15rpx;
				color: white;
			}

			&_right {

				&_image {
					width: 60rpx;
					height: 60rpx;
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
		padding: 20rpx 10rpx;
	}
</style>