"use strict"

/*
*
*   http://wiki.guildwars2.com/wiki/API:Main
*
*/



/*
*   Internal Modules
*/

const url = require('url');


/*
*   Dependencies
*/
const request = require('request');



/*
*
*   DEFINE EXPORT
*
*/

var Anet = {
	langs: [
		{key: 'en', label: 'EN', href: '/en', name: 'English'},
		{key: 'de', label: 'DE', href: '/de', name: 'Deutsch'},
		{key: 'fr', label: 'FR', href: '/fr', name: 'Français'},
		{key: 'es', label: 'ES', href: '/es', name: 'Español'},
	],
};

module.exports = Anet;


/*
*
*   PRIVATE PROPERTIES
*
*/

const __INSTANCE = {
	api: {
		timeout: (10*1000),
		protocol: 'https',
		hostname: 'api.guildwars2.com',

		endPoints: {
 			events: '/v1/events.json',							// http://wiki.guildwars2.com/wiki/API:1/events
 			eventNames: '/v1/event_names.json',					// http://wiki.guildwars2.com/wiki/API:1/event_names
			eventDetails: '/v1/event_details.json',				// https://api.guildwars2.com/v1/event_details.json
			mapNames: '/v1/map_names.json',						// http://wiki.guildwars2.com/wiki/API:1/map_names
			worldNames: '/v1/world_names.json',					// http://wiki.guildwars2.com/wiki/API:1/world_names
			
			guildDetails: '/v1/guild_details.json',				// http://wiki.guildwars2.com/wiki/API:1/guild_details
			
			items: '/v1/items.json',							// http://wiki.guildwars2.com/wiki/API:1/items
			itemDetails: '/v1/item_details.json',				// http://wiki.guildwars2.com/wiki/API:1/item_details
			recipes: '/v1/recipes.json',						// http://wiki.guildwars2.com/wiki/API:1/recipes
			recipeDetails: '/v1/recipe_details.json',			// http://wiki.guildwars2.com/wiki/API:1/recipe_details

			continents: '/v1/continents.json',					// http://wiki.guildwars2.com/wiki/API:1/continents
			maps: '/v1/maps.json',						// http://wiki.guildwars2.com/wiki/API:1/maps
			mapFloor: '/v1/map_floor.json',					// http://wiki.guildwars2.com/wiki/API:1/map_floor

			objectiveNames: '/v1/wvw/objective_names.json',		// http://wiki.guildwars2.com/wiki/API:1/wvw/matches
			matches: '/v1/wvw/matches.json',					// http://wiki.guildwars2.com/wiki/API:1/wvw/match_details
			matchDetails: '/v1/wvw/match_details.json',			// http://wiki.guildwars2.com/wiki/API:1/wvw/objective_names
		},

	},

	wvw: {
		colors: ['red', 'blue', 'green'],
		commonNames: {
			'en': ",Overlook,Valley,Lowlands,Golanta Clearing,Pangloss Rise,Speldan Clearcut,Danelon Passage,Umberglade Woods,Stonemist Castle,Rogue's Quarry,Aldon's Ledge,Wildcreek Run,Jerrifer's Slough,Klovan Gully,Langor Gulch,Quentin Lake,Mendon's Gap,Anzalias Pass,Ogrewatch Cut,Veloka Slope,Durios Gulch,Bravost Escarpment,Garrison,Champion's Demense,Redbriar,Greenlake,Ascension Bay,Dawn's Eyrie,The Spiritholme,Woodhaven,Askalion Hills,Etheron Hills,Dreaming Bay,Victor's Lodge,Greenbriar,Bluelake,Garrison,Longview,The Godsword,Cliffside,Shadaran Hills,Redlake,Hero's Lodge,Dreadfall Bay,Bluebriar,Garrison,Sunnyhill,Faithleap,Bluevale Refuge,Bluewater Lowlands,Astralholme,Arah's Hope,Greenvale Refuge,Foghaven,Redwater Lowlands,The Titanpaw,Cragtop,Godslore,Redvale Refuge,Stargrove,Greenwater Lowlands,Temple of Lost Prayers,Battle's Hollow,Bauer's Estate,Orchard Overlook,Carver's Ascent,Carver's Ascent,Orchard Overlook,Bauer's Estate,Battle's Hollow,Temple of Lost Prayers,Carver's Ascent,Orchard Overlook,Bauer's Estate,Battle's Hollow,Temple of Lost Prayers".split(',')
			, 'fr': ",Belvédère,Vallée,Basses terres,Clairière de Golanta,Montée de Pangloss,Forêt rasée de Speldan,Passage Danelon,Bois d'Ombreclair,Château Brumepierre,Carrière des voleurs,Corniche d'Aldon,Piste du Ruisseau sauvage,Bourbier de Jerrifer,Petit ravin de Klovan,Ravin de Langor,Lac Quentin,Faille de Mendon,Col d'Anzalias,Percée de Gardogre,Flanc de Veloka,Ravin de Durios,Falaise de Bravost,Garnison,Fief du champion,Bruyerouge,Lac Vert,Baie de l'Ascension,Promontoire de l'aube,L'antre des esprits,Gentesylve,Collines d'Askalion,Collines d'Etheron,Baie des rêves,Pavillon du vainqueur,Vertebranche,Lac bleu,Garnison,Longuevue,L'Epée divine,Flanc de falaise,Collines de Shadaran,Rougelac,Pavillon du Héros,Baie du Noir déclin,Bruyazur,Garnison,Colline ensoleillée,Ferveur,Refuge de bleuval,Basses terres d'Eau-Azur,Astralholme,Espoir d'Arah,Refuge de Valvert,Havre gris,Basses terres de Rubicon,Bras du titan,Sommet de l'escarpement,Divination,Refuge de Valrouge,Bosquet stellaire,Basses terres d'Eau-Verdoyante,Temple des prières perdues,Vallon de bataille,Domaine de Bauer,Belvédère du Verger,Côte du couteau,Côte du couteau,Belvédère du Verger,Domaine de Bauer,Vallon de bataille,Temple des prières perdues,Côte du couteau,Belvédère du Verger,Domaine de Bauer,Vallon de bataille,Temple des prières perdues".split(',')
			, 'es': ",Mirador,Valle,Vega,Claro Golanta,Colina Pangloss,Claro Espeldia,Pasaje Danelon,Bosques Clarosombra,Castillo Piedraniebla,Cantera del Pícaro,Cornisa de Aldon,Pista Arroyosalvaje,Cenagal de Jerrifer,Barranco Klovan,Barranco Langor,Lago Quentin,Zanja de Mendon,Paso Anzalias,Tajo de la Guardia del Ogro,Pendiente Veloka,Barranco Durios,Escarpadura Bravost,Fuerte,Dominio del Campeón,Zarzarroja,Lagoverde,Bahía de la Ascensión,Aguilera del Alba,La Isleta Espiritual,Refugio Forestal,Colinas Askalion,Colinas Etheron,Bahía Onírica,Albergue del Vencedor,Zarzaverde,Lagoazul,Fuerte,Vistaluenga,La Hoja Divina,Despeñadero,Colinas Shadaran,Lagorrojo,Albergue del Héroe,Bahía Salto Aciago,Zarzazul,Fuerte,Colina Soleada,Salto de Fe,Refugio Valleazul,Tierras Bajas de Aguazul,Isleta Astral,Esperanza de Arah,Refugio de Valleverde,Refugio Neblinoso,Tierras Bajas de Aguarroja,La Garra del Titán,Cumbrepeñasco,Sabiduría de los Dioses,Refugio Vallerojo,Arboleda de las Estrellas,Tierras Bajas de Aguaverde,Templo de las Pelgarias,Hondonada de la Battalla,Hacienda de Bauer,Mirador del Huerto,Ascenso del Trinchador,Ascenso del Trinchador,Mirador del Huerto,Hacienda de Bauer,Hondonada de la Battalla,Templo de las Pelgarias,Ascenso del Trinchador,Mirador del Huerto,Hacienda de Bauer,Hondonada de la Battalla,Templo de las Pelgarias".split(',')
			, 'de': ",Aussichtspunkt,Tal,Tiefland,Golanta-Lichtung,Pangloss-Anhöhe,Speldan Kahlschlag,Danelon-Passage,Umberlichtung-Forst,Schloss Steinnebel,Schurkenbruch,Aldons Vorsprung,Wildbachstrecke,Jerrifers Sumpfloch,Klovan-Senke,Langor - Schlucht,Quentinsee,Mendons Spalt,Anzalias-Pass,Ogerwacht-Kanal,Veloka-Hang,Durios-Schlucht,Bravost-Abhang,Festung,Landgut des Champions,Rotdornstrauch,Grünsee,Bucht des Aufstiegs,Horst der Morgendammerung,Der Geisterholm,Wald - Freistatt,Askalion - Hügel,Etheron - Hügel,Traumbucht,Sieger - Hütte,Grünstrauch,Blausee,Festung,Weitsicht,Das Gottschwert,Felswand,Shadaran Hügel,Rotsee,Hütte des Helden,Schreckensfall - Bucht,Blaudornstrauch,Festung,Sonnenlichthügel,Glaubenssprung,Blautal - Zuflucht,Blauwasser - Tiefland,Astralholm,Arahs Hoffnung,Grüntal - Zuflucht,Nebel - Freistatt,Rotwasser - Tiefland,Die Titanenpranke,Felsenspitze,Götterkunde,Rottal - Zuflucht,Sternenhain,Grünwasser - Tiefland,Tempel der Verlorenen Gebete,Schlachten-Senke,Bauers Anwesen,Obstgarten Aussichtspunkt,Aufstieg des Schnitzers,Aufstieg des Schnitzers,Obstgarten Aussichtspunkt,Bauers Anwesen,Schlachten-Senke,Tempel der Verlorenen Gebete,Aufstieg des Schnitzers,Obstgarten Aussichtspunkt,Bauers Anwesen,Schlachten-Senke,Tempel der Verlorenen Gebete".split(',')
		},
	},
};



