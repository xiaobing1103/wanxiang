// commonModel.ts
import { ModelType } from '../type/chatData';
import $assets from './assets.config';
import { ModelConfig } from './type';

export const commonModel : Record<ModelType, ModelConfig> = {
	'v35': {
		title: '推荐模型（组合）',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/v35',
		modelIcon: $assets.v35ModelIcon,
		modelDesc: '推荐模型基座训练数据超50亿T，是目前大语言模型中最全面的模型'
	},
	'v40': {
		title: '智慧4.0模式',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/v40',
		modelIcon: $assets.v40ModelIcon,
		modelDesc: '推荐模型=高中阶段，智慧4.0模型=博士阶段...'
	},
	// 'net': {
	// 	title: '联网模式 (bate) ',
	// 	ModelPath: '',
	// 	ModelApi: 'api/v1/chat2/completionNet',
	// 	modelIcon: $assets.netModelIcon
	// },
	// 'echarts': {
	// 	title: '图表模型',
	// 	ModelPath: '',
	// 	ModelApi: 'api/v1/chat2/v35',
	// 	modelIcon: $assets.echartsModelIcon,
	// 	modelDesc: '可以帮你处理表格信息，并且生成表格。支持Eharts代码数据可视化图表库'
	// },
	"vfast": {
		title: '极速模型',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/vfast',
		modelIcon: $assets.vfastModelIcon,
		modelDesc: '本模式以推荐模型为底座，在对话过程中语义和基础常识基本无区别，个别模型微调参数，联想长度和速度是多模型中速度最快的！'
	},
	'talkV2': {
		title: '普通模型',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/v35',
		modelIcon: $assets.v35ModelIcon,
		modelDesc: '本模式以推荐模型为底座，在对话过程中语义和基础常识会更为精准，但token限制比较小，联想长度和速度不及默认推荐模型。'
	},
	'glm': {
		title: '智谱 · 清华ChatGlm',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/zhipu',
		modelIcon: $assets.glmModelIcon,
		modelDesc: '本模型由清华大学人工智能团队开发，训练资料大量为中文资料，但也支持英语，为双语对话模型，对中文逻辑、中文文化背景属于国际领先。'
	},
	'baidu': {
		title: '文心一言',
		ModelPath: '',
		ModelApi: 'api/v1/chat2/baidu',
		modelIcon: $assets.baiduModelIcon,
		modelDesc: '基于飞桨深度学习平台和文心知识增强大模型，持续从海量数据和大规模知识中融合学习具备知识增强、检索增强和对话增强的技术特色。'
		
	}
};

export type AngleType = {
	key : number
	name : string
	desc : string
}
export const angleData : AngleType[] = [
	{
		key: 1,
		name: '默认角度',
		desc: '官方设置的默认角度，适用于日常生活工作的询问与回答，权重均衡'
	},
	{
		key: 2,
		name: '专业角度',
		desc: '基于你的专业知识和经验回答。'
	},
	{
		key: 3,
		name: '学术角度',
		desc: '依据学术研究和理论给出答案。'
	},
	{
		key: 4,
		name: '经济角度',
		desc: '从经济学的角度解释问题。'
	},
	{
		key: 5,
		name: '科技角度',
		desc: '根据科技发展与应用给出回答。'
	},
	{
		key: 6,
		name: '历史角度',
		desc: '基于历史事件和背景回答问题。'
	},
	{
		key: 7,
		name: '文化角度',
		desc: '考虑不同文化背景对问题的影响。'
	},
	{
		key: 8,
		name: '社会角度',
		desc: '从社会学的角度解读问题。'
	},
	{
		key: 9,
		name: '心理角度',
		desc: '依据心理学原理回答问题。'
	},
	{
		key: 10,
		name: '政治角度',
		desc: '从政治角度解决问题。'
	},
	{
		key: 11,
		name: '环保角度',
		desc: '考虑环境和可持续发展问题回答。'
	},
	{
		key: 12,
		name: '健康角度',
		desc: '从健康、医学角度给予答案。'
	},
	{
		key: 13,
		name: '伦理角度',
		desc: '基于伦理观念和道德原则回答问题。'
	},
	{
		key: 14,
		name: '哲学角度',
		desc: '根据哲学原理和思考给出回答。'
	},
	{
		key: 15,
		name: '教育角度',
		desc: '从教育学角度解释问题。'
	},
	{
		key: 16,
		name: '法律角度',
		desc: '依据法律法规和法律原则回答问题。'
	},
	{
		key: 17,
		name: '灵活角度',
		desc: '用创造性和灵活的思维解决问题。'
	},
	{
		key: 18,
		name: '社交角度',
		desc: '从社交交往和人际关系角度回答问题。'
	},
	{
		key: 19,
		name: '娱乐角度',
		desc: '在回答中加入幽默、娱乐元素。'
	},
	{
		key: 20,
		name: '人文角度',
		desc: '从人文学科和人文艺术角度解释问题。'
	},
	{
		key: 21,
		name: '生活角度',
		desc: '基于日常生活经验和实际情况给出答案。'
	}
]

