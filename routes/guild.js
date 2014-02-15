"use strict"

const qs = require('querystring')

const guilds = require('../lib/guilds')

module.exports = function (req, res) {
	const renderStart = Date.now()

	const guildName = req.params.guildName.replace(/-/g, ' ');


	guilds.getByName(guildName, function(err, data){
		if(data && data.guild_name){
			const guildNameUrl = data.guildNameUrl = qs.escape(data.guild_name.replace(/ /g, '-'));
			const canonical = '/guilds/' + guildNameUrl;

			// console.log(canonical, req.url)

			if(req.url !== canonical){
				res.redirect(301, canonical);
			}
			else{
				res.render("guild", {
					renderStart: renderStart,
					searchBar: true,

					title: data.guild_name,
					guild: data,
				})
			}
		}
		else{
			res.send(404, 'Sorry, we cannot find guild named ' + guildName);
		}
	})

};