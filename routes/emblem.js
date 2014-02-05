"use strict"

const qs = require('querystring')

const guilds = require('../lib/guilds');
const emblem = require('../lib/emblem.js');

module.exports = function (req, res) {
	const renderStart = Date.now()

	const guildName = req.params.guildName.replace(/-/g, ' ');
	const size = req.params.size;


	guilds.getByName(guildName, function(err, data){
		if(data && data.guild_name){
			const guildNameUrl = data.guildNameUrl = qs.escape(data.guild_name.replace(/ /g, '-'));
			const canonical = '/guilds/' + guildNameUrl + '/' + size + '.svg';

			if(req.url !== canonical){
				res.redirect(301, canonical);
			}
			else{
				emblem.draw(data.emblem, size, 'transparent', function(svg){

					res.writeHead(200, {
						'Content-Type': 'image/svg+xml',
						'Content-Encoding': 'gzip',
						'Cache-Control': 'public, max-age=86400',
						'Expires': new Date(Date.now() + 86400000).toUTCString(),
					});

					require('zlib').gzip(svg, function (err, data) {
						res.end(data);
					});
				});
			}
		}
		else{
			res.send(404, 'Sorry, we cannot find guild named ' + guildName);
		}
	})

};