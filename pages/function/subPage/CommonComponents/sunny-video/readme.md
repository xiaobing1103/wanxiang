# sunny-video视频倍速播放器
> **组件名：sunny-video**

### 平台差异说明
- 目前已应用到APP（安卓、iOS）、微信（小程序、H5）
- 其它平台未测试

### 安装方式

- 本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。
- **uni-app插件市场链接** —— [https://ext.dcloud.net.cn/plugin?id=11982](https://ext.dcloud.net.cn/plugin?id=11982)

### <a id="jump1">基本用法</a>

- APP端需要配置`manifest.json>App模块配置`勾选`VideoPlay(视频播放)`
- App端：3.6.14 以及 手机系统 iOS16 以上video全屏 需要配置应用支持横屏： 在`manifest.json` 文件内 `app-plus` 节点下新增 `screenOrientation` 配置，设置值为`["portrait-primary","portrait-secondary","landscape-primary","landscape-secondary"]`。如下：
```json
 "app-plus" : {
	"screenOrientation" : [
	     "portrait-primary",
	     "portrait-secondary",
	     "landscape-primary",
	     "landscape-secondary"
	]
 }
```
#### <a id="jump2">vue2使用必看</a>
- 自`2.0.0`开始，本组件使用`composition-api`, 如果你希望在vue2中使用，需要在`main.js`中的`vue2`部分中添加如下关键代码块
```javascript
// vue2
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```
- 更多说明请查看官方教程[vue-composition-api](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)

### 代码演示

```vue
<template>
	<view>
		<sunny-video 
			ref="sunnyVideoRef" 
			title="测试视频" 
			src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4" 
			poster="https://ask.dcloud.net.cn/static/images/side/ask_right_unicloud_class.jpg"
			:trialTime="20"
			:seekTime="5"
			@timeupdate="timeupdate" 
		/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			timeupdate(e){
			}
		}
	}
</script>

<style>
</style>
```

### Props

|属性名					| 类型			|默认值							| 可选值	| 说明																					|
|:-:					| :-:			|:-:							| :-:	| :-:																					|
|src					| String		| ''							| -		| 视频播放地址																			|
|loop `1.1.3`			| Boolean		| false							| true	| 是否循环播放																			|
|muted `1.1.3`			| Boolean		| false							| true	| 是否静音播放																			|
|autoplay				| Boolean		| false							| true	| 是否自动播放																			|
|title					| String		| ''							| -		| 视频标题																				|
|poster					| String		| ''							| -		| 视频封面																				|
|videoHeight			| String, Number| 230px							| -		| 视频高度																				|
|videoWidth `1.1.3`		| String, Number| 750rpx						| -		| 视频宽度																				|
|playImgHeight			| String, Number| 70rpx							| -		| 播放图标按钮宽高																		|
|playImg				| String		| base64						| -		| 播放按钮图标																			|
|showMuteBtn			| Boolean		| false							| true	| 是否显示静音按钮																		|
|isExitFullScreen		| Boolean		| true							| false	| 播放完毕是否退出全屏																		|
|tipText `1.1.0`		| String		| '试看已结束，本片是会员专享内容'	| -		| 试看提示的文字																			|
|btnText `1.1.0`		| String		| '成为会员免费观看'				| -		| 试看按钮的文字																			|
|trialTime `1.1.0`		| Number		| 0								| -		| 视频试看时间(秒), 不需要试看功能则默认为0													|
|speedBoxWidth `1.1.3`	| String, Number| 160rpx						| -		| 倍速盒子宽度																			|
|seekTime `1.2.0`		|  Number		| 0								| -		| 跳转到历史观看位置(秒), 不需要则默认为0，注:`H5`为被动										|
|videoId `1.2.1`		|  String		| sunnyVideo					| -		| 视频唯一ID																				|
|objectFit `2.0.0`		|  String		|	contain						| -		| 当视频大小与 video 容器大小不一致时，视频的表现形式。contain：包含，fill：填充，cover：覆盖	|

### 事件 Events

| 事件名					| 说明						| 返回值																|
|:-:						| :-:						|:-:																|
| play						| 监听开始播放				| -																	|
| pause						| 监听视频暂停				| -																	|
| playError					| 视频播放出错时触发			| -																	|
| videoEnded				| 视频播放结束触发			| -																	|
| timeupdate				| 播放进度变化时触发			| event.detail={currentTime, duration}。触发频率 250ms 一次			|
| fullscreenchange `1.1.3`	| 当视频进入和退出全屏时触发	| event={fullScreen, direction}，direction取为vertical或horizontal	|
| handleBtn `1.1.0`			| 点击试看按钮时触发			| -																	|
| trialEnd `1.1.0`			| 试看结束时触发				| -																	|
| changeSeek `1.1.7`		| 视频跳转到指定位置时触发		| event= 播放位置单位 s												|

### 方法 Methods

- 需要通过ref获取组件才能调用

| 名称						| 参数		| 说明						| 差异							|
|:-:						|:-:		|:-:						|:-:							|
| changePlay				|			| 开始播放视频				|	-							|
| changePause `1.1.3`		|			| 暂停播放视频				|	-							|
| showTrialEnd `1.1.0`		|			| 控制试看模块显示			|	-							|
| closeTrialEnd `1.1.0`		|			| 控制试看模块隐藏			|	-							|
| seek `1.1.1`				| position	| 跳转到指定位置，单位 s		|	-							|
| requestFullScreen `1.1.8`	|			|进入全屏					|	-							|
| exitFullScreen `1.1.8`	|			|退出全屏					|	-							|
| showStatusBar `1.1.8`		|			|显示状态栏，仅在iOS全屏下有效	|微信小程序、百度小程序、QQ小程序	|
| hideStatusBar `1.1.8`		|			|隐藏状态栏，仅在iOS全屏下有效	|微信小程序、百度小程序、QQ小程序	|
| handelStop `1.1.8`		|			|停止视频					|微信小程序						|

### 注意事项
- APP全屏需要按照文档[基本用法](#jump1)进行配置，
- APP端如果需要全屏倍速及试看，需要使用`.nvue`文件
- `vue2`项目中使用，需要按照文档[vue2使用必看](#jump2)进行配置
- 问题反馈交流群：[122150481](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=2_xYi389jXJRZwPseVEICL_9trE4RrPU&authKey=nsOJ%2BQd%2Fy3Irv4oKaNnxP6XUwTtHUbBVIy3Tw66WX%2FXgVTGWD%2FgBFGVajuQkWPru&noverify=0&group_code=122150481)
