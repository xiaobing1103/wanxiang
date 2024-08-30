function weChatTempPathToBase64(tempFilePath : string) {
	return new Promise((resolve, reject) => {
		// 使用微信小程序的 API 读取文件
		wx.getFileSystemManager().readFile({
			filePath: tempFilePath,
			encoding: 'base64',
			success: (res) => {
				// 获取文件类型
				wx.getFileInfo({
					filePath: tempFilePath,
					success: (info) => {
						const mimeType = info.mimeType;
						// 构造 Base64 数据 URL
						const base64DataUrl = `data:${mimeType};base64,${res.data}`;
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

export default weChatTempPathToBase64;