'use strict';

const global_settings = {
	COMPANY_NAME: "<SET COMPANY NAME>",
	BRANCH_NAME: "<SET BRANCH NAME>",
	STORE_NAME: "<SET STORE NAME>",
	AUTHOR_NAME: "<UNKNOWN AUTHOR>",

	PUBLIC_PATH: "",

	BASE_URL: "",

	CDN_BASE: "",

	get STICKY_TEMPLATE_URL() {
		return "";
	},

	get BRANDS_URL() {
		return "";
	},

	get MEDIA_URL() {
		return "/media/";
	},

	get STATIC_URL() {
		return "/static/";
	},

	INSTALLED_APPS: [],
};

export { global_settings };
