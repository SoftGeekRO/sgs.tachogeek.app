'use strict';

import { AppConfig } from "../sgs/apps/config";
import productInfo from "../sgs/utils/product";

import { isUndefined, isEmpty } from "lodash-es";

let gomag = isUndefined($.Gomag) ? null : $.Gomag;
class DisplayEAN extends AppConfig {
	constructor() {
		super("DisplayEAN");
		this.product_info = productInfo();
	}

	render() {
		const code_ean_obj_parrent = $("<span />").attr("class", "code code-ean"),
			code_ean_prefix_obj = $("<span/>")
				.attr("class", "-g-product-details-code-prefix")
				.html("Cod EAN: "),
			code_ean_obj = $("<strong/>"),
			elm_product_code = $(".product-code.dataProductId");

		if (this.product_info.product_EAN !== this.product_info.product_SKU) {
			code_ean_obj.html(this.product_info.product_EAN);
			code_ean_obj_parrent.append(code_ean_prefix_obj).append(code_ean_obj);
		}
		code_ean_obj_parrent.insertAfter(".product-code span.code");
	}

	ready() {
		let self = this;

		if (gomag !== null && !isUndefined(gomag.bind)) {
			gomag.bind("User/Ajax/Data/Loaded", function (event, data) {
				if (!isEmpty($(".product-code span.code"))) {
					self.render();
				}
			});
		}
	}
}

export default DisplayEAN;
