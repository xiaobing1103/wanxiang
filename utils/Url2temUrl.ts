
export const Url2temUrl = (url : string) => {
	const promise = new Promise((resolve, reject) => {
		uni.downloadFile({
			url: url,
			success: function (res) {
				if (res.statusCode === 200) {
					// uni.setStorageSync('tempFilePath', res.tempFilePath);
					resolve(res.tempFilePath)
				}
			},
			fail: (err) => {
				reject(err)
				uni.$u.toast('下载失败！' + err)
			}
		});
	})
	return promise
}