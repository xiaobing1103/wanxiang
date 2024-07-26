import {
	defineStore
} from 'pinia';

export const useChatStore = defineStore('chat', {
	state: () => {
		return {
			model: 'v35',

		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		setModel(newModel : string) {
			this.model = newModel;
		},
	},
});