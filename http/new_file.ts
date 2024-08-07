import {
	BaseApi
} from '@/http/baseApi'
export default {
	config: {
		baseUrl: BaseApi,
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
			// 'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() { },
		fail() { },
		complete() { }
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method

		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {
						////console.log("【" + _config.requestId + "】 结果：" + JSON.stringify(response.data))
					}
				}
				if (this.interceptor.response) {

					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				//_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					reject(response)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			// 统一的请求日志记录
			//_reqlog(_config)
			if (process.env.NODE_ENV === 'development') {
				//console.log("【" + _config.requestId + "】 地址：" + _config.url)
				if (_config.data) {
					//console.log("【" + _config.requestId + "】 参数：" + JSON.stringify(_config.data))
				}
			}

			uni.request(_config);
		});
	},
	// 	H5端的流式传输
	async fetchStream(options) {
		const { url, method, data, header, success, fail } = options;
		try {
			const response = await fetch(this.config.baseUrl + url || options.baseUrl + url, {
				method: method,
				headers: header,
				body: JSON.stringify(data),
			});
			if (response.ok) {
				const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
				const processStream = async () => {
					try {
						let result = '';
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							const lines = value.split('\n')
							result += lines;

							for (let i = 0; i < lines.length; i++) {
								if (lines[i]) {
									console.log(lines[i])
									const chunk = lines[i].replaceAll('\\n', '\n')
									if (result.length != 0 && chunk !== '[SUCCESS]') {
										success(chunk)
									}
								}
							}
						}
						if (success) {
							success(null);
						}
					} catch (error) {
						if (fail) {
							fail(error);
						}
					}
				};
				await processStream(); // 等待流处理完成
			} else {
				throw new Error(HTTP error! status: ${ response.status });
			}
		} catch (error) {
			if (fail) {
				fail(error);
			}
		}
	},
	// 小程序的流式传输
	StreamRequest(options) {
		const { url, method, data, header, success, fail } = options;
		return new Promise((resolve, reject) => {
			const response = uni.request({
				url: this.config.baseUrl + url || options.baseUrl + url,
				method,
				data,
				header: header,
				enableChunked: true,
				success: success,
				fail: fail,
			})
			// 返回请求的响应
			resolve(response)
		})
	}

}








/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		//console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			//console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		//console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			//console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		//console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}