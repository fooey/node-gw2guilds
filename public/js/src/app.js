'use strict';

$(function() {

    let $searchForm = $('form.guildSearch');
    if ($searchForm && $searchForm.length) {
        require('./search.js')($searchForm);
    }


    let $linkBuilder = $('#linkBuilder');
    if ($linkBuilder && $linkBuilder.length) {
        require('./linkBuilder.js')($linkBuilder);
    }

    require('./contact.js')('.contact');




});
