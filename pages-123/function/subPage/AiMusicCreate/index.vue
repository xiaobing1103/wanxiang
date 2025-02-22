<template>
	<AIMusicTemplate :publicMethods="publicMethods" />
</template>

<script setup lang="ts">
	import AIMusicTemplate from '../CommonComponents/AIMusicCommon/AIMusicTemplate.vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	
	const publicMethods = {
		title: 'AI音乐',
		currentPages: 0
	}

	onLoad(async (query) => {
		if (query.currentPages) {
			publicMethods.currentPages = Number(query.currentPages)
		}

	});
</script>