<template>
	<view class="Common_switch">
		<up-switch v-model="commonParmas.make_instrumental" activeColor="rgb(126, 61, 255)" inactiveColor="rgb(230, 230, 230)"
			size="20"></up-switch>
		<text class="Common_switch_pure">纯音乐</text>
	</view>
</template>

<script lang="ts" setup>
	import { commonParmasType } from '../types';

	const commonParmas = defineModel<commonParmasType>('commonParmas')
</script>

<style lang="scss" scoped>
	.Common_switch {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;

		&_pure {
			margin-left: 20rpx;
			font-size: 27rpx;
			font-weight: 800;
		}
	}
</style>