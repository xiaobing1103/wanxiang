<template>
	<view @click="handleCellClick" :style="[setCustomerStyle]" class="form-cell-item">
		<view class="label-box">
			<slot name="label">
				<text class="label">{{label}}</text>
			</slot>
		</view>
		<view class="desc-box">
			<text class="desc">{{description}}</text>
			<view class="extra">
				<slot name="extra"></slot>
			</view>
			<up-icon v-if="expand" size="16" color="rgba(185, 191, 207, 1)" name="arrow-right"></up-icon>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Component, computed, toRefs } from 'vue';
	import { toPage } from '@/utils/index'
	import { useUserStore } from '@/store';
	interface Props {
		label ?: string;
		description ?: string;
		path ?: string;
		height ?: number;
		border ?: boolean;
		labelIcon ?: Component | string;
		iconSize ?: number
		expand ?: boolean;
		isHasToken ?: boolean
	}
	const UserStore = useUserStore()
	const props = withDefaults(defineProps<Props>(), {
		border: true,
		height: 88
	})

	const emit = defineEmits<{
		(e : 'change') : void
	}>()
	const { border } = toRefs(props)

	const setCustomerStyle = computed(() => {
		let style : Record<string, any> = {}
		style['border-bottom'] = border.value ? `1rpx solid rgba(238, 238, 238, 1)` : 'none'
		style['height'] = props.height + 'rpx'
		return style
	})

	//点击事件
	const handleCellClick = () => {
		if (!UserStore.token && props.isHasToken) {
			uni.$u.toast('请先登录账号再操作！');
			return
		}
		if (!props.path) {
			emit('change')
			return
		}
		toPage(props.path)
	}
</script>

<style lang="scss" scoped>
	.form-cell-item {
		width: 100%;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 20rpx;
		box-sizing: border-box;

		.label-box {
			.label {
				font-size: 28rpx;
			}
		}

		.desc-box {
			display: flex;
			align-items: center;

			.extra {
				margin-left: 10rpx;
				display: flex;
				font-size: 24rpx;
				align-items: center;
			}

			.desc {
				font-size: 24rpx;
				color: rgba(185, 191, 207, 1);
			}
		}

		&:last-child {
			border-bottom: none !important;
		}
	}
</style>