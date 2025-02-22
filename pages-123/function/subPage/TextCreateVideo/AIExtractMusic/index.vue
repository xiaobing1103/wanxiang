<template>
	<HandlerImage :defindDatas="defindDatas" />
</template>

<script setup lang="ts">
	import HandlerImage from '../../CommonComponents/AIVideoCommon/HandlerImage.vue';
	const defindDatas = {
		title: 'AI提取音频',
		requestUrl: 'api/v1/video/get_wav'
	}
</script>

<style lang="scss" scoped>
</style>