<template>
	<view class="bigBox">
		<view class="ImageLoraScale_left">
			<view class="m-slider-container">
				<slider block-size="10" activeColor="#4072ff" :value="sliderValue" class="m-slider" :min="min"
					:max="max" @changing="change" />
				<view class="step-text">
					<text v-for="(item, index) in stepList" :key="item" class="text" :class="{ active: isActive(item) }"
						:style="{ left: left(index) }">{{ item }}</text>
				</view>
			</view>
		</view>
		<view class="ImageLoraScale_right">
			{{sliderValue}}
		</view>
	</view>
</template>
<script setup lang="ts">
	import { defineProps } from 'vue';
	const props = defineProps<{
		type : 'loraScale' | 'step' | 'cfg_scale' | 'denoising_strength' | 'weight',
		min : string,
		max : string,
		stepList ?: number[]
	}>();

	const sliderValue = defineModel<number>('sliderValue');

	const change = (e) => {
		sliderValue.value = e.detail.value;
	};

	const left = (index : number) => {
		return index * (100 / (props.stepList.length - 1)) + '%';
	};

	// 计算哪些 `text` 元素应该被激活
	const isActive = (item : number) => {
		return sliderValue.value >= item;
	};
</script>

<style lang="scss" scoped>
	.bigBox {
		display: flex;
		width: 100%;

	}

	.ImageLoraScale_left {
		width: 90%;
		padding: 0 25rpx;
	}

	.ImageLoraScale_right {
		width: 10%;
		margin-left: 20rpx;
		font-size: 27rpx;
		color: $uni-text-color;
	}

	.m-slider-container {
		.m-slider {
			margin: 0;

			::v-deep {
				.uni-slider-handle-wrapper {
					height: 10rpx;
				}

				.uni-slider-thumb {
					box-shadow: 0 0 0 4rpx #fff;
				}

				.uni-slider-track {
					background-image: linear-gradient(270deg, #4072ff 0%, #6791ff 99%);
					border-radius: 5px;
				}
			}
		}

		.range-text {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
		}

		.step-text {
			margin-top: 20rpx;
			height: 30rpx;
			position: relative;

			.text {
				position: absolute;
				top: 0;
				margin-left: -13px;
				text-align: center;
				width: 56rpx;
				font-size: 20rpx;
				color: #333;

				// :before {
				// 	content: "";
				// 	position: absolute;
				// 	top: -48rpx;
				// 	z-index: 0;
				// 	border-radius: 50%;
				// 	width: 20rpx;
				// 	height: 20rpx;
				// 	background-color: rgb(233, 233, 233);
				// }

				&.active {
					color: #4072ff;

					:before {
						background-color: #4072ff;
					}
				}
			}
		}
	}
</style>