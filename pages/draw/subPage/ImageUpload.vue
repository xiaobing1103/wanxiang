<template>
	<view class="ImageUploadCom">
		<view class="ImageUploadCom_content" @click="uploadImages">
			<template v-if="url">
				<image class="ImageUploadCom_content_image" :src="url" mode="aspectFit"></image>
			</template>
			<template v-else>
				<up-icon
					:custom-style="{ justifyContent: 'center', display: 'block', width: '100%', textAlign: 'center' }"
					name="photo-fill" size="100"></up-icon>
				<text v-if="!isShowPlaceholder" class="ImageUploadCom_text">点击上传图片</text>
			</template>
		</view>

		<up-overlay :show="showUpOverlay" :mask-click-able="false">
			<!-- #ifndef APP-PLUS  -->
			<view class="overlayHandlerImages">
				<view class="headerItems" :style="{ height: ScreenStore.navBarHeight + 'px',background:'#fff'}">
					<view class="Doodles_footerBox">
						<view class="Doodles_footerBox_title">
							涂鸦
						</view>
						<view class="Doodles_footerBox_rightBox">
							<view class="Doodles_main_color">
								<image @click="showDrawColor = true" class="Doodles_main_color_image"
									:src="$assets.tuYaDrawTiaoseIcon" mode="" />
							</view>
							<view class="Doodles_main_pen">
								<image @click="showDrawWidth = true" class="Doodles_main_color_image"
									:src="$assets.tuYaDrawIcon" mode="" />
							</view>
							<view class="Doodles_footer" @click="getaddAfterImage">
								<view class="Doodles_footer_saveButton">
									保存
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="Doodles" v-show="!showDrawColor && !showDrawWidth">
					<view class="Doodles_main">
						<Vsign :lineWidth="linesWidth" :lineColor="seletedColor" :width="canvasWidth"
							:height="canvasHeight" :customStyle="{
								width: canvasWidth + 'px',
								height: canvasHeight + 'px',
								backgroundColor: 'transparent'
							}" @init="onSignInit">
						</Vsign>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS  -->
			<view class="overlayHandlerImages">
				<DrawTools @saveImage="saveImage" :img="url" />
			</view>
			<!-- #endif -->
		</up-overlay>
		<up-modal :show="showDrawColor" @confirm="showDrawColor = false">
			<view class="showDrawColorModal">
				<text class="showDrawColorModal_title">画笔颜色</text>
				<view class="Doodles_main_color_seletedBox">
					<template v-for="(item, index) in colors" :key="index">
						<view class="Doodles_main_color_seletedBox_colorsSeleted" :style="{ background: item }"
							@click="changeColor(item)">
							<text v-if="seletedColor == item"
								class="Doodles_main_color_seletedBox_colorsSeleted_text">✓</text>
						</view>
					</template>
				</view>
			</view>
		</up-modal>

		<up-modal :show="showDrawWidth" @confirm="showDrawWidth = false">
			<view class="showDrawColorModal">
				<text class="showDrawColorModal_title">画笔大小</text>
				<view class="Doodles_main_pen_box">
					<template v-for="(item, index) in linesWidthList" :key="index">
						<view class="Doodles_main_pen_box_items"
							:style="{ fontSize: item + 'px', border: linesWidth == item ? '1px solid #333' : '1px solid #fff' }"
							@click="seletedPen(item)">
							⚫
						</view>
					</template>
				</view>
			</view>
		</up-modal>
	</view>
</template>

