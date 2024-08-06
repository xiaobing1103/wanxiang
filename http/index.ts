import { defaultTimeout } from '../api/http'
import { useUserStore } from '../store'
import http from './interface'

export const $http = (url : string, method : string, data ?: any, json ?: boolean, isStream ?: boolean, callback : () => void, errorCallback : () => void) => {
	//设置请求前拦截器
	const userStore = useUserStore();
	const { userInfo } = userStore
	const headers = {
		uid: userInfo?.id || '',
		token: userInfo?.token || '',
		App: userInfo?.appid || '',
		'Access-Token': userInfo?.access_token || '',
		Vt: userInfo?.vip || ''

	}
	http.interceptor.request = (config) => {
		uni.showLoading({
			title: '加载中...'
		})
		config.header = {
			'content-type': json ? 'application/json' : 'application/x-www-form-urlencoded',
			"Authorization": uni.getStorageSync('token'),
			...headers
		}
		config.timeout = config.timeout || defaultTimeout;
	}
	http.interceptor.response = async (response) => {
		uni.hideLoading()
		console.log(response)
		if (response.data.code === 401 || response.statusCode === 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
			// return response.data = await doRequest(response, url) 

		} else {
			if (response.data.code !== 200 && response.data.msg) {
				uni.showToast({
					title: response.data.msg,
					icon: 'none',
					duration: 1500
				})
			}
		}

		return response;
	}

	if (isStream) {
		let isDelopMent
		// #ifdef MP-WEIXIN
		isDelopMent = http.StreamRequest({
			url,
			method,
			data,
			header: headers,
			success: callback,
			fail: errorCallback
		})
		// #endif
		//  #ifdef H5
		isDelopMent = http.fetchStream({
			url,
			method,
			data,
			header: { 'Content-Type': 'application/json;charset=UTF-8', ...headers },
			success: callback,
			fail: errorCallback
		})
		// #endif
		return isDelopMent
	} else {
		return new Promise((resolvce, reject) => {
			http.request({
				method: method,
				url: url,
				dataType: 'json',
				data,
			}).then((res) => {
				resolvce(res.data)
			}).catch((err) => {
				reject(err)
			})
		})
	}



}

async function login() {
	return new Promise(resolve => {
		uni.login({
			provider: 'weixin',
			success(loginRes) {
				resolve(loginRes.code)
			},
			fail() { }
		});
	})
}

async function doRequest(response, url) {
	var code = await login()
	var res = await get('/v1/oauth/refreshToken/code/' + code, {})
	if (res && res.data.data.token) {
		let config = response.config
		uni.setStorageSync("token", res.data.data.token);
		config.header['Authorization'] = res.data.data.token
		let json = config.header["Content-Type"] === 'application/json'
		const resold = await $http(url, config.method, {
			...config.data
		}, json)
		return resold
	} else {
		uni.clearStorage()
		uni.showToast({
			title: "授权失效，请重新登录",
			duration: 1000,
		})
		uni.navigateTo({
			url: '/pages/login/auth'
		})
		return false
	}
}

function postJson(url, data) {
	return $http(url, 'POST', data)
}

function get(url, data) {

	return $http(url, 'GET', data)
}

function post(url, data) {
	return $http(url, 'POST', data, true)
}

function put(url, data) {
	return $http(url, 'PUT', data, true)
}

function del(url, data) {
	return $http(url, 'DELETE', data, true)
}

function request(url, method, data) {
	return $http(url, method, data, true)
}

function getStream(url, data, isStream, callback, errorCallback) {
	return $http(url, 'POST', data, true, isStream, callback, errorCallback)
}

export default {
	postJson,
	get,
	post,
	put,
	del,
	request,
	getStream
}