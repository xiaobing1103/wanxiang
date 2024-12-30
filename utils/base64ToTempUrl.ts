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