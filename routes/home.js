"use strict";

var _ = require('lodash');


module.exports = function(req, res) {
	const renderStart = Date.now();

	var sampleGuilds = _.chain(GLOBAL.guilds)
		.filter(function(g) { return !!g.emblem; })
		.sample(5)
		.value();

	res.render('home', {
		renderStart: renderStart,
		searchBar: false,
		guilds: sampleGuilds,

		title: 'GW2 Guilds',
	});

};
