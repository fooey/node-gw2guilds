"use strict";

const guilds = require('../lib/guilds');

module.exports = function(req, res) {
	const renderStart = Date.now();

	const guildId = req.params.guildId;
	const size = req.params.size || 256;
	const bgColor = req.params.bgColor;
	const extension = req.params.extension;

	guilds.getById(guildId, function(err, data) {
		if (data && data.guild_name) {
			if (!extension) {
				res.redirect(301, '/guilds/' + data.slug);
			}
			else if (extension === 'svg') {
				let svgPath = [size];
				if (bgColor) {svgPath.push(bgColor);}
				svgPath.push('svg');

				res.redirect(301, '/guilds/' + data.slug + '/' + svgPath.join('.'));
			}
			else {
				console.log(req.params);
				res.send(500, 'kaboom');
			}
		}
		else {
			res.send(404, 'Sorry, we cannot find guild_id ' + guildId);
		}
	});

};
