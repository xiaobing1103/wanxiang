<template>
	<HandlerImage :defindDatas="defindDatas" />
</template>

<script setup lang="ts">
	import HandlerImage from '../../CommonComponents/AIVideoCommon/HandlerImage.vue';
	const defindDatas = {
		title: 'AI视频抠图',
		requestUrl: 'api/v1/video/process_video'
	}
</script>

<style lang="scss" scoped>
</style>