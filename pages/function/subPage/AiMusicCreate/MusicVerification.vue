<template>
	<web-view 
		:src="webviewUrl" 
		@message="handleMessage"
	></web-view>
</template>

<script setup lang="ts">
const webviewUrl = "http://192.168.31.54:4570/verifyPage?source=external"
// const webviewUrl = "http://127.0.0.1:5500/test-verification.html"
// 处理来自 webview 的消息
const handleMessage = (event: any) => {
	console.log('收到webview消息：', event.detail.data)
	
	// 根据消息类型处理不同的业务逻辑
	const { type, data } = event.detail.data
	switch(type) {
		case 'verificationSuccess':
			// 处理验证成功的逻辑
			uni.showToast({
				title: '验证成功',
				icon: 'success'
			})
			break;
		case 'verificationFailed':
			// 处理验证失败的逻辑
			uni.showToast({
				title: '验证失败',
				icon: 'error'
			})
			break;
	}
}

// 向 webview 发送消息
const sendMessageToWebview = () => {
	// @ts-ignore
	const webviewContext = uni.createWebviewContext('webview')
	webviewContext.postMessage({
		data: {
			type: 'customEvent',
			data: { /* 要传递的数据 */ }
		}
	})
}
</script>

<style lang="scss" scoped></style>