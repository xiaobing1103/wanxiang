<template>
	<view class="CanvasProportion">
		<template v-for="(item, index) in sizeList" :key="index">
			<view :style="{
			background: item.value == parmas?.width + 'x' + parmas?.height ? 'var(--backgroundColor)' : '#eee',
			color: item.value == parmas?.width + 'x' + parmas?.height ? 'var(--textColor)' : ''
		}" @click="setProportion(item.value)" class="CanvasProportion_box">
				<view class="CanvasProportion_content" :style="{
				height: getHeight(Number(item.parent.split(':')[0]) *30) + 'rpx',
				width: getWidth(Number(item.parent.split(':')[1]) *30) + 'rpx',
				background: item.value == parmas?.width + 'x' + parmas?.height ?  'var(--backgroundColor)' : 'rgb(255, 255, 255)',
				border: item.value == parmas?.width + 'x' + parmas?.height ? '1px dashed var(--textColor)' : '1px dashed #eee'
			}">
				</view>
				<view class="CanvasProportion_textBox">{{item.parent}}</view>
			</view>
		</template>

	</view>
</template>


<script setup lang="ts">
	import { sizeList, Image2TextParmas } from '../../data';
	const parmas = defineModel<Image2TextParmas>("parmas");
	const setProportion = (proportion : string) => {
		parmas.value.width = parseInt(proportion.split('x')[0]);
		parmas.value.height = parseInt(proportion.split('x')[1]);
	}

	const getHeight : (height : number) => number = (height : number) => {
		if (height >= 50) {
			return getHeight(height * 0.5) as number
		} else {
			return height as number
		}
	}
	const getWidth = (width : number) : number => {
		if (width >= 50) {
			return getHeight(width * 0.3);
		} else {
			return width;
		}
	}
</script>


<style lang="scss" scoped>
	.CanvasProportion {
		display: grid;
		grid-template-columns: repeat(10, 8fr);
		grid-gap: 30rpx;
		width: 100%;
		overflow-x: scroll;
		--backgroundColor: #{$aichat-seletedView-backgroundColor };
		--textColor : #{$aichat-seletedView-textColor};


		&_box {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			width: 100rpx;
			border-radius: 15rpx;
			padding: 10rpx;
			box-sizing: border-box;
		}

		&_content {}

		&_textBox {
			padding-top: 20rpx;
			font-size: 25rpx;
			box-sizing: border-box;
			box-sizing: border-box;
		}
	}

</style>