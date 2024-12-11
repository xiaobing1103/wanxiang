<template>
	<template v-if="currentHistoryImages.length > 0">
		<view class="HistoryCreateImages">

			<view class="HistoryCreateImagesBox" v-for="(items,index) in currentHistoryImages" :key="index">
				<view class="HistoryCreateImages_content">
					<image class="HistoryCreateImages_content_iamges" @click="openImages(items.images)"
						:src="items.images[0]" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</template>
	<template v-else>
		<view class="NoImagestips">
			当前模型没有生成任何图片
		</view>
	</template>
</template>

<script setup lang='ts'>
	import {
		computed
	} from "vue";
	import {
		useDrawStore
	} from "@/store";
	const drawStore = useDrawStore()
	const currentHistoryImages = computed(() => {
		return drawStore.taskIdParmas[drawStore.seletedDrawProject].historyTasks
	})

	const openImages = (image: string[]) => {
		uni.previewImage({
			urls: image
		})
	}
</script>

<style lang="scss">
	.HistoryCreateImages {

		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 20rpx;

		&_content {
			border-radius: 10rpx;
			width: 200rpx;
			height: 200rpx;
			overflow: hidden;

			&_iamges {
				width: 200rpx;
				height: 200rpx;

			}
		}
	}

	.HistoryCreateImagesBox {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.NoImagestips {
		font-size: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: $aichat-border-color;
	}
</style>