export const angelItem : selectModalItemType = [
	{
		id: 1,
		name: '精准的'
	},
	{
		id: 2,
		name: '完美的'
	},
	{
		id: 3,
		name: '独特的'
	},
	{
		id: 4,
		name: '精确的'
	},
	{
		id: 5,
		name: '深入的'
	},
	{
		id: 6,
		name: '全面的'
	},
	{
		id: 7,
		name: '系统的'
	},
	{
		id: 8,
		name: '稳定的'
	},
	{
		id: 9,
		name: '高效的'
	},
	{
		id: 10,
		name: '创新的'
	},
	{
		id: 11,
		name: '可靠的'
	},
	{
		id: 12,
		name: '具体的'
	},
	{
		id: 13,
		name: '有挑战性的'
	},
	{
		id: 14,
		name: '灵活的'
	},
	{
		id: 15,
		name: '平衡的'
	},
	{
		id: 16,
		name: '具有互动性的'
	},
	{
		id: 17,
		name: '高度可定制的'
	},
	{
		id: 18,
		name: '强大的'
	},
	{
		id: 19,
		name: '富有想象力的'
	},
	{
		id: 20,
		name: '有趣的'
	},
	{
		id: 21,
		name: '引人入胜的'
	},
	{
		id: 22,
		name: '具有激励的'
	},
	{
		id: 23,
		name: '有道德的'
	},
	{
		id: 24,
		name: '持续的'
	},
	{
		id: 25,
		name: '高质量的'
	},
	{
		id: 26,
		name: '高标准的'
	},
	{
		id: 27,
		name: '有感染力的'
	},
	{
		id: 28,
		name: '有成就感的'
	},
	{
		id: 29,
		name: '现代的'
	},
	{
		id: 30,
		name: '前沿的'
	},
	{
		id: 31,
		name: '可持续的'
	},
	{
		id: 32,
		name: '多样化的'
	},
	{
		id: 33,
		name: '激动人心的'
	},
	{
		id: 34,
		name: '具备竞争力的'
	},
	{
		id: 35,
		name: '珍贵的'
	},
	{
		id: 36,
		name: '具备独特性的'
	},
	{
		id: 37,
		name: '激烈的'
	},
	{
		id: 38,
		name: '刺激的'
	},
	{
		id: 39,
		name: '坚实的'
	},
	{
		id: 40,
		name: '理性的'
	},
	{
		id: 41,
		name: '人性化的'
	},
	{
		id: 42,
		name: '实用的'
	},
	{
		id: 43,
		name: '富有表现力的'
	},
	{
		id: 44,
		name: '具备影响力的'
	},
	{
		id: 45,
		name: '丰富的'
	},
	{
		id: 46,
		name: '有希望的'
	},
	{
		id: 47,
		name: '具有回报的'
	},
	{
		id: 48,
		name: '有责任感的'
	},
	{
		id: 49,
		name: '具有生动性的'
	}
]
export type selectModalItemType = {
	id : number
	name : string
}[]
export const languageList : selectModalItemType = [
	{ id: 1, name: '中文' },
	{ id: 2, name: '英文' },
	{ id: 3, name: '法文' },
	{ id: 4, name: '德文' },
	{ id: 5, name: '西班牙语' },
	{ id: 6, name: '葡萄牙语' },
	{ id: 7, name: '日语' }
]

export const QuestionsTag = [
	{ id: 110, name: '有哪些有趣的科学实验' },
	{ id: 111, name: '春天适合去哪里旅行' },
	{ id: 112, name: '用简单的术语解释人工智能' },
	{ id: 113, name: '明朝有几位皇帝' }
]

export const creationTag = [
	{ id: 114, name: '用python写一个猜数字的游戏并运行它' },
	{ id: 115, name: '写一首赞美祖国的诗' },
	{ id: 116, name: '写一篇科幻小说' }
]

// 定义次数限制的变量
export const checkArr = {
	zhipu_glm4: 'chat_v40',
	qwen_max: 'chat_v40',
	baidu_speed_128k: 'chat_v40',
	// glm_4_airx: 'chat_v40',
	glm_4_0520: 'chat_v40',
	v40: 'chat_v40',
	baiduV40: 'chat_baidu_v40',
	official: 'chat_official',
	image: 'chat_image',
	doc: 'chat_doc'
}