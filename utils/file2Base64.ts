const fileToBase64 = (file, callback) => {
	const reader = new FileReader();
	reader.onloadend = function () {
		const base64String = reader.result.split(',')[1];
		callback(base64String);
	};
	reader.readAsDataURL(file);
}

export {
	fileToBase64,
	wxBase64
}


const wxBase64 = ({ url, type }) => {
	return new Promise((resolve, reject) => {
		wx.getFileSystemManager().readFile({
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