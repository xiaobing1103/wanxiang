import { isValidURL } from './isValidURL'
import { isWeChatTempPath } from './isWeChatTempPath'
import { Url2temUrl } from './Url2temUrl'
import { isBase64 } from './isBase64'
import { downloadReport } from './downloadBase64Local'
import { fileToBase64, fileToBase64WithHeader } from './file2Base64'
import { formatDate } from './formatDate'
import { saveImage } from './saveImages'

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
	let timer : any = null;

	// 2.真正执行的函数
	const _debounce = function (...args : any[]) {
		// 取消上一次的定时器 
		if (timer) clearTimeout(timer);

		// 延迟执行
		timer = setTimeout(() => {
			// 外部传入的真正要执行的函数，并传递参数
			fn.apply(this, args);
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
function saveBase64Img(base64) {
	const bitmap = new plus.nativeObj.Bitmap('test');
	bitmap.loadBase64Data(
		base64,
		function () {
			const url = '_doc/' + new Date() + '.png'; // url建议用时间戳命名方式
			console.log('url:', url);
			bitmap.save(
				url, {
				overwrite: true // 是否覆盖
				// quality: 'quality'  // 图片清晰度
			},
				i => {
					uni.saveImageToPhotosAlbum({
						filePath: url,
						success: function () {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							})
							bitmap.clear();
						}
					});
				},
				e => {
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					})
					console.log(e);
					bitmap.clear();
				}
			);
		},
		e => {
			console.log('保存失败', e);
			bitmap.clear();
		}
	);
}


const limitFileSize = (File : any, tips : string) => {
	let flag = true
	// #ifdef APP
	if (File[0]?.size > 10485760) {
		uni.$u.toast(tips + '大小不能超过10mb！');
		flag = false
	}
	// #endif
	// #ifndef APP
	if (File.file[0]?.size > 10485760) {
		uni.$u.toast(tips + '大小不能超过10mb！');
		flag = false
	}
	// #endif 
	return flag

}

