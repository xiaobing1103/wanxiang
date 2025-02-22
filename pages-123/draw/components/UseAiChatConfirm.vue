<template>
	<up-checkbox shape="circle" :customStyle="{margin: '20rpx 0' ,fontSize:'25rpx'}" name="agree" usedAlone
		v-model:checked="aloneChecked" @change="change">
		<template #label>
			<view class="aichatPromet">
				<text class="aichatPromet_top">使用AiChat优化你的提示词</text>
				<text class="aichatPromet_bottom">提示：有助于生成精准的绘画指令以及画面光影、画面比例、美感等</text>
			</view>
		</template>
	</up-checkbox>
	<up-modal :show="aloneChecked" showCancelButton closeOnClickOverlay @close="onclose" @cancel="onclose"
		@confirm="confirm">
		<view class="checkbox_modal">
			<view class="checkbox_modal_header">
				提示
			</view>
			<view class="checkbox_modal_content">
				使用AI优化功能后会占用你的AiChat3.5的问答次数，优化一次会扣掉一次问答次数,请知悉！
			</view>
		</view>

	</up-modal>
</template>
<script setup>
	import {
		ref
	} from 'vue'
	const aloneChecked = ref(false)
	const change = (e) => {
		if (e) {
			aloneChecked.value = true
		} else {
			aloneChecked.value = false
		}
	}
	const confirm = () => {
		console.log('点击了确认')
	}
	const onclose = () => {
		aloneChecked.value = false
	}
</script>

<style lang="scss">
	.checkbox_modal {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx;
		box-sizing: border-box;

		&_header {
			padding: 25rpx;
			font-weight: 600;
		}

		&_content {
			font-size: 27rpx;
		}
	}

	.aichatPromet {
		display: flex;
		flex-direction: column;
		&_top{
			font-size: 27rpx;
			font-weight: 700;
		}
		&_bottom{
			font-size: 20rpx;
			color: $uni-color-title;
		}
	}
</style>