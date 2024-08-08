import { BaseApi } from '@/http/baseApi';

export default {
	config: {
		baseUrl: BaseApi,
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
		data: {},
		method: 'GET',
		dataType: 'json',
		responseType: 'text',
	},
	interceptor: {
		request: null,
		response: null,
	},
	request(options) {
		if (!options) {
			options = {};
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl;
		options.dataType = options.dataType || this.config.dataType;
		options.url = options.baseUrl + options.url;
		options.data = options.data || {};
		options.method = options.method || this.config.method;

		return new Promise((resolve, reject) => {
			let _config = null;
			options.complete = (response) => {
				let statusCode = response.statusCode;
				response.config = _config;

				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response);
					if (newResponse) {
						response = newResponse;
					}
				}

				if (statusCode === 200) {
					resolve(response);
				} else {
					reject(response);
				}
			};

			_config = Object.assign({}, this.config, options);
			_config.requestId = new Date().getTime();

			if (this.interceptor.request) {
				this.interceptor.request(_config);
			}

			uni.request(_config);
		});
	},
	// async fetchStream(options) {
	// 	const { url, method, data, header, success, fail } = options;
	// 	let _config = Object.assign({}, this.config, options);
	// 	_config.url = this.config.baseUrl + url || options.baseUrl + url;
	// 	_config.method = method;
	// 	_config.headers = header;
	// 	_config.body = JSON.stringify(data);

	// 	if (this.interceptor.request) {
	// 		this.interceptor.request(_config);
	// 	}

	// 	try {
	// 		const response = await fetch(_config.url, {
	// 			method: _config.method,
	// 			headers: _config.headers,
	// 			body: _config.body,
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error(`HTTP error! status: ${response.status}`);
	// 		}

	// 		const reader = response.body.getReader();
	// 		const decoder = new TextDecoder();
	// 		let result = '';

	// 		const processStream = async () => {
	// 			try {
	// 				while (true) {
	// 					const { done, value } = await reader.read();
	// 					if (done) break;
	// 					const text = decoder.decode(value, { stream: true });
	// 					const lines = text.split('\n');
	// 					result += lines;

	// 					for (let i = 0; i < lines.length; i++) {
	// 						if (lines[i]) {
	// 							const chunk = lines[i].replaceAll('\\n', '\n');
	// 							if (result.length !== 0 && chunk !== '[SUCCESS]') {
	// 								success(chunk);
	// 							}
	// 						}
	// 					}
	// 				}
	// 				if (success) {
	// 					success(null);
	// 				}
	// 			} catch (error) {
	// 				if (fail) {
	// 					fail(error);
	// 				}
	// 			}
	// 		};

	// 		if (this.interceptor.response) {
	// 			let responseData = {
	// 				statusCode: response.status,
	// 				data: result,
	// 				config: _config,
	// 			};

	// 			let newResponse = this.interceptor.response(responseData);
	// 			if (newResponse) {
	// 				responseData = newResponse;
	// 			}
	// 		}
	// 		await processStream();
	// 	} catch (error) {
	// 		if (error.message.includes('401')) {
	// 			console.error('Unauthorized access - maybe redirect to login?');
	// 			if (fail) fail({ message: 'Unauthorized', status: 401 });
	// 		} else {
	// 			console.error('Fetch error:', error.message);
	// 			if (fail) fail(error);
	// 		}
	// 	}
	// },


	async fetchStream(options) {
		const { url, method, data, header, success, fail } = options;
		let _config = Object.assign({}, this.config, options);
		_config.url = this.config.baseUrl + url || options.baseUrl + url;
		_config.method = method;
		_config.headers = header;
		_config.body = JSON.stringify(data);

		if (this.interceptor.request) {
			this.interceptor.request(_config);
		}
		try {
			const response = await fetch(_config.url, {
				method: _config.method,
				headers: _config.headers,
				body: _config.body,
			});
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let result = '';
			const processStream = async () => {
				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						const text = decoder.decode(value, { stream: true });
						const lines = text.split('\n');
						result += lines;

						for (let i = 0; i < lines.length; i++) {
							if (lines[i]) {
								const chunk = lines[i].replaceAll('\\n', '\n');
								if (result.length !== 0 && chunk !== '[SUCCESS]') {
									success(chunk);
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

			let responseData = {
				statusCode: response.status,
				data: result,
				config: _config,
			};

			if (this.interceptor.response) {
				let newResponse = this.interceptor.response(responseData);
				if (newResponse) {
					responseData = newResponse;
				}
			}

			if (!response.ok) {
				throw new Error(`请求错误! 错误代码: ${response.status}`);
			}

			await processStream();
		} catch (error) {
			fail(error.message)
			// if (error.message.includes('401')) {
			// 	console.error('Unauthorized access - maybe redirect to login?');
			// 	if (fail) fail('Unauthorized access - maybe redirect to login?');
			// } else {
			// 	console.error('Fetch error:', error.message);
			// 	if (fail) fail(error);
			// }
		}
	},

	StreamRequest(options) {
		const { url, method, data, header, success, fail } = options;
		let _config = Object.assign({}, this.config, options);
		_config.url = this.config.baseUrl + url || options.baseUrl + url;
		_config.method = method;
		_config.headers = header;
		_config.data = data;

		if (this.interceptor.request) {
			this.interceptor.request(_config);
		}

		return new Promise((resolve, reject) => {
			const response = uni.request({
				url: _config.url,
				method: _config.method,
				data: _config.data,
				header: _config.headers,
				enableChunked: true,
				success: async (response) => {
					if (this.interceptor.response) {
						let newResponse = this.interceptor.response(response);
						if (newResponse) {
							response = newResponse;
						}
					}
					await success(response)
				},
				fail: fail,
			});
			resolve(response);
		});
	},
};

function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log(`【${req.requestId}】 地址：${req.url}`);
		if (req.data) {
			console.log(`【${req.requestId}】 请求参数：${JSON.stringify(req.data)}`);
		}
	}
}

function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		console.log(`【${res.config.requestId}】 地址：${res.config.url}`);
		if (res.config.data) {
			console.log(`【${res.config.requestId}】 请求参数：${JSON.stringify(res.config.data)}`);
		}
		console.log(`【${res.config.requestId}】 响应结果：${JSON.stringify(res)}`);
	}

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