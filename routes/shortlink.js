"use strict"

const guilds = require('../lib/guilds')

module.exports = function (req, res) {
	const renderStart = Date.now()

	const guildId = req.params.guildId;
	const extension = req.params.extension;
	console.log(req.params)

	guilds.getById(guildId, function(err, data){
		if(data && data.guild_name){
			const guildNameUrl = data.guild_name.replace(/ /g, '-');
			if(!extension){
				res.redirect(301, '/guilds/' + guildNameUrl);
			}
			else if(extension === '.svg'){
				res.redirect(301, '/guilds/' + guildNameUrl + '/256.svg');
			}
			else{
				console.log(req.params)
				res.send(500, 'kaboom');
			}
		}
		else{
			res.send(404, 'Sorry, we cannot find guild_id ' + guildId);
		}
	})

};