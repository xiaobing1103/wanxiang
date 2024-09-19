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