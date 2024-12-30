
/* 返回不带请求头的BASE64 */
const fileToBase64 = (file : File, callback : (base64 : string) => void, addHeader ?: boolean) => {
	const reader = new FileReader();
	reader.onloadend = function () {
		let base64String
		if (!addHeader) {
			base64String = reader.result.split(',')[1];
		} else {
			base64String = reader.result
		}
		callback(base64String);
	};
	reader.readAsDataURL(file);
}

export {
	fileToBase64,
	wxBase64,
	fileToBase64WithHeader
}

function fileToBase64WithHeader(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}


const wxBase64 = ({ url, type }) => {
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().readFile({
			filePath: url, //选择图片返回的相对路径
			encoding: 'base64', //编码格式
			success: res => {
				// resolve('data:image/' + type.toLocaleLowerCase() + ';base64,' + res.data)
				resolve(res.data)
			},
			fail: res => reject(res.errMsg)
		})
	})
}