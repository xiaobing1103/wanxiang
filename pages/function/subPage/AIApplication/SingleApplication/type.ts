export interface DetailDTO {
	category_id : number
	content : string
	context_num : number
	create_time : number
	form : DetailFormDTO[]
	frequency_penalty : number
	id : number
	image : string
	is_collect : number
	max_tokens : number
	name : string
	sort : number
	status : number
	tips : string
	virtual_use_num : number
}

export interface DetailFormDTO {
	id : string
	key : string
	name : string
	props : DetailFormPropsDTO
	title : string
}
export interface DetailFormPropsDTO {
	autosize : boolean
	defaultValue : string
	isRequired : boolean
	maxlength : number
	placeholder : string
	rows : number
	title : string
}