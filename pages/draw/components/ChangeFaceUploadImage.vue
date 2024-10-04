<template>
	<view class="ImageUploadCom">
		<view class="ImageUploadCom_content" @click="uploadImages">
			<template v-if="images">
				<image :src="images" mode="aspectFit"></image>
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
		<QfImageCropper :showAngle="false" radius="0" checkRange reverseRotatable choosable bounce gpu :width="500"
			:height="500" :radius="30" @crop="handleCrop">
		</QfImageCropper>
	</up-overlay>
</template>

<script setup lang="ts">
	import QfImageCropper from '../components/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.vue'
	import { ref } from 'vue';
	const images = defineModel('images')
	defineProps<{ description : string }>()
	const showupOverlay = ref(false)
	const uploadImages = () => {
		showupOverlay.value = true
	}
	const handleCrop = (e) => {
		images.value = e.tempFilePath
		// uni.previewImage({
		// 	urls: [e.tempFilePath],
		// 	current: 0
		// });
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