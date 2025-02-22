<template>
	<view class="uploadFileTranslateTop">
		<view class="uploadFileTranslateTop_left">
			自动检测源语言
		</view>
		<view class="uploadFileTranslateTop_middle">
			→
		</view>
		<view class="uploadFileTranslateTop_right" @click="changeLang">
			{{currentLang}} <up-icon :style="{margin:'0 10rpx'}" name="arrow-down" size="15"></up-icon>
		</view>
	</view>

	<up-popup :show="openPopup" round="15" @open="openPopup = true" @close="openPopup = false">
		<view class="upPopupLayout">
			<view class="upPopup" v-for="(items,index) in languages" :key="index"
				@click="currentLang = items; openPopup = false">
				<text>{{items}}</text>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { languages } from '../TranslatePages/type'
	const currentLang = defineModel('currentLang')
	const openPopup = ref(false)
	const changeLang = () => {
		openPopup.value = !openPopup.value
	}
</script>

<style lang="scss" scoped>
	.uploadFileTranslateTop {
		font-size: 27rpx;
		display: flex;
		text-align: center;
		justify-content: space-between;
		align-items: center;

		&_left {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_right {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
			display: flex;
			align-items: center;
		}

		&_middle {
			padding: 0 50rpx;

		}

	}

	.upPopupLayout {
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.upPopup {
		display: flex;
		justify-content: center;
		padding: 20rpx;
	}
</style>