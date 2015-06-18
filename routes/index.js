'use strict';


module.exports = function(app /*, express*/) {
    let routes = this;

    if (process.env.NODE_ENV === 'development') {
        app.get('/stressTest', require('routes/stressTest.js'));
    }


    app.get('/', require('routes/home.js'));


    // /0D8B74FC-F940-4314-8EAF-8F8C52C4C4EB
    app.get('/:guildId([A-Z0-9-]{36}).:size([0-9]+)?.:extension(svg)?', require('routes/shortlink.js'));
    app.get('/:guildId([A-Z0-9-]{36}).:size([0-9]+)?.:bgColor([a-z0-9]+)?.:extension(svg)?', require('routes/shortlink.js'));


    app.get('/guilds/:guildSlug/:size([0-9]+).:bgColor([a-z0-9]+)?.svg', require('routes/emblem.js'));
    app.get('/guilds/:guildSlug.svg', function(req, res) {
        console.log('NoSize', req.params);
        res.redirect(301, `/guilds/${req.params.guildSlug}/256.svg`);
    });
    // app.get('/guilds/:guildSlug/:size([0-9]+).svg', require('routes/emblem.js'));

    app.get('/guilds/:guildSlug', require('routes/guild.js'));


    app.get('/robots.txt', require('routes/robots.js'));
    app.get('/sitemap.xml', require('routes/sitemap.js'));

    app.get('/dump', function(req, res) {
        res.sendFile('routes/data/guilds/guilds-index.json', {
            root: process.cwd(),
        });
    });

    return routes;
};
