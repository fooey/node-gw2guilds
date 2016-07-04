'use strict';

// const qs = require('querystring');

const guilds = require('lib/guilds');

module.exports = function(req, res) {
    const renderStart = Date.now();
    const slug = req.params.guildSlug;

    // console.log('Routes::guild', req.params);


    return guilds.getBySlug(slug)
        .then((guild) => {
            if (!guild.guild_id) {
                throw({ type: 'NotFound' })
            }

            const canonicalUrl = '/guilds/' + guild.slug;
            const currentUrl = req.url;

            // console.log('canonical', canonical);
            // console.log('req.url', req.url);
            // console.log('decodeURI', decodeURI(req.url));
            // console.log('eq', req.url === canonical);
            // console.log('eq decodeURI', decodeURI(req.url) === decodeURI(canonical));

            if (currentUrl !== canonicalUrl && decodeURI(currentUrl) !== decodeURI(canonicalUrl)) {
                throw({ type: 'NotCanonical', canonicalUrl })
            }

            return res.render('guild', {
                renderStart: renderStart,
                searchBar: true,

                title: guild.guild_name + ' [' + guild.tag + ']',
                guild,
            });
        })
        .catch((err) => {
            // console.log(err.message, err.type, err);

            if (err.type && err.type === 'NotCanonical') {
                return res.redirect(301, err.canonicalUrl);
            }
            else if (err.type && err.type === 'NotFound') {
                return res.status(404).send('Guild not found');
            }
            else if (err.response && err.error && err.statusCode === 400) {
                return res.status(404).send(err.error);
            }
            else {
                return res.send(err);
            }
        })

};
