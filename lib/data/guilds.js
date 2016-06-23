'use strict';


import qs from 'querystring';
import fs from 'fs-extra';
import path from 'path';

import _ from 'lodash';
import async from 'async';
import Immutable from 'immutable';
import { cachedQuery, query, qrm } from 'lib/db';
import cacheProvider from 'lib/cache';
import fetch from 'node-fetch';


import slugifier from 'lib/slugifier.js';


const inProgressDelay = 20; // ms
const toDiskThrottle = (4) * 1000;

const msHour = (1000 * 60 * 60 * 1);
const cacheTimeMin = msHour * 24;
const cacheTimeMax = msHour * 36;
const cacheRefresh = msHour * 4;

const fresherDelayMin = (1000 * 4);
const fresherDelayMax = (1000 * 8);
const fresherCycleMin = 4;
const fresherCycleMax = 8;

class GuildsDB {
    constructor(DB) {
        console.log('DB::guilds::constructor');
        // this.DB = DB;
        //
        // this.dataPath = path.join(DB.pathRoot, 'guilds');
        // this.indexPath = path.join(this.dataPath, 'guilds-index.json');
        //
        // this.inProgress = {};
    }



    init(fnCallback) {
        console.log('DB::guilds::init');
        fnCallback();

        // async.auto({
        //     mkdirs  : [(cb) => fs.mkdirs(this.dataPath, cb)],
        //     loadData: ['mkdirs', cb => {
        //         __loadIndex(this.indexPath, (err, data) => {
        //             this.index = data;
        //             cb(err);
        //         });
        //     }],
        // }, (err) => {
        //     if (err) {
        //         throw(err);
        //     }
        //
        //     // don't precache on dev
        //     if (process.env.NODE_ENV === 'production') {
        //         async.nextTick(this.__freshmakerReschedule.bind(this));
        //     }
        //
        //     fnCallback(err);
        // });
    }



    /*
    *
    *   Public Methods
    *
    */

    // truncate() {
    //     fs.removeSync(this.dataPath);
    // }



    getBySlug(guildSlug) {
        const cacheKey = `getBySlug::${guildSlug}`;

        return this.dbGetBySlug(guildSlug, cacheKey)
            .then((guild) => {
                console.log({guild})
                if(guild !== null && guild.length) {
                    return guild;
                }
                else {
                    cacheProvider.set(cacheKey, this.remoteGetBySlug(guildSlug, cacheKey));
                    return cacheProvider.get(cacheKey);
                }
            })
            .then((guild) => {
                console.log({guild});
                return guild;
            });
    }

    cacheGetBySlug(guildSlug, cacheKey) {

    }

    dbGetBySlug(guildSlug, cacheKey) {
        const queryString = `
            SELECT *
            FROM guilds
            WHERE slug = '${guildSlug}'
        `;
        const queryParams = {
            guildSlug
        };

        return cachedQuery(
            cacheKey,
            queryString,
            queryParams,
            qrm.any
        )
        .then((result) => {
            console.log({result});
            return result;
        })
        .catch((err) => {
            console.log('dbGetBySlug::err', err)
            throw(err);
        });
    }

    remoteGetBySlug(guildSlug, cacheKey) {
        const queryParams = {
            guild_name: slugifier.deslugify(guildSlug),
        };

        return this.__getRemote(queryParams, cacheKey);
    }



