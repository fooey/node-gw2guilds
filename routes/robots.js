'use strict';



module.exports = function(req, res) {
    // const renderStart = Date.now()

    // res.header('content-type', 'text/plain');
    res.type('text').send([
        '#' + req.headers.host,
        '',
        // 'User-agent: *',
        // 'Disallow: *.svg$',
        // '',
        'Sitemap: http://guilds.gw2w2w.com/sitemap.xml',
        'Sitemap: http://guilds.gw2w2w.com/sitemap-svg.xml',
    ].join('\n'));
};
