<template>
	<view class="ImageNums">
		<view class="ImageNums_box" v-for="(item,index) in [1,2,3,4]" @click="setImageNums(item)" :style="{    
				background: item == parmas?.num ? 'var(--backgroundColor)' : '#eee',
                color: item == parmas?.num ? 'var(--textColor)' : ''}">
			<view class="ImageNums_content">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Image2TextParmas } from '../../data';
	const parmas = defineModel<Image2TextParmas>("parmas")
	const setImageNums = (num : number) => {
		parmas.value.num = num
	}
</script>

<style lang="scss" scoped>
	.ImageNums {
		display: flex;
		grid-gap: 30rpx;
		--backgroundColor: #{$aichat-seletedView-backgroundColor };
		--textColor : #{$aichat-seletedView-textColor};

		&_box {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 80rpx;
			height: 80rpx;
			border-radius: 15rpx;
			padding: 10rpx;
			box-sizing: border-box;
		}
	}
</style>