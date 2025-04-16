import { isUndefined, isNull } from "lodash-es";

import { AppConfig } from "../sgs/apps/config";

let gomag = isUndefined($.Gomag) ? null : $.Gomag;
class CodeToProductBox extends AppConfig {
	constructor() {
		super("CodeToProductBox");

		this.productBox = $(".product-box") || [];
	}

	render() {
		this.productBox.each(function (ndx, elm) {
			let pr_box = $(this),
				pr_env = gomag.getEnviromentItem(pr_box.data("product-id")),
				pr_sku_elm = $("<span>")
					.addClass("top-side-box-sku")
					.attr("data-sku", pr_env.sku)
					.html(pr_env.sku),
				old = $(`.top-side-box-sku[data-sku="${pr_env.sku}"]`);

			if (old) {
				old.remove();
			}
			pr_sku_elm.insertAfter(pr_box.find(".top-side-box h2"));
		});
	}

	ready() {
		let self = this;

		if (isNull(gomag)) {
			return;
		}

		self.render();

		gomag.bind("User/Ajax/Data/Loaded", (data) => {
			self.render();
		});

		// $(document).on("Gomag.ajaxContentLoaded", (data) => {
		// 	self.render();
		// });
	}
}

export default CodeToProductBox;
