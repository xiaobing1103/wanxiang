import { useGlobalProperties } from './useGlobalHooks'
import { computed, reactive, ref } from 'vue'
import { useAiAgentChats, useChatStore } from '@/store'
import { commonModel } from '@/config/modelConfig'
import { CreateImageDrawLoadding } from '@/store/aiAgentChats';
interface Options {
	onerror(str : any) : unknown;

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
		onmessage ?: (text : string | { SearchTitle : string } | { aiAgentSearchList : { content : string, link : string, title : string }[] }) => void
		onerror ?: (err ?: any) => void
		onfinish ?: (response ?: UniApp.RequestSuccessCallbackResult) => void,
		LoadingConfig ?: {
			showLoading : boolean;
			title : string;
		},
		oncancel ?: () => void,
		checkNumsType ?: string,
		noCheckNums ?: boolean,
		isAiAigent ?: boolean
	}
	enum ErrorCode {
		'SUCCESS' = 200
	}
	const { $api } = useGlobalProperties()
	const AiAgentChats = useAiAgentChats()
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

					if (!options.checkNumsType) {
						if (ChatStore.model == 'net') {
							message = await handlerCurrentModel(message)
						}
					}
					if (options.isAiAigent) {
						message = await handlerCurrentAiagent(message)
						options.onmessage(message)
					} else {
						options.onmessage && options.onmessage(message)
					}
					// console.log(message, 'message错误');
				});
			} else {
				console.error('requestTask is null or does not have onChunkReceived method');
			}
		} catch (error) {
			options.onerror('Error in getStream:')
			console.error('Error in getStream:', error);
		}
	};


	const handleResloveError = async (code : ErrorCode, options : StreamOptions, response ?: UniApp.RequestSuccessCallbackResult) => {
		switch (code) {
			case 200:
				isRecive.value = false
				options.onfinish && options.onfinish(response)
				if (!options.noCheckNums) {
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
			if (chunk == null) {
				isRecive.value = false
				options.onfinish && options.onfinish()
				if (!currentOptions.noCheckNums) {
					await $api.post('api/v1/number2/submit', { number: 1, type: options.checkNumsType ? options.checkNumsType : commonModel[ChatStore.model]?.checkNumsType })
				}
				return null
			}
			if (!options.checkNumsType) {
				if (ChatStore.model == 'net') {
					chunk = await handlerCurrentModel(chunk)
				}
			}
			if (options.isAiAigent) {
				let newChunk = await handlerCurrentAiagent(chunk)
				options.onmessage(newChunk);
			} else {
				options.onmessage && options.onmessage(chunk)
			}


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

	// 处理当前ai智能
	const handlerCurrentAiagent = (result : string) : Promise<string | { SearchTitle : string } | { aiAgentSearchList : { content : string, link : string, title : string }[] }> => {
		return new Promise((resolve, reject) => {
			let resultArr = []
			result = result.replace(/[\u0000-\u001F\u007F-\u009F]/g, function (match) {
				switch (match) {
					case '\n': return '\\n';
					case '\t': return '\\t';
					default:
						return '\\u' + match.charCodeAt(0).toString(16).padStart(4, '0')
				}
			});

			if (result.includes('data: ')) {
				resultArr = result.split('data: ')
				resultArr.forEach((items) => {
					if (items) {
						if (handlerAiAgentFn(items)) {
							resolve(handlerAiAgentFn(items))
						}

					}
				})
			}
		})
	}
	const setIsRecive = () => {
		isRecive.value = false;
	}

	let htmlString = ''

	let globalSearchResults = [];
	// 检查元素是否已存在于数组中，基于某个唯一标识符（例如链接）
	function isDuplicate(item, array) {
		return array.some(element => element.link === item.link);
	}
	const handlerAiAgentFn = (str : string) => {
		try {
			switch (str) {
				case '[SUCCESS]':
					break;
				case '[DONE]':
					isRecive.value = false;
					break;
				case '[ERROR]':
					break;
				default:
					let jsonPart = null
					let da = '成功解析'
					try {
						jsonPart = JSON.parse(str)
					} catch (err) {
						da = '解析失败'
						jsonPart = str
						console.log(da, jsonPart)
						currentOptions.onerror(jsonPart);
					}
					if (da == '成功解析') {
						console.log(da, jsonPart)
						if (!AiAgentChats.currentConversation_id) {
							AiAgentChats.setCurrentConversation_id(jsonPart.conversation_id)
						}
						if (jsonPart.type == 'web_browser') {
							if (!jsonPart.content?.input?.includes('mclick')) {
								if (jsonPart.content?.input?.startsWith('search') || jsonPart.content?.input?.startsWith('msearch')) {
									const regex = /"([^"]*)"/;
									const match = jsonPart.content.input.match(regex);
									return { SearchTitle: match[1] }
								}
								if (jsonPart.content?.outputs instanceof Array) {
									if (jsonPart.content?.outputs.length > 0) {
										// 过滤掉重复的数据
										const uniqueOutputs = jsonPart.content.outputs.filter(item => !isDuplicate(item, globalSearchResults));
										// 将去重后的新数据追加到全局数组中
										globalSearchResults = globalSearchResults.concat(uniqueOutputs);
										// 返回最新的全局搜索结果数组
										return { aiAgentSearchList: globalSearchResults };
									}
								}
							}
						}
						if (jsonPart.type == 'code_interpreter') {
							if (jsonPart.content.input) {
								return `\`\`\`python\n\n${jsonPart.content.input}\n\`\`\`\n`
							}
							if (jsonPart.content.outputs && jsonPart.content.outputs.length > 0) {
								if (
									jsonPart.content.outputs[0].logs &&
									/^https?:\/\//i.test(jsonPart.content.outputs[0].logs)
								) {
									return `![alt image](${jsonPart.content.outputs[0].logs})\n\n`
								} else {
									console.log('结果', jsonPart.content.outputs[0].logs)
									return `\`\`\`javascript\n\n${jsonPart.content.outputs[0].logs}\n\`\`\`\n`
								}
							}
						}
						if (jsonPart.type == 'drawing_tool') {
							if (jsonPart.content.input) {
								return CreateImageDrawLoadding()
							}
							if (jsonPart.content.outputs instanceof Array) {
								return `<div style="padding:10px;"><img style="max-width:160px;min-height:160px;border-radius:20rpx;" src='${jsonPart.content.outputs[0].image}'/></div>`
							}
						}
						if (jsonPart.type == 'function') {
							if (jsonPart.content.arguments) {
								let code_msg = '\n\n' + jsonPart.content.arguments + '\n\n'
								if (jsonPart.content.name) {
									code_msg = `<p style="font-size:16px;font-weight:700;margin:10px 0;">方法${jsonPart.content.name}</p>` + code_msg
								}
								return code_msg
							}
							if (jsonPart.content.outputs && jsonPart.content.outputs.length > 0) {
								let data = JSON.parse(jsonPart.content.outputs[0].content)
								if (data.url) {
									return `![alt image](${data.url})`
								}
							}
							if (jsonPart.content.url) {
								return `![alt image](${jsonPart.content.url})`
							}
						}
						if (jsonPart.role == 'assistant') {
							return jsonPart.content
						}
					}

			}
		} catch (err) {
			console.log(err)
			currentOptions.onerror(err);
		}
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

	//文档翻译限制
	const verifyTranslateTextLimit = (text : string) => {
		// 统计汉字数量
		let chineseCount = Array.from(text).filter(function (char) {
			return char.charCodeAt(0) > 127
		}).length
		// 统计英文字符数量
		let englishCount = text.length - chineseCount
		// 汉字限制1万字
		let chineseLimit = 10000
		// 英文限制2万字
		let englishLimit = 20000
		// 混合文本限制1.5万字
		let mixedLimit = 15000
		// 打印输出信息
		console.log('总字符数量: ' + text.length)
		console.log('汉字数量: ' + chineseCount)
		console.log('英文字符数量: ' + englishCount)
		if (chineseCount > 0 && englishCount === 0) {
			// 纯汉字
			return chineseCount <= chineseLimit
		} else if (chineseCount === 0 && englishCount > 0) {
			// 纯英文
			return englishCount <= englishLimit
		} else {
			// 混合文本
			return text.length <= mixedLimit
		}
	}
	const checkNumFun = async (checkType : string) => {
		return new Promise(async (resolve, reject) => {
			const checkRes = await $api.post('api/v1/number2/check', { type: checkType })
			if (checkRes.code !== 200) {
				ChatStore.setShowLevelUpVipContent(checkRes.msg)
				ChatStore.setShowlevelUpVip(true)
				resolve(false)
			} else {
				resolve(true)
			}
		})

	}
	const checkSubmit = async (checkType : string, number = 1) => {
		await $api.post('api/v1/number2/submit', { type: checkType, number })
	}
	
	const streamSpark = (text : string) : Promise<string> => {
		return new Promise((resolve, reject) => {			
			let htmlString = "";
			const codeBlocks = text.match(/```[\s\S]*?```|```[\s\S]*?$/g) || []
			const lastBlock = codeBlocks[codeBlocks.length - 1]
			if (lastBlock && !lastBlock.endsWith('```')) {
				  htmlString =text + '\n'
				} else {
				  htmlString =text
				}
			  resolve(htmlString); 
		});
	}
	return {
		streamRequest,
		isRecive,
		onCancelRequest,
		checkSubmit,
		checkNumFun,
		setIsRecive,
		streamSpark,
		verifyTranslateTextLimit
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

