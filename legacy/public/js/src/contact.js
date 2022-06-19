'use strict';

module.exports = function nospam(selector) {
    const addr = getAddr();

    $(selector).each(function(i, el) {
        let $el = $(el);

        $el.replaceWith($('<a>', {
            href: 'mailto:' + addr,
            html: addr,
        }));
    });
};

function getAddr() {
    const src = '@ gw2w2w schtuph com .'.split(' ');
    const addr = [src[1], src[0], src[2], src[4], src[3]].join('');

    return addr;
}