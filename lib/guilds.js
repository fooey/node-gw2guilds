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

const cacheTime = (1000 * 60 * 60 * 1); // 1 hour



/*
*
*   PUBLIC METHODS
*
*/



function getById(guildId, fnCallback) {
	pruneExpired();

	var guild = GLOBAL.guilds[guildId];

	if (guild && guild.guild_id) {
		fnCallback(null, guild);
	}
	else {
		gw2api.getGuildDetails(
			{guild_id: guildId},
			setGuild.bind(null, fnCallback)
		);
	}
}



function getBySlug(slug, fnCallback) {
	pruneExpired();

	var guild = _.find(GLOBAL.guilds, {slug: slug});

	// console.log('getBySlug', slug, guild);

	if (guild && guild.guild_id) {
		fnCallback(null, guild);
	}
	else {
		gw2api.getGuildDetails(
			{guild_name: deslugify(slug)},
			setGuild.bind(null, fnCallback)
		);
	}
}



function getByName(guildName, fnCallback) {
	getBySlug(slugify(guildName), fnCallback);
}




function setGuild(fnCallback, err, guildData) {
	if (err || !guildData.guild_id) {
		err = 'NOTFOUND';
		guildData = {};
	}
	else {
		// console.log('new gulid', guildData.guild_name);
		guildData.slug = slugify(guildData.guild_name);
	}

	guildData.expires = Date.now() + cacheTime;

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
