
import { isUndefined } from "lodash-es";

import { AppConfig } from "../sgs/apps/config";

let gomag = isUndefined($.Gomag) ? null : $.Gomag,
	icons_list = [
		{
			icon: 'fa fa-github',
			url: 'https://github.com/SoftGeekRO',
			target: '_blank'
		}
	],
	distribution_block = [
		{
			title: '',
			img_alt: 'SG Distribution B2B',
			img_src: 'https://cdn.sgsolar.ro/softgeek.ro/logo/sg_distribution_logo_350x150.png',
			url: 'https://www.softgeek.ro',
			target: '_blank'
		}
	],
	links = [
		{
			url: 'https://www.tachogeek.ro/catalogs',
			icon: 'fa fa-github',
			title: 'Cataloage'
		},
		{
			url: 'https://www.tachogeek.ro/brands',
			icon: 'fa fa-github',
			title: 'Brands'
		},
		{
			url: 'https://www.tachogeek.ro/sg-solar-production',
			icon: 'fa fa-github',
			title: 'PV System'
		}
	];

class BottomBlocks extends AppConfig {

	constructor() {
		super("BottomBlocks");
		this.social_div = $(".bottom-section .holder .container-h .col.social");
	}

	ready() {
		this.renderSocialIcons();
		this.renderCatalogsBrandMenu();
		this.renderSGDistribution();
	}

	renderSocialIcons() {
		let social_block = $("#wrapper .bottom-section .container-h .col.social ul"),
			media_icon_str = "";

		icons_list.forEach((val) => {
			media_icon_str += `<li><a href="${val.url}" rel="noopener nofollow" target="${val.target}"><i class="${val.icon}"></i></a></li>`;
		});
		social_block.append($(media_icon_str));
	}

	renderCatalogsBrandMenu() {
		let content = "<p class='title'>Resurse</p>";

		links.forEach((elm) => {
			content += `<a href="${elm.url}" class="support-contact">${elm.title}</a>`;
		});

		$("<div>").html(content).insertAfter(this.social_div).addClass("col sgs-brands-catalogs");
	}

	renderSGDistribution() {
		const social_div = $(".bottom-section .holder .container-h .col.sgs-brands-catalogs");
		let distribution_content = "<p class='title'>Distributie B2B</p>";

		distribution_block.forEach((elm) => {
			distribution_content += `<a href="${elm.url}" target="${elm.target}"><img src="${elm.img_src}" alt="${elm.img_alt}" style="margin: auto"></a>`;
		});

		$("<div>").html(distribution_content).insertAfter(social_div).addClass("col sg-distribution");
	}

}

export default BottomBlocks;
