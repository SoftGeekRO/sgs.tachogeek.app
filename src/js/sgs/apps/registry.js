"use strict";

import { AppConfig } from "./config";

class Apps {
	constructor(installed_apps = []) {
		// Mapping of labels to AppConfig instances for installed apps.
		this.app_configs = {};

		// Whether the registry is populated.
		this.apps_ready = this.ready = false;

		if (!("SGS" in window)) {
			window.SGS = {};
		}

		if (installed_apps != null) {
			this.populate(installed_apps);
		}
	}

	populate(installed_apps = []) {
		let app_config = {};

		if (this.ready) {
			return;
		}

		// Phase 1: initialize app and import modules
		installed_apps.forEach((entry) => {
			if (entry instanceof AppConfig) {
				app_config = entry;
			} else {
				app_config = AppConfig.create(entry);
			}
			this.app_configs[app_config.label] = app_config;
		});

		this.apps_ready = true;

		// Phase 2: run ready() methods of app configs.
		this.get_app_configs().forEach((app_config) => {
			app_config.ready();
		});

		Object.assign(window.SGS, { ...this.app_configs });

		this.ready = true;
	}

	get_app_configs() {
		return Object.values(this.app_configs);
	}
}

const apps = new Apps(null);

export default apps;
