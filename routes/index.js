"use strict";

const DB = require('../lib/data');


module.exports = function(app, express) {
	var routes = this;

	if (process.env.NODE_ENV === 'development') {
		app.get('/stressTest', require('./stressTest.js'));
	}


	app.get('/', require('./home.js'));


	// /0D8B74FC-F940-4314-8EAF-8F8C52C4C4EB
	app.get('/:guildId([A-Z0-9-]{36}).:size([0-9]+)?.:extension(svg)?', require('./shortlink.js'));
	app.get('/:guildId([A-Z0-9-]{36}).:size([0-9]+)?.:bgColor([a-z0-9]+)?.:extension(svg)?', require('./shortlink.js'));


	app.get('/guilds/:guildSlug/:size([0-9]+).:bgColor([a-z0-9]+)?.svg', require('./emblem.js'));
	app.get('/guilds/:guildSlug.svg', function(req, res) {
		res.redirect(301, `/guilds/${req.params.guildSlug}/256.svg`);
	});
	// app.get('/guilds/:guildSlug/:size([0-9]+).svg', require('./emblem.js'));

	app.get('/guilds/:guildSlug', require('./guild.js'));


	app.get('/robots.txt', require('./robots.js'));
	app.get('/sitemap.xml', require('./sitemap.js'));

	app.get('/dump', function(req, res) {
		res.json(DB.guilds.index.toJS());
	});

	return routes;
};
