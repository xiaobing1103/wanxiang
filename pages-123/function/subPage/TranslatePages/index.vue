<template>
	<TranslateTem :parmas="parmas" />
</template>

<script setup lang="ts">
	import TranslateTem from './TranslateTem.vue'
	const parmas = {
		title: 'AI文档翻译',
	}
</script>