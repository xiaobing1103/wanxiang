/**
 * 生成一个用不重复的ID
 */
export /**
 * 生成一个用不重复的ID
 */
	function GenNonDuplicateID(n : number) {
	return Math.random().toString(36).substr(2, n) + Date.now().toString(36).substr(4, n);
}
//GenNonDuplicateID()将生成 rfmipbs8ag0kgkcogc 类似的ID


export function generateUUID() {
	let d = new Date().getTime()
	if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
		d += performance.now() // use high-precision timer if available
	}
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (d + Math.random() * 16) % 16 | 0
		d = Math.floor(d / 16)
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
	})
	return uuid
}