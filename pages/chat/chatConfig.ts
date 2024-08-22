import { ModelType, chatConfigProps } from "../../type/chatData";

// 前面模型对应的type值
export const modelTypes : Record<ModelType, string> = {
	v35: 'Web-推荐对话',
	video: 'Web-AI视频对话',
	voice: 'Web-音频理解模型',
	image: 'Web-图片理解模型',
	echarts: 'Web-图表模型',
	web: 'Web-AI文档对话',
	v40: undefined,
	net: undefined,
	vfast: undefined,
	talkV2: 'Web-推荐对话'
}

// 当前模型需要额外携带的参数
export const exParmas : Record<ModelType, string | any> = {
	v35: {},
	video: {},
	voice: {},
	image: {},
	echarts: {},
	web: {},
	v40: {},
	net: {},
	vfast: {},
	talkV2: {
		// conversationId: ''
	},
	glm: {},
	baidu: {}
}
// 当前模型需要转换params的键值
export const currentModelReversParmas : Record<ModelType, string | any> = {
	v35: undefined,
	video: undefined,
	voice: undefined,
	image: undefined,
	echarts: undefined,
	web: undefined,
	v40: undefined,
	net: undefined,
	vfast: undefined,
	talkV2: undefined,
	'glm': 'ask',
	baidu: undefined
}

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
	'echarts': {
		messagesTemplate: [
			{
				role: 'system',
				template: 'echartsTemplate',
				messageType: 'text2',
				message: `你好，我是AI-图表模型，试试对话处理表格我可以帮你处理表格信息，并且生成表格。支持Eharts代码数据可视化图表库`
			}
		]
	},
	'vfast': {
		messagesTemplate: [
			{
				role: 'system',
				template: 'vfastTemplate',
				messageType: 'text2',
				message: `本模式以推荐模型为底座，在对话过程中语义和基础常识基本无区别，个别模型微调参数，联想长度和速度是多模型中速度最快的！`
			}
		]
	},


	"talkV2": {
		messagesTemplate: [
			{
				role: 'system',
				template: 'talkV2Template',
				messageType: 'text2',
				message: `本模式以推荐模型为底座，在对话过程中语义和基础常识会更为精准，但token限制比较小，联想长度和速度不及默认推荐模型。`
			}
		]
	},

	'glm': {
		messagesTemplate: [
			{
				role: 'system',
				template: 'glmTemplate',
				messageType: 'text2',
				message: `本模型由清华大学人工智能团队开发，训练资料大量为中文资料，但也支持英语，为双语对话模型，对中文逻辑、中文文化背景属于国际领先。`
			}
		]
	},
	// video: undefined,
	// voice: undefined,
	// image: undefined,
	// web: undefined,
	baidu: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'baiduTemplate',
				messageType: 'text2',
				message: `基于飞桨深度学习平台和文心知识增强大模型，持续从海量数据和大规模知识中融合学习具备知识增强、检索增强和对话增强的技术特色。`
			}
		]
	}
};