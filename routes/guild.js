'use strict';

// const qs = require('querystring');

const guilds = require('lib/guilds');

module.exports = function(req, res) {
    const renderStart = Date.now();
    const slug = req.params.guildSlug;

    // console.log('Routes::guild', req.params);


    return guilds.getBySlug(slug)
        .then(guild => {
            if (guild && guild.guild_name) {
                const canonical = '/guilds/' + guild.slug;

                // console.log('canonical', canonical);
                // console.log('req.url', req.url);
                // console.log('decodeURI', decodeURI(req.url));
                // console.log('eq', req.url === canonical);
                // console.log('eq decodeURI', decodeURI(req.url) === decodeURI(canonical));

                if (req.url !== canonical && decodeURI(req.url) !== decodeURI(canonical)) {
                    return res.redirect(301, canonical);
                }
                else {
                    return res.render('guild', {
                        renderStart: renderStart,
                        searchBar: true,

                        title: guild.guild_name + ' [' + guild.tag + ']',
                        guild,
                    });
                }
            }
            else {
                return res.status(404).send('Guild not found');
            }
        });

};
