'use strict';

function sort_json(unordered) {
	return unordered.sort((a, b) => (a.name > b.name ? 1 : -1));
}

export { sort_json };
