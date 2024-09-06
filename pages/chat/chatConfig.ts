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
	talkV2: 'Web-推荐对话',
	glm: "",
	baidu: "",
	doc: "Web-AI文档对话"
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
	baidu: {},
	doc: {},
	"GLM-4-Air": {
		type: "zhipu"
	},
	glm_4_airx: { type: "zhipu" },
	glm_4_0520: { type: "zhipu" },
	glm_4_flash: { type: "zhipu" },
	zhipu_glm4: { type: "zhipu" },
	baidu_8k_1222: {},
	baidu_speed_128k: {},
	baidu_speed: {}
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
	baidu: undefined,
	doc: undefined,
	"GLM-4-Air": 'ask',
	glm_4_airx: 'ask',
	glm_4_0520: 'ask',
	glm_4_flash: 'ask',
	zhipu_glm4: 'ask',
	baidu_8k_1222: undefined,
	baidu_speed_128k: undefined,
	baidu_speed: undefined
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
				messageType: 'template',
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
	},
	baidu_8k_1222: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'baidu_8k_1222Template',
				messageType: 'text2',
				message: `旗舰级大规模语言模型，覆盖海量中英文语料，具有强大的通用能力，可满足绝大部分对话问答、创作生成、插件应用场景要求；支持自动对接百度搜索插件，保障问答信息时效。`
			}
		]
	},

	baidu_speed_128k: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'baidu_speed_128kTemplate',
				messageType: 'text2',
				message: `我是由百度2024年最新发布的自研高性能大语言模型，通用能力优异，适合作为基座模型进行精调，更好地处理特定场景问题，同时具备极佳的推理性能。`
			}
		]
	},
	doc: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'docTemplate',
				messageType: 'text2',
				message: `文档理解模型,可以理解任意文档类型，支持各种方式对话`
			}
		]
	},
	video: undefined,
	voice: undefined,
	image: undefined,
	web: undefined,
	"GLM-4-Air": {
		messagesTemplate: [
			{
				role: 'system',
				template: 'GLM-4-AirTemplate',
				messageType: 'text2',
				message: `综合性能接近GLM-4，速度更快。`
			}
		]
	},
	glm_4_airx: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'glm_4_airxTemplate',
				messageType: 'text2',
				message: `GLM-4-Air 的高性能版本，效果不变，推理速度达到其2.6倍。`
			}
		]
	},

	glm_4_0520: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'glm_4_0520Template',
				messageType: 'text2',
				message: `当前智谱最先进最智能的模型，指令遵从能力大幅提升18.6%，发布于20240605。`
			}
		]
	},
	glm_4_flash: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'glm_4_flashTemplate',
				messageType: 'text2',
				message: `综合性能强，适用简单任务，速度最快。`
			}
		]
	},
	zhipu_glm4: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'zhipu_glm4Template',
				messageType: 'text2',
				message: `适用于复杂的对话交互和深度内容创作设计的场景.`
			}
		]
	},
	baidu_speed: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'baidu_speedTemplate',
				messageType: 'text2',
				message: `我是由百度自研的轻量级大语言模型，兼顾优异的模型效果与推理性能 .`
			}
		]
	},

	baidu_lite_8k: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'baidu_lite_8kTemplate',
				messageType: 'text2',
				message: `我是由百度2024年最新发布的自研高性能大语言模型，通用能力优异，适合作为基座模型进行精调，更好地处理特定场景问题，同时具备极佳的推理性能。`
			}
		]
	},
	baidu_tiny_8k: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'baidu_tiny_8kTemplate',
				messageType: 'text2',
				message: `我是由百度自研的超高性能大语言模型。`
			}
		]
	},
	baidu_ai_apaas: {
		messagesTemplate: [
			{
				role: 'system',
				template: 'baidu_ai_apaasTemplate',
				messageType: 'text2',
				message: `我是针对企业级大模型应用进行了专门的指令调优，在问答场景、智能体相关场景可以获得同等规模模型下更好的效果。`
			}
		]
	}

};

export const noHistoryArr = ['doc']