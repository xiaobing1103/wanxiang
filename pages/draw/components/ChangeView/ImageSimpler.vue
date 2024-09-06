<template>
	<view class="ImageSimpler">
		<up-picker @confirm="confirm" keyName="title" :show="show" :columns="columns"
			@cancel="show = false"></up-picker>
		<view class="ImageSimpler_box" @click="show = true">
			<text class="ImageSimpler_content">{{parmas?.simpler}}</text>
			<up-icon name="arrow-down" size="18"></up-icon>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from "vue"
	import { Image2TextParmas } from '../../data';
	const parmas = defineModel<Image2TextParmas>("parmas")
	const setImageNums = (num : number) => {
		parmas.value.num = num
	}
	const show = ref(false);
	const columns = ref([
		['DPM++ SDE Karras', 'DPM++ 2S a', 'Euler a', 'DDIM']
	]);
	const confirm = (e) => {
		parmas.value.simpler = e.value[0]
		show.value = false
	}
</script>

<style lang="scss" scoped>
	.ImageSimpler {
		--backgroundColor: #{$aichat-seletedView-backgroundColor };
		--textColor : #{$aichat-seletedView-textColor};
		width: 80%;

		&_box {

			border: 1px solid #ccc;
			display: flex;
			height: 60rpx;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			justify-content: space-between;
			align-items: center;
		}

		&_content {
			font-size: 27rpx;

		}
	}
</style>