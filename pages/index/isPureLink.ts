export function isPureLink(str : string) {
	const pureLinkRegex = /^https?:\/\/[^\s]+$/;
	const linkInContentRegex = /https?:\/\/[^\s]+/;
	if (pureLinkRegex.test(str)) {
		return true;
	} else if (linkInContentRegex.test(str)) {
		return false;
	} else {
		uni.$u.toast("这不是一个有效的链接！")

	}
}