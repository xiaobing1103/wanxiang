// 页面跳转
const toPage = (path: string) => {
	uni.navigateTo({
		url: path
	});
};
//获取指定范围的随机数
const getRandomInt = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
function debounce(fn: Function, delay: number) {
	// 1.定义一个定时器, 保存上一次的定时器
	let timer = null;
	// 2.真正执行的函数
	const _debounce = function () {
		// 取消上一次的定时器
		if (timer) clearTimeout(timer);
		// 延迟执行
		timer = setTimeout(() => {
			// 外部传入的真正要执行的函数
			fn();
		}, delay);
	};
	return _debounce;
}
const toCopyText = (content: string) => {
	//#ifndef H5
	uni.setClipboardData({
		data: String(content), // 必须字符串
		success: function () {
			uni.showToast({
				title: '复制成功',
				icon: 'success'
			});
		},
		fail(err) {
			console.log(err, 'err');
		}
	});
	//#endif
	// #ifdef H5
	if (!document.queryCommandSupported('copy')) {
		// 兼容某些浏览器的判断
		console.log('该浏览器不支持');
	}
	let textarea = document.createElement('textarea');
	textarea.value = content;
	textarea.readOnly = 'readOnly';
	document.body.appendChild(textarea);
	textarea.select(); // 选择对象
	textarea.setSelectionRange(0, content.length); // 核心
	let result = document.execCommand('copy'); // 执行浏览器复制命令
	if (result) {
		uni.showToast({
			title: '复制成功',
			icon: 'success'
		});
	}
	textarea.remove();
	// #endif
};
const exportTxt = (textContent: string) => {

	// 2. 创建 Blob 对象
	const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });

	// 3. 创建 URL 对象
	const url = URL.createObjectURL(blob);

	// 4. 创建一个下载链接
	const a = document.createElement('a');
	a.href = url;
	a.download = 'exported-file.txt';

	// 5. 触发下载
	document.body.appendChild(a);
	a.click();

	// 6. 清理 URL 对象
	URL.revokeObjectURL(url);
};

export { toPage, debounce, toCopyText, getRandomInt, exportTxt };
