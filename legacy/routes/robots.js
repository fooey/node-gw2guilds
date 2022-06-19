
module.exports = (req, res) => {
    return res.type('text').send(`
#${req.headers.host}
Sitemap: http://guilds.gw2w2w.com/sitemap.xml

User-agent: BLEXBot
Disallow: /
    `);
};
