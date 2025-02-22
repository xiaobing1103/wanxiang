<template>
	<view class="CommonChangeFace">
		<!-- 自定义上传原图 -->
		<ChangeFaceUploadImage description="请上传自定义原图" v-model:images="parmas.image1" />
		<!-- 模板图库 -->
		<ChangeFaceTemplates title="模板图库" :faceTems="ChangeFaceTypes.formworkImage" v-model:images="parmas.image1" />
		<!-- 自定义上传人脸图 -->
		<ChangeFaceUploadImage description="请上传自定义人脸图" v-model:images="parmas.image2" />
		<!-- 第二个模板图库 -->
		<template v-if="ChangeFaceTypes.humanFaceImage.length > 0">
			<ChangeFaceTemplates title="人脸图库模板" :faceTems="ChangeFaceTypes.humanFaceImage"
				v-model:images="parmas.image2" />
		</template>
	</view>
</template>

<script setup lang="ts">
	import ChangeFaceUploadImage from './ChangeFaceUploadImage'
	import ChangeFaceTemplates from './ChangeFaceTemplates'
	import { ChangeFaceTypesProps } from '../../data';
	const parmas = defineModel<{
		image1 : null | FormData
		image2 : null | FormData
	}>('parmas')

	const props = defineProps<{ ChangeFaceTypes : ChangeFaceTypesProps }>()

	// const setImages1 = (e : any) => {
	// 	parmas.value.image1 = e
	// }
</script>

<style lang="scss" scoped>
	.ImageUploadCom {
		padding: 25rpx 0 !important;
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
</style>