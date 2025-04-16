import Handlebars from "handlebars/dist/handlebars.min";
import { Fancybox } from "@fancyapps/ui";

import catalogs_hbs from "html-loader!./template/catalogs.hbs";
import brands_hbs from "html-loader!./template/brands.hbs";
import { AppConfig } from "../sgs/apps/config";


const catalogs_api_url = 'https://envy.softgeek.ro/catalogs.json';
const brands_api_url = 'https://envy.softgeek.ro/brands.json';

class Catalogs_and_Brands extends AppConfig {

	#catalogs_brands_hub = $("#sgs-catalogs-and-brands-hub");
	#brands_hub = $("#sgs-brands-hub");

	constructor() {
		super("Catalogs_and_Brands");

		let _functions = Object.getOwnPropertyNames(
			Object.getPrototypeOf(this)).filter(
			(name) => name !== "constructor" && typeof this[name] === "function"
		);

		_functions.forEach((val, ndx) => {
			if (val.startsWith("helper_") || val.startsWith("partial_")) {
				this[val]();
			}
		});

	}

	ready() {
		this.render();
	}

	render() {
		let self = this;

		if (this.#catalogs_brands_hub.length === 1) {
			this.fetchData(catalogs_api_url).then((result) => {
				self.render_catalongs(result);
			});
		}

		if (this.#brands_hub.length === 1) {

			this.fetchData(brands_api_url).then((result) => {
				self.render_brands(result);
			});
		}
	}

	render_brands(result) {
		let template = Handlebars.compile(brands_hbs),
			rendered = template(result);
		this.#brands_hub.html(rendered);
		$('.brands-spinner').hide();
		this.#brands_hub.show();
	}

	render_catalongs(result) {
		let template = Handlebars.compile(catalogs_hbs),
			rendered = template(result);
		this.#catalogs_brands_hub.html(rendered);
		$('.catalog-spinner').hide();
		this.#catalogs_brands_hub.css('visibility', 'visible');
	}

	async fetchData(url) {
		try {
			const response = await fetch(url, {
				headers: {
					"Content-Type": "application/json",
				}
			});

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			return await response.json();

		} catch (err) {
			console.error(err.message);
		}
	}

}

export default Catalogs_and_Brands;
