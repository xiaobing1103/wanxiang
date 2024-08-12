<template>
	<view class="ImageShowcasePlaza">
		<custom-waterfalls-flow :value="ImageList" @imageClick="openImgae" @wapperClick="openImgae">
			<!-- #ifndef MP-WEIXIN -->
			<template v-slot:default="item">
				<view class="ImageShowcasePlazaBox_item">
					<view class="ImageShowcasePlazaBox_item_title">{{item.title}}</view>
					<view class="ImageShowcasePlazaBox_modelName">
						<text class="ImageShowcasePlazaBox_modelName_tag"> {{item.model_name}}</text>
						<text class="ImageShowcasePlazaBox_modelName_tag"> {{item.nick}}</text>
					</view>
				</view>
			</template>
			<!--  #endif -->


			<!-- #ifdef MP-WEIXIN -->
			<view class="ImageShowcasePlazaBox_item" v-for="(item,index) in ImageList" :key="index"
				slot="slot{{index}}">
				<view class="ImageShowcasePlazaBox_item_title">{{item.title}}</view>
				<view class="ImageShowcasePlazaBox_modelName">
					<text class="ImageShowcasePlazaBox_modelName_tag"> {{item.model_name}}</text>
					<text class="ImageShowcasePlazaBox_modelName_tag"> {{item.nick}}</text>
				</view>
			</view>
			<!--  #endif -->

		</custom-waterfalls-flow>
		<ImageModal :showImageModal="showImageModal" @closeImage="closeImage" :currentImages="currentImages" />
	</view>
</template>

<script setup lang="ts">
	import ImageModal from './ImageModal'
	import { ImageListDTO } from '../data';
	import { ref } from 'vue';
	const currentImages = ref<ImageListDTO>()
	defineProps<{ ImageList : ImageListDTO[] }>()
	const openImgae = (ImageList : ImageListDTO) => {
		currentImages.value = ImageList
		showImageModal.value = true
	}
	const closeImage = () => {
		showImageModal.value = false
	}
	const showImageModal = ref(false);
</script>

<style lang="scss">
	.ImageShowcasePlaza {
		width: 100%;

	}

	.ImageShowcasePlazaBox_item {
		display: flex;
		flex-direction: column;
		background-color: rgba(0, 0, 0, .2);
		padding: 10rpx;
		box-sizing: border-box;
	}

	.ImageShowcasePlazaBox_item_title {
		font-size: 25rpx;
	}

	.ImageShowcasePlazaBox_modelName_tag {
		background-color: #aaaa7f;
		border-radius: 10rpx;
		color: $uni-bg-color;
		padding: 5rpx;
		font-size: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 5rpx;
	}
</style>