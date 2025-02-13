<template>
	<view :renderjsData="renderjsData" :change:renderjsData="chat?.startChatCore" :stopCount="stopCount"
		:change:stopCount="chat?.stopChatCore" />
</template>
<script>
	export default {
		props: {},
		data() {
			return {
				stopCount: 0,
				renderjsData: {
					url: "",
					key: 0,
					body: ""
				}
			}
		},
		methods: {
			stopChat() {
				this.stopCount += 1
			},
			/**
			 * 开始chat对话
			 * @param body
			 * @param url
			 * @param headers
			 */
			startChat({
				body,
				url,
				headers = {}
			}) {
				this.renderjsData = Object.assign({}, this.renderjsData, {
					key: this.renderjsData.key + 1,
					body: JSON.stringify(body),
					url: url,
					headers
				});
			},

			open() {
				this.$emit("onOpen")
			},
			message(msg) {
				this.$emit("onMessage", msg)
			},
			error(err) {
				this.$emit("onError", err)
			},
			finish() {
				this.$emit("onFinish")
			}
		},
	}
</script>

<script module="chat" lang="renderjs">
	export default {
		data() {
			return {
				ctrl: null,
			}
		},
		methods: {
			onstart(reader) {
				this.$ownerInstance.callMethod('open', reader);
			},
			getStream(reader) {
				const processChunk = async (result) => {
					if (result.done) {
						this.$ownerInstance.callMethod('finish');
						return
					}
					this.$ownerInstance.callMethod('message', result.value);
					return reader.read().then(processChunk)
				}
				reader.read().then(processChunk)
			},
			stopChatCore() {
				if (this.ctrl) {
					this.ctrl.abort();
					this.ctrl = null;
					this.$ownerInstance.callMethod('finish');
				}
			},
			async startChatCore({
				url,
				body,
				headers
			}) {
				if (!url) return;

				try {
					// 创建新的 AbortController
					this.ctrl = new AbortController();
					console.log(url)
					const response = await fetch(url, {
						method: 'POST',
						headers,
						body: body,
						signal: this.ctrl.signal // 添加 signal
					});

					if (response.body) {
						const reader = response.body.pipeThrough(new window.TextDecoderStream()).getReader();
						this.onstart && this.onstart(reader);
						this.getStream(reader);
					}
				} catch (err) {
					// 判断是否是用户主动取消的请求
					if (err.name === 'AbortError') {
						console.log('用户主动取消的请求');
					} else {
						this.$ownerInstance.callMethod('error', err);
					}
				}
			}
		}
	}
</script>