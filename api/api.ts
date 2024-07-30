
import { useUserStore } from "../store";
import http from "./http";

const urls = {
	login: {
		url: "api/v1/user/login", method: "POST", loading: true
	},
	phoneLogin: {
		url: "api/v1/user/phoneLogin", method: "POST", loading: true,
	},
	sendSmsCode: {
		url: "api/v1/user/sendSmsCode", method: "POST", loading: true,
	},
	// 获取模版信息
	getModels: {
		url: "api/v1/chat2/getModels", method: "POST", loading: true,
	}
};

export default http.dispatch(urls);