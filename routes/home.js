"use strict";

const DB = require('../lib/data');


module.exports = function(req, res) {
	const renderStart = Date.now();

	let sampleGuilds = DB.guilds.index
		.toSeq()
		.filter(g => g.has('emblem'))
		.sortBy(g => Math.random())
		.take(5);

	res.render('home', {
		renderStart: renderStart,
		searchBar: false,
		guilds: sampleGuilds.toJS(),

		title: 'GW2 Guilds',
	});

};
