<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true"
		:pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader defindPath="/pages/function/subPage/AImapping/index" defindTitle="AI思维导图" />
		</template>
		<view class="MappingContent">
			<view class="MappingContent_header">
				<iframe class="MappingContent_header_webview" ref="iframeRef"
					:src="`https://api-view.java68.cn/mindmap/#/?mindValue=${encodeURIComponent(MappingStore.contentStr)}`"
					style="width: 100%; height: 90vh;border: none;" />
			</view>
		</view>
	</z-paging>
</template>

<script lang="ts" setup>
	import CommonHeader from '@/components/CommonHeader.vue'
	import { ref, onMounted, onUnmounted, nextTick } from 'vue';
	import { useMappingStore } from '@/store';
	const MappingStore = useMappingStore()
	const iframeRef = ref(null);
	const count = ref(0);
	onUnmounted(() => {
		uni.$off('update', updateHandler);
		MappingStore.setContentStr(MappingStore.initValue)
		MappingStore.setUrl()
	});

	const updateHandler = (data : { msg : string; }) => {
		let result = '';
		let num = 10
		result += data.msg;
		count.value++;

		uni.$u.toast('正在生成思维导图请等待！')
		if (count.value >= num) {
			MappingStore.setContentStr(result)
			if (iframeRef.value) {
				// #ifdef H5
				const iframeElement = iframeRef.value;
				const iframeWindow = iframeElement ? iframeElement.contentWindow : null;
				nextTick(() => {
					iframeWindow.postMessage({ type: 'value', value: MappingStore.contentStr }, '*');
				})
				// #endif
			}

			// #ifdef MP-WEIXIN
			MappingStore.setUrl(MappingStore.contentStr)
			nextTick(() => {
				uni.reLaunch({
					url: "/pages/function/subPage/AImappingPreview/index"
				})
			})

			// #endif
			count.value = 0;

		}
	}
	onMounted(() => {
		uni.$on('update', updateHandler)
	});
</script>

<style lang="scss" scoped>
	.MappingContent {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.MappingContent_header {
		width: 100%;

		&_webview {
			border: none;
		}
	}
</style>