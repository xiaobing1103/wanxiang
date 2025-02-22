<template>
	<view class="menu-card" @click="$emit('change',data)">
		<view class="cover" :style="{backgroundImage:`url(${data.cover})`}">

		</view>
		<view class="bottom">
			<text class="title">{{data.title}}</text>
			<text class="desc">{{data.description}}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { MenuItem } from "../type"
	interface Props {
		data : MenuItem
	}
	const props = defineProps<Props>()
	const emit = defineEmits<{
		(e : 'change', val : MenuItem) : void
	}>()
</script>

<style lang="scss" scoped>
	.menu-card {
		height: 310rpx;
		background-color: $u-info-light;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.cover {
			height: 190rpx;
			flex-shrink: 0;
			background-size: 100% 100%;
		}

		.bottom {
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			flex: 1;
			padding: 10rpx 0 10rpx 10rpx;

			.title {
				font-size: 32rpx;
				padding-bottom: 10rpx;
			}

			.desc {
				font-size: 24rpx;
				white-space: nowrap;
		
				overflow: hidden;
				text-overflow: ellipsis;
				color: $u-info-dark;
			}
		}
	}
</style>