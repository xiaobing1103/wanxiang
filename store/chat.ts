import {
	defineStore
} from 'pinia';
import { ref } from 'vue';
import { CommonModelKeys } from '../config/type';
import { ModelType } from '../type/chatData';

const useChatStore = defineStore('wanxiang_chat', () => {
	const model = ref<ModelType>('v35')
	const openSeletedModel = ref<boolean>(false)
	const openHistoryModel = ref<boolean>(false)

	const setModel = (val : CommonModelKeys) => {
		model.value = val
	}
	const setOpenSeletedModel = (val : boolean) => {
		openSeletedModel.value = val
	}
	const setopenHistoryModel = (val : boolean) => {
		openHistoryModel.value = val
	}
	return {
		model,
		setModel,
		openSeletedModel,
		setOpenSeletedModel,
		setopenHistoryModel,
		openHistoryModel
	}
}
);
export default useChatStore