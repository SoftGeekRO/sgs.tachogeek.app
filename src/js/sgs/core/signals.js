'use strict';

import { Signal } from "../dispatch/dispatcher";

let request_finished = new Signal(),
	load_signal = new Signal();

export { request_finished, load_signal };
