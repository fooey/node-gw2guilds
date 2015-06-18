'use strict';



module.exports = function(req, res) {
    // const renderStart = Date.now()

    res.header('content-type', 'text/plain');
    res.end([
        '#' + req.headers.host,
        '',
        'User-agent: *',
        'Disallow: *.svg$',
        '',
        'Sitemap: http://' + req.headers.host + '/sitemap.xml',
    ].join('\n'));
};