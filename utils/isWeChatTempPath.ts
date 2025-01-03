/**
 * 判断一个路径是否是微信的临时路径
 * @param {string} filePath - 要检查的路径
 * @returns {boolean} - 如果是微信临时路径返回 true，否则返回 false
 */
export function isWeChatTempPath(filePath : string) {
	// 检查是否以微信的标准临时路径前缀开头
	if (filePath.startsWith('wxfile://')) {
		return true;
	}

	// 检查是否以 'tmp/' 开头
	if (filePath.startsWith('tmp/')) {
		return true;
	}
	if (filePath.startsWith('file:///')) {
		return true;
	}
	if (filePath.startsWith('_doc/uniapp_temp_')) {
		return true;
	}
	// 检查是否以 'http://tmp/' 开头（处理可能的特殊情况）
	if (filePath.startsWith('http://tmp/')) {
		return true;
	}

	return false;
}