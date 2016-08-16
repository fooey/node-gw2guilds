'use strict';

// const _ = require('lodash');
const DB = require('lib/data');


export let sitemap = (req, res) => {
    const section = req.params.section;

    return DB.guilds.dbGetAll()
        .filter(g => g.guild_id[0] === section)
        // .then(guilds => filterResults(guilds))
        // .then(guilds => guilds.slice(0, 50))
        .then(guilds => guilds.map(guild => getNode(guild)))
        .then(nodes => res.type('xml').send(getXml(nodes)));


    function getNode(guild) {
        return `<url><loc>${getGuildUrl(guild)}</loc><lastmod>${getLastMod(guild)}</lastmod>${getImageElement(guild)}</url>`;
    }

    function getXml(nodes) {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                ${nodes.join('\n')}
            </urlset>`;
    }


    function getGuildUrl(guild) {
        return `http://guilds.gw2w2w.com/guilds/${guild.slug}`;
    }

    function getLastMod(guild) {
        return new Date(guild.modified_date * 1000).toISOString();
    }

    function getImageElement(guild) {
        return (guild.emblem.background_id)
            ? `<image:image>
                <image:loc>${getGuildUrl(guild)}.svg</image:loc>
                <image:title>${guild.guild_name}</image:title>
                <image:caption>GuildWars2 Emblem of ${guild.guild_name}</image:caption>
            </image:image>`
            : ``;
    }
};

export let index = (req, res) => {
    return res.type('xml').send(`<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${'0123456789abcdef'.split('').map(section => (`
                <sitemap><loc>http://guilds.gw2w2w.com/sitemap/${section}.xml</loc></sitemap>
            `))}
        </sitemapindex>`
   );
};
