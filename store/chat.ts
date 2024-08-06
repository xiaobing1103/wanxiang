import {
	defineStore
} from 'pinia';
import { ref } from 'vue';
import { CommonModelKeys } from '../config/type';

const useChatStore = defineStore('wanxiang_chat', () => {
	const model = ref<CommonModelKeys>('v35')
	const openSeletedModel = ref<boolean>(false)
	const openHistoryModel = ref<boolean>(false)
	const setModel = (val : CommonModelKeys) => {
		model.value = val
	}
	const setOpenSeletedModel = (val : boolean) => {
		openSeletedModel.value = val
	}
	const setopenHistoryModel = (val : boolean) => {
		openSeletedModel.value = val
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