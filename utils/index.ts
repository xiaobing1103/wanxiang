
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
function debounce(fn:Function, delay:number) {
  // 1.定义一个定时器, 保存上一次的定时器
  let timer = null
  // 2.真正执行的函数
  const _debounce = function () {
    // 取消上一次的定时器
    if (timer) clearTimeout(timer)
    // 延迟执行
    timer = setTimeout(() => {
      // 外部传入的真正要执行的函数
      fn()
    }, delay)
  }
  return _debounce
}
export {
	toPage,
	debounce,
	getRandomInt
}