import {
	defineStore
} from 'pinia';
import { ref } from 'vue';
import { ChatHistory, ItemMessage, ModelType, } from '../type/chatData';
import { generateUUID } from '../tools/uuid';
import { commonModel } from '../config/modelConfig';
import { noHistoryArr } from '@/pages/chat/chatConfig';
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

	const isShowSearchTabbar = ref('HomeTemPlate')
	const chats = ref<ChatHistory[]>([])
	const shareButton = ref(false)
	const seletedModel = ref('DeepSeek_R1')
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
	const setIsShowSearchTabbar = (val : string) => {
		isShowSearchTabbar.value = val
	}
	const setSeletedModel = (val : string) => {
		seletedModel.value = val
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



	const addchats = (value : ChatHistory) => {
		if (chats.value.length >= 10) {
			uni.$u.toast('历史记录不能超过十条,请删除历史记录后重试！')

			return
		}
		setModel(value.model)
		changeSelectChatId(value.id)
		if (noHistoryArr.includes(value.model)) return
		chats.value.unshift({ ...value })
	}

	const delChats = (id : string) => {
		if (chats.value.length === 1) {
			// 如果只有一个消息，不允许删除
			UNI.$u.toast('只有一条消息记录，无法删除');
			return;
		}
		const newChats = chats.value.filter((val) => val.id !== id);
		chats.value = newChats;
		if (chats.value.length > 0) {
			// 如果还有剩余的消息，更新选择的聊天和模型
			setTimeout(() => {
				changeSelectChatId(chats.value[0].id);
				setModel(chats.value[0].model);
			}, 100)

		} else {
			// 如果删除后没有剩余消息，可以处理这种情况
			uni.$u.toast('没有剩余的消息');
		}
	};
	const clearChats = () => {
		if (chats.value.length > 1) {
			chats.value = []
			addchats({
				id: generateUUID(),
				iconUrl: commonModel.v35.modelIcon,
				title: commonModel.v35.title,
				data: [],
				model: 'v35'
			})
		} else {

			uni.$u.toast('只有一条消息记录，无法删除！');
		}
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

	const initChatInfo = (refreshPage ?: boolean) => {
		if (chats.value.length >= 10) {
			uni.$u.toast('历史记录不能超过十条！')
			return
		}
		if (chats.value.length == 0 || refreshPage) {
			const chatId = generateUUID()
			changeSelectChatId(chatId)
			addchats({
				id: chatId,
				data: [],
				iconUrl: commonModel[model.value].modelIcon,
				model: model.value,
				title: commonModel[model.value].title
			})
			changeSelectChatId(chatId)
		}
	}
	const getCurrentInfo = (id : string) => {
		return chats.value.find((item) => item.id == id)
	}

	const seletedFirstChats = () => {
		setModel(chats.value[0].model)
		changeSelectChatId(chats.value[0].id)
	}
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
		initChatInfo,
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
		seletedModel,
		setSeletedModel,
		isShowSearchTabbar,
		setIsShowSearchTabbar,
		isNotThinkModels
	}
}, { unistorage: { paths: ['model', 'selectChatId', 'chats', 'persona_id', 'loadingMessage'] } }
);
export default useChatStore