export function formatDate(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 月份从0开始
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, '0'); // 保证分钟是两位数

	return `${year}-${month}-${day} ${hours}:${minutes}`;
}