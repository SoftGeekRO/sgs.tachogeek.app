import { AppConfig } from "../sgs/apps/config";
import Handlebars from "handlebars/dist/handlebars.min";

import { isUndefined, isEmpty, isNull } from "lodash-es";

import add_to_cart_hbs from "html-loader!./template/sticky_add_to_cart.hbs";

let gomag = isUndefined($.Gomag) ? null : $.Gomag;

const currenty_fmt = new Intl.NumberFormat("ro-RO", {
	style: "currency",
	currency: "RON",
	//maximumFractionDigits: 2,
});
class StickyAddToCart extends AppConfig {
	/* inspired by: https://www.e-datacomputer.ro
	 *
	 */

	wish_sec = $(".wish-section");
	pos = this.wish_sec.height();
	product_id = $(".container-h.product-top").data("product-id");

	constructor() {
		super("StickyAddToCart");

		if (!isNull(gomag)) {
			this.product_env = gomag.getEnviromentItem(this.product_id);
		}

		let _functions = Object.getOwnPropertyNames(
			Object.getPrototypeOf(this),
		).filter(
			(name) => name !== "constructor" && typeof this[name] === "function",
		);

		_functions.forEach((val, ndx) => {
			if (val.startsWith("helper_") || val.startsWith("partial_")) {
				this[val]();
			}
		});
	}

	build_data() {
		return {
			productId: this.product_env.id,
			productPicture: this.product_env.image,
			productName: this.product_env.name,
			productPrice: currenty_fmt
				.format(this.product_env.price)
				.replace(/[a-z]{3}/i, "")
				.trim(),
			productCurrenty: this.product_env.currency,
			productAddCartQuantity_class: gomag.config.addToCartQuantityH.slice(1),
			productAddToCart: gomag.config.detailsAddToCart.slice(2),
		};
	}

	render() {
		let template = Handlebars.compile(add_to_cart_hbs),
			rendered = template(this.build_data());

		this.wish_sec.after(rendered);
	}

	ready() {
		let self = this;

		if (isNull(gomag)) {
			return;
		}

		if (!isEmpty(this.wish_sec)) {
			this.render();
			$(window).scroll(function () {
				let fix = $(this).scrollTop() > self.wish_sec.offset().top,
					e = $(".sticky-add-to-cart-wrapper"),
					i = e.find(".sticky-add-to-cart");

				if (fix) {
					e.css({ height: 0 });
					i.addClass("sticky-add-to-cart--active");
					i.removeClass("sticky-add-to-cart--hide");
				} else {
					i.removeClass("sticky-add-to-cart--active");
					i.addClass("sticky-add-to-cart--hide");
					e.css({ height: "auto" });
				}
			});
		}
	}
}

export default StickyAddToCart;
