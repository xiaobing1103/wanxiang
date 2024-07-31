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

export const StreamRequest = (options : StreamRequestOptions) => {
	const { url, method, data, header } = options;
	const userStore = useUserStore();
	const headers = {
		...header,
		"uid": userStore.userInfo?.id || '',
		"token": userStore.userInfo?.token || '',
		"App": userStore.userInfo?.appid || '',
		"Access-Token": userStore.userInfo?.access_token || '',
		"vt": userStore.userInfo?.vip || '',
	};
	return new Promise((resolve, reject) => {
		const response = uni.request({
			url,
			method,
			data,
			header: header || headers,
			responseType: "text",
			enableChunked: true, // 开启流传输
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			},
		})

		// 返回请求的响应
		resolve(response)
	})
}


export async function fetchStream(
	options : StreamRequestOptions
) {
	const { url, method, data, header, callback, errorback } = options;
	const userStore = useUserStore();
	const headers = {
		...header,
		"uid": userStore.userInfo?.id || '',
		"token": userStore.userInfo?.token || '',
		"App": userStore.userInfo?.appid || '',
		"Access-Token": userStore.userInfo?.access_token || '',
		"vt": userStore.userInfo?.vip || '',
		"Content-Type": 'application/json'
	};
	try {
		const extendedHeaders = {
			...headers,
		};
		const response = await fetch(url, {
			method: method,
			headers: extendedHeaders,
			body: JSON.stringify(data),
		});
		if (response.ok) {
			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader();
			const processStream = async () => {
				try {
					let result = '';
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						result += value;
						if (callback) {
							callback(value);
						}
					}
				} catch (error) {
					if (errorback) {
						errorback(error);
					}
				}
			};
			processStream();
		} else {

			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		if (errorback) {
			errorback(error);
		}
	}
}