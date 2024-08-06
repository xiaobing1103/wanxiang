import { ModelType, chatConfigProps } from "../../type/chatData";

export const TemplateConfig : Record<ModelType, chatConfigProps> = {
	'v35': {
		placeholder: '有问题尽管问，知无不答~',
		messagesTemplate: [
			{
				role: 'system',
				template: 'v35Template',
				messageType: 'template'
			}

		]
	},
	'v40': {
		messagesTemplate: [
			{
				role: 'system',
				messageType: 'image',
				message: '//file.1foo.com/2023/12/01/02ae98729cafef3cc0ea0fca1c632101.jpg'
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