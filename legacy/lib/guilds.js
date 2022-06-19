'use strict';

const DB        = require('lib/data');
const slugifier = require('lib/slugifier.js');






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



function getById(guildId) {
    return DB.guilds.getById(guildId);
}



function getBySlug(slug) {
    return DB.guilds.getBySlug(slug);
}



function getByName(guildName) {
    return DB.guilds.getByName(guildName);
}
