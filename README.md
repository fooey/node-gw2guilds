node-gw2api
========
Wrapper for calling ArenaNet's GuildWars2 APIs
http://wiki.guildwars2.com/wiki/API:Main and http://state.gw2w2w.com/

###Results
All methods are async, and return callbacks in the format of **function(err, data){}**

#World vs World

###getMatches(callback)
- no params
- getMatches(fn)
	- returns JSON from https://api.guildwars2.com/v1/wvw/matches.json

###getMatchDetails(params, callback)
- Required Param: match_id
- getMatchDetails({match_id: '1-1'}, fn)
	- returns JSON from https://api.guildwars2.com/v1/wvw/match_details.json?match_id=1-1

###getMatchesState(params, callback)
- Optional Param: match_id
- getMatchesState(fn)
	- returns JSON from http://state.gw2w2w.com/matches
- getMatchesState({match_id: '1-1'}, fn)
	- returns JSON from http://state.gw2w2w.com/matches/1-1

###getMatchDetailsState(params, callback)
- Required Param: match_id OR world_slug
- getMatchDetailsState({match_id: '1-1'}, fn)
	- returns JSON from http://state.gw2w2w.com/1-1
- getMatchDetailsState({world_slug: 'sea-of-sorrows'}, fn)
	- returns JSON from http://state.gw2w2w.com/world/sea-of-sorrows
	- world_slugs from https://github.com/fooey/gw2w2w-static/blob/master/data/world_names.js


#Static Data

###getObjectiveNames(params, callback)
- Optional Param: lang
- getObjectiveNames({lang: 'en'}, fn)
	- returns JSON from https://api.guildwars2.com/v1/wvw/objective_names.json?lang=en

###getWorldNames(params, callback)
- Optional Param: lang, ids
- getWorldNames({lang: 'en'}, fn)
	- returns JSON from https://api.guildwars2.com/v2/worlds?page=0&lang=en
- getWorldNames({lang: 'en', ids=[1001, 1002]}, fn)
	- returns JSON from https://api.guildwars2.com/v2/worlds?lang=en&ids=1001,1002

###getGuildDetails(params, callback)
- Required Param: guild_id OR guild_name (guild_id takes priority)
- getGuildDetails({guild_id: '4BBB52AA-D768-4FC6-8EDE-C299F2822F0'}, fn)
	- returns JSON from https://api.guildwars2.com/v1/guild_details.json?guild_id=4BBB52AA-D768-4FC6-8EDE-C299F2822F0F
- getGuildDetails({guild_name: 'ArenaNet'}, fn)
	- returns JSON from https://api.guildwars2.com/v1/guild_details.json?guild_name=ArenaNet