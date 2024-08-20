<template>
	<view class="ImageUploadCom">
		<view class="ImageUploadCom_content" @click="uploadImages">
			<template v-if="url">
				<image :src="url"></image>
			</template>
			<template v-else>
				<up-icon :custom-style="{justifyContent: 'center', display: 'block',width:'100%',textAlign:'center'}"
					name="photo-fill" size="100"></up-icon>
				<text class="ImageUploadCom_text">点击上传图片</text>
			</template>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { ref, defineExpose } from 'vue';
	import { Image2TextParmas } from '../data';
	import useDrawStore, { taskIdTypeKey } from '@/store/draw';
	import { fileToBase64, wxBase64 } from "@/utils/file2Base64"
	import { base64ToFile } from '@/utils/base642file';
	const props = defineProps<{ type : taskIdTypeKey }>()
	const parmas = defineModel<Image2TextParmas>("parmas");
	const url = defineModel<string>("url");
	const DrawStore = useDrawStore()
	const imgWidth = ref(512)
	const imgheight = ref(512)
	// 赋值image
	const hanlderImages = async (url : string) => {
		console.log('处理的 URL:', url);
		// #ifdef H5
		if (props.type == 'coloringLineArt_task_json') {
			parmas.value.image = DrawStore.currentIamgeBase64
		} else {
			parmas.value.image = base64ToFile(DrawStore.currentIamgeBase64, '涂鸦后图片')
		}

		const img = new Image();
		img.src = url;
		img.onload = () => {
			imgWidth.value = img.width
			imgheight.value = img.height
		};
		// #endif

		// #ifdef MP-WEIXIN
		wx.getImageInfo({
			src: url,
			success: (res) => {
				imgWidth.value = res.width
				imgheight.value = res.height
			}
		});
		if (props.type == 'coloringLineArt_task_json') {
			const file = await wxBase64({ url: url, type: 'png' })
			parmas.value.image = file
		} else {
			parmas.value.image = url
		}
		// #endif
	}
	defineExpose({
		hanlderImages
	})
	const uploadImages = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original'],
			success: async (options) => {
				const { tempFilePaths, tempFiles } = options
				url.value = tempFilePaths[0]
				// #ifdef H5
				if (props.type == 'coloringLineArt_task_json') {
					fileToBase64(tempFiles[0], (base64 : any) => {
						parmas.value.image = base64
					})
				} else {
		
					parmas.value.image = tempFiles[0]
				}

				const img = new Image();
				img.src = tempFilePaths[0];
				img.onload = () => {
					imgWidth.value = img.width
					imgheight.value = img.height
				};
				// #endif


				// #ifdef MP-WEIXIN
				wx.getImageInfo({
					src: tempFilePaths[0],
					success: (res) => {
						imgWidth.value = res.width
						imgheight.value = res.height
						// console.log('Image Width:', res.width);
						// console.log('Image Height:', res.height);
					}
				});
				if (props.type == 'coloringLineArt_task_json') {
					const file = await wxBase64({ url: tempFilePaths[0], type: 'png' })
					parmas.value.image = file
				} else {
					parmas.value.image = tempFilePaths[0]
				}
				// #endif
				setTimeout(() => {
					uni.navigateTo({
						url: `/pages/draw/subPage/Doodles/index?chooseImagePath=${tempFilePaths[0]}&width=${imgWidth.value}&height=${imgheight.value}`

					})
				}, 1000)

			},
			fail: (err) => {
				console.log(err)
				uni.$u.toast('上传图片失败，请重试！')
			}
		})
	}
</script>

<style lang="scss">
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
			background-image: linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0), linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0);
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