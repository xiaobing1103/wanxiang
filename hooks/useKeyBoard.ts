import { ref } from 'vue'

export const useKeyboard = () => {
	const keyboardHeight = ref(0)
	const isIOS = uni.getSystemInfoSync().platform === 'ios'
	const lastKeyboardTime = ref(0)

	// 初始化键盘监听
	const initKeyboardListener = () => {
		uni.onKeyboardHeightChange((res) => {
			if (isIOS) {
				const now = Date.now()
				if (res.height === 0 && now - lastKeyboardTime.value < 500) {
					return
				}
				lastKeyboardTime.value = now
			}
			console.log('键盘高度', res.height)
			keyboardHeight.value = res.height
		})

	}

	// 清理键盘监听
	const clearKeyboardListener = () => {
		uni.offKeyboardHeightChange()
	}

	return {
		keyboardHeight,
		initKeyboardListener,
		clearKeyboardListener
	}
}

// 创建单例
export const globalKeyboard = useKeyboard()