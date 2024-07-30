
import http, { UrlConfig } from "./http";


const urls : Record<string, UrlConfig> = {
	login: {
		url: "api/v1/user/login", method: "POST", loading: true
	},
	userInfo: {
		url: 'api/v1/user/info', method: 'GET', loading: true
	},
	phoneLogin: {
		url: "api/v1/user/phoneLogin", method: "POST", loading: true,
	},
	sendSmsCode: {
		url: "api/v1/user/sendSmsCode", method: "POST", loading: true,
	},
	getModels: {
		url: "api/v1/chat2/getModels", method: "POST", loading: true,
	},
	register: {
		url: "api/v1/user/register", method: "POST", loading: true,
	},
	v35: {
		url: 'api/v1/chat2/v35', method: 'POST', loading: true, eventStream: true
	}
};

export default http.dispatch(urls);