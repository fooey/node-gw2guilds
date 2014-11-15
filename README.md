node-gw2api
========
Wrapper for calling ArenaNet's GuildWars2 API  
http://wiki.guildwars2.com/wiki/API:Main

- ##World vs World
    - **getObjectiveNames(callback, params)**
        - Optional Param: lang
        - getObjectiveNames(fn, {lang: 'en'})  
            - returns JSON from https://api.guildwars2.com/v1/wvw/objective_names.json?lang=en
    - **getMatches(callback)**
        - no params
        - returns JSON from https://api.guildwars2.com/v1/wvw/matches.json
    - **getMatchDetails(callback, params)**
        - Required Param: match_id
        - getMatchDetails(fn, {match_id: '1-1'})  
            - returns JSON from https://api.guildwars2.com/v1/wvw/match_details.json?match_id=1-1
    - **getMatchesState(callback, params)**
        - Optional Param: match_id
        - getMatchesState(fn)  
            - returns JSON from http://state.gw2w2w.com/matches
        - getMatchesState(fn, {match_id: '1-1'})  
            - returns JSON from http://state.gw2w2w.com/matches/1-1
    - **getMatchDetailsState(callback, params)**
        - Required Param: match_id OR world_slug
        - getMatchDetailsState(fn, {match_id: '1-1'})  
            - returns JSON from http://state.gw2w2w.com/1-1
        - getMatchDetailsState(fn, {world_slug: 'sea-of-sorrows'})  
            - returns JSON from http://state.gw2w2w.com/world/sea-of-sorrows
        - world_slugs from https://github.com/fooey/gw2w2w-static/blob/master/data/world_names.js
- **getWorldNames(callback, params)**
    - Optional Param: lang, ids
    - getWorldNames(fn, {lang: 'en'})  
        - returns JSON from https://api.guildwars2.com/v2/worlds?page=0&lang=en
    - getWorldNames(fn, {lang: 'en', ids=[1001, 1002]})  
        - returns JSON from https://api.guildwars2.com/v2/worlds?lang=en&ids=1001,1002
- **getGuildDetails(callback, params)**
    - Required Param: guild_id OR guild_name (guild_id takes priority)
    - getGuildDetails(fn, {guild_id: '4BBB52AA-D768-4FC6-8EDE-C299F2822F0'})  
        - returns JSON from https://api.guildwars2.com/v1/guild_details.json?guild_id=4BBB52AA-D768-4FC6-8EDE-C299F2822F0F
    - getGuildDetails(fn, {guild_name: 'ArenaNet'})  
        - returns JSON from https://api.guildwars2.com/v1/guild_details.json?guild_name=ArenaNet