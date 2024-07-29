
// 页面跳转
const toPage = (path:string) =>{
	uni.navigateTo({
		url:path
	})
}

export {
	toPage
}