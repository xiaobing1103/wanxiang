<template>
	<z-paging>
		<web-view  :src="previewUrl"></web-view>
	</z-paging>
</template>

<script lang="ts" setup>
	import {ref} from 'vue'
	const previewUrl = ref('')
	
	const preview = (src:string) =>{
		previewUrl.value= src
	}
	defineExpose({
		preview
	})
</script>

<style lang="scss" scoped>
</style>