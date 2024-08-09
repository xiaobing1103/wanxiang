export interface LoginReq {
	access_token : string;
	appid : number;
	avatar : string;
	cash_money : number;
	create_time : number;
	distributor : number;
	email : null;
	enable : number;
	higher : null;
	id : number;
	inv_pay_num : number;
	invitation_money : number;
	invitation_num : number;
	is_team_member : number;
	last_login_ip : string;
	last_login_time : number;
	money : number;
	myTeamer : number;
	nick : string;
	phone : string;
	qq_nick : null;
	qqid : null;
	teamer : number;
	token : string;
	user : string;
	wx_nick : null;
	wxid : null;
}

export interface UserInfoDTO {
	access_token : string;
	appid : number;
	avatar : string;
	cash_money : number;
	create_time : number;
	distributor : number;
	email : null;
	enable : number;
	higher : null;
	id : number;
	inv_pay_num : number;
	invitation_money : number;
	invitation_num : number;
	is_team_member : number;
	last_login_ip : string;
	last_login_time : number;
	money : number;
	myTeamer : number;
	nick : string;
	phone : string;
	qq_nick : null;
	qqid : null;
	teamer : number;
	token : string;
	user : string;
	vip : number;
	vipTime : string;
	vipType : string;
	vip_end_time : number;
	wx_nick : null;
	wxid : null;
}
//气泡类型
export interface ToolTipItem {
	after_text : string;
	before_text : string;
	create_time : string;
	description : string;
	doc_id : number | null;
	frequency_penalty : number;
	help : string;
	icon : string;
	id : number;
	isPrivate : number;
	mode : number;
	model_id : string;
	presence_penalty : number;
	prompt : string;
	r : number;
	status : number;
	temperature : number;
	title : string;
	uid : number;
	zan : number
}