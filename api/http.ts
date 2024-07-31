import { Http } from "@anyup/uni-http";
import { useUserStore } from "../store";
import { LoginReq } from "../type/userTypes";


export interface RequestOptions {
	url : string;
	method : "GET" | "POST" | "PUT" | "DELETE";
	data ?: any;
	header ?: Record<string, string>;
	loading ?: boolean;
	timeout ?: number; // 新增属性
	eventStream ?: boolean; // 新增属性，用于标记 text/event-stream 请求
	callback ?: (chunk : string) => void; // 新增属性，回调函数
	errorback ?: (error : any) => void; // 新增属性，错误回调函数
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
	header : Record<string, string>;
	callback : (val) => void
	errorCallback : (val) => void
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
	timeout ?: number; // 新增属性
	eventStream ?: boolean; // 添加 eventStream 配置
}

export interface ApiMethods {
	login : RequestMethod<LoginReq>;
	userInfo : RequestMethod<null>;
	phoneLogin : RequestMethod;
	sendSmsCode : RequestMethod<{ phone : string }>;
	getModels : RequestMethod;
	register : RequestMethod<{ user : string, pass : string, code ?: string }>
	v35 : RequestMethod<{ params : string, prompt : string, type ?: string }>
}

const header : Record<string, string> = {};

export const baseURL = "https://ai1foo.com/";
export const defaultTimeout = 20000
const http = new Http().setBaseURL(baseURL).setHeader(header);;

// 请求拦截器
http.interceptors.request.use(
	(request : RequestOptions) => {
		if (request.loading) {
			// 如果配置了loading，显示
		}
		// 设置请求header
		const userStore = useUserStore();
		const { userInfo } = userStore
		request.header = request.header || {};
		request.header["uid"] = userInfo?.id || '';
		request.header["token"] = userInfo?.token || '';
		request.header["App"] = userInfo?.appid || '';
		request.header["Access-Token"] = userInfo?.access_token || ''
		request.timeout = request.timeout || defaultTimeout;
		// 如果是 event-stream 请求，设置 Accept 头
		if (request.eventStream) {
			request.header["Accept"] = "text/event-stream";
		}
		return request;
	},
	(error : any) => Promise.resolve(error)
);

// 响应拦截器
http.interceptors.response.use(
	(response : any) => {
		// 非流请求正常处理
		if (!response.data) {
			return Promise.reject(new Error("接口请求未知错误"));
		}
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
	constructor(private http : Http<any>) { }
	public dispatch(urls : Record<string, UrlConfig>) : ApiMethods {
		const apiMethods : Partial<ApiMethods> = {};
		for (const key in urls) {
			if (Object.prototype.hasOwnProperty.call(urls, key)) {
				const urlConfig = urls[key];
				apiMethods[key] = (params : any, callback ?: (chunk : string) => void, errorback ?: (error : any) => void) => {
					return http.request({
						url: urlConfig.url,
						method: urlConfig.method,
						data: params,
						loading: urlConfig.loading,
						header: urlConfig.header,
						timeout: urlConfig.timeout || defaultTimeout,
						eventStream: urlConfig.eventStream || false, // 设置 eventStream 参数
					})
				};
			}
		}
		return apiMethods as ApiMethods;
	}
}
export default new HttpBuilder(http);