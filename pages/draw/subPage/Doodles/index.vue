<template>
	<z-paging ref="srollRef" :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 0rpx' }">
		<template #top>
			<CommonHeader defindTitle="图片涂鸦" />
		</template>
		<!-- 对话框 -->
		<scroll-view class="scroll-container">
			<view class="Doodles">
				<!-- 	<view class="Doodles_header">
					<CommonTitle title="图片涂鸦" desc="尽情发挥你的想象力" />
				</view> -->
				<view class="Doodles_main">
					<!-- <view class="Doodles_main_imageBox">
						<image :style="{width:canvasWidth + 'px',height:canvasHeight+ 'px'}" :src="currentImage"
							mode=""></image>
					</view> -->
					<v-sign
						:lineWidth="linesWidth"
						:lineColor="seletedColor"
						:width="canvasWidth"
						:height="canvasHeight"
						:customStyle="{
							width: canvasWidth + 'px',
							height: canvasHeight + 'px',
							backgroundColor: 'transparent'
						}"
						@init="onSignInit"
					>
						<!-- 	<view class="Doodles_main_color">
							<text>画笔颜色</text>
							<v-sign-color></v-sign-color>
						</view> -->

						<!-- <v-sign-action @save="save" @clear="clear"></v-sign-action> -->
						<!-- 		<view class="Doodles_main_pen">
							<text>画笔大小</text>
							<v-sign-pen></v-sign-pen>
						</view> -->
					</v-sign>
				</view>
			</view>
		</scroll-view>

		<template #bottom>
			<view class="Doodles_footerBox">
				<view class="Doodles_main_color">
					<text>画笔颜色</text>
					<view class="Doodles_main_color_seletedBox">
						<template v-for="(item, index) in colors" :key="index">
							<view class="Doodles_main_color_seletedBox_colorsSeleted" :style="{ background: item }" @click="changeColor(item)">
								<text v-if="seletedColor == item" class="Doodles_main_color_seletedBox_colorsSeleted_text">✓</text>
							</view>
						</template>
					</view>
				</view>

				<view class="Doodles_main_pen">
					<text>画笔大小</text>
					<view class="Doodles_main_pen_box">
						<template v-for="(item, index) in linesWidthList" :key="index">
							<view
								class="Doodles_main_pen_box_items"
								:style="{ fontSize: item + 'px', border: linesWidth == item ? '1px solid #333' : '1px solid #fff' }"
								@click="seletedPen(item)"
							>
								⚫
							</view>
						</template>
					</view>
				</view>
				<view class="Doodles_footer" @click="getaddAfterImage">点击确认涂鸦</view>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
import CommonHeader from '@/components/CommonHeader.vue';
import { useDrawStore, useScreenStore } from '@/store';
import CommonTitle from '@/components/CommonTitle.vue';
import { onLoad } from '@dcloudio/uni-app';
import { base64ToTempUrl } from '@/utils/base64ToTempUrl';
import { onMounted, ref } from 'vue';
import { drawProjectConfig } from '../../data';
const ScreenStore = useScreenStore();
const DrawStore = useDrawStore();
const winWidth = ref(ScreenStore.systemInfo.windowWidth);
const signContext = ref(null);
const onSignInit = (signCtx) => {
	signContext.value = signCtx;
};
const seletedColor = ref('#000000');
const colors = ['#000000', '#F5222D', '#FA8C16', '#FADB14', '#8BBB11', '#52C41A', '#13A8A8', '#1677FF', '#2F54EB', '#722ED1', '#EB2F96'];
const linesWidth = ref(4);
const linesWidthList = [4, 6, 8, 10, 12, 14, 16, 18, 20];
const currentImage = ref('');
const currentImagewidth = ref(0);
const currentImageheight = ref(0);

const canvasWidth = ref(0);
const canvasHeight = ref(0);

const seletedPen = (pen: number) => {
	linesWidth.value = pen;
};

const changeColor = (color: string) => {
	seletedColor.value = color;
};

const addImage = () => {
	signContext.value.addImages(currentImage.value, canvasWidth.value, canvasHeight.value);
};
const getaddAfterImage = async () => {
	const base64 = await signContext.value.getImagePath();
	let temImage = base64.replace(/^data:.*;base64,/, '');
	// #ifdef H5
	DrawStore.setCurrentIamgeBase64(temImage);
	temImage = base64ToTempUrl(base64);
	// #endif
	uni.navigateTo({
		url: drawProjectConfig[DrawStore.seletedDrawProject].path + `?temImages=${temImage}`
	});
};
onMounted(async () => {
	adjustCanvasSizeAndDrawImage();
	setTimeout(() => {
		addImage();
	}, 1000);
});

async function adjustCanvasSizeAndDrawImage() {
	const screenWidth = ScreenStore.systemInfo.screenWidth;
	const screenHeight = ScreenStore.systemInfo.screenHeight;
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
		currentImage.value = query.chooseImagePath;
	}
	if (query.width) {
		currentImagewidth.value = query.width;
	}
	if (query.height) {
		currentImageheight.value = query.height;
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
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding: 0 30rpx;

			&_seletedBox {
				width: 100%;
				display: flex;

				&_colorsSeleted {
					width: 40rpx;
					height: 40rpx;
					margin: 10rpx;
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
			width: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			padding: 25rpx 30rpx;
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
		overflow: hidden;
		width: 100%;
		min-height: 35vh;
		display: flex;
		flex-direction: column;
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

.scroll-container {
	overflow: hidden;
	height: 50vh;
	min-height: 50vh;
	max-height: 50vh;
	box-sizing: border-box;
}
</style>
