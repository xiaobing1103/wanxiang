<template>
	<view class="TemImages">
		<template v-if="type == 'style'">
			<view class="TemImages_content " style="background: #ccc;" @click="seletedModels('')"
				:style="{border: parmas.loraId == ''  ?  '3px solid  #1cd8ba' : '3px solid white'}">
				<image class="TemImages_content_images" :style="{height: '50rpx' ,width:'50rpx'}"
					src="//file.1foo.com/2024/03/02/1aa03b7f42c7c38855e2c355182d1083.png" mode=""></image>
				<text class="TemImages_content_text">不使用</text>
			</view>
		</template>
		<view class="TemImages_content" v-for="item in datas" :key="item.id" :style="{border: isModelId  ==  item.id ? 
			'3px solid transparent' : '3px solid white'}" @click="seletedModels(item.id)">
			<image class="TemImages_content_images" :src="item.image" mode=""></image>
			<text class="TemImages_content_text"> {{item.name}}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { Image2TextParmas, modelsDTO } from '../../data';
	import { stylesDTO } from '../../data';
	const props = defineProps<{ datas : modelsDTO[] | stylesDTO[], type : 'model' | "style" }>()
	const parmas = defineModel<Image2TextParmas>("parmas")
	const isModelId = computed(() => props.type == 'model' ? parmas.value.model : parmas.value.loraId)
	const seletedModels = (id : string) => {
		if (!id) {
			if (props.type == 'style') {
				parmas.value.loraId = ''
			}
			return
		}
		if (props.type == 'model') {
			parmas.value.model = id
		}
		if (props.type == 'style') {
			parmas.value.loraId = id
		}
	}
</script>

<style lang="scss" scoped>
	.TemImages {
		display: grid;
		grid-template-columns: repeat(20, 8fr);
		grid-gap: 20rpx;
		width: 100%;
		overflow-x: scroll;



		&_content {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			border-radius: 10px;
			background: linear-gradient(to right, #1cd8ba, #06c0f9);
			background-clip: border-box;



			&_images {
				height: 140rpx;
				border-radius: 10rpx;
				width: 140rpx;


			}

			&_text {
				position: absolute;
				width: 100%;
				display: flex;
				padding: 5rpx 0;
				border-radius: 0 0 10rpx 10rpx;
				justify-content: center;
				background-color: rgba(0, 0, 0, .5);
				font-size: 20rpx;
				bottom: 0;
				color: $uni-bg-color;
			}
		}
	}
</style>