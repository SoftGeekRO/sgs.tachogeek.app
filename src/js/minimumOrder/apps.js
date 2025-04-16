import { isUndefined } from "lodash-es";

import { AppConfig } from "../sgs/apps/config";

let gomag = isUndefined($.Gomag) ? null : $.Gomag;

function formatPriceFromString(price) {
	price = price.replace(/[^\d\.\,]+/g, '');
	// WHEN PRICE FORMAT 1.000,00
	if (/\.[^\,\.]+\,/g.test(price))
		price = price.replace(/\./g, '').replace(/\,/, '.');
	// WHEN PRICE FORMAT 1,000.00
	else if (/\,[^\,\.]+\./g.test(price))
		price = price.replace(/\,/g, '');
	// WHEN PRICE FORMAT 100,00 OR 100.00
	else
		price = price.replace(/\,/g, '.');

	return Number(price);
}

class MinimumOrder extends AppConfig {

	constructor() {
		super("MinimumOrder");
		self.minimumOrderValue = 100.00; // the value is in RON
		self.minimumText = `Esti foarte aproape de comanda minima de ${self.minimumOrderValue} RON.<br>Mai adauga cateava produse pentru a finaliza comanda ta`;
		self.endOrderURL = `${window.location.origin}/finalizeaza-comanda`;
		self.defaultCartURL = `${window.location.origin}/cos-de-cumparaturi`;
		self.defaultFinishShoppingURL = `${window.location.origin}/finalizeaza-comanda`;
		self.subtotal = 0;
	}

	render(data) {
		const minimumOrderText = `<span class="AddtoCart_messageBlock">${self.minimumText}</span>`,
			minimumOrderBody = `<div class="minimumOrderBlock" data-block="AddtoCartTopBefore">${minimumOrderText}</div>`,
			finishOrderBody = `<div id="SubmitButtonMessageBlock">${self.minimumText}</div>`;

		let _data = data.properties,
			subtotal = _data.cartSubtotal,
			endOrderTopBtn = $(".btn[data-block='AddtoCartTop']"),
			endOrderBottomBtn = $(".btn[data-block='AddtoCart']"),
			afterTitleCarousel = $("#shoppingcart .cart-title-holder .title-carousel"),
			afterUpdatecart = $("#shoppingcart #updateCart"),
			beforeCheckoutBtn = $("#checkoutform #doCheckout");

		if (parseInt(subtotal) < self.minimumOrderValue) {
			$(".minimumOrderBlock").remove();
			$("#SubmitButtonMessageBlock").remove();

			if (afterTitleCarousel) {
				$(minimumOrderBody).addClass("minimumOrder_top_center").insertAfter(afterTitleCarousel);
				endOrderTopBtn.addClass("disabled").attr("disabled");
			}

			if (afterUpdatecart) {
				$(minimumOrderBody).addClass("minimumOrder_bottom_right").insertAfter(afterUpdatecart);
				endOrderBottomBtn.addClass("disabled").attr("disabled");
			}

			if (beforeCheckoutBtn) {
				$(finishOrderBody).insertBefore(beforeCheckoutBtn);
				beforeCheckoutBtn.addClass("disabled").attr("disabled");
			}
		} else {
			if (endOrderTopBtn) {
				$(".minimumOrderBlock.minimumOrder_top_center").remove();
				endOrderTopBtn.removeClass("disabled").removeAttr("disabled");
			}

			if (endOrderBottomBtn) {
				$(".minimumOrderBlock.minimumOrder_bottom_right").remove();
				endOrderBottomBtn.removeClass("disabled").removeAttr("disabled");
			}

			if (beforeCheckoutBtn) {
				$("#SubmitButtonMessageBlock").remove();
				beforeCheckoutBtn.removeClass("disabled").removeAttr("disabled");
			}
		}
	}

	frontPageCart(subtotal) {
		if (parseFloat(formatPriceFromString(subtotal)) < parseFloat(self.minimumOrderValue)) {
			$(".cart-header-btn.cart ._cartShow .cart-button .fr._orderSend").attr('onclick', `window.location = '${self.defaultCartURL}'`);
		} else {
			$(".cart-header-btn.cart ._cartShow .cart-button .fr._orderSend").attr('onclick', `window.location = '${self.defaultFinishShoppingURL}'`);
		}
	}

	ready() {
		let self = this,
			updateCartUrl = `${window.location.origin}/cart-update`;
		if (gomag !== null && !isUndefined(gomag.bind)) {
			gomag.bind("Order/Summary/Complete", (response, data) => {
				self.render(data);
			});

			// update subtotal when adding products to cart
			gomag.bind("Product/Add/To/Cart/After", (eventResponse, properties) => {
				let data = JSON.parse(properties.data);
				self.subtotal = data.subtotal;
			});

			gomag.bind('User/Data/Response', (event, data) => {
				let cart = data.cart;
				if(!isUndefined(cart)) {
					self.subtotal = cart.subtotal;
				}
			});

			// update subtotal on remove products from cart
			$('#_cartSummary').on('updateCart', (event, cart) => {
				$.get(updateCartUrl, {
					cart
				}, function (data) {
					self.subtotal = data.subtotal;
				}, 'json');
			});

			let nIntervalID = null;
			$('.cart').mouseenter(() => {
				if (!nIntervalID) {
					nIntervalID = setInterval(() => {
						if ($("div._cartShow")) {
							self.frontPageCart(self.subtotal);
						}
					}, 1000);
				}
			}).mouseleave(() => {
				clearInterval(nIntervalID);
				nIntervalID = null;
			});
		}
	}
}

export default MinimumOrder;
