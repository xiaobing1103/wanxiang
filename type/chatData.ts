export type ItemMessage = {
	id : string //消息ID
	state : StateType // 状态 ok=全部回复完成 waite=还在继续
	target : TargetType // system=AI回复的消息 user=用户发送的消息
	message : any // 消息

	messageType : MessageType //消息类型
	templateType ?: MessageType //模版类型 仅在messageType为template时生效
}
export type StateType = 'ok' | 'waite' | 'error'
export type MessageType = 'text' | 'text2' | 'image' | 'assistant' | 'template' | undefined

export type TargetType = 'system' | 'user' | 'assistant'
export type ModelType = 'v35' | 'v40' | 'net'
export interface chatConfigProps {
	placeholder ?: string // 输入框提示内容 
	setting ?: boolean // 底部设置回复角度等显示
	template ?: string //模板类型
	messagesTemplate ?: MessagesTemplate[] //消息模板
}
export type MessagesTemplate = {
	role : TargetType //角色类型 
	template ?: string //模板
	MessageType ?: MessageType //模版类型
	message ?: string | any //模版内容 
}