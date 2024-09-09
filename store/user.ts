import { defineStore } from 'pinia'
import { ref } from 'vue'
// import api from '../api/api'
import { UserInfoDTO } from '../type/userTypes'
import $api from '@/http'

const useUserStore = defineStore("wanxiang_userInfo", () => {
	const userInfo = ref<UserInfoDTO | null>(null)//用户信息
	const token = ref('')
	const showVip = ref(true)
	const exitLogin = () => {
		userInfo.value = null
		uni.navigateTo({
			url: '/pages/login/index'
		})
	}
	// 用户名密码登录
	const login = async (parmas, type : 'login' | 'register' | 'phone' | 'wechat') => {
		if (type == 'phone') {
			return $api.post('api/v1/user/phoneLogin', parmas)
			// return await api.phoneLogin(parmas)
		}
		if (type == 'login') {
			return $api.post('api/v1/user/login', parmas)
			// return await api.login(parmas)
		}
		if (type == 'register') {
			return $api.post('api/v1/user/register', parmas)
			// return await api.register(parmas)
		}
		if (type == 'wechat') {
			return $api.post('api/v1/user/wechatPhoneLogin', parmas)
		}
	}
	//微信授权登录
	const wxAuthLogin = async () => {
		try {
			const wxUserInfo = await getWxUserInfo()//获取微信用户信息
			const code = await getUserCode()//获取微信用户code
			//使用code去获取token
		} catch (err) {
			uni.$u.toast(JSON.stringify(err))
		}
	}
	//获取微信用户信息
	const getWxUserInfo = () : Promise<UniApp.GetUserProfileRes> => {
		// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
		// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		// #ifdef MP-WEIXIN
		return new Promise((reslove, reject) => {
			uni.getUserProfile({
				lang: "zh_CN",
				desc: '用于完善订单用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success(res) {
					reslove(res)
				},
				fail(err) {
					reject(err)
				}
			})
		})
		// #endif
		// #ifndef MP-WEIXIN
		uni.$u.toast('客户端环境不匹配')
		// #endif	
	}
	//获取用户code
	const getUserCode = () : Promise<string> => {
		// #ifdef MP-WEIXIN
		return new Promise((reslove, reject) => {
			uni.login({
				provider: "weixin",
				onlyAuthorize: true,
				async success(res) {
					reslove(res.code)
				},
				fail(err) {
					reject(err)
				}
			})
		})
		// #endif
		// #ifndef MP-WEIXIN
		uni.$u.toast('客户端环境不匹配')
		// #endif
	}
	return {
		userInfo,
		token,
		login,
		getUserCode,
		showVip,
		getWxUserInfo,
		exitLogin,
		wxAuthLogin,
		// appId,
		// uid
	}
}, { unistorage: { paths: ['userInfo', 'token'] } })
export default useUserStore