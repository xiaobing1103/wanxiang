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
			type: "Web-AI思维导图",
			prompt: '请根据下面的主题生成思维导图:\'' +
				currentMsg +
				'\'，回答的时候不要有任何其他内容，你只需要输出markdown，请严格按照我的格式模版要求执行。' +
				` 
        格式模版
        # 周报
        - 日期：[填写日期]
        - 目标：[填写本周目标]
        - 进展：
          - [填写任务1进展]
          - [填写任务2进展]
          - [填写任务3进展]
        - 问题：
          - [填写问题1]
          - [填写问题2]
          - [填写问题3]
        - 下周计划：
          - [填写任务1计划]
          - [填写任务2计划]
          - [填写任务3计划]`
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