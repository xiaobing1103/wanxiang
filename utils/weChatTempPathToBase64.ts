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

export default weChatTempPathToBase64;