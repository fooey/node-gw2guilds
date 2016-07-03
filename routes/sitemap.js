'use strict';

// const _ = require('lodash');
const DB = require('lib/data');


module.exports = function(req, res) {
    // const renderStart = Date.now();


    return DB.guilds.dbGetAll()
        .then(guilds => guilds.map(guild => `
            <url>
                <loc>http://guilds.gw2w2w.com/guilds/${guild.slug}</loc>
                <lastmod>${getDateFormat(guild.modified_date)}</lastmod>
            </url>
            ${guild.emblem.background_id
                ? `<url>
                    <loc>http://guilds.gw2w2w.com/guilds/${guild.slug}/256.svg</loc>
                    <lastmod>${getDateFormat(guild.modified_date)}</lastmod>
                </url>`
                : ''
            }
        `))
        .then(nodes => res.type('xml').send(xml(nodes)));


    function xml(nodes) {
        return (
            `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${nodes.join('\n')}
            </urlset>`
        );
    }

    function getDateFormat(epochTime) {
        return new Date(epochTime * 1000).toISOString()
    }
};
