'use strict';

$(function() {

	var $searchForm = $('form.guildSearch');
	if ($searchForm && $searchForm.length) {
		require('./search.js')($searchForm);
	}


	var $linkBuilder = $('#linkBuilder');
	if ($linkBuilder && $linkBuilder.length) {
		require('./linkBuilder.js')($linkBuilder);
	}

});
