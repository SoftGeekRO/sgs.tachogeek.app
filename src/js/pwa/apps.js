"use strict";


import { isEmpty } from 'lodash-es';

import { AppConfig } from "../sgs/apps/config";

import { settings } from "../sgs/config/settings";

class SGSPWA extends AppConfig {
	manifest = $('link[rel="manifest"]');
	constructor() {
		super("SGSPWA");
	}

	render() {
		let manifest_link = $("<link>").attr({
			rel: "manifest",
			//crossorigin: "use-credentials",
			href: `${settings.CDN_BASE_URL}app/assets/manifest.json`,
		});
		manifest_link.insertAfter("meta[charset='UTF-8']");
	}

	ready() {
		if (!isEmpty(this.manifest)) {
			return;
		}
		this.render();
	}
}

export default SGSPWA;
