// http.js
import { Http } from "@anyup/uni-http";
import { useUserStore } from "../store";

const header = {};

const baseURL = "https://ai1foo.com/";
const http = new Http().setBaseURL(baseURL).setHeader(header);

// 请求拦截器
http.interceptors.request.use(
	(request) => {
		if (request.loading) {
			// 如果配置了loading，显示
		}
		// 设置请求header
		const userStore = useUserStore()
		request.header["uid"] = userStore.userInfo.id || '';
		request.header["token"] = userStore.userInfo.token || '';
		request.header["App"] = userStore.userInfo.appid || '';
		return request;
	},
	(error) => Promise.resolve(error)
);
// 响应拦截器
http.interceptors.response.use(
	(response) => {
		// 请求成功
		if (!response.data) {
			return Promise.reject(new Error("接口请求未知错误"));
		}
		// 其他业务处理
		return Promise.resolve(response);
	},
	(error) => {
		// 请求失败，业务处理
		return Promise.reject(error);
	},
	(complete) => {
		// 请求完成
		if (complete.request.loading) {
			// 如果配置了loading，关闭
		}
		// 其他业务处理
		console.log("complete", complete);
	}
);

export default new Http.Builder(http);