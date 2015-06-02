'use strict';


const fs   = require ('fs-extra');
const path = require('path');

// const async     = require('async');
const Immutable = require('immutable');
const _         = require('lodash');


const slugifier = require('../slugifier.js');
const gw2api    = require('gw2api');


const inProgressDelay = 20;
const toDiskThrottle  = (10) * 1000;

const cacheTimeMin    = (60 * 60 * 60 * 3) * 1000;
const cacheTimeMax    = (60 * 60 * 60 * 4) * 1000;


//https://github.com/fontello/svgpath


class GuildsDB {
    constructor(DB) {
        this.DB = DB;

        this.dataPath = path.join(DB.pathRoot, 'guilds');
        this.indexPath = path.join(this.dataPath, 'index.json');

        fs.mkdirsSync(this.dataPath);

        this.index = __loadIndex(this.indexPath);

        this.inProgress = {};
    }



    truncate(){
        fs.removeSync(this.dataPath);
    }



    getById(guildId, fnCallback) {
        let guild = this.index.find(g => g.get('guild_id') === guildId && g.get('expires') > Date.now());

        if (Immutable.Map.isMap(guild)) {
            fnCallback(null, guild);
        }
        else if (this.inProgress[guildId]) {
            setTimeout(this.getById.bind(this, guildId, fnCallback), inProgressDelay);
        }
        else {
            this.inProgress[guildId] = true;
            this.getRemote({guild_id: guildId}, (err, result) => {
                delete this.inProgress[guildId];
                fnCallback(err, result);
            });
        }
    }



    getBySlug(guildSlug, fnCallback) {
        let guild = this.index.get(guildSlug);

        guild = (guild && guild.get('expires') > Date.now())
            ? guild
            : null;


        if (Immutable.Map.isMap(guild)) {
            fnCallback(null, guild);
        }
        else if (this.inProgress[guildSlug]) {
            setTimeout(this.getBySlug.bind(this, guildSlug, fnCallback), inProgressDelay);
        }
        else {
            this.inProgress[guildSlug] = true;
            this.getRemote({guild_name: slugifier.deslugify(guildSlug)}, (err, result) => {
                delete this.inProgress[guildSlug];
                fnCallback(err, result);
            });
        }
    }



    getByName(guildName, fnCallback) {
        let guildSlug = slugifier.slugify(guildName);

        this.getBySlug(guildSlug, fnCallback);
    }



    getRemote(params, fnCallback) {
        // console.log('getRemote', params);

        gw2api.getGuildDetails(
            params,
            (err, guildData) => {
                if (err) {
                    console.log('getRemote()::err', params);
                    fnCallback(err);
                }
                else {
                    this.setGuild(guildData, fnCallback)
                }
            }
        );
    }


    setGuild(guildData, fnCallback) {
        const slug = slugifier.slugify(guildData.guild_name);

        let guild = Immutable.fromJS(guildData);

        guild = guild.merge({
            'slug': slug,
            'expires': Date.now() + (_.random(cacheTimeMin, cacheTimeMax)),
        });

        // console.log('setGuild', guild.toJS());

        this.index = this.index.set(slug, guild);

        fnCallback(null, guild);

        // queue off __writeIndex
        setTimeout(__writeIndex.bind(null, this.indexPath, this.index), 10);
    }
}


function __loadIndex(indexPath) {
    let guildsIndex = fs.readJsonSync(indexPath, {throws: false});

    if (!guildsIndex) {
        guildsIndex = {};
        __writeIndexBase(indexPath, guildsIndex);
    }

    return Immutable.fromJS(guildsIndex);
}



const __writeIndex = _.debounce(__writeIndexBase, toDiskThrottle);

function __writeIndexBase(indexPath, guildData){
    let _toDisk = guildData;

    if (Immutable.Map.isMap(guildData)) {
        _toDisk = guildData.toJS();
    }
    // console.log('__writeIndexBase', _toDisk, guildData)

    try {
        console.log('__writeIndexBase()');
        fs.writeJsonSync(indexPath, _toDisk);
    }
    catch(err) {
        console.log('__writeIndexBase()', 'WRITE FAILED', err);
    }
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = GuildsDB;