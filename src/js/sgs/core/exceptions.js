'use strict';

class InvalidImportError extends Error {
	constructor(message, field) {
		super(message);
		this.name = "InvalidImportError";
	}
}

class ImproperlyConfigured extends Error {
	constructor(message) {
		super(message);
	}
}

export { InvalidImportError, ImproperlyConfigured };
