<template>
	<view class="SearchbBox">
		<view class="SearchbBox_title">
			AI智能创作
		</view>
		<up-input prefixIcon="search" @change="changeValue"
			:customStyle="{border:'1rpx solid #ccc',background:'white',width:'100%'}" placeholder="请输入创作模型"
			border="surround" v-model="TextValue"></up-input>

	</view>
</template>

<script setup lang="ts">
	const TextValue = defineModel('TextValue')
	const emit = defineEmits<{
		(e : 'SearchValue', val : string) : void
	}>()

	const changeValue = (e : string) => {
		emit('SearchValue', e)
	}
</script>

<style scoped lang="scss">
	.SearchbBox {
		width: 100%;
		padding: 40rpx;

		&_title {
			font-size: 40rpx;
			padding: 40rpx 0;
			font-weight: 800;
			text-align: center;
		}
	}
</style>