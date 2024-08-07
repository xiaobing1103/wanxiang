<template>
	<up-popup :show="chatStore.openSeletedModel" :round="50" mode="bottom" @close="close" @open="open">
		<view class="CommonPopup">
			<template v-for="(item,key) in commonModel">
				<view class="CommonPopup_view" @click="changeModel(key)">
					<image class="CommonPopup_view_image" :src="item.modelIcon" mode=""></image>
					<text class="CommonPopup_view_text"> {{item.title}}</text>
				</view>
			</template>
		</view>
	</up-popup>


</template>

<script setup lang="ts">
	import { commonModel } from '@/config/modelConfig';
	import { computed, ref } from 'vue';
	import { useChatStore } from '@/store';
	import { CommonModelKeys } from '../../config/type';
	const chatStore = useChatStore()
	const popup = ref(null)
	const open = () => {
		chatStore.setOpenSeletedModel(true)

	}
	const close = () => {
		chatStore.setOpenSeletedModel(false)
	}
	const changeModel = (key : CommonModelKeys) => {
		chatStore.setModel(key)
		close()
	}
</script>

<style lang="scss" scoped>
	.CommonPopup {
		height: 700rpx;
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