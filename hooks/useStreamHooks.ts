import { useGlobalProperties } from './useGlobalHooks'
import { ref } from 'vue'
import { useChatStore } from '@/store'
import { commonModel } from '@/config/modelConfig'
interface Options {

}
const ChatStore = useChatStore()
const LoadingConfig = {
	showLoading: false,
	title: "加载中..."
}


export const useStreamHooks = (options ?: Options) => {
	let controller = ref(null)
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
		oncancel ?: () => void,
		checkNumsType ?: string,
		noCheckNums ?: boolean
	}
	enum ErrorCode {
		'SUCCESS' = 200
	}
	const { $api } = useGlobalProperties()
	const isRecive = ref(false)
	let requestTask = null;
	let cancelFn
	//用于微信
	const wechatStreamRequest = async (options : StreamOptions) => {
		isRecive.value = true;
		cancelFn = options.oncancel
		try {
			const getStreamOptions = {
				url: options.url,
				data: options.data,
				isStream: true,
				callback: async (response : UniApp.RequestSuccessCallbackResult) => {
					handleResloveError(response.statusCode, options, response);
				},
				errorCallback: async (err) => {
					console.log(err, '微信错误');
					options.onerror(err)
				},
				LoadingConfig: LoadingConfig,
				checkNumsType: options.checkNumsType ? options.checkNumsType : commonModel[ChatStore.model]?.checkNumsType,
				noCheckNums: options.noCheckNums
			}
			requestTask = await $api.getStream(getStreamOptions);
			if (requestTask && typeof requestTask.onChunkReceived === 'function') {
				requestTask.onChunkReceived(async res => {
					let message = resloveResponseText(res.data);
					if (ChatStore.model == 'net') {
						message = await handlerCurrentModel(message)
					}
					options.onmessage && options.onmessage(message);
					console.log(message, 'message错误');
				});
			} else {
				console.error('requestTask is null or does not have onChunkReceived method');
			}

		} catch (error) {
			console.error('Error in getStream:', error);
		}
	};

	const handleResloveError = async (code : ErrorCode, options : StreamOptions, response ?: UniApp.RequestSuccessCallbackResult) => {
		switch (code) {
			case ErrorCode.SUCCESS:
				isRecive.value = false
				options.onfinish && options.onfinish(response)
				if (!options.checkNumsType) {
					await $api.post('api/v1/number2/submit', { number: 1, type: options.checkNumsType ? options.checkNumsType : commonModel[ChatStore.model]?.checkNumsType })
				}
				break;
			default:
				isRecive.value = false
				options.onerror && options.onerror()
		}
	}
	let currentOptions
	const h5StreamRequest = async (options : StreamOptions) => {
		currentOptions = options
		isRecive.value = true
		controller.value = new AbortController();
		const signal = controller.value.signal;
		const onSuccess = async (chunk : string) => {
			if (chunk == null) {//完成
				isRecive.value = false
				options.onfinish && options.onfinish()
				if (!currentOptions.noCheckNums) {
					await $api.post('api/v1/number2/submit', { number: 1, type: options.checkNumsType ? options.checkNumsType : commonModel[ChatStore.model]?.checkNumsType })
				}
				return null
			}

			if (ChatStore.model == 'net') {
				chunk = await handlerCurrentModel(chunk)
			}
			options.onmessage && options.onmessage(chunk)
		}
		const onError = (err : any) => {
			isRecive.value = false
			options.onerror && options.onerror(err)
		}

		try {
			const getStreamOptions = {
				url: options.url,
				data: options.data,
				isStream: true,
				callback: onSuccess,
				errorCallback: (err) => {
					console.log(err)
					onError(err)
				},
				LoadingConfig: LoadingConfig,
				controller: { signal },
				checkNumsType: options.checkNumsType ? options.checkNumsType : commonModel[ChatStore.model]?.checkNumsType,
				noCheckNums: options.noCheckNums
			}

			await $api.getStream(getStreamOptions);
		} catch (error) {
			if (error.name === 'AbortError') {
				console.log('Fetch aborted');
			} else {
				onError(error);
			}
			console.log(error)
		}
	}
	// 用于App
	const appStreamRequest = (options : StreamOptions) => {

	}
	// 处理当前net模型的数据
	let shouldProcess : boolean = false;
	let accumulatedData : string = '';

	const handlerCurrentModel = (result : string) : Promise<string> => {
		let searchResult : string = ''
		return new Promise((resolve, reject) => {
			accumulatedData += result;
			if (accumulatedData.startsWith(`data: {"type":"event","event":"search_read"`)) {
				const tagPattern = /"tag":"([\s\S]*?)"/;
				const contentPattern = /"content":\s*(\[[\s\S]*?\])/;
				const tagMatch = accumulatedData.match(tagPattern);
				const tag = tagMatch ? tagMatch[1] : null;
				const contentMatch = accumulatedData.match(contentPattern);
				const content = contentMatch ? contentMatch[1] : null;
				console.log("Tag:", tag);
				const contentArr = JSON.parse(content)
				contentArr.forEach((items : { title : string; link : string, icon : string, media : string }) => {
					searchResult += `<a style="color:rgb(0, 122, 255);display:block;padding:10rpx 0;" href="${items.link}"><img style="width: 30rpx; height:30rpx;margin-right:20rpx;" src="${items.icon}" alt="${items.media}"/>${items.title}</a>\n`
				})
				resolve(`<div style="margin:20rpx 0;padding:20rpx;background-color:#282c34;border-radius:10rpx;">${searchResult}</div>`)
			}
			try {
				const jsonPattern = /data:\s*({.*?})\s*/g;
				let match : RegExpExecArray | null;
				while ((match = jsonPattern.exec(accumulatedData)) !== null) {
					const jsonString = match[1];
					if (jsonString) {
						try {
							const obj = JSON.parse(jsonString);
							if (obj?.type === 'event' && obj?.event === 'search') {
								shouldProcess = true;
								resolve(`\nAl联网搜索: ${obj?.content.replace(/search\//g, '').replace(/正在搜索:/g, '')}\n------\n`);
							}
							if (shouldProcess && obj?.type === 'event' && obj?.event === 'search_read') {
								let searchResult = '';
								obj.content.forEach((item : { title : string; href : string }) => {
									searchResult += `<a style="color:red;">${item.title} + ${item.href}</a>\n`;
								});
								resolve(`<code>${searchResult}</code>`);
							}
							if (obj?.type === 'text') {
								resolve(shouldProcess ? obj?.content : obj?.content.replace(/search\//g, ''));
							}
						} catch (error) {
							reject(`JSON parsing error: ${error.message}`);
						}
					}
				}
				accumulatedData = '';
			} catch (error) {
				reject(`Error in processing data: ${error.message}`);
			}
		});
	};



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
		cancelFn && cancelFn()
		uni.$u.toast('已暂停请求！');
		// #endif

		// #ifdef H5
		if (controller.value) {
			controller.value.abort();
			cancelFn && cancelFn()
			uni.$u.toast('已暂停请求！');
		} else {
			console.warn('No active request to cancel');
		}
		// #endif
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