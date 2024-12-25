import { useChatStore, useUserStore, useAiAgentChats } from '../store';
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
	isWechatSendImages ?: boolean
}

export interface LoadingConfigTypes {
	showLoading : boolean
	title : string | "加载中..."
}
export type projectType = 'wanxiang' | 'bianjie'
export const AppName : projectType = 'bianjie'
export const AppStrName = AppName == 'wanxiang' ? '万象' : '边界'

export const $http = ({ url, method, data, isJson, isStream, callback, errorCallback, config, LoadingConfig, controller, isWechatSendImages } : httpDTO) => {
	LoadingConfig = LoadingConfig ? LoadingConfig : {
		showLoading: true,
		title: "加载中..."
	}
	const userStore = useUserStore();
	const ChatStore = useChatStore()
	const AiAgentChats = useAiAgentChats()
	const userInfo = userStore.userInfo;
	const defaultTimeout = 100000;
	const headers = {
		uid: userInfo?.id || '',
		token: userStore?.token || '',
		App: userInfo?.appid || '',
		'Access-Token': userInfo?.access_token || '',
		Vt: userInfo?.vip || '0',
		// plaintext: 'true'
		'app-name': AppName,
		...config
	};
	http.interceptor.request = (config) => {
		if (LoadingConfig.showLoading) {
			uni.showLoading({ title: LoadingConfig.title, mask: true });
		}

		config.header = {
			'content-type': isJson ? 'application/json' : 'multipart/form-data;',
			...headers
		};
		console.log(config)
		config.timeout = config.timeout || defaultTimeout;
	};
	http.interceptor.response = (response) => {
		uni.hideLoading();
		if (response?.status == 401 || response?.data?.code === 401 || response?.data?.code === 4001 || response?.statusCode === 401) {
			console.log(response)
			if (response.data?.msg) {
				uni.$u.toast(response.data.msg);
				ChatStore.setLoadingMessage(false)

			} else {
				uni.$u.toast('登录信息已过期，请重新登录！');
				ChatStore.setLoadingMessage(false)

			}
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/my/subPage/login/index'
				});
			}, 1500)
			ChatStore.setLoadingMessage(false)
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
				data,
				isWechatSendImages
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
								url: '/pages/my/subPage/login/index'
							});
							ChatStore.setLoadingMessage(false)

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

function get(url, data ?: any, config ?: any) {
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
const checkPosts = async (options : { url : string, data : any, checkNumsType ?: string }) => {
	const { url, data, checkNumsType } = options
	if (checkNumsType) {
		const res = await post('api/v1/number2/check', { type: checkNumsType })
		if (res.code == 200) {
			const httpDTO = {
				url,
				method: 'POST',
				data,
			};
			return $http(httpDTO);
		}
	}

}

function post(url : string, data : any, isjson ?: boolean, header ?: any, LoadingConfig ?: LoadingConfigTypes, isWechatSendImages ?: boolean) {
	const httpDTO = {
		url,
		method: 'POST',
		data,
		isJson: isjson || true,
		isStream: null,
		callback: null,
		errorCallback: null,
		config: header,
		LoadingConfig,
		isWechatSendImages,
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

async function getStream(options : { url : string, data : any, isStream : boolean, callback : any, errorCallback : any, LoadingConfig : LoadingConfigTypes, controller : { signal : any }, checkNumsType : string, noCheckNums ?: boolean }
) {
	const ChatStore = useChatStore()
	console.log(options)
	const { url, data, isStream, callback, errorCallback, LoadingConfig, controller, checkNumsType, noCheckNums } = options
	let res
	if (!noCheckNums) {
		res = await post('api/v1/number2/check', { type: checkNumsType, })
	}

	if (res?.code == 200 || noCheckNums) {
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
	} else {
		ChatStore.setLoadingMessage(false)
		errorCallback(res.msg)
	}
}

export default {
	postJson,
	get,
	post,
	put,
	del,
	request,
	getStream,
	checkPosts
};