/*
*
*   PUBLIC METHODS
*
*/

/*
*   API Calls
*/

const __get = Anet.get = function (key, params, callback) {
	__getRemote(__getApiUrl(key, params), callback);
};



/*
*	EVENTS
*/

// OPTIONAL: world_id, map_id, event_id
Anet.getEvents = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('events', args.params, args.callback);
};


// OPTIONAL: lang
Anet.getEventNames = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('eventNames', args.params, args.callback);
};


// OPTIONAL: lang, event_id
Anet.getEventDetails = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('eventDetails', args.params, args.callback);
};


// OPTIONAL: lang
Anet.getMapNames = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('mapNames',params, callback);
};


// OPTIONAL: lang
Anet.getWorldNames = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('worldNames', args.params, args.callback);
};



/*
*	GUILDS
*/

// REQUIRED: guild_id || guild_name (id takes priority)
Anet.getGuildDetails = function (params, callback) {
	if(!params.guild_id && !params.guild_name){
		throw('Either guild_id or guild_name must be passed')
	}
	const args = __fixNoParams(params, callback);
	__get('guildDetails', params, callback)
};



/*
*	ITEMS
*/

// NO PARAMS
Anet.getItems = function (callback) {
	__get('items', {}, callback);
};


// REQUIRED: item_id
// OPTIONAL: lang
Anet.getItemDetails = function (params, callback) {
	if(!params.item_id){
		throw('item_id is a required parameter')
	}
	__get('itemDetails', params, callback);
};


