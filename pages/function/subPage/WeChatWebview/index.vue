<template>
	<z-paging ref="pagingRef" :show-scrollbar="false" :scroll-with-animation="true"
		:pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<web-view class="MappingContent_header_webview" ref="webViewRef"
			:src="`https://api-view.java68.cn/mindmap2/#/?data=${encodeURIComponent(contentStr)}`"
			style="width: 100%; height: 90vh;border: none;" />
	</z-paging>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app';
	import { onMounted, ref } from 'vue';
	import { useStreamHooks } from '@/hooks/useStreamHooks'
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
	const contentStr = ref(initValue)

	const { streamRequest, isRecive } = useStreamHooks()
	const webViewRef = ref(null);
	const count = ref(0)
	// 定义一个方法，用于向 WebView 发送消息
	const sendMessageToWebView = (info) => {
		if (webViewRef.value) {
			const script = `uniEvent(${JSON.stringify(info)})`;
			console.log('Sending script:', script);
			webViewRef.value.evalJS(script);
		}
	};

	// 在组件挂载时，向 WebView 发送初始消息
	onMounted(() => {
		const info = { type: 'value', value: '# Hello World' };
		// 延迟发送消息，确保 WebView 完全加载
		setTimeout(() => {
			sendMessageToWebView(info);
		}, 1000);  // 延迟 1 秒发送消息
	});

	// 处理页面加载时的参数
	onLoad((query) => {
		if (query.sendMsg) {
			onCreateContent(query.sendMsg)
		}
	});

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
				count.value++;
				if (count.value >= 10) {
					contentStr.value += text
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