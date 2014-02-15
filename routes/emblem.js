"use strict"

const qs = require('querystring')
const _ = require('lodash')
const async = require('async')

const guilds = require('../lib/guilds');
const emblem = require('../lib/emblem2.js');

module.exports = function (req, res) {
	const visitor = require('./universal-analytics')(req, res);
	const renderStart = Date.now()

	const guildName = req.params.guildName.replace(/-/g, ' ');
	const size = req.params.size;
	const bgColor = req.params.bgColor;

	const cacheTime = 60 * 60 * 24 * 1; // 1 day



	console.log('options', req.method)

	guilds.getByName(guildName, __returnGuildEmblem);


	function __returnGuildEmblem(err, data){
		if(data && data.guild_name){
			const guildName = data.guild_name;
			const guildNameUrl = data.guildNameUrl = qs.escape(guildName.replace(/ /g, '-'));

			let svgPath = [size];
			if(bgColor){svgPath.push(bgColor);}
			svgPath.push('svg');

			const canonical = [
				'',
				'guilds',
				guildNameUrl,
				svgPath.join('.')
			].join('/');

			if(req.url !== canonical){
				res.redirect(301, canonical);
			}
			else{
				emblem.draw(data.emblem, size, bgColor, function(svg){
					require('zlib').gzip(svg, function (err, data) {

						res.writeHead(200, {
							'Content-Type': 'image/svg+xml',
							'Content-Encoding': 'gzip',
							'Cache-Control': 'public, max-age=' + (cacheTime),
							'Expires': new Date(Date.now() + (cacheTime * 1000)).toUTCString(),
						});
						res.end(data);

						_.defer(__trackEmblemHotLink);
					});

				});
			}
		}
		else{
			res.send(404, 'Sorry, we cannot find guild named ' + guildName);
		}


	}


	function __trackEmblemHotLink(){
		const referer = req.get('referer');
		const isHotlink = (
			!referer
			|| (
				referer.indexOf('localhost') === -1
				&& referer.indexOf('guilds.gw2w2w.com') === -1
			)
		);
		if(isHotlink){
			//Visitor#event(category, action, label, value)
			visitor.event('emblem-hotlink', guildName, referer, size).send();
		}
	}


};