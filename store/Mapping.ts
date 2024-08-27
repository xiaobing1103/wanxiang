import {
	defineStore
} from 'pinia';
import { ref } from 'vue';


const useMappingStore = defineStore('wanxiang_Mapping', () => {
	const initValue = `# ChatGptWeb系统
## 基础功能
- 支持AI聊天
- 支持GPT4
- 支持DLLAE2
- 支持Midjourney
- 支持mind思维导图生成
- 更多功能等你探索......

## 更多内容
-  在上面输入您想要生成的内容
- 点击生成即可
`

	const initUrl = `http://localhost:5173/#/pages/function/subPage/H5CreateAImappingPreview/index?sendMsg=${initValue}`
	const contentStr = ref<string>(initValue)

	const url = ref(initUrl)
	const setContentStr = (val : string) => {
		contentStr.value = val
	}
	const setUrl = (value ?: string) => {
		if (value) {
			url.value = `http://localhost:5173/#/pages/function/subPage/H5CreateAImappingPreview/index?sendMsg=${value}`
		} else {
			url.value = initUrl
		}
	}


	return {
		url,
		contentStr,
		setUrl,
		setContentStr,
		initValue
	}
}, { unistorage: { paths: ['url', 'contentStr'] } }
);
export default useMappingStore