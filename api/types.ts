//气泡类型
export interface ToolTipItem{
	after_text:string;
	before_text:string;
	create_time:string;
	description:string;
	doc_id:number |null;
	frequency_penalty:number;
	help:string;
	icon:string;
	id:number;
	isPrivate:number;
	mode:number;
	model_id:string;
	presence_penalty:number;
	prompt:string;
	r:number;
	status:number;
	temperature:number;
	title:string;
	uid:number;
	zan:number
}