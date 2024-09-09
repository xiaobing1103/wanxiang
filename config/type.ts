// types.ts
export interface IconConfig {
	vipCard : string;
	ppt_cover : string;
	aixz_cover : string;
	gzzj_cover : string;
	swdt_cover : string;
	wzyh_cover : string;
	wddh_cover : string;
	xgst_cover : string;
	tpzkt_cover : string;
	aihl_cover : string;
	paintAixz_cover : string;
	tpst_cover : string;
	wzst_cover : string;
	jbzh_cover : string;
	rxkt_cover : string;
	v35ModelIcon : string;
	v40ModelIcon : string;
	vfastModelIcon : string;
	netModelIcon : string;
	Change_Model_Icon : string
	echartsModelIcon : string
	glmModelIcon : string
	baiduModelIcon : string
	baidu40ModelIcon : string
	zhipuModelIcon : string
	zhipu_glm4Icon : string
	/*
		文档理解模型icon
	*/
	docModelIcon : string
	phoneIcon : string
	emailIcon : string
	userIcon : string
	qqIcon : string
	weixinIcon : string
	miyaoIcon : string
	resetPassWord : string
	deleteAccount : string
	emailChangeIcon : string
	gongZhongHao : string
	resetPassWordLock : string
	defineAvatar : string
	weiXinQun : string
	weiXinKeFu : string
	tuYaDrawIcon : string
	tuYaDrawTiaoseIcon : string
	uploadImageIcon : string
	previewImageIcon : string
}
export interface ModelConfig {
	title : string;
	ModelPath : string;
	modelIcon : string;
	ModelApi : string;
	modelDesc : string;
	resetPassWord ?: string
}

export type CommonModelKeys = 'v35' | 'v40' | 'net' | 'echarts' | 'vfast';