<template>
	<view :style="[setAreaStyle]" class="area-box">
		<textarea v-model="value" :maxlength="maxlength" :auto-height="autoHeight" class="area"
			:placeholder="placeholder"></textarea>
		<view v-if="showAction" class="action">
			<slot name="action">
				<u-icon @click="onReload" size="22" name="reload"></u-icon>
				<u-icon size="22" @click="onCopy" name="file-text"></u-icon>
				<u-icon size="22" @click="onShare" name="share-square"></u-icon>
			</slot>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { computed, CSSProperties } from 'vue'
	import { toCopyText } from '@/utils/index.ts'
	interface Props {
		height ?: string | number
		radius ?: string | number
		placeholder ?: string
		maxlength ?: number
		showAction ?: boolean
		autoHeight ?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		height: '200',
		radius: '20',
		autoHeight: true,
		showAction: false,
		placeholder: '请输入',
		maxlength: -1,
	})
	const emit = defineEmits<{
		(e : 'reload') : void,
		(e : 'export', valStr : string) : void
	}>()
	const value = defineModel<string>()

	const setAreaStyle = computed(() => {
		let style : CSSProperties = {}
		style['min-height'] = props.height + 'rpx'
		style['border-radius'] = props.radius + 'rpx'
		return style
	})
	//重新生成
	const onReload = () => {
		emit('reload')
	}
	//分享
	const onShare = () => {
		emit('export', value.value)
	}
	//复制
	const onCopy = () => {
		toCopyText(value.value)
	}
</script>

<style lang="scss" scoped>
	.area-box {
		margin-top: 20rpx;
		border: 2rpx solid $uni-bg-color-grey;
		padding: 25rpx 25rpx 16rpx 25rpx;
		background-color: #fcfcfc;
		display: flex;
		flex-direction: column;

		.area {
			font-size: 28rpx;
			width: 100%;
			color: #333333;
			// flex: 1;
		}

		.action {
			height: 60rpx;
			margin-top: auto;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 30rpx;
		}
	}
</style>