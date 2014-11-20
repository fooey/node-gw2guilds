"use strict";

const qs = require('querystring');

const guilds = require('../lib/guilds');

module.exports = function(req, res) {
	const renderStart = Date.now();
	const slug = req.params.guildSlug;


	guilds.getBySlug(slug, function(err, data) {
		if (data && data.guild_name) {
			const canonical = '/guilds/' + data.slug;

			if (req.url !== canonical) {
				res.redirect(301, canonical);
			}
			else {
				res.render("guild", {
					renderStart: renderStart,
					searchBar: true,

					title: data.guild_name + ' [' + data.tag + ']',
					guild: data,
				});
			}
		}
		else {
			res.send(404, 'Guild not found');
		}
	});

};
