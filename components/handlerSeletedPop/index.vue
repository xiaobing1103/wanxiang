<template>
	<up-popup round="15" :show="openPop" @close="openPop = false">
		<view class="openPop">
			<view class="openPop_header">
				请选择操作
			</view>
			<view class="openPop_main">
				<text class="openPop_main_text" @click="handler1">{{text1}}</text>
				<text class="openPop_main_text" @click="handler2">{{text2}}</text>
			</view>

			<view class="openPop_footer" @click="openPop = false">
				取消
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	const openPop = defineModel<boolean>('openPop')
	const emit = defineEmits(['handler1', 'handler2']);
	defineProps<{ text1 : string, text2 : string }>()
	const handler1 = () => {
		emit('handler1');
	}
	const handler2 = () => {
		emit('handler2');
	}
</script>

<style lang="scss">
	.openPop {

		width: 100%;
		overflow: hidden;

		&_header {
			font-weight: 800;
			width: 100%;
			padding: 15rpx 0;
			display: flex;
			justify-content: center;
		}

		&_main {
			display: flex;
			// padding: 10rpx 0;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			width: 100%;

			&_text {
				width: 100%;
				border-bottom: 1rpx solid #efefef;
				font-size: 27rpx;
				padding: 20rpx 0;
				display: flex;
				justify-content: center;
			}
		}

		&_footer {
			padding: 20rpx 0;
			border-top: 20rpx solid #efefef;
			display: flex;
			justify-content: center;
			font-size: 27rpx;
			// background-color: ;
		}
	}
</style>