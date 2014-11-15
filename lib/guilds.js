"use strict"
const _ = require('lodash');
const gw2api = require('gw2api');

const cache = require('./cache');





/*
*
*   DEFINE EXPORT
*
*/

let Controller = {};
var __guildMap = {};
module.exports = Controller;

const __INSTANCE = {
	cacheTime: (1000 * 60 * 60 * 24),
	// cacheTime: (1000 * 10)
};



/*
*
*   PUBLIC METHODS
*
*/



Controller.getById = function(guildId, cbGetter){
	cache.get(
		guildId,
		__INSTANCE.cacheTime,
		function(cbCacheMiss){
			gw2api.getGuildDetails(cbCacheMiss, {guild_id: guildId})
		},
		function(err, data){
			if(data && data.guild_name){
				__guildMap[data.guild_name.toLowerCase()] = data.guild_id;
				__saveGuildMap();
			}
			cbGetter(err, data);
		}
	);
};


Controller.getByName = function(guildName, cbGetter){
	let lowerGuildName = guildName.toLowerCase();

	if(__guildMap.hasOwnProperty(lowerGuildName)){
		Controller.getById(__guildMap[lowerGuildName], cbGetter);
	}
	else{
		var onGuildDetails = function(err, data){
			if (data && data.guild_name){
				__guildMap[lowerGuildName] = data.guild_id;
				__saveGuildMap();
				cache.put(data.guild_id, data, cbGetter.bind(null, err, data));
			}
			else {
				cbGetter('NOTFOUND', {})
			}
		};
		gw2api.getGuildDetails(onGuildDetails, {guild_name: guildName});
		
	}
};




/*
*
*   PRIVATE METHODS
*
*/

/*
*	GUILD MAP
*/

(function __setGuildMap(){
	__loadGuildMap(function(err, data){
		if(!data){
			__saveGuildMap();
		}
		else{
			__guildMap = data;
		}
	});
}())


function __loadGuildMap(cbGetter){
	cache.get(
		'guildMap',
		null,
		function(cbCacheMiss){
			cbCacheMiss(null, {})
		},
		cbGetter
	);
}


const __saveGuildMap= _.throttle(function(){
	// console.log(Date.now(), 'storing current guild map');
	cache.put('guildMap', __guildMap, _.noop)
}, 3000);