<template>
	<z-paging :pagingStyle="{ background: 'rgb(246, 247, 249)'}">
		<template #top>
			<CommonHeader defindTitle="txt文件预览" />
		</template>

		<view class=" Alltext">
			{{text}}
		</view>
		<template #bottom>
			<view class="copyButton">
				<up-button @click="copyTxt">复制文字</up-button>
			</view>
		</template>

	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import { toCopyText } from '@/utils';
	const text = ref('')
	onLoad(async (query) => {
		if (query.text) {
			text.value = query.text
		}

	});
	const copyTxt = () => {
		toCopyText(text.value)
	}
</script>

<style scoped lang="scss">
	.Alltext {
		padding: 30rpx;
	}

	.copyButton {
		padding: 30rpx 50rpx;
	}
</style>