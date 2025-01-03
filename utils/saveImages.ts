import { base64ToTempUrl } from "./base64ToTempUrl";
import { isBase64 } from "./isBase64";

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

		// #ifdef MP-WEIXIN || APP
		// 判断当前url是否是base64格式 
		if (isBase64(url)) {
			const tempFilePath = base64ToTempUrl(url)
			uni.saveImageToPhotosAlbum({
				filePath: tempFilePath,
				success: (res) => {
					resolve(res);
					uni.$u.toast('已保存！');
				},
				fail: (err) => {
					reject(err);
					uni.$u.toast('保存失败！');
				}
			});
		}
		else {
			uni.downloadFile({
				url: url,
				success: (downloadRes) => {
					if (downloadRes.statusCode === 200) {
						// 下载成功，保存到相册
						uni.saveImageToPhotosAlbum({
							filePath: downloadRes.tempFilePath,
							success: (res) => {
								resolve(res);
								uni.$u.toast('已保存！');
							},
							fail: (err) => {
								reject(err);
								uni.$u.toast('保存失败！');
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

		}
		// #endif
	});
}