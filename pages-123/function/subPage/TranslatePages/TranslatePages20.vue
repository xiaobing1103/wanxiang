<template>
	<TranslateTem :parmas="parmas" />
</template>

<script setup lang="ts">
	import TranslateTem from './TranslateTem.vue'

	const parmas = {
		title: 'AI文档翻译2.0',
		type: 'TranslateTem20'
	}
</script>