import {
	defineStore
} from 'pinia';
import { Ref, computed, ref } from 'vue';
import $assets from '@/config/assets.config.ts'

export interface MainPagesInterFace {
	openUpLoadFileModal : boolean
	chatValue : string
	fileList : FileItem[],
	isRecive : Ref<boolean>,
	streamRequest : () => void
	setIsRecive : (val : boolean) => void
	onCancelRequest : () => void
	streamSpark : (text : string) => Promise<string>
}
//菜单类型枚举
export enum AgentKeyEnum {
	Home = 'index', //首页
	ANALYSIS = 'date_analysis', //数据分析
	PPT = 'ppt_assistant', //ppt助手
	SEARCH = 'ai_search', //ai搜索
	IMAGE = 'ai_image', //ai画图
	FLOW_CHART = 'flow_chart', //复杂流程图
	MIND_MAP = 'mind_map', //思维导图
	CALL_WORD = 'call_word', //提示词工程师
	THESIS = 'thesis', //论文
	CODE_SAM = 'code_sam', //程序员助手
	WEB_ARTICLE = 'web_article', //网文助手
	ENGLISH_HELP = 'english_help', //英语语法助手
	DEFAULT = 'default' //默认模版
}

//模版Key
export const AgentIdMap : Record<AChat.MenuKeyEnum, string> = {
	[AgentKeyEnum.Home]: '',
	[AgentKeyEnum.ANALYSIS]: '65a265419d72d299a9230616',
	[AgentKeyEnum.PPT]: '65d2f07bb2c10188f885bd89',
	[AgentKeyEnum.SEARCH]: '659e54b1b8006379b4b2abd6',
	[AgentKeyEnum.IMAGE]: '66437ef3d920bdc5c60f338e',
	[AgentKeyEnum.FLOW_CHART]: '664dd7bd5bb3a13ba0f81668',
	[AgentKeyEnum.MIND_MAP]: '664e0cade018d633146de0d2',
	[AgentKeyEnum.CALL_WORD]: '6654898292788e88ce9e7f4c',
	[AgentKeyEnum.THESIS]: '663058948bb259b7e8a22730',
	[AgentKeyEnum.CODE_SAM]: '65a393b3619c6f13586246cd',
	[AgentKeyEnum.WEB_ARTICLE]: '65b356af6924a59d52832e54',
	[AgentKeyEnum.ENGLISH_HELP]: '668fdd45405f2e3c9f71f832'
}
export interface FileItem {
	name : string
	type : string
	size : number
	id ?: string
	originFile ?: File,
	url ?: string
	loadding : 'loadding' | 'error' | 'complete',
	message ?: string
}
export namespace AChat {
	export type Request = () => void
	//菜单列表
	export interface MenuItem {
		title : string
		icon : string
		id : string
		key : AgentKeyEnum
	}
	export type MenuKeyEnum = Exclude<AgentKeyEnum, AgentKeyEnum.DEFAULT>
	export type TemplateKey = Exclude<AgentKeyEnum, AgentKeyEnum.Home>
	export type AgentTmplate = Record<string, { template : string }>
	export interface UserMessageItem {
		role : 'user'
		id : string
		files ?: FileItem[]
		conversation_id ?: string | null
		content : string
	}

	export interface SystemMessageItem {
		role : 'system'
		// content: Array<StreamTools | StreamAssistant>
		content : string
		aiAgentSearchList ?: { content : string, link : string, title : string }[]
		SearchTitle ?: string
		drawLoading ?: boolean
		icon ?: string
		id : string
		conversation_id ?: string | null
		name ?: string
		description ?: string
	}

	export type MessageItem = UserMessageItem | SystemMessageItem
}
export namespace Agent {
	interface TagItem {
		key : string;
		label : string;
	}
	export interface Item {
		assistant_id : string;
		avatar : string;
		description : string;
		name : string;
		starter_prompts : string[]
		status : string;
		tools : string[]
		updated_at : string;
		tags ?: TagItem[]
	}
	export interface File {
		bytes : number;
		created_at : number;
		filename : string;
		id : string;
		object : string;
		purpose : string;
	}
	export interface ChatBody {
		messages : {
			role : string,
			content : string;
		}[],
		assistant_id : string;
		conversation_id : string | null | undefined;
		file_id ?: string[]

	}
}

