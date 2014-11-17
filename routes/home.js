"use strict";

var _ = require('lodash');


module.exports = function(req, res) {
	const renderStart = Date.now();

	if (req.query.guildName && req.query.guildName.length) {
		const guildNameUrl = req.query.guildName.replace(/ /g, '-');
		res.redirect(301, '/guilds/' + guildNameUrl);
	}
	else {
		const cache = require('../lib/cache');

		cache.get(
			'guildMap',
			null,
			function(cbCacheMiss) { render([]); },
			function(err, guilds) {
				var sampleGuilds = _.sample(guilds, 8);
				console.log('sampleGuilds', sampleGuilds);
				render(sampleGuilds);
			}
		);

		function render(guilds) {
			res.render('home', {
				renderStart: renderStart,
				searchBar: false,
				guilds: guilds,

				title: 'GW2 Guilds',
			});
		}

	}

};
