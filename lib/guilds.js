"use strict";

const _ = require('lodash');

const gw2api = require('gw2api');
const slugifier = require('./slugifier.js');





/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	getById,
	getByName,
	getBySlug,
	slugify: slugifier.slugify,
	deslugify: slugifier.deslugify,
};

const cacheTime = (1000 * 60 * 60 * 4); 	// 4 hours
const pruningThrottle = (1000 * 60); 		// 1 minute



/*
*
*   PUBLIC METHODS
*
*/



function getById(guildId, fnCallback) {
	const now = Date.now();
	const guild = GLOBAL.guilds[guildId];

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


	setImmediate(pruneExpiredThrottled);
}



function getBySlug(slug, fnCallback) {
	const guild = _.find(GLOBAL.guilds, {slug: slug});
	// console.log('getBySlug', slug);

	if (guild && guild.guild_id && !isStale(guild.expires)) {
		// console.log('getBySlug::cache hit', slug);
		fnCallback(null, guild);
	}
	else {
		const guildName = slugifier.deslugify(slug);
		// console.log('getBySlug::cache miss', guildName);
		gw2api.getGuildDetails(
			{guild_name: guildName},
			setGuild.bind(null, fnCallback)
		);
	}


	setImmediate(pruneExpiredThrottled);
}



function getByName(guildName, fnCallback) {
	getBySlug(slugifier.slugify(guildName), fnCallback);
}




function setGuild(fnCallback, err, guildData) {
	// console.log('setGuild()', guildData);
	const now = Date.now();

	if (err || !guildData || !guildData.guild_id) {
		err = 'NOTFOUND';
		guildData = {};
		guildData.lastmod = now;
		guildData.expires = now + (5 * 1000); // only cache failed lookups for 5 seconds
	}
	else {
		// console.log('new gulid', guildData.guild_name);
		guildData.slug = slugifier.slugify(guildData.guild_name);
		guildData.expires = now + cacheTime;
	}

	guildData.lastmod = now;


	GLOBAL.guilds[guildData.guild_id] = guildData;

	fnCallback(err, guildData);
}



function pruneExpired() {
	_.each(GLOBAL.guilds, (guild, key) => {
		if (isStale(guild.expires)) {
			delete GLOBAL.guilds[key];
		}
	});
}

const pruneExpiredThrottled = _.debounce(pruneExpired, pruningThrottle);


function isStale(expires) {
	return expires < Date.now();
}