<script setup lang="ts">
	import Vsign from './v-sign/components/v-sign/v-sign.vue'
	import DrawTools from './components/DrawTools.vue'
	import { ref, defineExpose, reactive } from 'vue';
	import { Image2TextParmas } from '../data';
	import useDrawStore, { taskIdTypeKey } from '@/store/draw';
	import { fileToBase64, wxBase64 } from '@/utils/file2Base64';
	import { storeToRefs } from 'pinia';
	import { base64ToFile } from '@/utils/base642file';
	import { base64ToTempUrl } from '@/utils/base64ToTempUrl';
	import { useScreenStore } from '@/store';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const showDrawColor = ref(false)
	const showDrawWidth = ref(false)
	const showUpOverlay = defineModel('showUpOverlay');
	const { $assets } = useGlobalProperties()
	const ScreenStore = useScreenStore();
	const props = defineProps<{ type : taskIdTypeKey, isShowPlaceholder ?: boolean }>();
	const parmas = defineModel<Image2TextParmas>('parmas');
	const url = defineModel<string>('url');
	const DrawStore = useDrawStore();
	const imgWidth = ref(512);
	const imgheight = ref(512);
	const show = ref(false)
	const signContext = ref(null);
	const canvasHeight = ref(0);
	const linesWidth = ref(4);
	const linesWidthList = [4, 6, 8, 10, 12, 14, 16, 18, 20];
	const colors = ['#000000', '#F5222D', '#FA8C16', '#FADB14', '#8BBB11', '#52C41A', '#13A8A8', '#1677FF', '#2F54EB', '#722ED1', '#EB2F96'];
	const currentImage = ref('');
	const seletedColor = ref('#000000');
	const canvasWidth = ref(0);
	const onSignInit = (signCtx : any) => {
		console.log(signCtx)
		signContext.value = signCtx;
	};

	const graffiti = ref(null)
	const stepInfo = ref({
		curStep: -1,
		len: 0
	})
	const stepChanged = (e) => {
		stepInfo.value = e;
	}
	const seletedPen = (pen : number) => {
		linesWidth.value = pen;
	};

	const changeColor = (color : string) => {
		seletedColor.value = color;
	};


	const getaddAfterImage = async () => {
		const base64 = await signContext.value.getImagePath();
		let temImage = base64.replace(/^data:.*;base64,/, '');
		// #ifdef H5
		DrawStore.setCurrentIamgeBase64(temImage);
		temImage = base64ToTempUrl(base64);
		// #endif

		url.value = temImage
		showUpOverlay.value = false
		// await signContext.value.clear();
		// const res = await graffiti.value.saveCanvas()
		// url.value = res
		// showUpOverlay.value = false
	};
	// 赋值image
	const hanlderImages = async (url : string) => {
		console.log('处理的 URL:', url);
		// #ifdef H5 
		if (props.type == 'coloringLineArt_task_json') {
			parmas.value.image = DrawStore.currentIamgeBase64;
		} else {
			parmas.value.image = base64ToFile(DrawStore.currentIamgeBase64, '涂鸦后图片');
		}

		const img = new Image();
		img.src = url;
		img.onload = () => {
			imgWidth.value = img.width;
			imgheight.value = img.height;
		};
		// #endif

		// #ifdef MP-WEIXIN || APP
		wx.getImageInfo({
			src: url,
			success: (res) => {
				imgWidth.value = res.width;
				imgheight.value = res.height;
			}
		});
		if (props.type == 'coloringLineArt_task_json') {
			const file = await wxBase64({ url: url, type: 'png' });
			parmas.value.image = file;
		} else {
			parmas.value.image = url;
		}
		// #endif
	};
	defineExpose({
		hanlderImages
	});
	const addImage = () => {
		signContext.value.addImages(currentImage.value, canvasWidth.value, canvasHeight.value);
	};
	const uploadImages = () => {
		if (!props.isShowPlaceholder) {
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				success: async (options) => {
					console.log(options)
					const { tempFilePaths, tempFiles } = options;
					url.value = tempFilePaths[0];
					// #ifdef H5
					if (props.type == 'coloringLineArt_task_json') {
						fileToBase64(tempFiles[0], (base64) => {
							parmas.value.image = base64;
						});
					} else {
						parmas.value.image = tempFiles[0];
					}
					const img = new Image();
					img.src = tempFilePaths[0];
					img.onload = async () => {
						imgWidth.value = img.width;
						imgheight.value = img.height;
						updateCanvasSize();
					};
					// #endif

					// #ifdef MP-WEIXIN || APP
					wx.getImageInfo({
						src: tempFilePaths[0],
						success: async (res) => {
							imgWidth.value = res.width;
							imgheight.value = res.height;
							updateCanvasSize();
						}
					});

					if (props.type == 'coloringLineArt_task_json') {
						const file = await wxBase64({ url: tempFilePaths[0], type: 'png' });
						parmas.value.image = file;
					} else {
						parmas.value.image = tempFilePaths[0];
					}
					// #endif
				},
				fail: (err) => {
					console.log('err', err);
					uni.$u.toast('上传图片失败，请重试！');
				}
			});

		}
	};

	const updateCanvasSize = () => {
		const isOpenDoodlesArr = ['coloringLineArt_task_json', 'image2cartoon_task_json', 'portraitCutout_task_json', 'reserveWordIcons_task_json'];
		if (!isOpenDoodlesArr.includes(DrawStore.seletedDrawProject)) {
			showUpOverlay.value = true;
			// #ifndef APP-PLUS 
			currentImage.value = url.value;
			const screenWidth = ScreenStore.systemInfo.screenWidth;
			const screenHeight = ScreenStore.systemInfo.screenHeight;
			const imageWidth = imgWidth.value;
			const imageHeight = imgheight.value;
			const widthRatio = screenWidth / imageWidth;
			const heightRatio = screenHeight / imageHeight;
			const scaleRatio = Math.min(widthRatio, heightRatio);
			canvasWidth.value = imageWidth * scaleRatio;
			canvasHeight.value = imageHeight * scaleRatio;
			setTimeout(() => {
				addImage();
			}, 200);
			// #endif
		}
	};

	const saveImage = (e) => {
		console.log(e)
		url.value = e


		parmas.value.image = e
		showUpOverlay.value = false;
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
			background-image: linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0),
				linear-gradient(45deg, #e6e6e6 25%, transparent 0, transparent 75%, #e6e6e6 0);
			background-position: 0 0, 15rpx 15rpx;
			background-size: 30rpx 30rpx;
			border: #e4e4e4 2rpx solid;

			&_image {
				// width: 100%;
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


	.overlayHandlerImages {
		width: 100vw;
		height: 100vh;
		background-color: #fff;
	}

	.headerItems {
		display: flex;
		align-items: flex-end;
		width: 100%;
		padding-top: 30rpx;
		box-sizing: content-box;
		background-color: #fff;
	}



	.Doodles {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		margin-top: 50rpx;

		&_main {
			height: 100%;
			width: 100%;
			display: flex;
			// align-items: center;
			position: relative;

			&_color {
				// width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				// padding: 0 30rpx;
				&_image {
					width: 40rpx;
					height: 40rpx;
				}



				&_seletedBox {
					width: 100%;
					display: flex;

					&_colorsSeleted {
						width: 40rpx;
						height: 40rpx;
						margin: 5rpx;
						border-radius: 10rpx;

						&_text {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
							height: 100%;
							text-align: center;
							font-weight: bold;
							color: #fff;
							font-size: 30rpx;
						}
					}
				}
			}

			&_pen {
				// width: 100%;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				// padding: 25rpx 30rpx;
				flex-direction: column;

				&_box {
					width: 100%;
					display: flex;
					align-items: flex-end;
					justify-content: flex-start;

					&_items {
						transition: 1s all;
						display: flex;
						align-items: center;
						justify-content: center;
						margin: 0 10rpx;

						border-radius: 50%;
					}
				}
			}
		}

		&_footerBox {
			height: 80rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-start;

			&_rightBox {
				display: flex;
				width: 40%;
				margin-left: 50rpx;
				justify-content: space-around;
			}

			&_title {
				font-size: 35rpx;
				padding: 0 20rpx;
				font-weight: 800;
			}
		}

		&_footer {
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			&_saveButton {
				font-size: 27rpx;
				padding: 12rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				color: #ffffff !important;
				background: linear-gradient(to right, #1cd8ba, #06c0f9);
			}
		}
	}

	.Doodles_main_imageBox {
		z-index: 1;
		position: absolute;
		top: 0;
	}

	.scroll-container {
		height: 90vh;
		min-height: 90vh;
		max-height: 90vh;
		box-sizing: border-box;
	}

	.showDrawColorModal {
		display: flex;
		align-items: center;
		flex-direction: column;

		&_title {
			font-size: 30rpx;
			font-weight: 800;
			padding-bottom: 20rpx;
		}
	}
</style>