'use strict';

/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	slugify(str) {
		return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
	},
	deslugify(str) {
		return decodeURIComponent(str).replace(/-/g, ' ');
	},
};