'use strict';


const fs   = require ('fs-extra');
const path = require('path');

const Immutable = require('immutable');
const async     = require('async');
const _         = require('lodash');


const slugifier = require('../slugifier.js');
const gw2api    = require('gw2api');


const inProgressDelay = 20; // ms
const toDiskThrottle  = (4) * 1000;

const msHour          = (1000 * 60 * 60 * 1);
const cacheTimeMin    = msHour * 24;
const cacheTimeMax    = msHour * 36;
const cacheRefresh    = msHour * 4;

const fresherDelayMin = (1000 * 4);
const fresherDelayMax = (1000 * 8);
const fresherCycleMin = 4;
const fresherCycleMax = 8;

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
        }, (err) => {
            if (err) {
                throw(err);
            }

            // don't precache on dev
            if (process.env.NODE_ENV === 'production') {
                async.nextTick(this.__freshmakerReschedule.bind(this));
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
            setTimeout(this.__refresh.bind(this, guild), _.random(2000, 8000));

            fnCallback(null, guild);
        }
        else {
            const progressKey  = guildSlug;
            const remoteParams = {guild_name: slugifier.deslugify(guildSlug)};
            const fnInProgress = this.getBySlug.bind(this, guildSlug, fnCallback);

            this.__getRemote(remoteParams, progressKey, fnInProgress, fnCallback);
        }
    }



    getById(guildId, fnCallback) {
        const guild = this.index.find(g => g.get('guild_id') === guildId && g.get('expires') > Date.now());

        if (Immutable.Map.isMap(guild)) {
            fnCallback(null, guild);
        }
        else {
            const progressKey  = guildId;
            const remoteParams = {guild_id: guildId};
            const fnInProgress = this.getById.bind(this, guildId, fnCallback);

            this.__getRemote(remoteParams, progressKey, fnInProgress, fnCallback);
        }
    }



    getByName(guildName, fnCallback) {
        const guildSlug = slugifier.slugify(guildName);

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
                    console.log('__getRemote()::err::params', params);
                    if (err.status) {
                        const statusCode = _.parseInt(err.status);
                        if(statusCode >= 400 && statusCode <= 500) {
                            err = 'NotFound';
                        }
                        console.log('__getRemote()::err:status', err.status);
                    }
                    else {
                        console.log('__getRemote()::err:object', err);
                    }


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
            slug: slug,
            expires: Date.now() + _.random(cacheTimeMin, cacheTimeMax),
        });

        // console.log('__setGuild', guild.toJS());

        this.index = this.index.set(slug, guild);

        fnCallback(null, guild);

        // queue off __writeIndex
        async.nextTick(
            __writeIndex.bind(null, this.indexPath, this.index)
        );
    }



    __refresh(guild, fnCallback=_.noop) {
        const refreshThreshold = Date.now() + cacheRefresh;
        const isDueForRefresh = (guild.get('expires') < refreshThreshold);


        if (isDueForRefresh) {
            const guildId = guild.get('guild_id');
            const progressKey  = guildId;
            const remoteParams = {guild_id: guildId};

            // console.log(
            //     'REFRESH GUILD',
            //     (guild.get('expires') - refreshThreshold) / 1000 / 60,
            //     guild.get('guild_name')
            // );
            // console.log(guild.get('expires') < refreshThreshold);
            // console.log(new Date(guild.get('expires')));
            // console.log(new Date(Date.now()));
            // console.log((guild.get('expires') - refreshThreshold) / 1000 / 60);

            async.nextTick(this.__getRemote.bind(this, remoteParams, progressKey, fnCallback, fnCallback));
        }
    }


    __freshmaker() {
        try {
            const refreshThreshold = Date.now() + cacheRefresh;
            const fresherCycle     = _.random(fresherCycleMin, fresherCycleMax);
            const toRefresh        = this.index.toSeq()
                                       .filter(g => g.get('expires') < refreshThreshold)
                                       .sortBy(g => g.get('expires'))
                                       .take(fresherCycle);


            // console.log('__freshmaker', toRefresh.size, this.index.size);

            toRefresh.forEach(g => async.nextTick(this.__refresh.bind(this, g)));
        }
        catch(junk){
            console.log('__freshmaker', 'ERROR', junk);
        }

        async.nextTick(this.__freshmakerReschedule.bind(this));
    }

    __freshmakerReschedule() {
        setTimeout(
            this.__freshmaker.bind(this),
            _.random(fresherDelayMin, fresherDelayMax)
        )
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
            catch (err) {
                data = {};
                console.log('ERROR:', err);
            }
        }

        let guildsIndex = Immutable.fromJS(data);

        fnCallback(null, guildsIndex);
    });
}



const __writeIndex = _.debounce(__writeIndexBase, toDiskThrottle);

function __writeIndexBase(indexPath, guildData, fnCallback=_.noop) {
    console.log('__writeIndexBase', indexPath);

    let _toDisk;

    try {
        _toDisk = JSON.stringify(guildData.toJS());
    }
    catch (err) {
        _toDisk = '{}';
    }

    fs.writeFile(indexPath, _toDisk, (err) => {
        if(err) {
            console.log('__writeIndexBase::complete', 'ERR', err);
        }
        fnCallback(err);
    });
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = GuildsDB;