<template>
	<view class="ChangeImageItems">
		<ChangeFaceUploadImage 
		noUseCorpImage 
		v-model:showupOverlay="showupOverlay"
		v-model:images="RequestParmas.imageUrl" 
		v-model:FileMode="RequestParmas.FileMode" 
		description="请上传二维码图片,其他图片会出错"
		/>
	</view>
</template>

<script setup lang="ts">
	import ChangeFaceUploadImage from '../CommonChangeFace/ChangeFaceUploadImage.vue'
	import { RequestParmasInterface } from './types'
	import { ref } from 'vue'
	const RequestParmas = defineModel<RequestParmasInterface>('RequestParmas')
	const showupOverlay = ref(false)
</script>

<style scoped lang="scss">
</style>