import { Http } from "@anyup/uni-http";
import { useUserStore } from "../store";

export interface RequestOptions {
	url : string;
	method : "GET" | "POST" | "PUT" | "DELETE";
	data ?: any;
	header ?: Record<string, string>;
	loading ?: boolean;
}

export enum HttpStatusCode {
	OK = 200,
	Created = 201,
	Accepted = 202,
	NoContent = 204,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	Conflict = 409,
	InternalServerError = 500,
	NotImplemented = 501,
	BadGateway = 502,
	ServiceUnavailable = 503,
	GatewayTimeout = 504
}

export const HttpStatusMessage : Record<HttpStatusCode, string> = {
	[HttpStatusCode.OK]: "OK",
	[HttpStatusCode.Created]: "Created",
	[HttpStatusCode.Accepted]: "Accepted",
	[HttpStatusCode.NoContent]: "No Content",
	[HttpStatusCode.BadRequest]: "Bad Request",
	[HttpStatusCode.Unauthorized]: "Unauthorized",
	[HttpStatusCode.Forbidden]: "Forbidden",
	[HttpStatusCode.NotFound]: "Not Found",
	[HttpStatusCode.MethodNotAllowed]: "Method Not Allowed",
	[HttpStatusCode.Conflict]: "Conflict",
	[HttpStatusCode.InternalServerError]: "Internal Server Error",
	[HttpStatusCode.NotImplemented]: "Not Implemented",
	[HttpStatusCode.BadGateway]: "Bad Gateway",
	[HttpStatusCode.ServiceUnavailable]: "Service Unavailable",
	[HttpStatusCode.GatewayTimeout]: "Gateway Timeout"
};

export const CustomHttpMessages : Record<number, string> = {
	400: "验证码已过期",
	// 可以在这里添加更多的自定义消息
};

export interface Response<T = any> {
	data : T;
	code : HttpStatusCode;
	msg : string;
	headers : Record<string, string>;
}

export interface UserStore {
	userInfo : {
		id : string;
		token : string;
		appid : string;
	};
}

export interface RequestMethod<T = any> {
	(params : any) : Promise<Response<T>>;
}

export interface UrlConfig {
	url : string;
	method : "GET" | "POST" | "PUT" | "DELETE";
	loading : boolean;
	header ?: Record<string, string>;
	baseURL ?: string;
}

export interface ApiMethods {
	login : RequestMethod;
	phoneLogin : RequestMethod;
	sendSmsCode : RequestMethod<{ phone : string }>;
	getModels : RequestMethod;
}

const header : Record<string, string> = {};

const baseURL = "https://ai1foo.com/";
const http = new Http().setBaseURL(baseURL).setHeader(header);

// 请求拦截器
http.interceptors.request.use(
	(request : RequestOptions) => {
		if (request.loading) {
			// 如果配置了loading，显示
		}
		// 设置请求header
		const userStore = useUserStore();
		request.header = request.header || {};
		request.header["uid"] = userStore.userInfo.id || '';
		request.header["token"] = userStore.userInfo.token || '';
		request.header["App"] = userStore.userInfo.appid || '';
		return request;
	},
	(error : any) => Promise.resolve(error)
);

// 响应拦截器
http.interceptors.response.use(
	(response : Response) => {
		// 请求成功
		if (!response.data) {
			return Promise.reject(new Error("接口请求未知错误"));
		}
		// 其他业务处理
		return Promise.resolve(response);
	},
	(error : any) => {
		// 请求失败，业务处理
		return Promise.reject(error);
	},
	(complete : any) => {
		// 请求完成
		if (complete.request.loading) {
			// 如果配置了loading，关闭
		}
		// 其他业务处理
		console.log("complete", complete);
	}
);

class HttpBuilder {
	constructor(private http : Http) { }

	public dispatch(urls : Record<string, UrlConfig>) : ApiMethods {
		const apiMethods : Partial<ApiMethods> = {};
		for (const key in urls) {
			if (Object.prototype.hasOwnProperty.call(urls, key)) {
				const urlConfig = urls[key];
				apiMethods[key] = (params : any) => this.http.request({
					url: urlConfig.url,
					method: urlConfig.method,
					data: params,
					loading: urlConfig.loading,
				});
			}
		}
		return apiMethods as ApiMethods;
	}
}

export default new HttpBuilder(http);