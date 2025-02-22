<template>
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
				@click="handleModelSelect(items.modelKey)">
				<view class="DeepSeekModel_Content_top">
					{{items.hot}}
				</view>
				<view class="DeepSeekModel_Content_right">
					<image class="DeepSeekModel_Content_right_image" :src="$assets.DeepSeekModelIcon" mode="">
					</image>
				</view>
				<view class="DeepSeekModel_Content_left">
					<text class="DeepSeekModel_Content_left_modelName">{{items.label}}</text>
					<text class="DeepSeekModel_Content_left_modeldesc">{{items.desc}}</text>
					<view class="DeepSeekModel_Content_left_tag">
						<view v-for="(tags,index) in items.tag" :style="{marginRight:'5rpx'}" :key="index">
							<up-tag :style="{fontSize:'10rpx'}" borderColor="rgba(0,0,0,0)" :bgColor="tags.bgcolor"
								size="mini" :text="tags.title" :color="tags.color">
							</up-tag>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { columns } from '@/config/modelConfig'
	import { useChatStore } from '@/store'

	const ChatStore = useChatStore()

	const props = defineProps({
		isPopup: {
			type: Boolean,
			default: false
		}
	})

	const emit = defineEmits(['select', 'close'])

	const handleModelSelect = (key : string) => {
		if (props.isPopup) {
			// 在弹窗模式下
			ChatStore.setModel(key)
			ChatStore.changeSelectChatId('')
			ChatStore.setOpenDeepSeekModel(false)

			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			const currentRoute = '/' + currentPage.route

			if (currentRoute == '/pages/index/index') {
				uni.navigateTo({
					url: '/pages/index/subPage/AllChatPage/index'
				})
			}
		} else {
			// 在页面模式下
			emit('select', key)
		}
	}
</script>

<style lang="scss" scoped>
	.DeepSeekModel {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;


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
			padding: 10rpx;
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
		// overflow: scroll;
		max-height: 800rpx;
		// padding: 20rpx 10rpx;
	}
</style>