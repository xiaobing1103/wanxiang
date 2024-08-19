<template>
	<web-view  :src="previewUrl"></web-view>
</template>

<script lang="ts" setup>
	import {  onLoad } from '@dcloudio/uni-app'
	import {ref} from 'vue'
	const previewUrl = ref('')
	
	onLoad((options:{url?:string}) =>{
		previewUrl.value = options.url
	})
</script>

<style lang="scss" scoped>
</style>