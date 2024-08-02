import { ModelType, chatConfigProps } from "../../type/chatData";

export const TemplateConfig : Record<ModelType, chatConfigProps> = {
	'v35': {
		placeholder: '有问题尽管问，知无不答~',
		messagesTemplate: [
			{
				role: 'system',
				template: 'v35Template',
				messageType: 'template'
			},
			{
				role: 'system',
				messageType: 'image',
				message: '//file.1foo.com/2023/12/01/02ae98729cafef3cc0ea0fca1c632101.jpg'
			},
			{
				role: 'user',
				messageType: 'text',
				message: '你好',
			},
			{
				role: 'system',
				messageType: 'text',
				message: '我是人工智能助手,请问有什么帮助的吗？',
			},
		]
	},
	'v40': {
		messagesTemplate: [
			{
				role: 'system',
				template: 'V40Template'
			}
		]
	},
	'net': {
		messagesTemplate: [
			{
				role: 'system',
				template: 'netTemplate'
			}
		]
	},
};