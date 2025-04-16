'use strict';

import { InvalidImportError, ImproperlyConfigured } from "../core/exceptions";

class AppConfig {
	constructor(app_name) {
		this.app_name = app_name;

		if (this.app_name === undefined) {
			throw new ImproperlyConfigured(
				`Class ${this.constructor.name} is missing <app_name> attribute in constructor`,
			);
		}

		if (!("label" in Object.keys(this))) {
			this.label = this.app_name;
		}
	}

  static create(entry) {
    let app_config_class = null;
    let app_module = null;

    try {
      app_module = require(`../../${entry}/apps`);
    } catch (error) {
      console.error(error);
      throw new InvalidImportError(error.message);
    }

    if (!(app_module.default.prototype instanceof this)) {
      throw ImproperlyConfigured(`${entry} is not a instance of AppConfig`);
    }

    app_config_class = new app_module.default();

    return app_config_class;
  }

	ready() {
		// Override this method in subclasses to run code when SGS famework starts.
	}
}

export { AppConfig };
