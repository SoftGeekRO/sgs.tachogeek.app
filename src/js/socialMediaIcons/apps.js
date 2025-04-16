import { isUndefined, } from "lodash-es";

import { AppConfig } from "../sgs/apps/config";


let gomag = isUndefined($.Gomag) ? null : $.Gomag,
	icons_list = [
		{ icon: 'fa fa-github', url: 'https://github.com/SoftGeekRO', target: '_blank' }
	];

class SocialMediaIcons extends AppConfig {

	constructor() {
		super("SocialMediaIcons");
	}

	ready() {
		let social_block = $("#wrapper .bottom-section .container-h .col.social ul"),
			media_icon_str = "";

		icons_list.forEach((val) => {
			media_icon_str += `<li><a href="${val.url}" rel="noopener nofollow" target="${val.target}"><i class="${val.icon}"></i></a></li>`;
		});
		social_block.append($(media_icon_str));
	}
}

export default SocialMediaIcons;
