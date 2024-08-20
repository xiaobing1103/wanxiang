export async function saveImage(url, filename = '签名') {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		resolve({
			errMsg: 'saveImageH5:ok'
		});
		// #endif
		
		// #ifdef MP-WEIXIN
		uni.downloadFile({
			url: url,
			success: (downloadRes) => {
				if (downloadRes.statusCode === 200) {
					// 下载成功，保存到相册
					uni.saveImageToPhotosAlbum({
						filePath: downloadRes.tempFilePath,
						success: (res) => {
							resolve(res);
						},
						fail: (err) => {
							reject(err);
						}
					});
				} else {
					reject(new Error('下载失败'));
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
		// #endif
	});
}