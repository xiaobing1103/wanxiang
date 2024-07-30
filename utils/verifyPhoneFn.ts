// 验证手机
export const verifyPhoneFn = (phoneNumber : string) => {
	const regu = /^1[3-9][0-9]{9}$/
	return regu.test(phoneNumber)
}