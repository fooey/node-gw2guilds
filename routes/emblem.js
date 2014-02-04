"use strict"

const guilds = require('../lib/guilds');
const emblem = require('../lib/emblem.js');

module.exports = function (req, res) {
	const renderStart = Date.now()

	const guildName = req.params.guildName.replace(/-/g, ' ');
	const size = req.params.size;


	guilds.getByName(guildName, function(err, data){
		if(data && data.guild_name){
			const guildNameUrl = data.guild_name.replace(/ /g, '-');
			const canonical = '/guilds/' + guildNameUrl + '/' + size + '.svg';

			if(req.url !== canonical){
				res.redirect(301, canonical);
			}
			else{
				emblem.draw(data.emblem, size, 'transparent', function(svg){
					res.header("Content-Type", "image/svg+xml");
					res.send(svg);
				});
			}
		}
		else{
			res.send(404, 'Sorry, we cannot find guild named ' + guildName);
		}
	})

};