    getById(guildId, fnCallback) {
        const guild = this.index.find(g => g.get('guild_id') === guildId && g.get('expires') > Date.now());


        this.dbGetById(guildId, (result) => console.log(result));


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

    dbGetById(guildId, getCB) {
        const qryOptions = {
            name: `getById`,
            key: `getById::${guildId}`,
            params: [guildId],
            single: true,
            qry: `
                SELECT *
                FROM guilds
                WHERE guild_id = $1::uuid;
            `,
        };

        return cachedQuery(qryOptions, getCB);
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

    saveGuild(guildData) {
        const queryParams = {
            ...guildData,
            ...guildData.emblem,
            slug: slugifier.slugify(guildData.guild_name),
        }
        delete queryParams.emblem;

        const queryString = `
            INSERT INTO guilds (
                guild_id
                , guild_name
                , tag
                , slug
                , background_id
                , foreground_id
                , background_color_id
                , foreground_primary_color_id
                , foreground_secondary_color_id
            )
            VALUES (
                $[guild_id]
                , $[guild_name]
                , $[tag]
                , $[slug]
                , $[background_id]
                , $[foreground_id]
                , $[background_color_id]
                , $[foreground_primary_color_id]
                , $[foreground_secondary_color_id]
            )
            ON CONFLICT (guild_id)
            DO UPDATE
            SET guild_name = EXCLUDED.guild_name
                , tag = EXCLUDED.tag
                , slug = EXCLUDED.slug
                , background_id = EXCLUDED.background_id
                , foreground_id = EXCLUDED.foreground_id
                , background_color_id = EXCLUDED.background_color_id
                , foreground_primary_color_id = EXCLUDED.foreground_primary_color_id
                , foreground_secondary_color_id = EXCLUDED.foreground_secondary_color_id
                , date_modified = EXTRACT(EPOCH FROM Now())
                , date_accessed = EXTRACT(EPOCH FROM Now())
        `;
        console.log('saveGuild', {queryString});
        console.log('saveGuild', {queryParams});

        return query(
            queryString,
            queryParams
        )
        .then(() => guildData)
        .catch((err) => {
            console.log('dbGetBySlug::err', err)
            throw(err);
        });
    }

    __getRemote(queryParams, cacheKey) {
        console.log('__getRemote', queryParams);

        return fetch(`https://api.guildwars2.com/v1/guild_details?${qs.stringify(queryParams)}`, { method: 'GET' })
            .then(res => res.json())
            .then((guildData) => {
                console.log({guildData});

                if (!guildData || !guildData.hasOwnProperty('guild_id')) {
                    throw('NotFound');
                }
                else {
                    return this.saveGuild(guildData);
                }
            })
            .catch((err) => {
                console.log('__getRemote', err);
            });

        // if (this.inProgress[key]) {
        //     // console.log('__getRemote', params, 'in progress, waiting');
        //     setTimeout(fnInProgress, inProgressDelay);
        // }
        // else {

                // this.dbCreateGuild(guildData, (result, err) => {
                //     console.log(result, err)
                // })

            //     console.log('__getRemote', params, err);
            //     console.log('__getRemote', params, guildData);
            //     console.log('__getRemote', params, response.status);
            //
            //     if (err || !guildData.guild_id) {
            //         console.log('__getRemote()::err::params', params);
            //
            //         // this.dbCreateGuild(guildData, (result, err) => {
            //         //     console.log(result, error)
            //         // })
            //
            //         if (err.status) {
            //             const statusCode = _.parseInt(err.status);
            //
            //             if (statusCode >= 400 && statusCode < 500) {
            //                 err = 'NotFound';
            //             }
            //
            //             if (params.guild_id) {
            //                 this.__deleteGuildById(params.guild_id);
            //             }
            //
            //         }
            //         else {
            //             console.log('__getRemote()::err:object', err);
            //         }
            //
            //
            //         fnCallback(err);
            //     }
            //     else {
            //         this.__setGuild(guildData, fnCallback);
            //     }
            //
            // });
        // }
    }

    dbCreateGuild(data, fnCB) {
        console.log({data})
        const guildSlug = slugifier.slugify(data.guild_name);

        const qryOptions = {
            name: `dbCreateGuild`,
            key: `dbCreateGuild::${data.guild_id}`,
            params: [
                data.guild_id
                , data.guild_name
                , guildSlug
                , data.tag
                , data.emblem.background_id
                , data.emblem.foreground_id
                , data.emblem.background_color_id
                , data.emblem.foreground_primary_color_id
                , data.emblem.foreground_secondary_color_id
                , data.emblem.flags.indexOf('FlipBackgroundHorizontal') > -1
                , data.emblem.flags.indexOf('FlipBackgroundVertical') > -1
                , data.emblem.flags.indexOf('FlipForegroundHorizontal') > -1
                , data.emblem.flags.indexOf('FlipForegroundVertical') > -1
            ],
            single: true,
            qry: `
                INSERT INTO guilds(
                    guild_id
            		, guild_name
            		, slug
            		, tag
            		, background_id
            		, foreground_id
            		, background_color_id
            		, foreground_primary_color_id
            		, foreground_secondary_color_id
            		, flags_flip_bg_horizontal
            		, flags_flip_bg_vertical
            		, flags_flip_fg_horizontal
            		, flags_flip_fg_vertical
                )
                VALUES (
                    $1::uuid
                    , $2::text
                    , $3::text
                    , $4::text
                    , $5::integer
                    , $6::integer
                    , $7::integer
                    , $8::integer
                    , $9::integer
                    , $10::boolean
                    , $11::boolean
                    , $12::boolean
                    , $13::boolean
                )
            `,
        };

        return cachedQuery(qryOptions, fnCB);
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



    __deleteGuildById(guildid) {
        const guild = this.index.find(g => g.get('guild_id') === guildid);

        this.__deleteGuild(guild);
    }


    __deleteGuildBySlug(guildid) {
        const guild = this.index.get(guildSlug);

        this.__deleteGuild(guild);
    }


    __deleteGuild(guild) {
        if (guild && Immutable.Map.isMap(guild)) {
            this.index = this.index.deleteIn([guild.get('slug')]);

            async.nextTick(
                __writeIndex.bind(null, this.indexPath, this.index)
            );
        }
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
        // try {
        //     const refreshThreshold = Date.now() + cacheRefresh;
        //     const fresherCycle     = _.random(fresherCycleMin, fresherCycleMax);
        //     const toRefresh        = this.index.toSeq()
        //                                .filter(g => g.get('expires') < refreshThreshold)
        //                                .sortBy(g => g.get('expires'));
        //
        //
        //     console.log('__freshmaker', toRefresh.size, this.index.size);
        //
        //     toRefresh
        //         .take(fresherCycle)
        //         .forEach(g => async.nextTick(this.__refresh.bind(this, g)));
        // }
        // catch(junk){
        //     console.log('__freshmaker', 'ERROR', junk);
        // }
        //
        // async.nextTick(this.__freshmakerReschedule.bind(this));
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



function parseJSON(jsonString, defaultVal) {
    try {
        return JSON.parse(jsonString);
    }
    catch(junk) {
        return defaultVal;
    }
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = GuildsDB;
