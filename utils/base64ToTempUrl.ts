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

export function base64ToTempUrl(base64DataUrl) {
	// Extract the Base64 data part
	const [header, base64] = base64DataUrl.split(',');
	const mime = header.split(':')[1].split(';')[0];
	const blob = base64ToBlob(base64, mime);
	return URL.createObjectURL(blob);
}