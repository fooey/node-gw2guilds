'use strict';


const fs   = require ('fs-extra');
const path = require('path');

const Immutable = require('immutable');
const async     = require('async');
const _         = require('lodash');


const slugifier = require('../slugifier.js');
const gw2api    = require('gw2api');


const inProgressDelay = 20;
const toDiskThrottle  = (1) * 1000;

const cacheTimeMin    = (60 * 60 * 60 * 3) * 1000;
const cacheTimeMax    = (60 * 60 * 60 * 4) * 1000;


class GuildsDB {
    constructor(DB) {
        console.log('DB::guilds::constructor');
        this.DB = DB;

        this.dataPath = path.join(DB.pathRoot, 'guilds');
        this.indexPath = path.join(this.dataPath, 'guilds-index.json');

        this.inProgress = {};
    }



    init(fnCallback) {
        console.log('DB::guilds::init');

        async.auto({
            mkdirs  : [fs.mkdirs.bind(fs, this.dataPath)],
            loadData: ['mkdirs', cb => {
                __loadIndex(this.indexPath, (err, data) => {
                    this.index = data;
                    cb(err);
                });
            }],
        }, function(err) {
            if (err) {
                throw(err);
            }

            fnCallback(err);
        });
    }



    /*
    *
    *   Public Methods
    *
    */

    truncate() {
        fs.removeSync(this.dataPath);
    }



    getBySlug(guildSlug, fnCallback) {
        let guild = this.index.get(guildSlug);

        guild = (guild && guild.get('expires') > Date.now())
            ? guild
            : null;


        if (Immutable.Map.isMap(guild)) {
            fnCallback(null, guild);
        }
        else {
            let progressKey  = guildSlug;
            let remoteParams = {guild_name: slugifier.deslugify(guildSlug)};
            let fnInProgress = this.getBySlug.bind(this, guildSlug, fnCallback);

            this.__getRemote(remoteParams, progressKey, fnInProgress, fnCallback);
        }
    }



    getById(guildId, fnCallback) {
        let guild = this.index.find(g => g.get('guild_id') === guildId && g.get('expires') > Date.now());

        if (Immutable.Map.isMap(guild)) {
            fnCallback(null, guild);
        }
        else {
            let progressKey  = guildId;
            let remoteParams = {guild_id: guildId};
            let fnInProgress = this.getById.bind(this, guildId, fnCallback);

            this.__getRemote(remoteParams, progressKey, fnInProgress, fnCallback);
        }
    }



    getByName(guildName, fnCallback) {
        let guildSlug = slugifier.slugify(guildName);

        this.getBySlug(guildSlug, fnCallback);
    }



    /*
    *
    *   Private Methods
    *
    */

    __getRemote(params, key, fnInProgress, fnCallback) {
        // console.log('__getRemote', params);

        if (this.inProgress[key]) {
            setTimeout(fnInProgress, inProgressDelay);
        }
        else {
            this.inProgress[key] = true;

            gw2api.getGuildDetails(params, (err, guildData) => {
                delete this.inProgress[key];

                if (err) {
                    console.log('__getRemote()::err', params);
                    fnCallback(err);
                }
                else {
                    this.__setGuild(guildData, fnCallback);
                }

            });
        }
    }


    __setGuild(guildData, fnCallback) {
        const slug = slugifier.slugify(guildData.guild_name);

        let guild = Immutable.fromJS(guildData);

        guild = guild.merge({
            'slug': slug,
            'expires': Date.now() + (_.random(cacheTimeMin, cacheTimeMax)),
        });

        // console.log('__setGuild', guild.toJS());

        this.index = this.index.set(slug, guild);

        fnCallback(null, guild);

        // queue off __writeIndex
        async.nextTick(
            __writeIndex.bind(null, this.indexPath, this.index)
        );
    }
}


function __loadIndex(indexPath, fnCallback) {
    console.log('__loadIndex()', indexPath);

    fs.readFile(indexPath, (err, data) => {

        if (err) {
            console.log('__loadIndex():ERR', indexPath, err);
            data = {};
        }
        else {
            try {
                data = JSON.parse(data);
                console.log('__loadIndex() size', Object.keys(indexPath).length);
            }
            catch(err) {
                data = {};
                console.log('ERROR:', err);
            }
        }

        let guildsIndex = Immutable.fromJS(data);

        fnCallback(null, guildsIndex);
    });
}



const __writeIndex = _.debounce(__writeIndexBase, toDiskThrottle);

function __writeIndexBase(indexPath, guildData, fnCallback=_.noop){
    console.log('__writeIndexBase', indexPath);

    let _toDisk;

    try {
        _toDisk = JSON.stringify(guildData.toJS());
    }
    catch(err) {
        _toDisk = '{}';
    }

    fs.writeFile(indexPath, _toDisk, (err) => {
        console.log('__writeIndexBase::complete', 'ERR', err);
        fnCallback(err);
    });
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = GuildsDB;