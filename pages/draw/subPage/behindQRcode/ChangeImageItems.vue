<template>
	<view class="ChangeImageItems">
		<ChangeFaceUploadImage 
		noUseCorpImage 
		v-model:showupOverlay="showupOverlay"
		v-model:images="RequestParmas.imageUrl" 
		v-model:FileMode="RequestParmas.FileMode" 
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