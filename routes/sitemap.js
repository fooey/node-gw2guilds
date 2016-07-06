'use strict';

// const _ = require('lodash');
const DB = require('lib/data');


module.exports = function(req, res) {
    const svgMode = (req.originalUrl === '/sitemap-svg.xml');

    return DB.guilds.dbGetAll()
        .then(guilds => filterResults(guilds))
        // .then(guilds => guilds.slice(0, 50))
        .then(guilds => guilds.map(guild => getNode(guild)))
        .then(nodes => res.type('xml').send(getXml(nodes)));




    function filterResults(guilds) {
        return (!svgMode)
            ? guilds
            : guilds.filter(g => g.emblem.background_id);
    }


    function getNode(guild) {
        return `<url><loc>${getLoc(guild)}</loc><lastmod>${getLastMod(guild)}</lastmod></url>`;
    }

    function getXml(nodes) {
        return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${nodes.join('\n')}</urlset>`;
    }


    function getLoc(guild) {
        return `http://guilds.gw2w2w.com/guilds/${guild.slug}${svgMode ? '.svg' : ''}`;
    }

    function getLastMod(guild) {
        return new Date(guild.modified_date * 1000).toISOString()
    }
};
