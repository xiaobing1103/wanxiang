<template>
	<view class="Revers3DTem">
		<view class="Revers3DTem_tabs">
			<!-- <view class="Revers3DTem_tabs_box">
				<up-tabs :inactiveStyle="inactiveStyle" lineColor="rgba(0,0,0,0)" :activeStyle="activeStyle"
					:list="tabs"></up-tabs>
			</view> -->
		</view>
		<view class="boxItems">
			<view class="label">
				图片数量 (请选择您要生成的数量)
			</view>
			<view class="values">
				<view class="numbersItems">
					<template v-for="(items,index) in [1,2,3,4]" :key="index">
						<view :style="{color:parmas.batch_size == items ? '#2979ff' :''}" class="numbersItems_items"
							@click="parmas.batch_size = items">
							{{items}}
						</view>
					</template>
				</view>

			</view>
		</view>
		<view class="boxItems">
			<view class="label">
				脸部修复
			</view>
			<view class="values">
				<view class="numbersItems">
					<template v-for="(items,index) in ['关闭','开启']">
						<view :style="{color:parmas.face_restoration == index ? '#2979ff' :''}"
							class="numbersItems_items" @click="parmas.face_restoration = index">
							{{items}}
						</view>
					</template>
				</view>
			</view>
		</view>
		<view class="boxItems">
			<view class="label">
				手部修复
			</view>
			<view class="values">
				<view class="numbersItems">
					<template v-for="(items,index) in ['关闭','开启']">
						<view :style="{color:parmas.hand_restoration == index ? '#2979ff' :''}"
							class="numbersItems_items" @click="parmas.hand_restoration = index">
							{{items}}
						</view>
					</template>
				</view>
			</view>
		</view>

		<view class="boxItems">
			<view class="label">
				变化强度 <view class="label_rightText">(越大与原图越不相近)</view>
			</view>
			<view class="values">
				<ImageLoraScale v-model:sliderValue="parmas.denoising_strength" :stepList="[0,2,4,6,8,10]" :min='0'
					:max='10' type="bianHua" />
			</view>
		</view>
		<view class="boxItems">
			<view class="label">
				迭代数 <view class="label_rightText">(越大与原图越不相近)</view>
			</view>
			<view class="values">
				<ImageLoraScale v-model:sliderValue="parmas.steps" :stepList="[20,25,30,35,40]" min='20' max='40'
					type="diedai" />
			</view>
		</view>


	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import ImageLoraScale from '../ChangeView/ImageLoraScale.vue'
	import { parmasTypes } from './types'
	const parmas = defineModel<parmasTypes>('parmas')
	const seletedNumber = ref(1)
	const seletedFace = ref(0)
	const seletedHand = ref(0)
	const sliderValue = ref(6)
	const sliderValue2 = ref(20)
	const tabs = [
		{ name: '参数设置' },
		{ name: '历史记录' },
	]

	const activeStyle = {
		color: '#2979ff',
		background: '#ecf5ff',
		padding: '13rpx',
		borderRadius: '15rpx'
	}
	const inactiveStyle = {
		padding: '13rpx',
		borderRadius: '15rpx'
	}
</script>

<style lang="scss" scoped>
	.Revers3DTem {
		display: flex;
		flex-direction: column;

		&_tabs {
			display: flex;
			justify-content: center;

			&_box {
				width: 51%;
				background-color: white;
				display: flex;
				justify-content: center;
				border-radius: 15rpx;
			}
		}
	}

	.boxItems {
		padding: 20rpx 0;
	}

	.label {
		font-size: 30rpx;
		font-weight: 800;
		display: flex;
		align-items: flex-end;

		&_rightText {
			color: #ccc;
			font-weight: 200;
			font-size: 24rpx;
			margin-left: 20rpx;
		}
	}

	.values {
		font-size: 27rpx;
	}

	.numbersItems {

		display: flex;
		padding: 20rpx 0;

		&_items {
			background-color: #d7ecff;
			margin-right: 40rpx;
			color: '#2979ff';
			padding: 20rpx 25rpx;
			font-size: 30rpx;
			border-radius: 10rpx;
		}
	}
</style>