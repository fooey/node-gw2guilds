"use strict";

const _ = require('lodash');
const qs = require('querystring');

const gw2api = require('gw2api');







/*
*
*   DEFINE EXPORT
*
*/
module.exports = {
	getById: getById,
	getByName: getByName,
	getBySlug: getBySlug,
	slugify: slugify,
	deslugify: deslugify,
};


var guildMap = {};

const cacheTime = (1000 * 60 * 60 * 4); // 4 hours



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


	process.nextTick(pruneExpiredThrottled);
}



function getBySlug(slug, fnCallback) {
	var now = Date.now();
	var guild = _.find(GLOBAL.guilds, {slug: slug});

	if (guild && guild.guild_id && guild.expires > now) {
		// console.log('getBySlug::cache hit', slug);
		fnCallback(null, guild);
	}
	else {
		// console.log('getBySlug::cache miss', slug);
		gw2api.getGuildDetails(
			{guild_name: deslugify(slug)},
			setGuild.bind(null, fnCallback)
		);
	}


	process.nextTick(pruneExpiredThrottled);
}



function getByName(guildName, fnCallback) {
	getBySlug(slugify(guildName), fnCallback);
}




function setGuild(fnCallback, err, guildData) {
	if (err || !guildData || !guildData.guild_id) {
		err = 'NOTFOUND';
		guildData = {};
		guildData.expires = Date.now() + (5 * 1000); // only cache failed lookups for 5 seconds
	}
	else {
		// console.log('new gulid', guildData.guild_name);
		guildData.slug = slugify(guildData.guild_name);
		guildData.expires = Date.now() + cacheTime;
	}


	GLOBAL.guilds[guildData.guild_id] = guildData;

	fnCallback(err, guildData);
}



function slugify(str) {
	return qs.escape(str.replace(/ /g, '-')).toLowerCase();
}

function deslugify(str) {
	return qs.unescape(str).replace(/-/g, ' ');
}



function pruneExpired() {
	var now = Date.now();

	// using an each instead of _.filter because filter retuns an array

	_.each(GLOBAL.guilds, function(guild, key) {
		if (guild.expires < now) {
			delete GLOBAL.guilds[key];
		}
	});

}

var pruneExpiredThrottled = _.debounce(pruneExpired, 1000 * 3);
