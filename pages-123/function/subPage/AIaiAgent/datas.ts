import iconConfig from '@/config/assets.config'
export const aiAgentTemHeaderData = [
	{
		title: 'ai数据分析模型',
		desc: '分析数据,生成数据图表',
		modeIcon: iconConfig.aiAgentheaderModeIcon1,
		id: '65a265419d72d299a9230616',
	},
	{
		title: 'ai数据分析模型',
		desc: '超实用的PPT生成器',
		modeIcon: iconConfig.aiAgentheaderModeIcon2,
		id: '65d2f07bb2c10188f885bd89',
	},
	{
		title: 'AI联网搜索3.0',
		desc: '链接全网,快速分析并总结',
		modeIcon: iconConfig.aiAgentheaderModeIcon3,
		id: '659e54b1b8006379b4b2abd6',
	},
	{
		title: 'AI复杂思维导图',
		desc: '打开你的脑洞,所想即所画',
		modeIcon: iconConfig.aiAgentheaderModeIcon4,
		id: '664dd7bd5bb3a13ba0f81668',

	},
]

export const HotAiAgentTemDatas = [
	{
		title: '古诗绘画鉴赏助手',
		desc: '专业赏析、生动配图，理解古诗词如此简单',
		tips: ['官网出品', 'AI绘画'],
		modeIcon: iconConfig.aiAgentheaderModeIcon5,
		hotColor: 'red'
	},
	{
		title: 'AI连环画',
		desc: '只需提供一个主题，为你生成独家故事绘本。',
		modeIcon: iconConfig.aiAgentheaderModeIcon6,
		hotColor: 'rgb(255, 140, 26)'
	},
	{
		title: '自媒体同步写手',
		desc: '你有创意金矿，我是精准挖掘机，为你生成一键通发多平台内容。',
		modeIcon: iconConfig.aiAgentheaderModeIcon7,
		hotColor: 'rgb(255, 191, 0)'
	},
	{
		title: 'AI联网搜索3.0',
		desc: '连接全网内容，精准搜索，快速分析并总结的智能助手。',
		tips: ['官网出品', '职场提效'],
		modeIcon: iconConfig.aiAgentheaderModeIcon3,
		hotColor: 'rgb(237, 240, 253)',
		hotTextColor: 'rgb(132, 134, 145)'
	},
	{
		title: 'AI续写小说模型',
		desc: '跌宕起伏无限反转，和 AI 共创一部互动小说吧。',
		tips: ['官网出品', '公开配置', 'AI写作'],
		modeIcon: iconConfig.aiAgentheaderModeIcon8,
		hotColor: 'rgb(237, 240, 253)',
		hotTextColor: 'rgb(132, 134, 145)'
	},
]

export const FileIconMap : Record<string, string> = {
	pdf: '//file.1foo.com/2024/11/19/7e869ecd119c6e08a0265639d2a24e1d.png',
	txt: '//file.1foo.com/2024/11/19/c51d84527b29082279947f8bcd07035d.png',
	docx: '//file.1foo.com/2024/11/19/c51d84527b29082279947f8bcd07035d.png',
	doc: '//file.1foo.com/2024/11/19/c51d84527b29082279947f8bcd07035d.png',
	xlsx: '//file.1foo.com/2024/11/19/cabd39e854d5cd2cd36a41a619c3f278.png',
	png: '//file.1foo.com/2024/11/19/c51d84527b29082279947f8bcd07035d.png',
	jpeg: '//file.1foo.com/2024/11/19/c51d84527b29082279947f8bcd07035d.png',
	jpg: '//file.1foo.com/2024/11/19/c51d84527b29082279947f8bcd07035d.png',
}
export const accepetFileTypes = ['pdf', 'doc', 'xlsx', 'ppt', "txt", 'jpeg', 'jpg', 'png', 'docx']