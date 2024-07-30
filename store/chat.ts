import {
	defineStore
} from 'pinia';
import { ref } from 'vue';

const useChatStore = defineStore('wanxiang_chat', () => {
	const model = ref('v35')
	const setModel = (val : string) => {
		model.value = val
	}

	return {
		model,
		setModel
	}
}
);
export default useChatStore