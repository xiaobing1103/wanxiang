
export function saveFile(url : string, fileType : string) {
	uni.showLoading();
	if (url?.startsWith('data:')) {
		base64ToFile(url, (tempFilePath) => {
			saveToLocal(tempFilePath);
		}, (error) => {
			uni.hideLoading();
			console.error('Base64 转换失败:', error);
		});
	} else {
		// #ifdef MP-WEIXIN || APP
		uni.downloadFile({
			url: url,
			success: (res) => {
				if (res.statusCode === 200) {
					var filePath = res.tempFilePath;
					saveToLocal(filePath, fileType);
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
		// #endif
		// #ifdef H5
		if (url.startsWith('http')) {
			// 如果是网络文件，直接在新窗口中打开
			window.open(url);
		} else {
			const file = new File([url], `downloaded_file.${fileType}`, { type: `application/${fileType}` });
			const fileURL = URL.createObjectURL(file);
			window.open(fileURL);
		}
		uni.hideLoading();
		// #endif
	}
}

export function base64ToFile(base64Data, successCallback, errorCallback) {
	const base64Str = base64Data.replace(/^data:[a-z]+\/[a-z]+;base64,/, '');
	const arrayBuffer = base64ToArrayBuffer(base64Str);
	const filePath = `${wx.env.USER_DATA_PATH}/tempFile.png`;
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

export function saveToLocal(filePath : string, fileType : string) {

	const saveF = uni.getFileSystemManager()
	saveF.saveFile({
		tempFilePath: filePath,
		success: (res) => {
			uni.openDocument({
				filePath: res.savedFilePath,
				fileType: fileType,
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