/**
 * 将 Base64 字符串转换为 File 对象
 * @param {string} base64String - Base64 编码的字符串
 * @param {string} fileName - 文件名
 * @returns {File} - 转换后的 File 对象
 */
export function base64ToFile(base64String, fileName) {
	// 检查 Base64 字符串是否包含 MIME 类型前缀
	const [header, data] = base64String.split(',');

	// 提取 MIME 类型
	const mimeType = header.match(/data:(.*);base64/)[1];

	// 解码 Base64 字符串为二进制字符串
	const byteCharacters = atob(data);
	const byteArrays = [];

	// 将二进制字符串转换为字节数组
	for (let offset = 0; offset < byteCharacters.length; offset += 512) {
		const slice = byteCharacters.slice(offset, offset + 512);
		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	// 创建 Blob 对象
	const blob = new Blob(byteArrays, { type: mimeType });

	// 创建 File 对象
	return new File([blob], fileName, { type: mimeType });
}