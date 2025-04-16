'use strict';

import { get } from 'lodash-es';

function productInfo() {
	// get the product info and crate an object
	const ld_json = $('script[type="application/ld+json"]');
	let _p_info = null;

	$.each(ld_json, (ndx, elm) => {
		let sct = JSON.parse(elm.text);
		if (sct["@type"] === "Product") {
			_p_info = {
				product_brand: get(sct, "brand.name"),
				product_name: get(sct, "name"),
				product_description: get(sct, "description")
					.replace(/&(nbsp|amp|quot|lt|gt);/g, "")
					.replace(/icirc;/g, "i"),
				product_SKU: get(sct, "sku"),
				product_EAN: get(sct, "mpn"),
			};
		}
	});
	return _p_info;
}

export default productInfo;
