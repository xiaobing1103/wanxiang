
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#F8F8F8","navigationBar":{"backgroundColor":"#F8F8F8","titleText":"边界AI","type":"default","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"边界AIchat","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"4.45","entryPagePath":"pages/index/index","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"tabBar":{"position":"bottom","color":"#95ACBE","selectedColor":"#4955f5","borderStyle":"black","blurEffect":"none","fontSize":"24rpx","iconWidth":"24px","spacing":"3px","height":"40rpx  !important","list":[{"pagePath":"pages/index/index","text":"对话","iconPath":"/static/chat.png","selectedIconPath":"/static/seletedChat.png"},{"pagePath":"pages/draw/index","text":"绘画","iconPath":"/static/draw.png","selectedIconPath":"/static/drawSeleted.png"},{"pagePath":"pages/function/index","text":"功能库","iconPath":"/static/funtion.png","selectedIconPath":"/static/funtionSeleted.png"},{"pagePath":"pages/my/index","text":"我的","iconPath":"/static/my.png","selectedIconPath":"/static/mySeleted.png"}],"backgroundColor":"#fff","selectedIndex":0,"shown":true},"fallbackLocale":"zh-Hans","locales":{},"darkmode":false,"themeConfig":{}};
  const __uniRoutes = [{"path":"pages/index/index","meta":{"isQuit":true,"isEntry":true,"isTabBar":true,"tabBarIndex":0,"enablePullDownRefresh":false,"titleNView":false,"softinputmode":"adjustPan","navigationBar":{"titleText":"对话","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/index","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":3,"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"我的","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/index","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":1,"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"绘画","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/index","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":2,"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"功能库","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/index/subPage/imageModel/index","meta":{"navigationBar":{"titleText":"图文模型","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/index/subPage/voiceModel/index","meta":{"navigationBar":{"titleText":"音频模型","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/index/subPage/videoModel/index","meta":{"navigationBar":{"titleText":"视频模型","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/index/subPage/webModel/index","meta":{"navigationBar":{"titleText":"网页模型","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/login/index","meta":{"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"账户登录","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/loginAccount/index","meta":{"enablePullDownRefresh":false,"titleNView":false,"navigationBar":{"titleText":"用户登录","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/vip/index","meta":{"navigationBar":{"titleText":"会员信息","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/PrivacyPolicy/index","meta":{"navigationBar":{"titleText":"隐私协议","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/AboutWe/index","meta":{"navigationBar":{"titleText":"关于我们","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/ActiveRule/index","meta":{"navigationBar":{"titleText":"活动规则","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/UserAgreement/index","meta":{"navigationBar":{"titleText":"用户协议","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/my/subPage/PersonalCenter/index","meta":{"navigationBar":{"titleText":"个人中心","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/text2image/index","meta":{"navigationBar":{"titleText":"文字转图片","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/image2image/index","meta":{"navigationBar":{"titleText":"图片转图片","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/partialRepaint/index","meta":{"navigationBar":{"titleText":"局部重绘","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/portraitCutout/index","meta":{"navigationBar":{"titleText":"人像抠图","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/aiPhotoShoots/index","meta":{"navigationBar":{"titleText":"AI写真","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/aiFaceSwapping/index","meta":{"navigationBar":{"titleText":"AI换脸","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/image2cartoon/index","meta":{"navigationBar":{"titleText":"图片转卡通","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/coloringLineArt/index","meta":{"navigationBar":{"titleText":"线稿上色","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/PreviewPage/index","meta":{"navigationBar":{"titleText":"预览页面","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/QueueQueryPage/index","meta":{"navigationBar":{"titleText":"任务查询","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/Doodles/index","meta":{"navigationBar":{"titleText":"涂鸦","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/reserveWordIcons/index","meta":{"navigationBar":{"titleText":"图片反推提示词","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/behindQRcode/index","meta":{"navigationBar":{"titleText":"隐藏二维码","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/behindQRcode/articleQRcodoe","meta":{"navigationBar":{"titleText":"艺术二维码","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/draw/subPage/aiRevers3D/index","meta":{"navigationBar":{"titleText":"真人转3D","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/ppt/index","meta":{"navigationBar":{"titleText":"一键生成ppt","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/webview/index","meta":{"navigationBar":{"titleText":"文件预览","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/longText/index","meta":{"navigationBar":{"titleText":"AI长文写作系统","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/longText/write","meta":{"navigationBar":{"titleText":"AI长文写作系统","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AImapping/index","meta":{"navigationBar":{"titleText":"AI思维导图","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AImappingPreview/index","meta":{"navigationBar":{"titleText":"思维导图预览","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/WeChatWebview/index","meta":{"navigationBar":{"titleText":"思维导图预览","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiDailyModel/index","meta":{"navigationBar":{"titleText":"AI工作总结","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiarticleReset/index","meta":{"navigationBar":{"titleText":"AI文章纠正","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AidocumentChat/index","meta":{"navigationBar":{"titleText":"AI文档对话","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/OfficeWrite/index","meta":{"navigationBar":{"titleText":"公文写作","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/ArtistWrite/index","meta":{"navigationBar":{"titleText":"AI论文写作","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/previewTxtPages/index","meta":{"navigationBar":{"titleText":"TXT文件预览","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiVioceCreate/index","meta":{"navigationBar":{"titleText":"AI真人语音合成","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiORCModel/index","meta":{"navigationBar":{"titleText":"OCR-DOC办公文档识别","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/ArtistTest/index","meta":{"navigationBar":{"titleText":"AIGC检测","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/ArticlePlagiarism/index","meta":{"navigationBar":{"titleText":"智能降AIGC","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TestReport/index","meta":{"navigationBar":{"titleText":"查看报告","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TranslatePages/index","meta":{"navigationBar":{"titleText":"AI文档翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TranslatePages/TranslatePages20","meta":{"navigationBar":{"titleText":"AI文档翻译2.0","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/CommonAiTranslatePages/index","meta":{"navigationBar":{"titleText":"AI通用翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/OldArticelTranslate/index","meta":{"navigationBar":{"titleText":"AI文言文翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiVioceTranslate/index","meta":{"navigationBar":{"titleText":"AI录音翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiImageTranslate/index","meta":{"navigationBar":{"titleText":"AI图像翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/ArticelTranslate/index","meta":{"navigationBar":{"titleText":"论文翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/ZhArticelTranslate/index","meta":{"navigationBar":{"titleText":"中文学术翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/EnArticelTranslate/index","meta":{"navigationBar":{"titleText":"英文学术翻译","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiMusicCreate/index","meta":{"navigationBar":{"titleText":"AI音乐","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/MusicSquare/index","meta":{"navigationBar":{"titleText":"AI音乐广场","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AiMusicCreate/MusicVerification","meta":{"navigationBar":{"titleText":"音乐验证","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/ImageCreateMusic/index","meta":{"navigationBar":{"titleText":"AI图片创作音乐","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/VideoCreateMusic/index","meta":{"navigationBar":{"titleText":"AI视频创作音乐","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TextCreateVideo/index","meta":{"navigationBar":{"titleText":"文生视频","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/VideoVip/index","meta":{"navigationBar":{"titleText":"视频会员","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TextCreateVideo/PlayVideo/index","meta":{"navigationBar":{"titleText":"视频页面","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TextCreateVideo/videoHistory/index","meta":{"navigationBar":{"titleText":"历史记录","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TextCreateVideo/AINumersPeople/index","meta":{"navigationBar":{"titleText":"AI数字人","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TextCreateVideo/AIVideoHandlerImage/index","meta":{"navigationBar":{"titleText":"AI视频抠图","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TextCreateVideo/AIExtractMusic/index","meta":{"navigationBar":{"titleText":"AI提取音频","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AIWriteSomething/index","meta":{"navigationBar":{"titleText":"AI智能写作","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/importantTextExport/index","meta":{"navigationBar":{"titleText":"AI关键词提取","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/TheSamePointTest/index","meta":{"navigationBar":{"titleText":"AI相似度检测","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/InspiredWriting/index","meta":{"navigationBar":{"titleText":"AI灵感写作","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/articleWriting/index","meta":{"navigationBar":{"titleText":"AI写作助手","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/createTitle/index","meta":{"navigationBar":{"titleText":"AI标题生成","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AIaiAgent/index","meta":{"navigationBar":{"titleText":"AI智能体","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AIaiAgent/mainPages","meta":{"navigationBar":{"titleText":"智能体对话","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AIApplication/index","meta":{"navigationBar":{"titleText":"AI应用中心","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/function/subPage/AIApplication/SingleApplication/index","meta":{"navigationBar":{"titleText":"AI应用","style":"custom","type":"default"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  