export const CreateImageDrawLoadding = () => {
	return `
		<div style="display:flex;align-items: center;padding: 10px 0;" id="draw_loading">
		      <img  notScal="true" style="width:50rpx;height:50rpx;margin-right:10rpx;"  src="${$assets.aiAigentDrawLoading}"/>
		      <span class="name">CogView3-PlusAI绘画...</span>
		  </div>
	`
}

export const CreateDeepSeekLoadding = () => {
	return `
		<div style="display:flex;align-items: center;padding: 10px 0;" id="draw_loading">
		      <img  notScal="true" style="width:50rpx;height:50rpx;margin-right:10rpx;"  src="${$assets.DeepSeekModelIcon}"/>
		      <span class="name">深度思考中...</span>
			  <span class="arrow"> 👇 </span>
		  </div>
	`
}
export const CreateDeepSeekComplete = () => {
	return `
		<div style="display:flex;align-items: center;padding: 10px 0;" id="draw_loading">
		      <img  notScal="true" style="width:50rpx;height:50rpx;margin-right:10rpx;"  src="${$assets.DeepSeekModelIcon}"/>
		      <span class="name">已深度思考...</span>
		  </div>
	`
}
export const CreateImageDrawComplete = () => {
	return `
	  <div style="display:flex;align-items: center;padding: 10px 0;" id="draw_loading">
		  <img notScal="true" style="width:50rpx;height:50rpx;margin-right:10rpx;" src="${$assets.aiAigentLoadingIcon}"/>
		  <span class="name">CogView3-PlusAI绘画：已完成</span>
	  </div>\n\n`
}


