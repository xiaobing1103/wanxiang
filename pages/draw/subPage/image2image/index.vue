<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<view class="body">
			<CommonTitle title="图片生成图片" desc="在线AI绘画,创作你的专属作品" />
			<CommonDrawTem :IamgeTypes="IamgeTypes" />
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
		type: 'image2image',
		historyType: 'img2img_task_json',
		api: 'api/v1/img/img2img'
	}
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
</style>