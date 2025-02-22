<template>
	<view class="ImageQuality">
		<view class="ImageQuality_buttons" v-for="(item,index) in ['普通','高清']" :key="index" :style="{
				background: index == parmas?.hire ? 'var(--backgroundColor)' : '#eee',
		        color: index == parmas?.hire  ?  'var(--textColor)' : ''}" @click="setImageQuality(index)">
			{{item}}
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Image2TextParmas } from '../../data';
	const parmas = defineModel<Image2TextParmas>("parmas")
	const setImageQuality = (index : number) => {
		parmas.value.hire = index
	}
</script>

<style lang="scss" scoped>
	.ImageQuality {
		display: flex;
		grid-gap: 30rpx;
		--backgroundColor: #{$aichat-seletedView-backgroundColor };
		--textColor : #{$aichat-seletedView-textColor};

		&_buttons {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100rpx;
			height: 60rpx;
			border-radius: 15rpx;
			padding: 10rpx;
			box-sizing: border-box;
			font-size: 22rpx;
		}
	}
</style>