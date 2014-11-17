"use strict";

const _ = require('lodash');
const gw2api = require('gw2api');

const cache = require('./cache');





/*
*
*   DEFINE EXPORT
*
*/
module.exports = {
	getById: getById,
	getByName: getByName,
};


var guildMap = {};

const cacheTime = (1000 * 60 * 60 * 24);



/*
*
*   PUBLIC METHODS
*
*/



function getById(guildId, cbGetter) {
	cache.get(
		guildId,
		cacheTime,
		function(cbCacheMiss) {
			gw2api.getGuildDetails({guild_id: guildId}, cbCacheMiss);
		},
		function(err, data) {
			if (data && data.guild_name) {
				guildMap[data.guild_name.toLowerCase()] = data.guild_id;
				process.nextTick(saveGuildMap);
			}
			cbGetter(err, data);
		}
	);
}


function getByName(guildName, cbGetter) {
	var lowerGuildName = guildName.toLowerCase();

	if (guildMap.hasOwnProperty(lowerGuildName)) {
		getById(guildMap[lowerGuildName], cbGetter);
	}
	else {
		gw2api.getGuildDetails({guild_name: guildName}, function onGuildDetails(err, data) {
			if (data && data.guild_name) {
				guildMap[lowerGuildName] = data.guild_id;
				process.nextTick(saveGuildMap);
				cache.put(data.guild_id, data, cbGetter.bind(null, err, data));
			}
			else {
				cbGetter('NOTFOUND', {});
			}
		});
	}
}




/*
*
*   PRIVATE METHODS
*
*/

/*
*	GUILD MAP
*/

(function initGuildMap() {
	loadGuildMap(function(err, data) {
		if (!data) {
			saveGuildMap();
		}
		else {
			guildMap = data;
		}
	});
}());


function loadGuildMap(cbGetter) {
	cache.get(
		'guildMap',
		null,
		function(cbCacheMiss) {
			cbCacheMiss(null, {});
		},
		cbGetter
	);
}


const saveGuildMap = _.throttle(function() {
	// console.log(Date.now(), 'storing current guild map');
	cache.put('guildMap', guildMap, _.noop);
}, 3000);
