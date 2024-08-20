import fly from 'flyio';
import { BaseApi } from '@/http/baseApi';
import { isWeChatTempPath } from '@/utils/isWeChatTempPath';
// #ifdef MP-WEIXIN
import FormData from '@/tools/FormData';
// #endif

export default {
	config: {
		baseUrl: BaseApi,
		header: {
			// 'Content-Type': 'application/json;charset=UTF-8',
		},
		data: {},
		method: 'GET',
		dataType: 'json',
		responseType: 'text'
	},
	interceptor: {
		request: null,
		response: null
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

		const isFormData = options.data instanceof FormData;

		if (!isFormData) {
			options.header = options.header || {};
			if (typeof options.data === 'object' && !Array.isArray(options.data)) {
				options.header['Content-Type'] = 'application/x-www-form-urlencoded';
			} else if (typeof options.data === 'string') {
				options.header['Content-Type'] = 'application/json';
			}
		}

		if (this.interceptor.request) {
			options = this.interceptor.request(options) || options;
		}
		return new Promise((resolve, reject) => {
			let _config = Object.assign({}, this.config, options);
			_config.requestId = new Date().getTime();
			_config.complete = (response) => {
				let statusCode = response.statusCode;
				response.config = _config;
				// Apply response interceptor
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
			// h5端发送formdata的情况
			if (isFormData) {
				fly.interceptors.request.use(this.interceptor.request(_config));
				fly.interceptors.response.use(
					(response, promise) => {
						return response;
					},
					(err, promise) => {
						this.interceptor.response(err);
					}
				);
				fly.request({
					method: _config.method,
					url: _config.url,
					headers: _config.header,
					body: _config.data
				})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				if (typeof options.data?.image == 'string' && isWeChatTempPath(options.data?.image)) {
					const parmas = options.data;
					const { image, ...others } = parmas;
					uni.uploadFile({
						url: _config.url,
						filePath: image,
						header: {
							..._config.header,
							contentType: image.contentType
						},
						name: 'image',
						success: (uploadFileRes) => {
							const response = this.interceptor.response(uploadFileRes);
							resolve(response);
						},
						formData: {
							...others
						},
						fail(err) {
							reject(err.errMsg);
						}
					});
				} else {
					console.log(_config);
					uni.request(_config);
				}
			}
		});
	},
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
				headers: _config.header,
				body: _config.body
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
				config: _config
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
			fail(error.message);
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
					await success(response);
				},
				fail: fail
			});
			resolve(response);
		});
	}
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
