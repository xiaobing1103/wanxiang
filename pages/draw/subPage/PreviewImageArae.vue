<template>
	<view class="preview_inputBox">
		<up-textarea v-model="parmas.prompt" placeholder="请输入生成文案"></up-textarea>
		<view class="preview_inputBox_example">
			<text class="preview_inputBox_example_text"> 示例 ： {{ currentKey }}</text>
			<up-icon name="reload" @click="changeExample"></up-icon>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { DrawExampleKeys, Image2TextParmas, drawExamplePrompts } from '../data';
	const keys : DrawExampleKeys[] = Object.keys(drawExamplePrompts) as DrawExampleKeys[];
	const parmas = defineModel<Image2TextParmas>("parmas");
	const currentIndex = ref<number>(0);
	const currentKey = ref<DrawExampleKeys>(keys[currentIndex.value]);
	const changeExample = () => {
		currentIndex.value = (currentIndex.value + 1) % keys.length;
		currentKey.value = keys[currentIndex.value];
		parmas.value.prompt = drawExamplePrompts[currentKey.value]
	};
</script>

<style lang="scss">
	.preview_inputBox {
		background-color: $uni-bg-color;
		border-radius: 15rpx;

		&_example {
			display: flex;
			align-items: center;
			font-size: 27rpx;

			padding: 10rpx;
			box-sizing: border-box;

			&_text {
				margin-right: 20rpx;
			}
		}
	}
</style>