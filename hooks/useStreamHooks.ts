import { useGlobalProperties } from './useGlobalHooks'
import { ref } from 'vue'
interface Options {
	oncancel ?: () => void
}
const LoadingConfig = {
	showLoading: false,
	title: "加载中..."
}

let controller = ref(null)
export const useStreamHooks = (options ?: Options) => {
	interface StreamOptions {
		url : string;
		data ?: any;
		onmessage ?: (text : string) => void
		onerror ?: (err ?: any) => void
		onfinish ?: (response ?: UniApp.RequestSuccessCallbackResult) => void,
		LoadingConfig ?: {
			showLoading : boolean;
			title : string;
		},
		onRequestTaskReady ?: () => void
	}
	enum ErrorCode {
		'SUCCESS' = 200
	}
	const { $api } = useGlobalProperties()
	const isRecive = ref(false)
	let requestTask = null;

	//用于微信
	const wechatStreamRequest = async (options : StreamOptions) => {
		isRecive.value = true;
		try {
			requestTask = await $api.getStream(
				options.url,
				options.data,
				true,
				async (response : UniApp.RequestSuccessCallbackResult) => {
					handleResloveError(response.statusCode, options, response);
					console.log(response);
				},
				async (err) => {
					console.log(err);
				},
				LoadingConfig
			);

			if (requestTask && typeof requestTask.onChunkReceived === 'function') {
				requestTask.onChunkReceived(async res => {
					const message = resloveResponseText(res.data);
					options.onmessage && options.onmessage(message);
				});
			} else {
				console.error('requestTask is null or does not have onChunkReceived method');
			}

			// 通知外部任务已经准备好
			options?.onRequestTaskReady();

		} catch (error) {
			console.error('Error in getStream:', error);
		}
	};

	const handleResloveError = (code : ErrorCode, options : StreamOptions, response ?: UniApp.RequestSuccessCallbackResult) => {
		switch (code) {
			case ErrorCode.SUCCESS:
				isRecive.value = false
				options.onfinish && options.onfinish(response)
				break;
			default:
				isRecive.value = false
				options.onerror && options.onerror()
		}
	}
	const h5StreamRequest = async (options : StreamOptions) => {
		isRecive.value = true
		console.log('Controller before request:', controller.value);
		controller.value = new AbortController();
		console.log('Controller after initialization:', controller.value);
		const signal = controller.value.signal;
		const onSuccess = (chunk : string) => {
			if (chunk == null) {//完成
				isRecive.value = false
				options.onfinish && options.onfinish()
				return null
			}
			options.onmessage && options.onmessage(chunk)
		}
		const onError = (err : any) => {
			isRecive.value = false
			options.onerror && options.onerror(err)
		}

		try {
			await $api.getStream(options.url, options.data, true, onSuccess, onError, LoadingConfig, { signal });
		} catch (error) {
			if (error.name === 'AbortError') {
				console.log('Fetch aborted');
			} else {
				onError(error);
			}
		}
	}
	// 用于App
	const appStreamRequest = (options : StreamOptions) => {

	}
	//统一处理
	const streamRequest = (options ?: StreamOptions) => {
		// #ifdef MP-WEIXIN
		wechatStreamRequest(options)
		// #endif
		// #ifdef H5
		h5StreamRequest(options)
		// #endif
		// #ifdef APP
		appStreamRequest(options)
		// #endif
	}

	const onCancelRequest = () => {
		// #ifdef MP-WEIXIN
		requestTask.abort();
		// #endif

		// #ifdef H5

		if (controller.value) {
			console.log('Aborting request:', controller.value);
			controller.value.abort();
			console.log('Request aborted:', controller.value.signal.aborted); // 应该为 true
			uni.$u.toast('已暂停请求！');
		} else {
			console.warn('No active request to cancel');
		}

		// #endif

		uni.$u.toast('已暂停请求！');
	};
	return {
		streamRequest,
		isRecive,
		onCancelRequest
	}
}
// 流在进行中进行判断逻辑 	
const StreamLoading = (msg : string) => {
	// let newMsg = msg.replaceAll('\n', '')
	if (msg !== '[SUCCESS]') {
		return msg
	}
}
//用于解码
const decode = (text : string) => {
	const data = text
	let txt : string
	// 进行判断返回的对象是Uint8Array（开发者工具）或者ArrayBuffer（真机）
	// 1.获取对象的准确的类型
	const type = Object.prototype.toString.call(data); // Uni8Array的原型对象被更改了所以使用字符串的信息进行判断。
	if (type === "[object Uint8Array]") {
		txt = decodeURIComponent(escape(String.fromCharCode(...data)))
	} else if (data instanceof ArrayBuffer) {
		// 将ArrayBuffer转换为Uint8Array
		const uint8Array = new Uint8Array(data);
		txt = decodeURIComponent(escape(String.fromCharCode(...uint8Array)))
	}
	return txt
}
//处理返回的文本
const resloveResponseText = (content : string) : string => {
	let newMsg : string = ''
	let text = decode(content);
	let result = ''
	const lines = text.split('\n')
	result += lines;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i]) {
			const chunk = lines[i].replaceAll('\\n', '\n')
			if (result.length != 0 && chunk !== '[SUCCESS]') {
				newMsg += StreamLoading(chunk)
			}
		}
	}
	return newMsg
}