'use strict';

class EventResponse {
	results = [];

	getOk() {
		return this.results;
	}
	delay() {
		let index = this.results.length - 1;
		this.results[index] = 0;
		return index;
	}
	complete(i) {
		let index = i !== undefined ? i : this.results.length;
		this.results[index] = 1;
		return index;
	}
	checkComplete() {
		return this.results.indexOf(0);
	}
}
class Signal {
	constructor() {
		this.receivers = {};
	}

	bind(event, callback, key) {
		let callbackName = "";
		this.receivers[event] =
			this.receivers[event] !== undefined ? this.receivers[event] : {};
		if (callback.name) {
			callbackName = callback.name;
		} else if (key !== undefined && key !== "") {
			callbackName = key;
		} else {
			callbackName = Object.keys(this.receivers[event]).length + 1;
		}
		this.receivers[event][callbackName] = callback;
	}

	trigger(event, data, callbackEvent, key) {
		if (this.receivers[event] !== undefined) {
			const eventResponseTrigger = new EventResponse();
			$.each(this.receivers[event], function (i, callback) {
				if ((key !== undefined && i === key) || key === undefined || !key) {
					eventResponseTrigger.complete();
					callback(eventResponseTrigger, data);
				}
			});
			const eventResponseCheck = setInterval(function () {
				if (eventResponseTrigger.checkComplete() === -1) {
					clearInterval(eventResponseCheck);
					clearTimeout(eventResponseCheck);
					if (callbackEvent !== undefined && false !== callbackEvent) {
						callbackEvent();
					}
				}
			}, 300);
		} else {
			if (callbackEvent !== undefined && false !== callbackEvent) {
				callbackEvent();
			}
		}
	}
}

export { Signal };
