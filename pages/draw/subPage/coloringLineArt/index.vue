<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<view class="body">
			<CommonTitle title="线稿上色" desc="在线AI绘画,创作你的专属作品" />
			<CommonDrawTem :IamgeTypes="IamgeTypes" :parmas="parmas" />
		</view>

		<template #bottom>

		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonTitle from '@/components/CommonTitle.vue'
	import CommonDrawTem from "../../components/CommonDrawTem"
	const IamgeTypes = {
		type: 'coloringLineArt',
		historyType: 'coloringLineArt_task_json',
		api: 'api/v1/img/lines2img'
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
		// 线稿上色 是 60 到 70  风格强度
		'loraScale': 66,
		//变化强度
		'denoising_strength': 65,
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
		'num': 2,
		//图片分辨率
		'hire': 0,
		//（去除）
		'type': 0,
		// 权重 
		'weight': 1.0,
	}
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
</style>