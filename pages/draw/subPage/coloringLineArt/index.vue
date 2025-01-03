<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0'}">
		<template #top>
			<template v-if="!showUpOverlay">
				<CommonHeader defindPath="/pages/draw/index" />
			</template>
		</template>
		<view class="body">
			<CommonTitle title="线稿上色" desc="在线AI绘画,创作你的专属作品" />
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
	import { ImageProjectTypes } from '../../data';
	import { ref } from 'vue'
	const showUpOverlay = ref(false)
	const IamgeTypes : ImageProjectTypes = {
		type: 'coloringLineArt',
		historyType: 'coloringLineArt_task_json',
		api: 'api/v1/img/lines2img',
		loraScaleStepList: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		// loraScaleStepList: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
		denoising_strengthStepList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		stepStepList: [15, 18, 21, 24, 27, 30],
		cfg_scaleStepList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		weightStepList: [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
		denoising_strengthStepMin: '0',
		denoising_strengthStepMax: '10',
		DifferenceStrength: 60
	}

	const parmas = {
		// 模型id
		'model': 'b49012a9071407209652d332517a182e',
		// 宽度        
		'width': 512,
		//高度
		'height': 512,
		// 提示词
		'prompt': '',
		// 图片风格
		'loraId': '',
		// 风格强度 线稿上色 是 60 到 70
		'loraScale': 66,
		//变化强度
		'denoising_strength': 1,
		//文本强度
		'cfg_scale': 7,
		//迭代数
		'step': 20,
		//负标签
		'negative_prompt': 'easynegative, (worst quality:1.3), (low quality:1), (normal quality:1.4), lowres,skin spots, acnes, skin blemishes, age spot, glan, extra fingers, fewer fingers, strange fingers, bad hand, bad anatomy, fused fingers, missing leg, mutated hand, malformed limbs, missing feet,multiple legs,men,boy,logo, loli,3d,extra hands,extra foots',
		// 采样器
		'simpler': 'DPM++ SDE Karras',
		// 随机种子
		'seed': -1,
		// 图片数量
		'num': 1,
		//图片分辨率
		'hire': 0,
		//（去除）
		'type': 0,
		// 权重 
		'weight': 100,
	}
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 30rpx;
	}
</style>