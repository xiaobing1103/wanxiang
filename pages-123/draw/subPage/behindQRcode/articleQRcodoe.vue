<template>
	<QRcodeTem :QRcodeParmas="QRcodeParmas" />
</template>

<script setup lang="ts">
	import QRcodeTem from "./QRcodeTem.vue"
	
	const QRcodeParmas = {
		title: 'AI艺术二维码'
	}
</script>

<style lang="scss" scoped>

</style>