import { useUserStore } from '../store';
import { UserInfoDTO } from '../type/userTypes';
import http from './interface';
export interface httpDTO {
	url : string;
	method : string;
	data ?: any;
	isJson ?: boolean;
	isStream ?: boolean;
	callback ?: () => void;
	errorCallback ?: () => void;
	config ?: any;
	LoadingConfig ?: LoadingConfigTypes
	controller ?: { signal : any }
}

export interface LoadingConfigTypes {
	showLoading : boolean
	title : String | "加载中..."
}
export const $http = ({ url, method, data, isJson, isStream, callback, errorCallback, config, LoadingConfig, controller } : httpDTO) => {
	LoadingConfig = LoadingConfig ? LoadingConfig : {
		showLoading: true,
		title: "加载中..."
	}
	const userStore = useUserStore();
	const userInfo = userStore.userInfo;
	const defaultTimeout = 20000;
	const headers = {
		uid: userInfo?.id || '',
		token: userInfo?.token || '',
		App: userInfo?.appid || '',
		'Access-Token': userInfo?.access_token || '',
		Vt: userInfo?.vip || '',
		// plaintext: 'true'
		...config
	};
	http.interceptor.request = (config) => {
		if (LoadingConfig.showLoading) {
			uni.showLoading({ title: LoadingConfig.title, mask: true });
		}
		config.header = {
			'content-type': isJson ? 'application/json' : 'multipart/form-data;',
			// Authorization: uni.getStorageSync('token'),
			...headers
		};
		config.timeout = config.timeout || defaultTimeout;
	};
	http.interceptor.response = (response) => {
		console.log(response)
		uni.hideLoading();

		if (response?.status == 401 || response?.data.code === 401 || response?.data.code === 4001 || response?.statusCode === 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			});

			// return response.data = await doRequest(response, url)
		} else {
			if (response.data.code !== 200 && response.data.message) {
				uni.showToast({
					title: response.data.message,
					icon: 'none',
					duration: 1500
				});
			}
		}

		return response;
	};

	if (isStream) {
		let isDelopMent;
		// #ifdef MP-WEIXIN
		isDelopMent = http.StreamRequest({
			url,
			method,
			data,
			header: headers,
			success: callback,
			fail: errorCallback
		});
		// #endif
		//  #ifdef H5

		isDelopMent = http.fetchStream({
			url,
			method,
			data,
			header: { ...headers },
			success: callback,
			fail: errorCallback,
			controller: controller
		});
		// #endif
		return isDelopMent;
	} else {
		return new Promise((resolvce, reject) => {
			http.request({
				method: method,
				url: url,
				dataType: isJson ? 'json' : '',
				data
			})
				.then((res) => {
					resolvce(res.data);
				})
				.catch((err) => {
					console.log(err)
					if (err.response) {
						let response = err.response;
						if (response.data.code === 401 || response.data.code === 4001 || response.statusCode === 401) {
							uni.hideLoading();
							uni.navigateTo({
								url: '/pages/login/index'
							});
						} else {
							if (response.data.code !== 200 && response.data.message) {
								uni.showToast({
									title: response.data.message,
									icon: 'none',
									duration: 1500
								});
							}
						}
					}

					reject(err);
				});
		});
	}
};

// async function login() {
// 	return new Promise(resolve => {
// 		uni.login({
// 			provider: 'weixin',
// 			success(loginRes) {
// 				resolve(loginRes.code)
// 			},
// 			fail() { }
// 		});
// 	})
// }

// async function doRequest(response, url) {
// 	var code = await login()
// 	var res = await get('/v1/oauth/refreshToken/code/' + code, {})
// 	if (res && res.data.data.token) {
// 		let config = response.config
// 		uni.setStorageSync("token", res.data.data.token);
// 		config.header['Authorization'] = res.data.data.token
// 		let json = config.header["Content-Type"] === 'application/json'
// 		const resold = await $http(url, config.method, {
// 			...config.data
// 		}, json)
// 		return resold
// 	} else {
// 		uni.clearStorage()
// 		uni.showToast({
// 			title: "授权失效，请重新登录",
// 			duration: 1000,
// 		})
// 		uni.navigateTo({
// 			url: '/pages/login/auth'
// 		})
// 		return false
// 	}
// }

function postJson(url, data) {
	const httpDTO = {
		url,
		method: 'POST',
		data,
		isJson: true,
		isStream: null,
		callback: null,
		errorCallback: null,
		config: null
	};
	return $http(httpDTO);
}

function get(url, data, config : any) {
	const httpDTO = {
		url,
		method: 'GET',
		data,
		isJson: true,
		isStream: null,
		callback: null,
		errorCallback: null,
		config: config
	};
	return $http(httpDTO);
}

function post(url : string, data : any, isjson ?: boolean, header ?: any, LoadingConfig ?: LoadingConfigTypes) {
	const httpDTO = {
		url,
		method: 'POST',
		data,
		isJson: isjson || true,
		isStream: null,
		callback: null,
		errorCallback: null,
		config: header,
		LoadingConfig
	};
	return $http(httpDTO);
}

function put(url, data) {
	const httpDTO = {
		url,
		method: 'PUT',
		data,
		isJson: true,
		isStream: null,
		callback: null,
		errorCallback: null,
		config: null
	};
	return $http(httpDTO);
}

function del(url, data) {
	const httpDTO = {
		url,
		method: 'DEL',
		data,
		isJson: true,
		isStream: null,
		callback: null,
		errorCallback: null,
		config: null
	};
	return $http(httpDTO);
}

function request(url, method, data) {
	const httpDTO = {
		url,
		method: method,
		data,
		isJson: true,
		isStream: null,
		callback: null,
		errorCallback: null,
		config: null
	};
	return $http(httpDTO);
}

function getStream(url : string, data : any, isStream : boolean, callback : any, errorCallback : any, LoadingConfig : LoadingConfigTypes, controller : { signal : any }) {
	const httpDTO = {
		url,
		method: 'POST',
		data,
		isJson: true,
		isStream: isStream,
		callback: callback,
		errorCallback: errorCallback,
		config: null,
		LoadingConfig: LoadingConfig,
		controller
	};
	return $http(httpDTO);
}

export default {
	postJson,
	get,
	post,
	put,
	del,
	request,
	getStream
};