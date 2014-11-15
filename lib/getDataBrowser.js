/*
*	package.json reqwrites to this from getData.js for Browserify
*/

"use strict";


module.exports = function requestJson(requestUrl, fnCallback) {
	requestClient(requestUrl, fnCallback);
};


function requestClient(requestUrl, fnCallback) {
	if (!window || !window.jQuery) {
		throw ('gw2api requires jQuery when used in the browser');
	}
	window.jQuery.getJSON(requestUrl)
		.done(function(data, textStatus, jqXHR) {
			fnCallback(null, data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			fnCallback({
				jqXHR: jqXHR,
				textStatus: textStatus,
				errorThrown: errorThrown
			});
		});
}
