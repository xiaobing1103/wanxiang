<template>
	<view class="vip-card" :style="{backgroundImage:`url(${$assets.vipCard})`}"></view>
	
</template>

<script setup lang="ts">
	import {useGlobalProperties} from '@/hooks/useGlobalHooks'
	const {$assets} = useGlobalProperties()
	
</script>

<style lang="scss" scoped>
	.vip-card{
		width: 100%;
		height: 244rpx;
		margin: 30rpx 0 50rpx 0;
		background-size: 100% 100%;
	}
</style>