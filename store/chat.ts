import {
	defineStore
} from 'pinia';
import { ref } from 'vue';
import { CommonModelKeys } from '../config/type';
import { ChatHistory, ItemMessage, MessageItems, ModelType, historyMessages } from '../type/chatData';
import { generateUUID } from '../tools/uuid';
import { commonModel } from '../config/modelConfig';


const useChatStore = defineStore('wanxiang_chat', () => {
	const model = ref<ModelType>('v35')
	const selectChatId = ref<string>('')
	const persona_id = ref<string>('')
	const loadingMessage = ref<boolean>(false)
	const openSeletedModel = ref<boolean>(false)
	const openHistoryModel = ref<boolean>(false)
	const chats = ref<ChatHistory[]>([])
	const setModel = (val : ModelType) => {
		model.value = val
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
		const noHistoryArr = ['doc']
		if (noHistoryArr.includes(value.model)) return
		chats.value.unshift({ ...value })
	}

	const delChats = (id : string) => {
		if (chats.value.length === 1) {
			// 如果只有一个消息，不允许删除
			uni.$u.toast('只有一个消息，无法删除');
			return;
		}

		const newChats = chats.value.filter((val) => val.id !== id);
		chats.value = newChats;

		if (chats.value.length > 0) {
			// 如果还有剩余的消息，更新选择的聊天和模型
			changeSelectChatId(chats.value[0].id);
			setModel(chats.value[0].model);
		} else {
			// 如果删除后没有剩余消息，可以处理这种情况
			uni.$u.toast('没有剩余的消息');
		}
	};
	const clearChats = () => {
		chats.value = []
	}
	const changeSelectChatId = (id : string) => {
		selectChatId.value = id
	}
	const setPersonaId = (id : string) => {
		persona_id.value = id
	}
	const setChatInfo = (id : string, data : ItemMessage) => {
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
		if (chats.value.length > 10) {
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
		seletedFirstChats
	}
}, { unistorage: { paths: ['model', 'selectChatId', 'chats', 'persona_id'] } }
);
export default useChatStore