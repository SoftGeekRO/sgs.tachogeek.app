'use strict';

import { global_settings } from './global_settings';
import { settings as _settings_app } from '../../settings';

const settings = $.extend({}, global_settings, _settings_app);
export { settings };
