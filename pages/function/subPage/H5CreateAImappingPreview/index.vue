<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true"
		:pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<iframe class="MappingContent_header_webview" ref="iframeRef"
			:src="`https://api-view.java68.cn/mindmap/#/?mindValue=${encodeURIComponent(contentStr)}`"
			style="width: 100%; height: 90vh;border: none;" />
	</z-paging>

</template>

<script setup lang="ts">
	import { ref, nextTick } from 'vue';
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { onLoad } from '@dcloudio/uni-app';
	const { streamRequest, isRecive } = useStreamHooks()
	const iframeRef = ref(null)
	const contentStr = ref('')
	onLoad((query) => {
		if (query.sendMsg) {
			onCreateContent(query.sendMsg)
		}
	});
	const count = ref(0)
	const onCreateContent = (currentMsg : string) => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		if (!currentMsg) {
			uni.$u.toast('输入内容为空！')
			return
		}
		contentStr.value = '';
		const endContent = `我的标题是:${currentMsg}`
		const params = [
			{
				role: 'user',
				content: endContent,
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-PPT生成内容",
			prompt: "我希望你根据我的标题生成文档，以下格式中 ## 为章节、###为大纲、####为小纲、- 为根据\"小纲\"补充的回答，必须对小纲进行回答，严格要求必须有2个以上章节，严格要求每个小纲必须有2个以上的回答，严格按照以下格式输出：\n\n# 标题\n\n## 1\n### 1.1\n#### 1.1.1\n- \n- \n\n#### 1.1.2\n- \n- \n\n#### 1.1.3\n- \n- \n\n### 1.2\n#### 1.2.1\n- \n- \n\n#### 1.2.2\n- \n- \n\n#### 1.2.3\n- \n- \n\n### 1.3\n#### 1.3.1\n- \n- \n\n#### 1.3.2\n- \n- \n\n#### 1.3.3\n- \n- \n\n## 2\n### 2.1\n#### 2.1.1\n- \n- \n\n#### 2.1.2\n- \n- \n\n#### 2.1.3\n- \n- \n\n### 2.2\n#### 2.2.1\n- \n- \n\n#### 2.2.2\n- \n- \n\n#### 2.2.3\n- \n- \n\n### 2.3\n#### 2.3.1\n- \n- \n\n#### 2.3.2\n- \n- \n\n#### 2.3.3\n- \n- \n\n## 3\n### 3.1\n#### 3.1.1\n- \n- \n\n#### 3.1.2\n- \n- \n\n#### 3.1.3\n- \n- \n\n### 3.2\n#### 3.2.1\n- \n- \n\n#### 3.2.2\n- \n- \n\n#### 3.2.3\n- \n- \n\n### 3.3\n#### 3.3.1\n- \n- \n\n#### 3.3.2\n- \n- \n\n#### 3.3.3\n- \n- \n\n\n## 4\n### 4.1\n#### 4.1.1\n- \n- \n\n#### 4.1.2\n- \n- \n\n#### 4.1.3\n- \n- \n\n### 4.2\n#### 4.2.1\n- \n- \n\n#### 4.2.2\n- \n- \n\n#### 4.2.3\n- \n- \n\n### 4.3\n#### 4.3.1\n- \n- \n\n#### 4.3.2\n- \n- \n\n#### 4.3.3\n- \n请严格按照我的设定回答"
		}
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				contentStr.value += text
				count.value++;
				if (count.value >= 10) {
					if (iframeRef.value) {
						const iframeElement = iframeRef.value;
						const iframeWindow = iframeElement ? iframeElement.contentWindow : null;
						nextTick(() => {
							iframeWindow.postMessage({ type: 'value', value: contentStr.value }, '*');
						})
					}
					count.value = 0;
				}

			},
			onfinish() {
				console.log('成功')

			},
			onerror(err) {
				console.log(err, "错误")
			}
		})
	}
</script>