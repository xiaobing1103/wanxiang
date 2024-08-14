export function downloadBase64Image(base64Data, filename) {
	const link = document.createElement('a');
	link.href = base64Data;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
export function saveFile(url) {
	uni.showLoading();

	// 判断是否是 base64 格式
	if (url.startsWith('data:')) {
		// 处理 base64 数据
		base64ToFile(url, (tempFilePath) => {
			saveToLocal(tempFilePath);
		}, (error) => {
			uni.hideLoading();
			console.error('Base64 转换失败:', error);
		});
	} else {
		// 下载文件资源到本地
		uni.downloadFile({
			url: url,
			success: (res) => {
				if (res.statusCode === 200) {
					var filePath = res.tempFilePath;
					saveToLocal(filePath);
				} else {
					uni.hideLoading();
					console.error('下载失败:', res.statusCode);
				}
			},
			fail: (err) => {
				uni.hideLoading();
				console.error('下载失败:', err);
			}
		});
	}
}

export function base64ToFile(base64Data, successCallback, errorCallback) {
	// 从 base64 数据中提取出数据部分
	const base64Str = base64Data.replace(/^data:[a-z]+\/[a-z]+;base64,/, '');

	// 创建一个 Blob 对象
	const arrayBuffer = base64ToArrayBuffer(base64Str);
	const filePath = `${wx.env.USER_DATA_PATH}/tempFile.png`; // 使用自定义的路径

	// 使用 uni.getFileSystemManager 写入文件
	const fs = uni.getFileSystemManager();
	fs.writeFile({
		filePath: filePath,
		data: arrayBuffer,
		encoding: 'binary',
		success: () => {
			console.log('File written successfully:', filePath);
			successCallback(filePath);
		},
		fail: (err) => {
			console.error('File write failed:', err);
			errorCallback(err);
		}
	});
}
export function base64ToArrayBuffer(base64) {
	const binaryString = wx.base64ToArrayBuffer(base64);
	return binaryString;
}

export function saveToLocal(filePath) {
	uni.saveFile({
		tempFilePath: filePath,
		success: (res) => {
			uni.openDocument({
				filePath: res.savedFilePath,
				fileType: 'pdf',
				showMenu: true,
				success: () => {
					uni.hideLoading();
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('打开文件失败:', err);
				}
			});
		},
		fail: (err) => {
			uni.hideLoading();
			console.error('保存失败:', err);
		}
	});
}