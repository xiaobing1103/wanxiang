import { useUserStore } from "../store";

interface StreamRequestOptions {
	url : string;
	method : "GET" | "POST" | "PUT" | "DELETE";
	data ?: any;
	header ?: Record<string, string>;
	eventStream ?: boolean;
	callback ?: (chunk : string) => void; // 用于接收数据块的回调函数
	errorback ?: (error : any) => void; // 错误回调函数
}

export function streamRequest(options : StreamRequestOptions) {
	return new Promise<void>((resolve, reject) => {
		const { url, method, data, header, eventStream, callback, errorback } = options;

		if (!eventStream) {
			reject(new Error("Not a stream request"));
			return;
		}

		const userStore = useUserStore();
		const headers = {
			...header,
			"uid": userStore.userInfo?.id || '',
			"token": userStore.userInfo?.token || '',
			"App": userStore.userInfo?.appid || '',
			"Access-Token": userStore.userInfo?.access_token || '',
			"vt": userStore.userInfo?.vip || '',
			"Accept": "text/event-stream",
		};

		uni.request({
			url,
			method,
			data,
			header: headers,
			success: (response) => {
				if (response.statusCode === 200) {
					const reader = new TextDecoderStream();
					const stream = new ReadableStream({
						start(controller) {
							const reader = response.data.getReader();
							const decoder = new TextDecoder();
							let result = '';

							function push() {
								reader.read().then(({ done, value }) => {
									if (done) {
										controller.close();
										if (callback) {
											callback(result);
										}
										resolve();
										return;
									}
									const chunk = decoder.decode(value, { stream: true });
									result += chunk;
									if (callback) {
										callback(chunk);
									}
									push();
								}).catch((error) => {
									controller.error(error);
									if (errorback) {
										errorback(error);
									}
									reject(error);
								});
							}

							push();
						}
					});

					const streamReader = new Response(stream).body?.getReader();
					streamReader?.read().then(({ done, value }) => {
						if (done) {
							resolve();
						}
					}).catch((error) => {
						if (errorback) {
							errorback(error);
						}
						reject(error);
					});
				} else {
					const errorMsg = `Request failed with status ${response.statusCode}`;
					if (errorback) {
						errorback(new Error(errorMsg));
					}
					reject(new Error(errorMsg));
				}
			},
			fail: (error) => {
				if (errorback) {
					errorback(error);
				}
				reject(error);
			}
		});
	});
}