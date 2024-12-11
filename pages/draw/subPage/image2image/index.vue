<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<template v-if="!showUpOverlay">
				<CommonHeader defindPath="/pages/draw/index" />
			</template>
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<view class="body">
			<CommonTitle title="图片生成图片" desc="在线AI绘画,创作你的专属作品" />
			<CommonDrawTem v-model:showUpOverlay="showUpOverlay" :IamgeTypes="IamgeTypes" :parmas="parmas" />
		</view>

		<template #bottom>

		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonTitle from '@/components/CommonTitle.vue'
	import CommonDrawTem from "../CommonDrawTem"
	import { ref, computed } from 'vue'
	import { ImageProjectTypes } from '../../data';
	const showUpOverlay = ref(false)
	const IamgeTypes : ImageProjectTypes = {
		type: 'image2image',
		historyType: 'img2img_task_json',
		api: 'api/v1/img/img2img',
		loraScaleStepList: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		denoising_strengthStepList: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		stepStepList: [15, 18, 21, 24, 27, 30],
		cfg_scaleStepList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		denoising_strengthStepMin: '1',
		denoising_strengthStepMax: '100'
	}
	const parmas = ref({
		// 文本强度
		cfg_scale: 7,
		// 变化强度 为 60 - 70 但是显示为 0 - 10
		denoising_strength: 60,
		// 图片画质
		hire: 0,
		// 图片风格
		loraId: "",
		// 风格强度
		loraScale: 66,
		// 模型id
		model: "b49012a9071407209652d332517a182e",
		// 负标签
		negative_prompt: "easynegative, (worst quality:1.3), (low quality:1), (normal quality:1.4), lowres,skin spots, acnes, skin blemishes, age spot, glan, extra fingers, fewer fingers, strange fingers, bad hand, bad anatomy, fused fingers, missing leg, mutated hand, malformed limbs, missing feet,multiple legs,men,boy,logo, loli,3d,extra hands,extra foots",
		// 图片数量
		num: 1,
		// 文本输入
		prompt: "",
		// 随机种子
		seed: -1,
		// 采样器
		simpler: "DPM++ SDE Karras",
		// 迭代数
		step: 20,
		// 宽度
		width: 512,
		// 高度
		height: 512,
	})
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
</style>