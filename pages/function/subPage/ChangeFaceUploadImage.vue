<template>
	<view class="ImageUploadCom">
		<view class="ImageUploadCom_content" @click="uploadImages">
			<template v-if="images">
				<view class="ImageUploadCom_content_image">
					<image :style="{width:'90%'}" :src="images" mode="aspectFit"></image>
				</view>

			</template>
			<template v-else>
				<up-icon
					:custom-style="{ justifyContent: 'center', display: 'block', width: '100%', textAlign: 'center' }"
					name="photo-fill" size="100"></up-icon>
				<text class="ImageUploadCom_text">点击上传图片</text>
				<text class="ImageUploadCom_text">只能上传jpg/png文件,且不超过10MB</text>
			</template>
		</view>
	</view>
	<view class="description">
		{{description}}
	</view>
	<up-overlay :show="showupOverlay">
		<QfImageCropper :showAngle="props.showAngle|| false" checkRange reverseRotatable choosable bounce gpu
			:width="props.width || 500" :height="props.height|| 500" :radius="0" @crop="handleCrop"
			@close="handleClose">
		</QfImageCropper>
	</up-overlay>
</template>

<script setup lang="ts">
	import QfImageCropper from './qf-image-cropper/components/qf-image-cropper/qf-image-cropper.vue'
	import { ref } from 'vue';
	import { fileToBase64, weChatTempPathToBase64 } from '@/utils';
	const images = defineModel('images')
	const props = defineProps<{ noUseCorpImage : boolean, description ?: string, radius ?: number, showAngle ?: boolean, width ?: number, height ?: number, appuUseBase64 ?: boolean, }>()
	const showupOverlay = defineModel('showupOverlay')
	const uploadImages = () => {
		if (!props.noUseCorpImage) {
			showupOverlay.value = true
		} else {
			uni.chooseImage({
				count: 1,
				success: function (res) {


					// #ifdef H5
					fileToBase64(res.tempFiles[0], (base64 : string) => {
						images.value = base64
					}, true)
					// #endif
					console.log(res)
					// #ifdef MP-WEIXIN || APP
					if (props.appuUseBase64) {
						weChatTempPathToBase64(res.tempFilePaths[0]).then((res) => {
							console.log(res)
							images.value = res
						})
						return
					}

					if (props.noUseCorpImage) {
						images.value = res.tempFilePaths[0]
					} else {
						weChatTempPathToBase64(res.tempFilePaths[0]).then((res) => {
							console.log(res)
							images.value = res
						})
					}
					// #endif
				}
			})
		}
	}
	const handleCrop = (e) => {
		images.value = e.tempFilePath
		console.log(images.value)
		showupOverlay.value = false

	}
	const handleClose = (e) => {
		showupOverlay.value = false
	}
</script>

<style lang="scss" scoped>
	.ImageUploadCom {
		padding: 40rpx 0 !important;
		width: 100%;
		height: 100%;

		&_content {
			padding: 50rpx 0;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			position: relative;
			box-sizing: border-box;
			justify-content: center;
			box-shadow: 0 0 2rpx #ffffff80;
			border-radius: 10rpx;
			overflow: hidden;
			background-image: linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0),
				linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0);
			background-position: 0 0, 15rpx 15rpx;
			background-size: 30rpx 30rpx;
			border: #e4e4e4 2rpx solid;

			&_image {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				margin: 15rpx;
			}
		}

		&_text {
			width: 100%;
			display: block;
			text-align: center;
			color: $aichat-border-color;
			padding: 10rpx 0;
		}
	}

	.description {
		display: flex;
		justify-content: center;
		font-size: 27rpx;
	}
</style>