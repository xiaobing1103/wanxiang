export const vipTypes = [{
	title: '热门推荐',

}, {
	title: '办公会员'
}]

export interface vipDatasType {
	active : number
	aid : number
	create_time : number
	description : string
	discount_price : number
	fakaLink : string
	id : number
	money : number
	name : string
	notifty_url : string
	price : number
	showInApp : number
	solds : number
	sort : number
	tag : string
	target_id : number
	type : number
}
export interface payModeType {
	channels : ["wechat_scan" | "alipay"]
	id : "jsapi" | "h5_yt"
	name : "微信收银台" | "支付宝H5 - 域拓"
}

export const defaultTh = [
	{ name: '会员权益对比' },
	{ name: '超级永久会员' },
	{ name: '会员权益对比' },
]
export const quanYiArr = [
	{
		name: '会员权益对比',
		isHeader: true,
	},
	{
		name: 'AI基础对话',
		key: 'chatCount',
	},
	{
		name: 'AI绘画次数',
		key: 'sdCount'
	},
	{
		name: '文档对话',
		key: 'docCount'
	},
	{
		name: '文档字数上限',
		key: 'docMaxLength'
	},
	{
		name: `语音\视频\网页总结`,
		key: 'audiocce'
	},
	{
		name: '论文模式',
		key: 'thesisCount'
	},
	{
		name: '文章批改、纠正',
		key: 'articleCorrectCount'
	},
	{
		name: '图片理解模型',
		key: "descriptionImageCount"
	},
	{
		name: 'AI思维导图',
		key: 'xmindCount'
	},
	{
		name: 'AIPPT相关',
		key: 'pptCount'
	},
	{
		name: '艺术/隐藏二维码',
		key: 'qrcodeCount'

	},
	{
		name: 'Chat4.0对话',
		key: 'chat4Count'
	},

	{
		name: '公文写作',
		key: "penandinkCound"
	},
	{
		name: 'AIPDF翻译',
		key: 'pdfCount'
	},
	{
		name: 'Al文档翻译',
		key: 'doctranslateCount'
	},
	{
		name: 'AI真人语音合成',
		key: 'ttsExportCount'
	},
	{
		name: 'AI在线抠图',
		key: 'mattingCount'
	},
	{
		name: 'AI图片增强放大',
		key: 'amplifyCount'
	},
	{
		name: 'AI换脸',
		key: 'facerep'
	},
	{
		name: 'AI联网搜索',
		key: 'netsearch'
	},
	{
		name: '以图生图',
		key: 'drawing'
	},
	{
		name: '动漫模式',
		key: 'cartoon'
	},
	{
		name: '局部重绘',
		key: 'redraw'
	},
	{
		name: 'AI扩图',
		key: 'expand'
	},
	{
		name: 'PDF工具',
		key: 'pdftools'
	},
	{
		name: '训练模型',
		key: 'xunlianModal'
	},
	{
		name: 'AI智能体',
		key: 'aiagent'
	},
	{
		name: '语音对话',
		key: 'voicechat'
	},
	{
		name: '多模型对抗',
		key: 'confront'
	},
	{
		name: '图片理解2.0',
		key: 'imgcomprehend'
	},
	{
		name: '私有化部署',
		key: 'deploy'
	},
]

export const TableTh = {
	'default': {
		thName: '会员权益对比'
	},
	"200": {
		thName: '超级永久会员'
	},
	"197": {
		thName: '体验月卡会员'
	},
	"198": {
		thName: '年费会员VIP'
	},
	"199": {
		thName: '永久会员VIP'
	},
	"201": {
		thName: '两年会员VIP'
	},
	"202": {
		thName: '超级三年会员'
	},
	"203": {
		thName: '办公会员VIP'
	},
	"204": {
		thName: '高级办公会员'
	},
}


export const vipShowModals = {
	'200': {
		background:
			'linear-gradient(90deg, rgba(255, 154, 36, 1) 0%, rgba(240, 26, 154, 1) 100%), rgba(204, 204, 204, 1)',
		color: 'white',
		content: '限时早鸟特惠，80%人已抢',
		name: '超级永久会员'
	},
	'197': {
		background: 'linear-gradient(90deg, rgba(105, 122, 255, 1) 0%, rgba(50, 91, 255, 1) 100%)',
		color: 'white',
		content: '限时早鸟特惠，80%人已抢',
		name: '体验月卡会员'
	},
	'198': {
		background: 'linear-gradient(90deg, rgba(105, 122, 255, 1) 0%, rgba(50, 91, 255, 1) 100%)',
		color: 'white',
		content: '限时早鸟特惠，80%人已抢',
		name: '年费会员VIP'
	},
	'199': {
		background: 'linear-gradient(90deg, rgba(105, 122, 255, 1) 0%, rgba(50, 91, 255, 1) 100%)',
		color: 'white',
		content: '限时早鸟特惠，80%人已抢',
		name: '永久会员VIP'
	},
	'201': {
		background: 'linear-gradient(90deg, rgba(105, 122, 255, 1) 0%, rgba(50, 91, 255, 1) 100%)',
		color: 'white',
		content: '限时早鸟特惠，80%人已抢',
		name: '两年会员VIP'
	},
	"202": {
		background: 'linear-gradient(90deg, rgba(105, 122, 255, 1) 0%, rgba(50, 91, 255, 1) 100%)',
		color: 'white',
		content: '限时早鸟特惠，80%人已抢',
		name: '超级三年会员'
	},
	"203": {
		background: 'linear-gradient(90deg,#ff715f,#ff3f43)',
		color: 'white',
		content: '高效办公',
		name: '办公会员VIP'
	},
	"204": {
		background: 'linear-gradient(90deg,#ff715f,#ff3f43)',
		color: 'white',
		content: '开放全部功能 · 办公无忧',
		name: '高级办公会员'
	},

}