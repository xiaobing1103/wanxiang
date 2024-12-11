<template>
	<view class="CommonInput">
		<view class="CommonInput_input">
			<view class="CommonInput_input_title">
				歌曲名称
			</view>

			<up-input v-model="commonParmas.title" :customStyle="{border:'1rpx solid #ccc'}" count border="surround"
				:adjustPosition="false" placeholder="请输入你的歌曲名称"></up-input>
		</view>
	</view>


</template>

<script setup lang="ts">
	import { commonParmasType } from '../types';

	const commonParmas = defineModel<commonParmasType>('commonParmas')
</script>


<style lang="scss" scoped>
	.CommonInput {
		width: 100%;

		&_input {
			width: 100%;
			padding-bottom: 20rpx;

			&_title {
				padding-bottom: 20rpx;
				font-weight: 800;
				font-size: 27rpx;
			}
		}

	}
</style>