const toCopyText = (content : string, tips ?: string) => {
	//#ifndef H5
	uni.setClipboardData({
		data: String(content), // 必须字符串
		success: function () {
			uni.$u.toast(tips || '复制成功！');
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
	// #ifdef APP
	toCopyText(textContent)
	// #endif
};

function weChatTempPathToBase64(tempFilePath : string, deleteHeader ?: boolean) {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
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
		// #endif
		// #ifdef APP-PLUS
		// App端的API
		plus.io.resolveLocalFileSystemURL(tempFilePath, function (entry) {
			entry.file(function (file) {
				let reader = new plus.io.FileReader();
				reader.onloadend = function (e) {
					let base64Data = e.target.result;
					// let mimeType = file.type;
					// const base64DataUrl = `data:${mimeType};base64,${base64Data}`;
					if (deleteHeader) {
						if (base64Data.indexOf(',') > -1) {
							base64Data = base64Data.split(',')[1];
						}
					}

					resolve(base64Data);
				};
				reader.onerror = function (e) {
					reject(e.target.error);
				};
				reader.readAsDataURL(file);
			}, function (e) {
				reject(e.message);
			});
		}, function (e) {
			reject(e.message);
		});
		// #endif
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
	};
	return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}
const saveTextToFile = (textContent : string) => {
	const fileSystemManager = wx.getFileSystemManager();
	let tempFilePath = wx.env.USER_DATA_PATH + '/exported-file.txt';
	const nowEno = uni.getSystemInfoSync().platform;
	console.log(textContent)
	console.log(nowEno)
	console.log(tempFilePath)
	if (nowEno == 'ios') {
		uni.navigateTo({
			url: "/pages/function/subPage/previewTxtPages/index?text=" + textContent
		})
	} else {
		fileSystemManager.writeFile({
			filePath: tempFilePath,
			data: textContent,
			encoding: 'utf-8',
			success: (res) => {
				console.log('文件写入成功:', res);
				fileSystemManager.saveFile({
					tempFilePath: tempFilePath,
					success: (res) => {
						console.log('文件保存成功:', res.savedFilePath);
						wx.openDocument({
							showMenu: true,
							filePath: res.savedFilePath,
							success: function () {
								console.log('文件打开成功');
							}
						});
					},
					fail: (err) => {
						uni.$u.toast("文件保存失败！", err.errMsg)
						console.error('文件保存失败:', err);
					}
				});
			},
			fail: (err) => {
				console.error('文件写入失败:', err);
			}
		});

	}
};

function timestampToDateString(timestamp, includeTime) {
	// 创建一个新的Date对象
	var date = new Date(timestamp * 1000);
	// 获取年、月、日并确保它们是两位数
	var year = date.getFullYear();
	var month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
	var day = date.getDate().toString().padStart(2, '0');
	var hours = date.getHours().toString().padStart(2, '0');
	var minutes = date.getMinutes().toString().padStart(2, '0');
	var seconds = date.getSeconds().toString().padStart(2, '0');

	// 根据includeTime参数决定是否包含时分秒
	var dateString = `${year}-${month}-${day}`;
	if (includeTime) {
		dateString += ` ${hours}:${minutes}:${seconds}`;
	}

	// 返回格式化的日期字符串
	return dateString;
}
function checkFileType(fileName : string, allowedExtensions = ['acc', 'mp4', 'opus', 'wav']) {

	// 获取文件的扩展名	
	const fileExtension = fileName.split('.').pop().toLowerCase();
	// 检查文件扩展名是否在允许的列表中
	if (allowedExtensions.includes(fileExtension)) {
		return true; // 文件类型允许
	} else {
		return false; // 文件类型不允许
	}
}
const uploadFileBefore = (
	event : { file : any },
	allowTypes ?: Array<string>,
	acceptNumber ?: number,
	acceptTips ?: string,
	translateType ?: string,
	maxNumber ?: number,
	formdataTypes ?: 'file2text' | 'docTypes'
) : Promise<{
	fileName : string,
	fileType : string,
	formdata : null,
	response : null,
	isJson : boolean,
	isWechatSendImages : boolean,
	originFormData : null | any,
	maxNumber : number
}> => {
	const returnDatas = {
		fileType: '',
		fileName: '',
		formdata: undefined,
		response: undefined,
		isJson: undefined,
		isWechatSendImages: undefined,
		originFormData: undefined
	}
	return new Promise((resolve, reject) => {
		// #ifdef H5
		if (event.file[0].size > (acceptNumber || 15728640)) {
			uni.$u.toast(acceptTips || '内容大小超出限制,不能上传超过15mb大小的文件！')
			reject(false)
		}
		returnDatas.fileName = event.file[0].name
		returnDatas.formdata = new FormData()
		returnDatas.originFormData = new FormData()
		if (formdataTypes !== 'file2text') {
			returnDatas.originFormData.append('doc', event.file[0].file)
			returnDatas.originFormData.append('target_lang', translateType)
			returnDatas.formdata.append('doc', event.file[0].file)
			returnDatas.formdata.append('target_lang', translateType)
			returnDatas.formdata.append('max_count', maxNumber)
		}
		if (formdataTypes == 'file2text') {
			returnDatas.formdata.append('file', event.file[0].file)
		}

		// #endif
		// #ifdef MP-WEIXIN 
		if (formdataTypes !== 'file2text') {
			returnDatas.fileName = event.file[0].name
			returnDatas.formdata = { doc: event.file[0].url, target_lang: translateType, translate_type: 'usual', max_count: maxNumber }
			returnDatas.isWechatSendImages = true
			returnDatas.isJosn = true
			returnDatas.originFormData = { doc: event.file[0].url, target_lang: translateType, }
		}
		if (formdataTypes == 'file2text') {
			returnDatas.fileName = event.file[0].name
			returnDatas.formdata = { file: event.file[0].url }
			returnDatas.isWechatSendImages = true
			returnDatas.isJosn = true
			returnDatas.originFormData = { file: event.file[0].url }
		}
		// #endif
		// #ifdef APP
		console.log(event)
		if (event[0].size > (acceptNumber || 15728640)) {
			uni.$u.toast(acceptTips || '内容大小超出限制,不能上传超过15mb大小的文件！')
			reject(false)
		}
		if (formdataTypes !== 'file2text') {
			returnDatas.fileName = event[0].name
			returnDatas.formdata = { doc: event[0].url, translate_type: 'usual', target_lang: translateType, max_count: maxNumber }
			returnDatas.isWechatSendImages = true
			returnDatas.isJosn = true
			returnDatas.originFormData = { doc: event[0].url, target_lang: translateType }
		}
		if (formdataTypes == 'file2text') {
			returnDatas.fileName = event[0].name
			returnDatas.formdata = { file: event[0].url }
			returnDatas.isWechatSendImages = true
			returnDatas.isJosn = true
			returnDatas.originFormData = { file: event[0].url, }
		}


		// #endif
		const types = allowTypes ? allowTypes : ['docx', 'pdf']
		returnDatas.fileType = returnDatas.fileName.split('.').pop().toLowerCase();
		if (!checkFileType(returnDatas.fileName, types)) {
			uni.$u.toast(`只支持上传文档格式${types}！`);
			reject(false)
		}
		resolve(returnDatas)
	})
}


/* eslint-disable no-var */
function getLocalFilePath(path) {
	if (
		path.indexOf('_www') === 0 ||
		path.indexOf('_doc') === 0 ||
		path.indexOf('_documents') === 0 ||
		path.indexOf('_downloads') === 0
	) {
		return path
	}
	if (path.indexOf('file://') === 0) {
		return path
	}
	if (path.indexOf('/storage/emulated/0/') === 0) {
		return path
	}
	if (path.indexOf('/') === 0) {
		const localFilePath = plus.io.convertAbsoluteFileSystem(path)
		if (localFilePath !== path) {
			return localFilePath
		} else {
			path = path.substr(1)
		}
	}
	return '_www/' + path
}

const base64ToBlob = (base64Data : string) => {
	const sliceSize = 1024;
	const byteCharacters = atob(base64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);
		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: 'image/png' });
	return blob;
}
export { toPage, getLocalFilePath, uploadFileBefore, base64ToBlob, saveImage, debounce, isPureLink, toCopyText, timestampToDateString, getRandomInt, exportTxt, fileToBase64WithHeader, fileToBase64, saveTextToFile, isValidURL, formatDate, isWeChatTempPath, Url2temUrl, weChatTempPathToBase64, isBase64, downloadReport, limitFileSize, shareText, saveBase64Img };