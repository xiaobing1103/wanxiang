
export function isValidURL(url : string) {
	const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-zA-Z\\d_]*)?$', 'i'); // fragment locator
	return !!pattern.test(url);
}