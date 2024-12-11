export function downloadBase64Image(base64Data, filename) {
	const link = document.createElement('a');
	link.href = base64Data;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
