<template>
	<QRcodeTem :QRcodeParmas="QRcodeParmas" />
</template>

<script setup lang="ts">
	import QRcodeTem from "./QRcodeTem.vue"
	
	const QRcodeParmas = {
		title: 'AI隐藏二维码'
	}
</script>

<style lang="scss" scoped>

</style>