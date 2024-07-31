**插件使用说明**

- 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
- 下载后把 http 文件夹 copy 到项目根目录下

## 1. 配置 

### 1.1 全局配置修改（修改http/baseApi.js中BaseApi和http/index.js中相关配置）
	
### 1.2 具体接口调用时修改（在http/index.js文件中具体业务接口中配置)
``` javascript
//设置token和content-type（区分json对象传输和formData传输）
http.interceptor.request = (config) => {
		config.header = {
			'content-type': json ? 'application/json' : 'application/x-www-form-urlencoded',
			"Authorization": uni.getStorageSync('token')
		}
	}
//设置请求结束后拦截器
	http.interceptor.response = async (response) => {
		//判断返回状态 执行相应操作
			if(response.data.code===401){//执行token过期的操作
				return response.data = await doRequest(response,url)
			}
		return response;
	}
//配置刷新token的接口
	var res=await postJson('/v1/miniprogram/oauth/wechat/refreshToken',{code:code})
```	
### 1.3 封装具体的业务请求（在http/index.js文件中具体业务接口中配置)
``` javascript
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

function del(url,data){
	return $http(url, 'DELETE', data, true)
}
``` 
## 2. 使用

### 2.1 全局使用(在main.js注册)

``` //  main.js
  import api from '@/http/'
	
	// 全局挂载后使用
	Vue.prototype.$api = api
```

``` // pages/index/index.vue

<template>
	<view class="content">
		测试api
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(option) {
			this.test()
		},
		methods: {
			// 方式一
			test(){
							this.$api.get('/v1/miniprogram/device/'+'21040011515')
							.then(res=>{
								this.name = res.data.data.clazz_name
							})
						}
			
			//方式二
			async test(){
							let res = await this.$api.get('/v1/miniprogram/device/'+'21040011515')
						}
		}
	}
</script>
```

## 3. 接口数据加密、接口签名核验

在http/interface.js文件中的request(Object)方法中补充修改相应的代码

## 4. 接口请求/响应日志记录

在http/interface.js文件中的request(Object)方法中补充修改相应的代码

## 5. 业务相关接口编写

在http/index.js文件中的编写具体业务相关的接口



	