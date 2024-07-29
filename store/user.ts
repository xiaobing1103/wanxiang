import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const useUserStore = defineStore("user", () => {
	const userInfo = ref({})//用户信息
	const token = ref('')//token
	const showVip = ref(true)

	//退出登录
	const exitLogin = () => {

	}
	// 用户名密码登录
	const login = async () => {

	}
	return {
		userInfo,
		token,
		login,
		showVip,
		exitLogin
	}
}, { unistorage: { paths: ['userInfo', 'token'] } })
export default useUserStore