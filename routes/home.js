"use strict"


module.exports = function (req, res) {
	const renderStart = Date.now();

	if(req.query.guildName && req.query.guildName.length){
		const guildNameUrl = req.query.guildName.replace(/ /g, '-');
		res.redirect(301, '/guilds/' + guildNameUrl);
	}
	else{
		res.render('home', {
			renderStart: renderStart,
			searchBar: false,
			
			title: 'GW2 Guilds',
		});
	}

};