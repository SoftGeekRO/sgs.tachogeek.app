'use strict';

class Http {
	constructor() {
		this.query = new URLSearchParams(window.location.search);
	}

	get debug() {
		if (this.query.has("_")) {
			return this.query.get("_").toLowerCase() === "true";
		}
		return false;
	}
}

export { Http };
