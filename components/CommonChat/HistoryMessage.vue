<template>
	<up-popup :show="chatStore.openHistoryModel" mode="left" @close="close" @open="open">
		<view class="historyBox">
			
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { useChatStore } from '../../store';
	const chatStore = useChatStore()
	const open = () => {
		chatStore.setopenHistoryModel(true)

	}
	const close = () => {
		chatStore.setopenHistoryModel(false)
	}
</script>
<style lang="scss">
	.historyBox {
		width: 50vw;
		background-color: white;
		border-radius: 30rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);

		&_view {

			display: flex;
			align-items: center;
			justify-content: center;

			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 0 20rpx;
			}

			&_text {
				font-size: 25rpx;
			}
		}
	}
</style>