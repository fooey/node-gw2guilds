"use strict";

const _ = require('lodash');

const DB        = require('./data');
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



/*
*
*   PUBLIC METHODS
*
*/



function getById(guildId, fnCallback) {
	DB.guilds.getById(guildId, fnCallback);
}



function getBySlug(slug, fnCallback) {
	DB.guilds.getBySlug(slug, fnCallback);
}



function getByName(guildName, fnCallback) {
	DB.guilds.getByName(guildName, fnCallback);
}