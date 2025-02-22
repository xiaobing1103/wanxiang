import {
	defineStore
} from 'pinia';
import { ref } from 'vue';
import { ChatHistory, ItemMessage, MessageItems, ModelType, } from '../type/chatData';
import { generateUUID } from '../tools/uuid';
import { commonModel } from '../config/modelConfig';
import { TemplateConfig, noHistoryArr } from '@/pages/chat/chatConfig';
export interface shareDataType {
	sharedata ?: any
	type : number
	strShareUrl ?: string
	strShareTitle ?: string
	strShareSummary ?: string
	strShareImageUrl ?: string
}

const useChatStore = defineStore('wanxiang_chat', () => {
	const model = ref<ModelType>('v35')
	const selectChatId = ref<string>('')
	const persona_id = ref<string>('')
	const loadingMessage = ref<boolean>(false)
	const openSeletedModel = ref<boolean>(false)
	const showlevelUpVip = ref<boolean>(false)
	const showLevelUpVipContent = ref<string>('')
	const openHistoryModel = ref<boolean>(false)
	const openDeepSeekModel = ref(false)
	const messageList = ref<MessageItems>(new Map());
	const isShowSearchTabbar = ref('HomeTemPlate')
	const chats = ref<ChatHistory[]>([])
	const shareButton = ref(false)
	const openLianWangModel = ref(false)
	const isNotThinkModels = ['DeepSeek_V3', 'DeepSeek_Coder_V2', 'DeepSeek_Coder']
	const isDeepSeekModels = ['DeepSeek_R1', 'DeepSeek_V3', 'deepseek_r1_qwen_70b', 'glm-zero-preview', 'deepseek_r1_qwen_32b', 'DeepSeek_Coder_V2', 'DeepSeek_Coder']
	const isDeepSeekR1ChatModels = ['DeepSeek_R1', 'deepseek_r1_qwen_70b', 'glm-zero-preview', 'deepseek_r1_qwen_32b',]

	const sharedata = ref<shareDataType>({
		type: 1,
		strShareUrl: "http://www.baidu.com",
		strShareTitle: "分享标题",
		strShareSummary: "分享总结",
		strShareImageUrl: "http://www.xuelejia.com/xljapp/h5/static/aboutUsLogo.png"
	})

	const setopenLianWangModel = (val : boolean) => {
		openLianWangModel.value = val
	}
	const setIsShowSearchTabbar = (val : string) => {
		isShowSearchTabbar.value = val
	}

	const setOpenDeepSeekModel = (val : boolean) => {
		openDeepSeekModel.value = val
	}

	const setSharedata = (val : shareDataType) => {
		sharedata.value = val
	}
	const setShareButton = (val : boolean) => {
		shareButton.value = val
	}
	const setModel = (val : ModelType) => {
		model.value = val
	}
	const setShowlevelUpVip = (val : boolean) => {
		showlevelUpVip.value = val
	}
	const setShowLevelUpVipContent = (val : string) => {
		showLevelUpVipContent.value = val
	}

	const setLoadingMessage = (val : boolean) => {
		loadingMessage.value = val
	}
	const setOpenSeletedModel = (val : boolean) => {
		openSeletedModel.value = val
	}
	const setopenHistoryModel = (val : boolean) => {
		openHistoryModel.value = val
	}


	const getInitTemplate = () => {
		const maps = new Map();
		TemplateConfig[model.value].messagesTemplate.map((item, index) => {
			const id = generateUUID();
			item.id = id;
			maps.set(item.id, {
				id: id,
				state: 'ok',
				target: item.role,
				message: item.message || item.template,
				messageType: item.messageType || 'template'
			});
		});
		return maps;
	};
	const addchats = (value : ChatHistory) => {
		// if (chats.value.length >= 10) {
		// 	uni.$u.toast('历史记录不能超过十条,请删除历史记录后重试！')
		// 	return
		// }
		setModel(value.model)
		changeSelectChatId(value.id)
		if (noHistoryArr.includes(value.model)) return
		chats.value.unshift({ ...value })
	}

	const delChats = (id : string) => {
		const newChats = chats.value.filter((val) => val.id !== id);

		chats.value = newChats
		// if (chats.value.length > 0) {
		// 	setTimeout(() => {
		// 		changeSelectChatId(chats.value[0].id);
		// 		setModel(chats.value[0].model);
		// 	}, 100)
		// } else {
		// 	uni.$u.toast('没有剩余的消息');
		// }
		if (chats.value.length == 0) {
			uni.$u.toast('没有剩余的消息');
		}
	};
	const clearChats = () => {
		setModel(model.value)
		chats.value = []
		messageList.value = getInitTemplate()
		uni.$u.toast('清楚全部历史记录成功！');

	}
	const clearChartLoadingStauts = () => {
		console.log(chats.value.find((items) => items.id == selectChatId.value))
	}
	const changeSelectChatId = (id : string) => {
		selectChatId.value = id
	}
	const setPersonaId = (id : string) => {
		persona_id.value = id
	}
	const setChatInfo = (id : string, data : ItemMessage) => {
		if (noHistoryArr.includes(model.value)) return
		const newChats = chats.value.map((item) => {
			if (item.id == id) {
				const updatedData = Array.isArray(item.data) ? item.data : [];
				return {
					...item,
					data: [...updatedData, data],
				};
			}
			return item;
		});
		chats.value = newChats;
	};

	// const initChatInfo = (refreshPage ?: boolean) => {
	// 	if (chats.value.length >= 10) {
	// 		uni.$u.toast('历史记录不能超过十条！')
	// 		return
	// 	}
	// 	if (chats.value.length == 0 || refreshPage) {
	// 		const chatId = generateUUID()
	// 		changeSelectChatId(chatId)
	// 		addchats({
	// 			id: chatId,
	// 			data: [],
	// 			iconUrl: commonModel[model.value].modelIcon,
	// 			model: model.value,
	// 			title: commonModel[model.value].title
	// 		})
	// 		changeSelectChatId(chatId)
	// 	}
	// }
	const getCurrentInfo = (id : string) => {
		return chats.value.find((item) => item.id == id)
	}

	const seletedFirstChats = () => {
		if (chats.value.length > 0) {
			setModel(chats.value[0].model)
			changeSelectChatId(chats.value[0].id)
		}

	}
	// 修改对话title
	const updateChatTitle = (id : string, newTitle : string) => {
		const newChats = chats.value.map((chat) => {
			if (chat.id === id) {
				return {
					...chat,
					title: newTitle
				};
			}
			return chat;
		});

		chats.value = newChats;
	};

	return {
		model,
		setModel,
		openSeletedModel,
		setOpenSeletedModel,
		setopenHistoryModel,
		openHistoryModel,
		selectChatId,
		loadingMessage,
		chats,
		addchats,
		delChats,
		clearChats,
		changeSelectChatId,
		persona_id,
		setPersonaId,
		setChatInfo,
		// initChatInfo,
		getCurrentInfo,
		setLoadingMessage,
		seletedFirstChats,
		clearChartLoadingStauts,
		showlevelUpVip,
		showLevelUpVipContent,
		setShowlevelUpVip,
		setShowLevelUpVipContent,
		sharedata,
		shareButton,
		setShareButton,
		setSharedata,
		isDeepSeekModels,
		isDeepSeekR1ChatModels,
		setOpenDeepSeekModel,
		openDeepSeekModel,
		isShowSearchTabbar,
		setIsShowSearchTabbar,
		isNotThinkModels,
		messageList,
		getInitTemplate,
		updateChatTitle,
		openLianWangModel,
		setopenLianWangModel
	}
}, { unistorage: { paths: ['model', 'chats', 'persona_id', 'loadingMessage'] } }
);
export default useChatStore