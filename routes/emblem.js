"use strict";

const guilds = require('../lib/guilds');
const emblem = require('../lib/emblem2.js');

module.exports = function(req, res) {
	const renderStart = Date.now();

	const slug = req.params.guildSlug;
	const size = req.params.size;
	const bgColor = req.params.bgColor;

	const cacheTime = 60 * 60 * 1; // 1 hour

	guilds.getBySlug(slug, function __returnGuildEmblem(err, data) {
		if (data && data.guild_name) {

			var svgPath = [size];
			if (bgColor) {
				svgPath.push(bgColor);
			}
			svgPath.push('svg');

			const canonical = [
				'',
				'guilds',
				data.slug,
				svgPath.join('.')
			].join('/');


			if (req.url !== canonical) {
				res.redirect(301, canonical);
			}
			else {
				emblem.draw(data.emblem, size, bgColor, function(svg) {
					res.type('svg');

					res.set({
						// 'Content-Type': 'image/svg+xml',
						'Cache-Control': 'public, max-age=' + (cacheTime),
						'Expires': new Date(Date.now() + (cacheTime * 1000)).toUTCString(),
					});
					res.send(svg);

					process.nextTick(gaqTrackEvent.bind(null, req));

				});
			}
		}
		else {
			res.send(404, 'Request guild not found');
		}
	});




	function gaqTrackEvent(req) {
		const referer = req.get('referer');

		const isHotlink = (
			!referer
			|| (
				referer.indexOf('localhost') === -1
				&& referer.indexOf('guilds.gw2w2w.com') === -1
			)
		);

		if (isHotlink) {
			const ua = require('universal-analytics');
			const uaUUID = (req.cookies && req.cookies.uaUUID) ? req.cookies.uaUUID : null;
			const visitor = ua('UA-51384-40', uaUUID);

			//Visitor#event(category, action, label, value)
			visitor.event('emblem-hotlink', req.params.guildSlug, referer, size).send();
		}
	}


};
