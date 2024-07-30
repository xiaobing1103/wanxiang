
// 页面跳转
const toPage = (path:string) =>{
	uni.navigateTo({
		url:path
	})
}
//获取指定范围的随机数
const getRandomInt = (min:number, max:number):number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export {
	toPage,
	getRandomInt
}