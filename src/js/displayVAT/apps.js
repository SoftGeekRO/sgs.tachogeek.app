'use strict';

import { isUndefined } from "lodash-es";

import { AppConfig } from "../sgs/apps/config";

const currenty_fmt = new Intl.NumberFormat("ro-RO", {
	style: "currency",
	currency: "RON",
	//maximumFractionDigits: 2,
});

let gomag = isUndefined($.Gomag) ? null : $.Gomag;

class DisplayVAT extends AppConfig {
	product_id = null;
	constructor() {
		super("DisplayVAT");
		// Get the product ID of the current device from the Gomag framework

		if (gomag !== null && !isUndefined(gomag.environment.Product)) {
			this.product_id = gomag.environment.Product;
		}
	}

	render() {
		const price_without_vat = $("<span/>")
				.addClass(`-g-product-final-price-wihout-vat-${this.product_id}`)
				.attr("id", "fPrice_without_vat"),
			product_vat_value = $("<small/>")
				.addClass("-g-product-vat-value")
				.attr("id", "fPrice_vat"),
			detail_price = $("#wrapper #product-page span.detail-price"),
			all_spans = detail_price.children(".detail-price span");

		// get the values of the product
		let product_base_priceObj = detail_price
				.children("input#productFinalPrice")
				.val(),
			productBasePrice = parseFloat(product_base_priceObj),
			product_vatObj = detail_price.children("input#productVat").val(),
			productVAT = parseFloat(product_vatObj),
			productCurrentyObj = detail_price.children("input#productCurrency").val(),
			productPriceWithoutVAT = productBasePrice / (productVAT / 100 + 1);

		product_vat_value.append(`(${productVAT}%)`);
		price_without_vat
			.append(
				`${currenty_fmt
					.format(productPriceWithoutVAT)
					.replace(/[a-z]{3}/i, "")
					.trim()} ${productCurrentyObj} + TVA`,
			)
			.append(product_vat_value);
		// @todo: check what is the reason that the element is duplicated
		// @fix: remove the element before any append
		$("span[class*='-g-product-final-price-wihout-vat-']").remove();

		return price_without_vat;
	}

	ready() {
		let self = this;
		if (gomag !== null && !isUndefined(gomag.bind)) {
			gomag.bind("User/Ajax/Data/Loaded", function (event, data) {
				// check if the product ID is present, if so, then the view is product details
				if (self.product_id) {
					let price_whitout_vat = self.render();
					if ($("span.-g-product-details-um")) {
						price_whitout_vat.insertAfter("span.-g-product-details-um");
					} else {
						price_whitout_vat.insertAfter("span.fPrice");
					}
				}
			});
		}
	}
}

export default DisplayVAT;
