function base64ToBlob(base64, mime) {
	const sliceSize = 512;
	const byteCharacters = atob(base64);
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

	return new Blob(byteArrays, { type: mime });
}

export function base64ToTempUrl(base64DataUrl, success ?: (filePath : string) => void, fail ?: () => void) {

	// #ifdef APP
	let userDataPath = '';
	const fs = uni.getFileSystemManager();
	const fileName = 'temp_image_' + Date.now() + '.png';
	// const filePath = uni.env.USER_DATA_PATH + '/' + fileName

	const res = plus.io.convertLocalFileSystemURL('_doc/');
	userDataPath = res.nativePath;

	const filePath = userDataPath + '/' + fileName;
	const buffer = uni.base64ToArrayBuffer(base64DataUrl);
	fs.writeFile({
		filePath,
		data: buffer,
		encoding: 'binary',
		success() {
			success && success(filePath)
		},
		fail() {
			fail && fail()
		}
	})
	// #endif
	// #ifndef APP
	const [header, base64] = base64DataUrl.split(',');
	const mime = header.split(':')[1].split(';')[0];
	const blob = base64ToBlob(base64, mime);
	return URL.createObjectURL(blob);
	// #endif

}
export function base64ToTempUrl2(base64DataUrl : string, success ?: (filePath : string) => void, fail ?: () => void) {
	// #ifdef APP-PLUS
	try {
		// 创建Bitmap对象
		const bitmap = new plus.nativeObj.Bitmap();

		// 加载base64数据
		bitmap.loadBase64Data(base64DataUrl, () => {
			// 生成临时文件名
			const fileName = `_doc/temp_${Date.now()}.png`;

			// 保存为图片文件
			bitmap.save(fileName, {}, () => {
				// 获取本地文件系统URL
				const localUrl = plus.io.convertLocalFileSystemURL(fileName);
				console.log('图片保存成功:', localUrl);

				// 清理Bitmap对象
				bitmap.clear();

				// 调用成功回调
				success && success(localUrl);
			}, (error) => {
				console.error('保存图片失败:', error);
				bitmap.clear();
				fail && fail();
			});
		}, (error) => {
			console.error('加载base64数据失败:', error);
			bitmap.clear();
			fail && fail();
		});
	} catch (error) {
		console.error('创建Bitmap失败:', error);
		fail && fail();
	}
	// #endif

	// #ifdef H5
	try {
		const [header, base64] = base64DataUrl.split(',');
		const mime = header.split(':')[1].split(';')[0];
		const blob = base64ToBlob2(base64, mime);
		return URL.createObjectURL(blob);
	} catch (error) {
		console.error('H5创建Blob失败:', error);
		return '';
	}
	// #endif
}

// H5环境下使用的辅助函数
function base64ToBlob2(base64 : string, mime : string) {
	const byteString = atob(base64);
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const uint8Array = new Uint8Array(arrayBuffer);

	for (let i = 0; i < byteString.length; i++) {
		uint8Array[i] = byteString.charCodeAt(i);
	}

	return new Blob([arrayBuffer], { type: mime });
}