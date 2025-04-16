import { AppConfig } from "../sgs/apps/config";

import { isUndefined, isNull, isEmpty } from "lodash-es";

let gomag = isUndefined($.Gomag) ? null : $.Gomag;
class Tweaks extends AppConfig {
	constructor() {
		super("Tweaks");
	}

	render() {
		$(window).on("load", function () {
			let nav = $(".main-header");

			if (isEmpty(nav)) {
				return;
			}
			let pos = nav.height(),
				posDelay = nav.height() * 2,
				prevScroll = 0;

			/* Fix the shutter glitch on scroll frm the top */
			$(window).scroll(function () {
				let fix = $(this).scrollTop() > posDelay;

				if (fix) {
					if ($(this).scrollTop() > prevScroll) {
						nav.removeClass("fix-nav fade-menu active-menu animate-menu");
					} else {
						nav.removeClass("fix-nav fade-menu active-menu animate-menu");
					}
					$("body").css("margin-top", 0);
					nav.removeClass("fade-menu active-menu animate-menu");
				}

				prevScroll = $(this).scrollTop();
			});
		});
	}

	ready() {
		let self = this;

		if (isNull(gomag)) {
			return;
		}

		self.render();

		gomag.bind("Widget/Add/After", function () {
			// butcher the main menu and remove fix nav animation
			$(".main-header").removeClass(
				"fix-nav fade-menu active-menu animate-menu",
			);
		});
	}
}

export default Tweaks;
