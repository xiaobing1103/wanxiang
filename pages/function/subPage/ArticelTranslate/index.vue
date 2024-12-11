<template>
	<TranslateCommonTem :publicMethods="publicMethods" />
</template>

<script setup lang="ts">
	import TranslateCommonTem from '../CommonComponents/TranslateCommonTem.vue'
	import { publicMethodsType } from '../CommonComponents/types';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const { $assets } = useGlobalProperties()
	const publicMethods : publicMethodsType = {
		title: '论文翻译',
		uploadImageSrc: [$assets.wordFileIcon, $assets.ppxtRedFileIcon, $assets.excelFileIcon, $assets.ppxtYellowFileIcon]
	}
</script>

<style lang="scss">
</style>