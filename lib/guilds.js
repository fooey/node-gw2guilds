"use strict";

var _ = require('lodash');

var gw2api = require('gw2api');

var slugifier = require('./slugifier.js');





/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	getById: getById,
	getByName: getByName,
	getBySlug: getBySlug,
	slugify: slugifier.slugify,
	deslugify: slugifier.deslugify,
};


var guildMap = {};

var cacheTime = (1000 * 60 * 60 * 4); 	// 4 hours
var pruningThrottle = (1000 * 60); 		// 1 minute



/*
*
*   PUBLIC METHODS
*
*/



function getById(guildId, fnCallback) {
	var now = Date.now();
	var guild = GLOBAL.guilds[guildId];

	if (guild && guild.guild_id && guild.expires > now) {
		// console.log('getById::cache hit', slug);
		fnCallback(null, guild);
	}
	else {
		// console.log('getById::cache miss', slug);
		gw2api.getGuildDetails(
			{guild_id: guildId},
			setGuild.bind(null, fnCallback)
		);
	}


	setTimeout(pruneExpiredThrottled, 10);
}



function getBySlug(slug, fnCallback) {
	var now = Date.now();
	var guild = _.find(GLOBAL.guilds, {slug: slug});
	// console.log('getBySlug', slug);

	if (guild && guild.guild_id && !isStale(guild.expires)) {
		// console.log('getBySlug::cache hit', slug);
		fnCallback(null, guild);
	}
	else {
		var guildName = slugifier.deslugify(slug);
		// console.log('getBySlug::cache miss', guildName);
		gw2api.getGuildDetails(
			{guild_name: guildName},
			setGuild.bind(null, fnCallback)
		);
	}


	setTimeout(pruneExpiredThrottled, 10);
}



function getByName(guildName, fnCallback) {
	getBySlug(slugifier.slugify(guildName), fnCallback);
}




function setGuild(fnCallback, err, guildData) {
	// console.log('setGuild()', guildData);

	if (err || !guildData || !guildData.guild_id) {
		err = 'NOTFOUND';
		guildData = {};
		guildData.expires = Date.now() + (5 * 1000); // only cache failed lookups for 5 seconds
	}
	else {
		// console.log('new gulid', guildData.guild_name);
		guildData.slug = slugifier.slugify(guildData.guild_name);
		guildData.expires = Date.now() + cacheTime;
	}


	GLOBAL.guilds[guildData.guild_id] = guildData;

	fnCallback(err, guildData);
}



function pruneExpired() {
	var now = Date.now();

	_.each(GLOBAL.guilds, function(guild, key) {
		if (isStale(guild.expires)) {
			delete GLOBAL.guilds[key];
		}
	});
}

var pruneExpiredThrottled = _.debounce(pruneExpired, pruningThrottle);


function isStale(expires) {
	return expires < Date.now();
}
