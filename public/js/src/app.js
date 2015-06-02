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




    (function nospam(selector) {
        var addr = getAddr();
        var newEl =
        console.log(selector, addr);

        $(selector).each(function(i, el) {
            var $el = $(el);
            console.log($el);

            $el.replaceWith($('<a>', {
                href: 'mailto:' + addr,
                html: addr
            }));
        });
    }('.contact'));

    function getAddr() {
        var src = '@ gw2w2w schtuph com .'.split(' ');
        var addr = [src[1], src[0], src[2], src[4], src[3]].join('');

        return addr;
    }

});
