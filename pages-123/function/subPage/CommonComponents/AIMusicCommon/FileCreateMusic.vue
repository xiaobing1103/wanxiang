<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'0 40rpx '}">
		<template #top>
			<CommonHeader :defindTitle="FileParmas.title" />
		</template>
		<view class="FileCreateMusic">
			<view class="FileCreateMusic_title">
				允许用户通过上传照片和视频来生成与之相匹配的音乐。无论是风景照片、搞笑的表情包还是自拍或日常视频，边界AI都能根据这些图像生成对应的音乐。用可以轻松地将视觉内容转化为听觉体验，创作出独特的音乐作品。
			</view>
			<view class="FileCreateMusic_upload">
				<ChangeFaceUploadImage noUseCorpImage v-model:showupOverlay="showupOverlay" description=""
					v-model:images="SoraPromptPramas.image_url" :showAngle="true" :width="900" :height="800" />
			</view>
		</view>
		<template #bottom>
			氛围废物废物
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import ChangeFaceUploadImage from '../../ChangeFaceUploadImage.vue'
	import { reactive, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	const props = defineProps<{ FileParmas : { title : string } }>()
	const showupOverlay = ref(false)
	const SoraPromptPramas = reactive({
		image_url: ''
	})
</script>

<style lang="scss" scoped>
	.FileCreateMusic {
		display: flex;
		flex-direction: column;

		&_title {
			font-size: 27rpx;
			padding: 20rpx 0;
			color: $aichat-border-color;
		}
	}
</style>