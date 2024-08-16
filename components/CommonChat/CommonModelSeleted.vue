<template>
	<up-popup :show="chatStore.openSeletedModel" :round="25" mode="bottom" @close="close" @open="open">

		<view class="viewBox">
			<view class="change">
				切换项目
			</view>
			<view class="CommonPopup">
				<template v-for="(item,key) in commonModel" :key="key">
					<view :style="{background:key == chatStore.model ? '#eaeaea':''}" class="CommonPopup_view"
						@click="changeModel(key)">
						<image class="CommonPopup_view_image" :src="item.modelIcon" mode=""></image>
						<text class="CommonPopup_view_text"> {{item.title}}</text>
					</view>
				</template>
			</view>
		</view>
	</up-popup>


</template>

<script setup lang="ts">
	import { commonModel } from '@/config/modelConfig';
	import { computed, ref } from 'vue';
	import { useChatStore } from '@/store';
	import { CommonModelKeys } from '../../config/type';
	import { generateUUID } from '../../tools/uuid';
	const chatStore = useChatStore()
	const popup = ref(null)
	const open = () => {
		chatStore.setOpenSeletedModel(true)

	}
	const close = () => {
		chatStore.setOpenSeletedModel(false)
	}
	const changeModel = (key : CommonModelKeys) => {
		if (key == chatStore.model) {
			return
		}
		chatStore.addchats({
			id: generateUUID(),
			iconUrl: commonModel[key].modelIcon,
			title: commonModel[key].title,
			data: [],
			model: key
		})
		// chatStore.setModel(key)
		close()
	}
</script>

<style lang="scss" scoped>
	.change {
		display: flex;
		justify-content: center;
		font-size: 30rpx;
		padding: 25rpx 0;
	}

	.viewBox {
		display: flex;
		flex-direction: column;
	}

	.CommonPopup {
		display: grid;
		grid-template-columns: repeat(2, 1fr);

		&_view {

			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			padding: 25rpx;

			&_image {

				height: 40rpx;
				width: 40rpx;
				padding: 0 20rpx;
			}

			&_text {
				font-size: 25rpx;
			}
		}
	}
</style>