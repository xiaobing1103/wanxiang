<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true"
		:pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<!-- #ifdef H5 -->
		<template #top>
			<CommonHeader defindTitle="AI思维导图" />
		</template>
		<!-- #endif -->

		<view class="MappingContent">
			<view class="MappingContent_header">
				<!-- #ifdef H5 -->
				<iframe class="MappingContent_header_webview" ref="iframeRef"
					:src="`https://api-view.java68.cn/mindmap/#/?mindValue=${encodeURIComponent(contentStr)}`"
					style="width: 100%; height: 90vh;border: none;" />
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<web-view ref="iframeRef" :style="{ width: '100%', height: '100vh' }"
					:src="`https://api-view.java68.cn/mindmap/#/?mindValue=${encodeURIComponent(contentStr)}`"
					@message="onWebViewMessage" />
				<!-- #endif -->
			</view>
		</view>


	</z-paging>
</template>

<script lang="ts" setup>
	import CommonHeader from '@/components/CommonHeader.vue'
	import { ref, watch, onMounted, computed } from 'vue';
	const iframeRef = ref(null);
	const initValue = `# ChatGptWeb系统
## 基础功能
- 支持AI聊天
- 支持GPT4
- 支持DLLAE2
- 支持Midjourney
- 支持mind思维导图生成
- 更多功能等你探索......

## 更多内容
-  在上面输入您想要生成的内容
- 点击生成即可
`
	const contentStr = ref(initValue);
	const count = ref(0);

	const onWebViewMessage = (event : any) => {
		console.log('Message from web-view:', event.detail.data);
	};


	onMounted(() => {
		let result = '';
		uni.$on('update', function (data) {
			result += data.msg;
			count.value++;
			if (count.value >= 10) {
				contentStr.value = result
				if (iframeRef.value) {
					// #ifdef H5
					const iframeElement = iframeRef.value;
					console.log(iframeElement)
					const iframeWindow = iframeElement ? iframeElement.contentWindow : null;
					console.log(iframeWindow)
					iframeWindow.postMessage({ type: 'value', value: contentStr.value }, '*');
					// #endif
					// #ifdef MP-WEIXIN
					window.postMessage({ type: 'value', value: contentStr.value }, '*');
					// #endif
				}
			}
			count.value = 0;
		});
	});
</script>

<style scoped>
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