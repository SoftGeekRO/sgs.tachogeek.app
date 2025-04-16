"use strict";

const settings = {
	COMPANY_NAME: "SoftGeek",
	BRANCH_NAME: "TachoGeek ROMANIA",
	STORE_NAME: "TachoGeek",
	AUTHOR_NAME: "SoulRaven <SoftGeek Romania>",

	BASE_URL: "https://www.tachoheek.ro/",

	CDN_BASE_URL: "https://cdn.softgeek.ro/tachogeek/",

	get MEDIA_URL() {
		return `${this.CDN_BASE_URL}media/`;
	},

	get STATIC_URL() {
		return `${this.CDN_BASE_URL}static/`;
	},

	INSTALLED_APPS: [
		// "catalogs",
		// "brandsCarusel",
		"displayVAT",
		"displayEAN",
		// "currentyToggle",
		"updatePageMeta",
		// "categoryImageHeader",
		// "datasheetTabMockup",
		"stickyAddToCart",
		"codeToProductBox",
		"minimumOrder",
		"pwa",
		"tweaks",
		'bottomBlocks',
		'catalogs_and_brands'
	],
};

export { settings };
