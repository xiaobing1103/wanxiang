<template>
	<z-paging ref="srollRef" :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 0rpx' }">
		<template #top>
			<CommonHeader defindTitle="图片涂鸦" />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->


		<view class="body">
			<view class="Doodles">
				<!-- <view class="Doodles_header">
					<CommonTitle title="图片涂鸦" desc="尽情发挥你的想象力" />
				</view> -->
				<view class="Doodles_main">
					<!-- 			<view class="Doodles_main_imageBox">
						<image :style="{width:canvasWidth + 'px',height:canvasHeight+ 'px'}" :src="currentImage"
							mode=""></image>
					</view> -->
					<v-sign :width="canvasWidth" :height="canvasHeight " :customStyle="{ 
						width:canvasWidth + 'px',
						height:canvasHeight+ 'px',
					    backgroundColor: 'transparent'
					}" @init="onSignInit">
						<view class="Doodles_main_color">
							<text>画笔颜色</text>
							<v-sign-color></v-sign-color>
						</view>

						<!-- <v-sign-action @save="save" @clear="clear"></v-sign-action> -->
						<view class="Doodles_main_pen">
							<text>画笔大小</text>
							<v-sign-pen></v-sign-pen>
						</view>

					</v-sign>
				</view>


			</view>
		</view>

		<template #bottom>
			<view class="Doodles_footerBox">
				<view class="Doodles_footer" @click="getaddAfterImage">点击确认涂鸦</view>
			</view>
			<!-- <up-input v-model="chatValue" @changeData="changeData">修改子组件的数据</up-input> -->
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import { useDrawStore, useScreenStore } from '@/store'
	import CommonTitle from '@/components/CommonTitle.vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { base64ToTempUrl } from '@/utils/base64ToTempUrl'
	import { onMounted, ref } from 'vue'
	import { drawProjectConfig } from '../../data'
	const ScreenStore = useScreenStore()
	const DrawStore = useDrawStore()
	const winWidth = ref(ScreenStore.systemInfo.windowWidth)
	const signContext = ref(null)
	const onSignInit = (signCtx) => {
		signContext.value = signCtx
	}
	const currentImage = ref('')
	const currentImagewidth = ref(0)
	const currentImageheight = ref(0)


	const canvasWidth = ref(0)
	const canvasHeight = ref(0)
	const clear = () => {
		signContext.value.clear()
	}
	const save = (tempFilePath) => {
		console.log(tempFilePath);
	}
	const revoke = () => {
		signContext.value.revoke()
	}
	const addImage = () => {
		console.log(currentImage.value)
		signContext.value.addImages(currentImage.value, canvasWidth.value, canvasHeight.value)

	}
	const getaddAfterImage = async () => {
		let temImage = await signContext.value.getImagePath()
		// #ifdef H5
		temImage = base64ToTempUrl(temImage)
		// #endif
		uni.navigateTo({
			url: drawProjectConfig[DrawStore.seletedDrawProject].path + `?temImages=${temImage}`
		})

	}
	onMounted(async () => {
		adjustCanvasSizeAndDrawImage()
		setTimeout(() => {
			addImage()
			signContext.value.getImagePath('transparent')
		}, 1000)
	})

	async function adjustCanvasSizeAndDrawImage() {
		const screenWidth = ScreenStore.systemInfo.screenWidth
		const screenHeight = ScreenStore.systemInfo.screenHeight
		const imageWidth = currentImagewidth.value;
		const imageHeight = currentImageheight.value;
		const widthRatio = screenWidth / imageWidth;
		const heightRatio = screenHeight / imageHeight;

		const scaleRatio = Math.min(widthRatio, heightRatio);
		canvasWidth.value = imageWidth * scaleRatio;
		canvasHeight.value = imageHeight * scaleRatio;
	}

	onLoad((query) => {
		if (query.chooseImagePath) {
			currentImage.value = query.chooseImagePath
		}
		if (query.width) {
			currentImagewidth.value = query.width
		}
		if (query.height) {
			currentImageheight.value = query.height
		}
	});
</script>

<style lang="scss">
	.Doodles {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;

		&_main {
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
			position: relative;

			&_color {
				padding: 0 30rpx;
			}

			&_pen {

				width: 100%;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				padding: 25rpx 30rpx;
				flex-direction: column;
			}
		}

		&_footerBox {

			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&_footer {
			width: 70%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 25rpx 0;
			padding: 25rpx;
			font-size: 25rpx;
			border-radius: 1.09375rem !important;
			height: 80rpx !important;
			color: #ffffff !important;
			background: linear-gradient(to right, #1cd8ba, #06c0f9);
			cursor: pointer;
		}
	}

	.Doodles_main_imageBox {
		z-index: 1;
		position: absolute;
		top: 0;
	}
</style>