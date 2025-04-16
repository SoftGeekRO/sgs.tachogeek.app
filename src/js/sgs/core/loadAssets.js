'use strict';

import '@/libs/globals';

import { BaseApp } from "./baseApp";
class LoadAssets extends BaseApp {
	check_manifest() {
		return $('link[rel="manifest"]').length > 0;
	}
	loadManifest(hostname) {
		if (this.check_manifest()) {
			return;
		}
		let f_parts = this.get_url_parts(hostname);

		this.loadPreconnect(f_parts.hostname);
		this.loadDnsPrefetch(f_parts.hostname);

		const manifest_elm = document.createElement("link");

		manifest_elm.rel = "manifest";
		manifest_elm.href = `${hostname}${this.no_cache}`;
		manifest_elm.crossOrigin = "use-credentials";

		$(manifest_elm).insertBefore('link[rel="preconnect"]:first');
	}

	loadCSS() {}

	loadJS() {}

	loadFont() {}
}

export { LoadAssets };
