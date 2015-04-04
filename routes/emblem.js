"use strict";

const guilds = require('../lib/guilds');
const emblem = require('../lib/emblem2.js');

module.exports = function(req, res) {
	const slug = req.params.guildSlug;
	const size = req.params.size;
	const bgColor = req.params.bgColor;

	guilds.getBySlug(slug, (err, data) => {
		if (data && data.guild_name) {

			const cacheTime = 60 * 60 * 4; // 4 hours
			const lastmod = data.lastmod.toString();
			const etag = `${slug}::${lastmod}`;

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
				res
					.set('Last-Modified', lastmod)
					.set('ETag', etag)
					.set('Cache-Control', 'public, max-age=' + (cacheTime))
					.set('Expires', new Date(Date.now() + (cacheTime * 1000)).toUTCString());

				if (isResponseCached(req, lastmod, etag)) {
					res.sendStatus(304);
				}
				else {
					emblem.draw(data.emblem, size, bgColor, (svg) => {

						res.type('svg').send(svg);

					});
				}
			}


			setImmediate(gaqTrackEvent.bind(null, req));
		}
		else {
			res.send(404, 'Guild not found');
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


function isResponseCached(req, lastmod, etag) {
	const notModified = !!(req.get('if-modified-since') && req.get('if-modified-since') === lastmod);
	const isMatch = !!(req.get('if-none-match') && req.get('if-none-match') === etag);

	const isCached = notModified || isMatch;

	// console.log('notModified', req.get('if-modified-since'), lastmod, req.get('if-modified-since') === lastmod);
	// console.log('isMatch', req.get('if-none-match'), lastmod, req.get('if-none-match') === etag);
	// console.log('isCached', isCached);

	return isCached;
}
