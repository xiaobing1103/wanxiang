import { isValidURL } from './isValidURL'
import { isWeChatTempPath } from './isWeChatTempPath'
import { Url2temUrl } from './Url2temUrl'
import { isBase64 } from './isBase64'
import { downloadReport } from './downloadBase64Local'
import { fileToBase64, fileToBase64WithHeader } from './file2Base64'
import { formatDate } from './formatDate'
// 页面跳转
const toPage = (path : string) => {
	uni.navigateTo({
		url: path
	});
};
//获取指定范围的随机数
const getRandomInt = (min : number, max : number) : number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
function debounce(fn : Function, delay : number) {
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
function isPureLink(str : string) {
	const pureLinkRegex = /^https?:\/\/[^\s]+$/;
	const linkInContentRegex = /https?:\/\/[^\s]+/;
	if (pureLinkRegex.test(str)) {
		return true;
	} else if (linkInContentRegex.test(str)) {
		return false;
	} else {
		uni.$u.toast("这不是一个有效的链接！")

	}
}
const toCopyText = (content : string, tips ?: string) => {
	//#ifndef H5

	uni.setClipboardData({
		data: String(content), // 必须字符串
		success: function () {
			uni.showToast({
				title: tips || '复制成功',

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
			title: tips || '复制成功',
		});
	}
	textarea.remove();
	// #endif
};
const exportTxt = (textContent : string) => {
	// #ifdef H5
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
	// #endif
	// #ifdef MP-WEIXIN
	saveTextToFile(textContent)
	// #endif
};
function weChatTempPathToBase64(tempFilePath : string) {
	return new Promise((resolve, reject) => {
		// 使用微信小程序的 API 读取文件
		wx.getFileSystemManager().readFile({
			filePath: tempFilePath,
			encoding: 'base64',
			success: (res) => {
				// 获取文件类型
				wx.getFileSystemManager().getFileInfo({
					filePath: tempFilePath,
					success: (info) => {
						let mimeType = info.mimeType;
						// 如果 mimeType 未定义，尝试根据文件扩展名推断
						if (!mimeType) {
							const ext = tempFilePath.split('.').pop();
							mimeType = getMimeTypeFromExtension(ext);
						}
						// 构造 Base64 数据 URL
						const base64DataUrl = `data:${mimeType || 'application/octet-stream'};base64,${res.data}`;
						resolve(base64DataUrl);
					},
					fail: (error) => {
						reject(error);
					}
				});
			},
			fail: (error) => {
				reject(error);
			}
		});
	});
}
function getMimeTypeFromExtension(ext : string) {
	const mimeTypes : { [key : string] : string } = {
		'png': 'image/png',
		'jpg': 'image/jpeg',
		'jpeg': 'image/jpeg',
		'gif': 'image/gif',
		'bmp': 'image/bmp',
		'webp': 'image/webp',
		'svg': 'image/svg+xml',
		'mp4': 'video/mp4',
		'mp3': 'audio/mpeg',
		'wav': 'audio/wav',
		// 其他扩展名和 MIME 类型可以根据需要添加
	};
	return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}
const saveTextToFile = (textContent : string) => {
	const fileSystemManager = wx.getFileSystemManager();
	const tempFilePath = wx.env.USER_DATA_PATH + '/exported-file.txt';

	// 1. 创建临时文件并写入内容
	fileSystemManager.writeFile({
		filePath: tempFilePath,
		data: textContent,
		encoding: 'utf8',
		success: (res) => {
			console.log('文件写入成功:', res);

			// 2. 使用 getFileSystemManager().saveFile 代替 wx.saveFile 保存文件到本地
			fileSystemManager.saveFile({
				tempFilePath: tempFilePath,
				success: (res) => {
					console.log('文件保存成功:', res.savedFilePath);

					// 3. 提供用户打开或操作文件的方式
					wx.openDocument({
						showMenu: true,
						filePath: res.savedFilePath,
						success: function () {
							console.log('文件打开成功');
						}
					});
				},
				fail: (err) => {
					console.error('文件保存失败:', err);
				}
			});
		},
		fail: (err) => {
			console.error('文件写入失败:', err);
		}
	});
};
export { toPage, debounce, isPureLink, toCopyText, getRandomInt, exportTxt, fileToBase64WithHeader, fileToBase64, saveTextToFile, isValidURL, formatDate, isWeChatTempPath, Url2temUrl, weChatTempPathToBase64, isBase64, downloadReport };