// NO PARAMS
Anet.getRecipes = function (callback) {
	__get('recipes', {}, callback);
};

// REQUIRED: recipe_id
// OPTIONAL: lang
Anet.getRecipeDetails = function (params, callback) {
	if(!params.recipe_id){
		throw('recipe_id is a required parameter')
	}
	__get('recipeDetails', params, callback);
};



/*
*	Map information
*/

// NO PARAMS
Anet.getContinents = function (callback) {
	__get('continents', {}, callback);
};


// OPTIONAL: map_id, lang
Anet.getMaps = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('maps', {}, callback);
};


// REQUIRED: continent_id, floor
// OPTIONAL: lang
Anet.getMapFloor = function (params, callback) {
	if(!params.continent_id){
		throw('continent_id is a required parameter')
	}
	else if(!params.floor){
		throw('floor is a required parameter')
	}
	__get('mapFloor', {}, callback);
};



/*
*	World vs World
*/

// NO PARAMS
Anet.getMatches = function (callback) {
	__get('matches', {}, function(err, data){
		const wvw_matches = (data && data.wvw_matches) ? data.wvw_matches : [];
		callback(err, wvw_matches)
	})
};

// OPTIONAL: lang
Anet.getObjectives = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('objectiveNames', args.params, args.callback)
};

