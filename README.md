node-gw2
========
Wrapper for calling ArenaNet's GuildWars2 API
http://wiki.guildwars2.com/wiki/API:Main

## Supported Endpoints:
- events (http://wiki.guildwars2.com/wiki/API:1/events)
- eventNames (http://wiki.guildwars2.com/wiki/API:1/event_names)
- eventDetails (https://api.guildwars2.com/v1/event_details.json)
- mapNames (http://wiki.guildwars2.com/wiki/API:1/map_names)
- worldNames (http://wiki.guildwars2.com/wiki/API:1/world_names)

- guildDetails (http://wiki.guildwars2.com/wiki/API:1/guild_details)

- items (http://wiki.guildwars2.com/wiki/API:1/items)
- itemDetails (http://wiki.guildwars2.com/wiki/API:1/item_details)
- recipes (http://wiki.guildwars2.com/wiki/API:1/recipes)
- recipeDetails (http://wiki.guildwars2.com/wiki/API:1/recipe_details)

- continents (http://wiki.guildwars2.com/wiki/API:1/continents)
- maps (http://wiki.guildwars2.com/wiki/API:1/maps)
- mapFloor (http://wiki.guildwars2.com/wiki/API:1/map_floor)

- objectiveNames (http://wiki.guildwars2.com/wiki/API:1/wvw/matches)
- matches (http://wiki.guildwars2.com/wiki/API:1/wvw/match_details)
- matchDetails (http://wiki.guildwars2.com/wiki/API:1/wvw/objective_names)

## PUBLIC METHODS

**.get(key, params, callback)**  
Used internally, but exposed since it can be convenient to call directly. 'key' corresponds to the above endpoints

### EVENTS

**.getEvents(params, callback)**  
Optional Params: world_id, map_id, event_id

**.getEventNames(params, callback)**  
Optional Params: lang

**.getEventDetails(params, callback)**  
Optional Params: lang, event_id

**.getMapNames(params, callback)**  
Optional Params: lang

### GUILDS

**.getGuildDetails(params, callback)**  
Requires one of guild_id or guild_name, if both exist, guild_id takes priority  

### ITEMS

**.getItems(callback)**  
No parameters  

**.getItemDetails(params, callback)**  
Required Params: item_id  
Optional Params: lang  

**.getRecipes(callback)**  
No parameters  

**.getRecipeDetails(params, callback)**  
Required Params: recipe_id  
Optional Params: lang    

### MAP INFORMATION

**.getContinents(callback)**  
No parameters  

**.getMaps(params, callback)**  
Optional Params: map_id, lang  

**.getMapFloor(params, callback)**  
Required Params: continent_id, floor  
Optional Params: lang  

### WORLD vs WORLD

**.getMatches(callback)**  
No parameters  

**.getObjectives(params, callback)**  
Optional Params: lang  

**.getMatchDetails(params, callback)**  
Rquired Params: match_id  

### MISCELLANEOUS

**.getBuild(callback)**  
No parameters  

**.getColors(callback)**  
Optional Params: lang  

**.getFiles(callback)**  
No parameters  