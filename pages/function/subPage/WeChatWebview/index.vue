<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true"
		:pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<web-view class="MappingContent_header_webview" ref="iframeRef"
			:src="`https://api-view.java68.cn/mindmap/#/?mindValue=${encodeURIComponent(contentStr)}`"
			style="width: 100%; height: 90vh;border: none;" />
	</z-paging>

</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	import { ref } from 'vue';
	const sendMsg = ref('')
	const contentStr = ref('')
	onLoad((query) => {
		if (query.sendMsg) {
			console.log(query)
			sendMsg.value = query.sendMsg
		}
	});
</script>