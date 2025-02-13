import {
	ModelType,
	chatConfigProps
} from "../../type/chatData";
export const modelTypes : Record<ModelType, string> = {
	v35: 'Web-推荐对话',
	video: 'Web-AI视频对话',
	voice: 'Web-音频理解模型',
	image: 'Web-图片理解模型',
	web: 'Web-AI文档对话',
	v40: undefined,
	net: undefined,
	vfast: undefined,
	tongyi: undefined,
	talkV2: 'Web-推荐对话',
	glm: "",
	baidu: "",
	doc: "Web-AI文档对话",
	baiduV40: "",
	"GLM-4-Air": "",
	glm_4_airx: "",
	glm_4_0520: "",
	glm_4_flash: "",
	zhipu_glm4: "",
	baidu_8k_1222: "",
	baidu_speed_128k: "",
	baidu_speed: "",
	baidu_lite_8k: "",
	baidu_tiny_8k: "",
	baidu_ai_apaas: "",
	qwen_max: "",
	qwen_turbo: "",
	qwen_farui: "",
	baidu_code_llama: "",
	baidu_llama: "",
	moonshot_v1_128k: "",
	moonshot_v1_32k: "",
	qwen_plus: "",
	moonshot_v1_8k: "",
	DeepSeek_V3: '',
	deepseek_r1_qwen_32b: '',
	deepseek_r1_qwen_70b: '',
	DeepSeek_Coder: '',
	DeepSeek_Coder_V2: '',
	'glm-zero-preview': ''
};
export const exParmas : Record<ModelType, string | any> = {
	v35: {},
	video: {},
	voice: {},
	image: {},
	echarts: {
		type: "zhipu"
	},
	web: {},
	v40: {},
	net: {},
	vfast: {},
	talkV2: {},
	tongyi: {},
	glm: {},
	baidu: {},
	doc: {},
	"GLM-4-Air": {
		type: "zhipu"
	},
	glm_4_airx: {
		type: "zhipu"
	},
	glm_4_0520: {
		type: "zhipu"
	},
	glm_4_flash: {
		type: "zhipu"
	},
	zhipu_glm4: {
		type: "zhipu"
	},
	baidu_8k_1222: {},
	baidu_speed_128k: {},
	baidu_speed: {},
	baiduV40: {},
	baidu_lite_8k: {},
	baidu_tiny_8k: {},
	baidu_ai_apaas: {},
	qwen_max: {},
	qwen_turbo: {},
	qwen_farui: {},
	baidu_code_llama: {},
	baidu_llama: {},
	DeepSeek_V3: {},
	'glm-zero-preview': {},
	DeepSeek_R1: {},
	deepseek_r1_qwen_32b: {},
	DeepSeek_Coder_V2: {},
	moonshot_v1_128k: {},
	moonshot_v1_32k: {},

	qwen_plus: {},
	moonshot_v1_8k: {},
	chat_4o_mini: {
		type: "zhipu"
	},
	chat_4o: {
		type: "zhipu"
	},
	chat_40: {
		type: "zhipu"
	},
	codegeex_4: {
		type: "zhipu"
	}
};
export const currentModelReversParmas : Record<ModelType, string | any> = {
	v35: undefined,
	video: undefined,
	voice: undefined,
	image: undefined,
	echarts: 'ask',
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
	baidu_speed: undefined,
	baiduV40: undefined,
	baidu_lite_8k: undefined,
	baidu_tiny_8k: undefined,
	baidu_ai_apaas: undefined,
	tongyi: undefined,
	qwen_max: undefined,
	qwen_turbo: undefined,
	qwen_farui: undefined,
	baidu_code_llama: undefined,
	baidu_llama: undefined,
	DeepSeek_V3: 'messages',
	DeepSeek_R1: 'messages',
	deepseek_r1_qwen_70b: 'messages',
	deepseek_r1_qwen_32b: 'messages',
	DeepSeek_Coder_V2: 'messages',
	'glm-zero-preview': 'messages',
	DeepSeek_Coder: 'messages',
	moonshot_v1_128k: undefined,
	moonshot_v1_32k: undefined,
	qwen_plus: undefined,
	moonshot_v1_8k: undefined,
	chat_4o_mini: 'ask',
	chat_4o: 'ask',
	chat_40: 'ask',
	codegeex_4: 'ask'
};
export const TemplateConfig : Record<ModelType, chatConfigProps> = {
	'v35': {
		placeholder: '有问题尽管问，知无不答~',
		messagesTemplate: [{
			role: 'system',
			template: 'v35Template',
			messageType: 'template',
		}]
	},
	'v40': {
		messagesTemplate: [{
			role: 'system',
			template: 'v40Template',
			messageType: 'image',
			message: '//file.1foo.com/2023/12/01/02ae98729cafef3cc0ea0fca1c632101.jpg'
		}]
	},
	'echarts': {
		messagesTemplate: [{
			role: 'system',
			template: 'echartsTemplate',
			messageType: 'template',
		}]
	},
	'vfast': {
		messagesTemplate: [{
			role: 'system',
			template: 'vfastTemplate',
			messageType: 'text2',
			message: `本模式以推荐模型为底座，在对话过程中语义和基础常识基本无区别，个别模型微调参数，联想长度和速度是多模型中速度最快的！`
		}]
	},
	"talkV2": {
		messagesTemplate: [{
			role: 'system',
			template: 'talkV2Template',
			messageType: 'text2',
			message: `本模式以推荐模型为底座，在对话过程中语义和基础常识会更为精准，但token限制比较小，联想长度和速度不及默认推荐模型。`
		}]
	},
	'glm': {
		messagesTemplate: [{
			role: 'system',
			template: 'glmTemplate',
			messageType: 'text2',
			message: `本模型由清华大学人工智能团队开发，训练资料大量为中文资料，但也支持英语，为双语对话模型，对中文逻辑、中文文化背景属于国际领先。`
		}]
	},
	baidu: {
		messagesTemplate: [{
			role: 'system',
			template: 'baiduTemplate',
			messageType: 'text2',
			message: `基于飞桨深度学习平台和文心知识增强大模型，持续从海量数据和大规模知识中融合学习具备知识增强、检索增强和对话增强的技术特色。`
		}]
	},
	baidu_8k_1222: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_8k_1222Template',
			messageType: 'text2',
			message: `旗舰级大规模语言模型，覆盖海量中英文语料，具有强大的通用能力，可满足绝大部分对话问答、创作生成、插件应用场景要求；支持自动对接百度搜索插件，保障问答信息时效。`
		}]
	},
	baidu_speed_128k: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_speed_128kTemplate',
			messageType: 'text2',
			message: `我是由百度2024年最新发布的自研高性能大语言模型，通用能力优异，适合作为基座模型进行精调，更好地处理特定场景问题，同时具备极佳的推理性能。`
		}]
	},
	doc: {
		messagesTemplate: [{
			role: 'system',
			template: 'docTemplate',
			messageType: 'text2',
			message: `文档理解模型,可以理解任意文档类型，支持各种方式对话`
		}]
	},
	net: {
		messagesTemplate: [{
			role: 'system',
			template: 'netTemplate',
			messageType: 'text2',
			message: `我是您的AI助手，我已连接互联网，知晓近日的多数数据，你可以尝试问我,近期的新闻。`
		}]
	},
	image: {
		messagesTemplate: [{
			role: 'system',
			template: 'imageTemplate',
			messageType: 'text2',
			message: `图片理解模型正在加载中...`
		}]
	},
	'tongyi': {
		messagesTemplate: [{
			role: 'system',
			template: 'tongyiTemplate',
			messageType: 'text2',
			message: `基于通义千问强大模型，持续从海量数据和大规模知识中融合学习具备知识增强、检索增强和对话增强的技术特色。`
		}]
	},
	video: {
		messagesTemplate: [{
			role: 'system',
			template: 'videoTemplate',
			messageType: 'text2',
			message: `视频理解模型正在加载中...`
		}]
	},
	voice: {
		messagesTemplate: [{
			role: 'system',
			template: 'tongyiTemplate',
			messageType: 'text2',
			message: `音频理解模型正在加载中...`
		}]
	},
	web: {
		messagesTemplate: [{
			role: 'system',
			template: 'webTemplate',
			messageType: 'text2',
			message: `网页理解模型正在加载中...`
		}]
	},
	"GLM-4-Air": {
		messagesTemplate: [{
			role: 'system',
			template: 'GLM-4-AirTemplate',
			messageType: 'text2',
			message: `综合性能接近GLM-4，速度更快。`
		}]
	},
	glm_4_airx: {
		messagesTemplate: [{
			role: 'system',
			template: 'glm_4_airxTemplate',
			messageType: 'text2',
			message: `GLM-4-Air的高性能版本，效果不变，推理速度达到其2.6倍。`
		}]
	},
	glm_4_0520: {
		messagesTemplate: [{
			role: 'system',
			template: 'glm_4_0520Template',
			messageType: 'text2',
			message: `当前智谱最先进最智能的模型，指令遵从能力大幅提升18.6%，发布于20240605。`
		}]
	},
	glm_4_flash: {
		messagesTemplate: [{
			role: 'system',
			template: 'glm_4_flashTemplate',
			messageType: 'text2',
			message: `综合性能强，适用简单任务，速度最快。`
		}]
	},
	zhipu_glm4: {
		messagesTemplate: [{
			role: 'system',
			template: 'zhipu_glm4Template',
			messageType: 'text2',
			message: `适用于复杂的对话交互和深度内容创作设计的场景.`
		}]
	},
	baidu_speed: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_speedTemplate',
			messageType: 'text2',
			message: `我是由百度自研的轻量级大语言模型，兼顾优异的模型效果与推理性能.`
		}]
	},
	baidu_lite_8k: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_lite_8kTemplate',
			messageType: 'text2',
			message: `我是由百度2024年最新发布的自研高性能大语言模型，通用能力优异，适合作为基座模型进行精调，更好地处理特定场景问题，同时具备极佳的推理性能。`
		}]
	},
	baidu_tiny_8k: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_tiny_8kTemplate',
			messageType: 'text2',
			message: `我是由百度自研的超高性能大语言模型。`
		}]
	},
	baidu_ai_apaas: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_ai_apaasTemplate',
			messageType: 'text2',
			message: `我是针对企业级大模型应用进行了专门的指令调优，在问答场景、智能体相关场景可以获得同等规模模型下更好的效果。`
		}]
	},
	baiduV40: {
		messagesTemplate: [{
			role: 'system',
			template: 'baiduV40Template',
			messageType: 'text2',
			message: `我是基于深度学习技术训练得到的文心一言，媲美ChatGPT4.0，我在中文学习上更胜一筹，符合国人使用，我的性能可以通过一些指标来评估，比如语言模型的困惑度（Perplexity）、准确率（Accuracy）、F1指数（F1 Score）等，这些指数可以反映我在处理自然语言任务时的表现和水平。`
		}]
	},
	qwen_max: {
		messagesTemplate: [{
			role: 'system',
			template: 'qwen_maxTemplate',
			messageType: 'text2',
			message: `我是通义千问2.5系列千亿级别超大规模语言模型，支持中文、英文等不同语言输入。`
		}]
	},
	qwen_turbo: {
		messagesTemplate: [{
			role: 'system',
			template: 'qwen_turboTemplate',
			messageType: 'text2',
			message: `我是通义千问超大规模语言模型，支持中文英文等不同语言输入。`
		}]
	},
	qwen_farui: {
		messagesTemplate: [{
			role: 'system',
			template: 'qwen_faruiTemplate',
			messageType: 'text2',
			message: `我是以通义千问为基座经法律行业数据和知识专门训练的法律行业大模型产品，综合运用了模型精调、强化学习、RAG检索增强、法律Agent技术，具有回答法律问题、推理法律适用、推荐裁判类案、辅助案情分析、生成法律文书、检索法律知识、审查合同条款等功能。`
		}]
	},
	qwen_plus: {
		messagesTemplate: [{
			role: 'system',
			template: 'qwen_plusTemplate',
			messageType: 'text2',
			message: `我是通义千问超大规模语言模型的增强版，支持中文英文等不同语言输入。`
		}]
	},
	moonshot_v1_8k: {
		messagesTemplate: [{
			role: 'system',
			template: 'moonshot_v1_8kTemplate',
			messageType: 'text2',
			message: `我是跟KimiAI同款的模型，一款千亿参数的语言模型，具备优秀的语义理解、指令遵循和文本生成能力。支持8K上下文窗口，适合长文本的理解和内容生成场景。随着性能的迭代，模型会持续更新。`
		}]
	},

	moonshot_v1_32k: {
		messagesTemplate: [{
			role: 'system',
			template: 'moonshot_v1_32kTemplate',
			messageType: 'text2',
			message: `我是跟KimiAI同款的模型，一款千亿参数的语言模型，具备优秀的语义理解、指令遵循和文本生成能力。支持32K上下文窗口，适合长文本的理解和内容生成场景。随着性能的迭代，模型会持续更新。`
		}]
	},
	moonshot_v1_128k: {
		messagesTemplate: [{
			role: 'system',
			template: 'moonshot_v1_128kTemplate',
			messageType: 'text2',
			message: `我是跟KimiAI同款的模型，一款千亿参数的语言模型，具备优秀的语义理解、指令遵循和文本生成能力。支持128K长上下文窗口，适合超长文本的理解和内容生成场景。随着性能的迭代，模型会持续更新。`
		}]
	},
	doubao_v1_4k: {
		messagesTemplate: [{
			role: 'system',
			template: 'doubao_v1_4k',
			messageType: 'text2',
			message: `豆包是你的 AI 聊天智能对话问答助手，写作文案翻译情感陪伴编程全能工具。 豆包为你答疑解惑，提供灵感，辅助创作，也可以和你畅聊任何你感兴趣的话题。`
		}]
	},
	doubao_v1_32k: {
		messagesTemplate: [{
			role: 'system',
			template: 'doubao_v1_32k',
			messageType: 'text2',
			message: `豆包是你的 AI 聊天智能对话问答助手，写作文案翻译情感陪伴编程全能工具。 豆包为你答疑解惑，提供灵感，辅助创作，也可以和你畅聊任何你感兴趣的话题。`
		}]
	},
	doubao_v1_128k: {
		messagesTemplate: [{
			role: 'system',
			template: 'doubao_v1_128k',
			messageType: 'text2',
			message: `豆包是你的 AI 聊天智能对话问答助手，写作文案翻译情感陪伴编程全能工具。 豆包为你答疑解惑，提供灵感，辅助创作，也可以和你畅聊任何你感兴趣的话题。`
		}]
	},
	baidu_llama: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_llamaTemplate',
			messageType: 'text2',
			message: `文心一言·Llama英文是Llama的新一代版本，是其系列大模型发展的自然延续。Llama可以根据提示生成文本和代码的模型，在英文对话中优势于其他模型。`
		}]
	},
	DeepSeek_V3: {
		messagesTemplate: [{
			role: 'system',
			template: 'DeepSeek_V3Template',
			messageType: 'text2',
			message: `DeepSeek-V3适用于各种自然语言处理任务，包括但不限于文本生成、语言理解、机器翻译等。其高性能和高效训练的特点使其在科研、开发和商业应用中具有广泛的应用前景。`
		}]
	},
	DeepSeek_R1: {
		messagesTemplate: [{
			role: 'system',
			template: 'DeepSeek_R1Template',
			messageType: 'text2',
			message: `DeepSeek-R1采用强化学习进行后训练，旨在提升推理能力，尤其擅长数学、代码和自然语言推理等复杂任务。`
		}]
	},
	deepseek_r1_qwen_70b: {
		messagesTemplate: [{
			role: 'system',
			template: 'deepseek_r1_qwen_70bTemplate',
			messageType: 'text2',
			message: `DeepSeek-R1采用强化学习进行后训练，旨在提升推理能力，尤其擅长数学、代码和自然语言推理等复杂任务。`
		}]
	},
	deepseek_r1_qwen_32b: {
		messagesTemplate: [{
			role: 'system',
			template: 'deepseek_r1_qwen_32bTemplate',
			messageType: 'text2',
			message: `DeepSeek-R1采用强化学习进行后训练，旨在提升推理能力，尤其擅长数学、代码和自然语言推理等复杂任务。`
		}]
	},
	DeepSeek_Coder: {
		messagesTemplate: [{
			role: 'system',
			template: 'DeepSeek_CoderTemplate',
			messageType: 'text2',
			message: `DeepSeek Coder适用于各种场景，包括初创企业的快速原型设计、大型公司的复杂代码重构以及个人开发者的日常编码需求。无论是编码生成、智能代码修复还是作为编程助手，DeepSeek Coder都能提供强大的支持。`
		}]
	},
	DeepSeek_Coder_V2: {
		messagesTemplate: [{
			role: 'system',
			template: 'DeepSeek_Coder_V2Template',
			messageType: 'text2',
			message: `DeepSeek Coder_V2适用于各种场景，包括初创企业的快速原型设计、大型公司的复杂代码重构以及个人开发者的日常编码需求。无论是编码生成、智能代码修复还是作为编程助手，DeepSeek Coder都能提供强大的支持。`
		}]
	},
	'glm-zero-preview': {
		messagesTemplate: [{
			role: 'system',
			template: 'glm-zero-previewTemplate',
			messageType: 'text2',
			message: `GLM-Zero-Preview 具有强大的归纳与演绎能力，能够快速处理复杂的数学运算，解答包括代数、微积分、概率统计等领域的问题。`
		}]
	},
	baidu_code_llama: {
		messagesTemplate: [{
			role: 'system',
			template: 'baidu_code_llamaTemplate',
			messageType: 'text2',
			message: `我是由Meta AI研发并开源的一系列文本生成模型，旨在用于一般代码合成和理解。模型参数规模为70亿。`
		}]
	},
	chat_40: {
		messagesTemplate: [{
			role: 'system',
			template: 'chat_40Template',
			messageType: 'text2',
			message: `欢迎使用chat_40模型`
		}]
	},
	chat_4o: {
		messagesTemplate: [{
			role: 'system',
			template: 'chat_4oTemplate',
			messageType: 'text2',
			message: `欢迎使用chat_4o模型`
		}]
	},
	chat_4o_mini: {
		messagesTemplate: [{
			role: 'system',
			template: 'chat_4o_miniTemplate',
			messageType: 'text2',
			message: `欢迎使用chat_4o_mini模型`
		}]
	},
	codegeex_4: {
		messagesTemplate: [{
			role: 'system',
			template: 'codegeex_4Template',
			messageType: 'text2',
			message: `欢迎使用codegeex_4代码模型`
		}]
	}
};
export const noHistoryArr = ['doc', 'image', 'voice', 'video', 'web'];