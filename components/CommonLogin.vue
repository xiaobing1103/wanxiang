<template>
	<up-overlay :show="show">
		<view class="warp">
			<up-loading-icon vertical color="#e8e8e8" text-color="#e8e8e8" text="登录中" textSize="18"></up-loading-icon>
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	const show = ref(false)
</script>

<style>
</style>