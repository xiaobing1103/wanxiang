<template>
	<view class="MappingContent">
		<view class="MappingContent_header">
			<web-view ref="iframeRef" :fullscreen="false" :style="{ width: '100%', height: '85vh' }" :src="url"
				@message="onWebViewMessage" />
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, watch, onMounted, computed } from 'vue';
	const iframeRef = ref(null);
	const contentStr = defineModel<string>('contentStr'); // 初始化你的内容
	const count = ref(0);

	const url = computed(() => {
		console.log(`https://api-view.java68.cn/mindmap/#/?mindValue=${encodeURIComponent(contentStr.value)}`)
		return `https://api-view.java68.cn/mindmap/#/?mindValue=${encodeURIComponent(contentStr.value)}`
	})
	const onWebViewMessage = (event : any) => {
		console.log('Message from web-view:', event.detail.data);
	};

	watch(contentStr, (newValue) => {
		count.value++;
		if (count.value >= 10) {
			if (iframeRef.value) {
				// #ifdef H5
				// (iframeRef.value as any)?.contentWindow?.postMessage({ type: 'value', value: newValue }, '*');
				window.postMessage({ type: 'value', value: newValue }, '*');
				// #endif
				// #ifdef MP-WEIXIN
				(iframeRef.value as any)?.postMessage({ data: { type: 'value', value: newValue } });
				// #endif
			}
			count.value = 0; // 重置计数
		}
	});

	onMounted(() => {
		// 如果需要在挂载后做额外的设置，可以在这里处理
	});
</script>

<style scoped>
	.MappingContent {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25rpx;
	}

	.MappingContent_header {
		width: 100%;
	}
</style>