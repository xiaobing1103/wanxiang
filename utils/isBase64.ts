export function isBase64(str) {
	if (typeof str !== 'string') {
		return false;
	}

	// 去掉可能的前缀部分，例如 data:image/png;base64,
	const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/;
	if (base64Pattern.test(str)) {
		str = str.replace(base64Pattern, '');
	}

	// Base64 字符串的长度应该是 4 的倍数
	if (str.length % 4 !== 0) {
		return false;
	}

	// 检查是否符合 Base64 格式的正则表达式
	const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

	return base64Regex.test(str);
}