export let newStr = ''
const useAiAgentChats = defineStore('wanxiang_aiAgentChats', () => {
	const openHistoryModal = ref(false)
	const searchList = ref([])
	const chatList = ref<Record<string, Record<string, AChat.MessageItem[]>>>({})
	const agentMenus = ref([
		{
			cover: $assets.aiAgentheaderModeIcon,
			title: '智能体中心',
			description: '多种智能体供你选择,你可以创建自己的智能体模型',
			path: '/pages/function/subPage/AIaiAgent/index'
		},
		{
			cover: $assets.aiAgentheaderModeIcon1,
			title: 'AI数据分析模型',
			description: '使用本模式后可以写出非常优秀、领域性的文章，例如可用于论文、研究报告、学术论坛、学术文章、科学研究、学术期刊',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=65a265419d72d299a9230616'
		},
		{
			cover: $assets.aiAgentheaderModeIcon2,
			title: 'AI-PPT轻简版',
			description: '超实用的PPT生成器，支持手动编辑大纲、自动填充章节内容，更有多个模板一键替换',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=65d2f07bb2c10188f885bd89'
		},
		{
			cover: $assets.aiAgentheaderModeIcon3,
			title: 'AI联网搜索3.0',
			description: '超实用的PPT生成器，支持手动编辑大纲、自动填充章节内容，更有多个模板一键替换',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=659e54b1b8006379b4b2abd6'
		},
		{
			cover: $assets.aiAgentheaderModeIcon4,
			title: 'AI复杂流程图生成',
			description: '人人都能掌握的流程图工具，分分钟做出一张清晰的流程图。',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=664dd7bd5bb3a13ba0f81668'
		},
		{
			cover: $assets.aiAgentheaderModeIcon9,
			title: 'AI复杂思维导图',
			description: '告别整理烦恼，任何复杂概念秒变脑图。',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=664e0cade018d633146de0d2'
		},
		{
			cover: $assets.aiAgentheaderModeIcon10,
			title: '提示词优化插件',
			description: '人人都是提示词工程师，超强清言结构化提示词专家，一键改写提示词。',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=6654898292788e88ce9e7f4c'
		},
		{
			cover: $assets.aiAgentheaderModeIcon11,
			title: 'arXiv论文速度',
			description: '深度解析arXiv论文，让你快速掌握研究动态，节省宝贵时间。',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=663058948bb259b7e8a22730'
		},
		{
			cover: $assets.aiAgentheaderModeIcon12,
			title: '编程开发知识搜索引',
			description: '我有一个外号叫“编程开发知识搜索引擎”，我很开心能帮助程序员解决日常问题❤️',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=65a393b3619c6f13586246cd'
		},
		{
			cover: $assets.aiAgentheaderModeIcon13,
			title: 'AI网文模型',
			description: '大神写作秘诀：一套模板不断重复。',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=65b356af6924a59d52832e54'
		},
		{
			cover: $assets.aiAgentheaderModeIcon14,
			title: '英语语法助手',
			description: '输入单词，进行单词查询；输入句子，进行语法检查；输入讲解，进行语法解释。',
			path: '/pages/function/subPage/AIaiAgent/mainPages?id=668fdd45405f2e3c9f71f832'
		}])

	const agentId = ref<string>('')

	const agentItem = ref<Agent.Item | null>(null)
	const agentList = ref<Agent.Item[]>([])
	const showAgentChangeBox = ref(false)
	const currentConversation_id = ref(null)
	const showMessageList = computed<AChat.MessageItem[] | []>(() => {
		if (currentConversation_id.value) {
			for (let key in chatList.value) {
				if (agentId.value == key) {
					for (let newkey in chatList.value[key]) {
						if (newkey == currentConversation_id.value) {
							return chatList.value[key][currentConversation_id.value]
						}
					}
				}
			}
		}
		return []
	})
	const messageList = ref<AChat.MessageItem[]>([])
	const AiAgentChats = ref()
	//智能体当前
	const getAgentItem = () => {
		return agentList.value[0]
	}
	const setMessageList = (val : AChat.MessageItem[]) => {
		messageList.value = val
	}

	const addMessageList = (val : AChat.MessageItem) => {
		messageList.value.push(val)
	}

	const changeMessageListSearchTitle = (val : string) => {
		const length = messageList.value.length - 1
		messageList.value[length] = { ...messageList.value[length], SearchTitle: val }
	}

	const changeMessageListSAiAgentSearchList = (val : { content : string; link : string; title : string; }[]) => {
		const length = messageList.value.length - 1
		messageList.value[length] = { ...messageList.value[length], aiAgentSearchList: val }
	}
	const replaceMessageLists = (form : string, to = '') => {
		const length = messageList.value.length - 1
		messageList.value[length].content = messageList.value[length].content.replace(form, to)
	}

	const PopMessageList = () => {
		messageList.value.pop()
	}

	const setOpenHistoryModal = (val : boolean) => {
		openHistoryModal.value = val
	}
	const setAgentId = (val : string) => {
		agentId.value = val
	}
	const setAgentList = (val : Agent.Item[]) => {
		agentList.value = val
	}
	const setAgentItem = (val : Agent.Item | {}) => {
		agentItem.value = val
	}

	const setShowAgentChangeBox = (val : boolean) => {
		showAgentChangeBox.value = val
	}

	const clearsingleMsg = () => {

	}

	const setCurrentConversation_id = (val : string) => {
		currentConversation_id.value = val
	}

	const createNewChatList = (id : string) => {
		if (!chatList.value[agentId.value]) {
			chatList.value[agentId.value] = {}
		}
		chatList.value[agentId.value][id] = messageList.value
	}

	const deleteChatListSingleChat = (key : string) => {
		if (chatList.value[agentId.value] && chatList.value[agentId.value][key]) {
			delete chatList.value[agentId.value][key];
			messageList.value = []
		}

	}
	const changeMessageList = (key : string) => {
		messageList.value = chatList.value[agentId.value][key]
	}
	const clearAllLists = () => {
		chatList.value[agentId.value] = {}
		messageList.value = []
	}
	return {
		chatList,
		showMessageList,
		messageList,
		setMessageList,
		addMessageList,
		createNewChatList,
		clearAllLists,
		changeMessageListSearchTitle,
		changeMessageListSAiAgentSearchList,
		replaceMessageLists,
		deleteChatListSingleChat,
		AiAgentChats,
		PopMessageList,
		agentItem,
		setAgentList,
		setAgentItem,
		getAgentItem,
		agentList,
		showAgentChangeBox,
		setShowAgentChangeBox,
		agentMenus,
		agentId,
		setAgentId,
		searchList,
		currentConversation_id,
		setCurrentConversation_id,
		openHistoryModal,
		setOpenHistoryModal,
		changeMessageList,
		clearsingleMsg,
	}
}, { unistorage: { paths: ['chatList', 'agentId', 'currentConversation_id'] } }
);
export default useAiAgentChats