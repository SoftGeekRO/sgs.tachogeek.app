'use strict';

function get_url_parts(str) {
	const url = new URL(str),
		[...parts] = url.pathname.split("/"),
		fileName = parts.pop(),
		[...segments] = fileName.split("."),
		fileExtension = segments.pop(),
		fileNameWithoutExtension = segments.join(".");

	return {
		hostname: url.origin,
		filename: fileName,
		file_ext: fileExtension,
		url: str,
	};
}

export { get_url_parts };
