<template>
	<AIVideoCommon v-model:allParmas="allParmas" />
</template>

<script setup lang="ts">
	import { reactive } from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import AIVideoCommon from '../CommonComponents/AIVideoCommon/index.vue'

	const allParmas = reactive({
		title: '文生视频',
		currentPages: 0
	})
	onLoad(async (query) => {
		if (query.currentPages) {
			allParmas.currentPages = Number(query.currentPages)
			allParmas.title = allParmas.currentPages ? '图生视频' : '文生视频'
		}
	});
</script>

<style>
</style>