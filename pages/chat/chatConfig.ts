import { ModelType, chatConfigProps } from "../../type/chatData";

export const TemplateConfig : Record<ModelType, chatConfigProps> = {
	'v35': {
		placeholder: '有问题尽管问，知无不答~',
		messagesTemplate: [
			{
				role: 'system',
				template: 'v35Template',
				messageType: 'template',
			}
		]
	},
	'v40': {
		messagesTemplate: [
			{
				role: 'system',
				template: 'v40Template',
				messageType: 'image',
				message: '//file.1foo.com/2023/12/01/02ae98729cafef3cc0ea0fca1c632101.jpg'
			}
		]
	},
	'net': {
		messagesTemplate: [
			{
				role: 'system',
				template: 'netTemplate',
				messageType: 'text2',
				message: '联网模型已初步对近期的信息已经学习或理解完成，但仍可能某些最新话题无法正常学习，可尝试重新提问或者换个话题。'
			}
		]
	},
	echarts: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'echartsTemplate',
				messageType: 'text2',
				message: `你好，我是AI-图表模型，试试对话处理表格
我可以帮你处理表格信息，并且生成表格。支持Eharts代码数据可视化图表库`
			}
		]
	}
};