// REQUIRED: match_id
Anet.getMatchDetails = function (params, callback) {
	if(!params.match_id){
		throw('match_id is a required parameter')
	}
	__get('matchDetails', params, callback)
};



/*
*	Miscellaneous
*/

// NO PARAMS
Anet.getBuild = function (callback) {
	__get('build', {}, callback);
};


// OPTIONAL: lang
Anet.getColors = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('colors', {}, callback);
};


// NO PARAMS
// to get files: https://render.guildwars2.com/file/{signature}/{file_id}.{format}
Anet.getFiles = function (params, callback) {
	const args = __fixNoParams(params, callback);
	__get('files', {}, callback);
};



/*
*
*   UTILITY METHODS
*
*/


/*
*   WVW
*/

Anet.wvwGetCommonName = function(lang, objectiveId){
	return __INSTANCE.wvw.commonNames[lang][objectiveId];
};


// SPECIAL CASE
// REQUIRED: signature, file_id, format
Anet.getFile = function (params, callback) {
	if(!params.signature){
		throw('signature is a required parameter')
	}
	else if(!params.file_id){
		throw('file_id is a required parameter')
	}
	else if(!params.format){
		throw('format is a required parameter')
	}

	__getRemote(Anet.getFileRenderUrl(params), callback);
};


// REQUIRED: signature, file_id, format
Anet.getFileRenderUrl = function (params, callback) {
	if(!params.signature){
		throw('signature is a required parameter')
	}
	else if(!params.file_id){
		throw('file_id is a required parameter')
	}
	else if(!params.format){
		throw('format is a required parameter')
	}

	const renderUrl = (
		'https://render.guildwars2.com/file/'
		+ params.signature
		+ '/'
		+ params.file_id
		+ '.'
		+ params.format
	);
	return renderUrl;
};



/*
*
*   PRIVATE METHODS
*
*/

 function __fixNoParams (params, callback){
	if(typeof(params) === "function"){
		callback = params;
		params = {};
	}
	return {params:params, callback:callback}
}



function __getRemote (requestUrl, callback) {
	const startTime = Date.now();
	// console.log(Date.now(), requestUrl)
	request({
			url: requestUrl,
			timeout: __INSTANCE.api.timeout
		},
		function (err, response, body) {
			//console.log(Date.now(), requestUrl, Date.now() - startTime, 'elapsed')
			if (response && response.statusCode == 200) {
				callback(err, JSON.parse(body));
			}
			else{
				// console.log('__getRemote()', response)
				// throw('unexepcted response in __getRemote()')
				callback(err, null);
			}
		}
	);
}



function __getApiUrl (endpoint, params) {
	if(!__INSTANCE.api.endPoints[endpoint]){
		throw('Invalid endpoint: ' + endpoint);
	}
	return url.format({
		protocol: __INSTANCE.api.protocol
		, hostname: __INSTANCE.api.hostname
		, pathname: __INSTANCE.api.endPoints[endpoint]
		, query: params
	});
};