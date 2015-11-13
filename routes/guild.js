'use strict';

// const qs = require('querystring');

const guilds = require('lib/guilds');

module.exports = function(req, res) {
    const renderStart = Date.now();
    const slug = req.params.guildSlug;

    // console.log('Routes::guild', req.params);


    guilds.getBySlug(slug, function(err, data) {
        if (data && data.has('guild_name')) {
            const canonical = '/guilds/' + data.get('slug');

            // console.log('canonical', canonical);
            // console.log('req.url', req.url);
            // console.log('decodeURI', decodeURI(req.url));
            // console.log('eq', req.url === canonical);
            // console.log('eq decodeURI', decodeURI(req.url) === decodeURI(canonical));

            if (req.url !== canonical && decodeURI(req.url) !== decodeURI(canonical)) {
                res.redirect(301, canonical);
            }
            else {
                res.render('guild', {
                    renderStart: renderStart,
                    searchBar: true,

                    title: data.get('guild_name') + ' [' + data.get('tag') + ']',
                    guild: data.toJS(),
                });
            }
        }
        else {
            res.status(404).send('Guild not found');
        }
    });

};
