<template>
	<up-modal customClass="modalClass" :show="showImageModal" :closeOnClickOverlay="true" @close="emit('closeImage')"
		@confirm="confirm" ref="uModal">
		<view class="ImageModal">
			<view class="ImageModal_imageBox">
				<!-- <image src="" mode="aspectFit"></image> -->
				<up-swiper indicator indicatorActiveColor="skyblue" :list="currentImages?.images" @click="openImages"
					keyName="image"></up-swiper>
				<view class="ImageModal_imageBox_form">
					<view class="ImageModal_imageBox_form_label">
						提示词：
					</view>
					<view class="ImageModal_imageBox_form_value">
						<up-copy :content="currentImages?.param.prompt">{{currentImages?.param.prompt}}</up-copy>
					</view>
				</view>
				<view class="ImageModal_imageBox_form">
					<view class="ImageModal_imageBox_form_label">
						反向提示词：
					</view>
					<view class="ImageModal_imageBox_form_value">
						<up-copy
							:content="currentImages?.param.negative_prompt">{{currentImages?.param.negative_prompt}}</up-copy>
					</view>
				</view>
				<view class="ImageModal_imageBox_InfoView">
					<up-grid :border="false" col="2">
						<up-grid-item>
							<view class="gridItems">
								<text class="gridItems_label">模型：</text>
								<text class="gridItems_value"> {{currentImages?.model_name}}</text>
							</view>

						</up-grid-item>
						<up-grid-item>
							<view class="gridItems">
								<text class="gridItems_label">图片尺寸：</text>
								<text class="gridItems_value"> {{currentImages?.param.width}} *
									{{currentImages?.param.height}}</text>
							</view>
						</up-grid-item>

						<up-grid-item>
							<view class="gridItems">
								<text class="gridItems_label">数量：</text>
								<text class="gridItems_value">{{currentImages?.param.num}}</text>
							</view>
						</up-grid-item>

						<up-grid-item>
							<view class="gridItems">
								<text class="gridItems_label">采样器：</text>
								<text class="gridItems_value">{{currentImages?.param.simpler}}</text>
							</view>
						</up-grid-item>

						<up-grid-item>
							<view class="gridItems">
								<text class="gridItems_label">文本强度：</text>
								<text class="gridItems_value">{{currentImages?.param.cfg_scale}}</text>
							</view>
						</up-grid-item>

						<up-grid-item>
							<view class="gridItems">
								<text class="gridItems_label">迭代数：</text>
								<text class="gridItems_value">{{currentImages?.param.step}}</text>
							</view>
						</up-grid-item>

						<up-grid-item>
							<view class="gridItems">
								<text class="gridItems_label">随机种子：</text>
								<text class="gridItems_value">{{currentImages?.param.seed}}</text>
							</view>
						</up-grid-item>

					</up-grid>
				</view>
			</view>

		</view>
		<template #confirmButton>
			<view class="imageBox_footer">
				<up-button @click="createImage" text="立即生成" type="primary"></up-button>
			</view>
		</template>
	</up-modal>
	<up-overlay z-index="20000" :show="showImages">
		<view class="overlay_warp">
			<view class="overlay_warp_box" @click="showImages = false">
				<image class="overlay_warp_box_images" :src="currentImages?.images[indexNum]" mode="aspectFit"></image>
				<!-- <view class="overlay_warp_footer">
					<up-icon stop @click="toDownload" name="download" color="#2979ff" size="28"></up-icon>
					<up-icon name="share" color="#2979ff" size="28"></up-icon>
				</view>
				<ss-download @tap.stop ref="ssdownload" :fileUrl="fileUrl" :fileType="fileType"></ss-download> -->
			</view>

		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { ImageListDTO } from '../data';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useDrawStore } from '@/store';
	const props = defineProps<{ showImageModal : boolean, currentImages : ImageListDTO }>()
	const emit = defineEmits<{
		(event : 'closeImage') : void;
	}>();
	const showImages = ref(false)
	// const ssdownload = ref(null)
	// const fileUrl = ref('')
	// const fileType = ref('')
	const indexNum = ref(0)

	const confirm = () => {
		console.log(123123, props.showImageModal + '')
	};
	const {
		$api
	} = useGlobalProperties()
	const openImages = (index : number) => {
		indexNum.value = index
		showImages.value = true
	}
	const DrawStore = useDrawStore()
	const createImage = async () => {
		// uni.navigateTo({
		// 	url: `/pages/draw/subPage/text2image/index?id=${props.currentImages.id}`
		// })

		// 拿到parmas拼装后直接生成图片

		const res = await $api.get(`api/v1/img/publishInfo?id=${props.currentImages.id}`)

		if (res.code == 200) {
			DrawStore.setSeletedDrawProject('txt2img_task_json')
			DrawStore.setCurrentParmasData(res.data.param)
			DrawStore.getTask(res.data.param)
		} else {
			uni.$u.toast('生成失败请重试！');
		}

	}
</script>

<style lang='scss' scoped>
	.ImageModal {
		display: flex;
		justify-content: flex-start;
		width: 100%;

		&_imageBox {
			width: 100%;
			padding: 20rpx;
			/* height: 100rpx; */
		}
	}

	.modalClass {
		::v-deep .u-modal__content {
			padding: 0 !important;

		}
	}

	.overlay_warp {
		width: 100%;
		height: 100%;


		&_box {
			display: flex;
			width: 100%;
			height: 100%;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			&_images {
				width: 100%;
				height: 70%;
			}
		}

		&_footer {
			color: white;
			display: flex;
			margin-top: 10rpx;
		}
	}

	.imageBox_footer {
		padding: 20rpx;
	}

	.ImageModal_imageBox_form {
		font-size: 27rpx;

		&_label {
			padding: 10rpx;
		}

		&_value {
			background-color: $u-bg-color;
			overflow-y: scroll;
			border-radius: 20rpx;
			padding: 10rpx;
			height: 200rpx;
		}
	}



	.ImageModal_imageBox_InfoView {

		margin-top: 20rpx;
	}

	.gridItems {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		font-size: 27rpx;
		padding-top: 10rpx;

		&_label {
			white-space: nowrap;
			margin-right: 5px;
			/* 可根据需要调整 */
		}

		&_value {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			flex-grow: 1;
			/* 使 value 占据剩余空间 */
		}
	}
</style>