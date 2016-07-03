'use strict';

import _ from 'lodash';
import async from 'async';
import Promise from 'bluebird';
import LRU from 'lru-cache';

import request from 'lib/request';
import { query, QueryFile } from 'lib/db';
import slugifier from 'lib/slugifier.js';

const cacheProvider = LRU({
    max: 128,
    maxAge: (1000 * 60 * 5),
    // maxAge: (1),
});

const MAX_DB_AGE = (1000 * 60 * 60 * 24);
// const MAX_DB_AGE = 1;

const QUERY_GUILD_BYSLUG = new QueryFile('data/guild-bySlug.sql', {minify: true});
const QUERY_GUILD_BYID = new QueryFile('data/guild-byId.sql', {minify: true});
const QUERY_GUILD_SAMPLE = new QueryFile('data/guild-sample.sql', {minify: true});
const QUERY_GUILD_UPSERT = new QueryFile('data/guild-upsert.sql', {minify: true});
const QUERY_GUILD_ALL = new QueryFile('data/guild-all.sql', {minify: true});


class GuildsDB {
    constructor(DB) {
        console.log('DB::guilds::constructor');
    }



    init() {
        console.log('DB::guilds::init');

        return Promise.resolve();
    }



    /*
    *
    *   Public Methods
    *
    */

    getBySlug(guildSlug) {
        guildSlug = guildSlug.toLowerCase();
        const cacheKey = `getBySlug::${guildSlug}`;

        if (cacheProvider.has(cacheKey)) {
            // console.log('getBySlug', 'cache hit', cacheProvider.get(cacheKey));
            return Promise.resolve(cacheProvider.get(cacheKey));
        }

        // console.log('getBySlug', 'cache miss', cacheKey);

        return this.dbGetBySlug(guildSlug)
            .then((guild) => (guild && guild.guild_id) ? guild : this.remoteGetBySlug(guildSlug, cacheKey))
            .then((guild) => (guild && guild.guild_id) ? this.saveGuild(guild) : guild)
            .then((guild) => {
                cacheProvider.set(cacheKey, guild);
                return this.getBySlug(guildSlug); // recurse
            });
    }

    getById(guildId) {
        const cacheKey = `getById::${guildId}`;

        if (cacheProvider.has(cacheKey)) {
            // console.log('getById', 'cache hit', cacheProvider.get(cacheKey));
            return cacheProvider.get(cacheKey);
        }

        // console.log('getById', 'cache miss', cacheKey);

        return this.dbGetById(guildId)
            .then((guild) => (guild && guild.guild_id) ? guild : this.remoteGetById(guildId, cacheKey))
            .then((guild) => (guild && guild.guild_id) ? this.saveGuild(guild) : guild)
            .then((guild) => {
                cacheProvider.set(cacheKey, guild);
                return this.getById(guildId); // recurse
            });
    }

    getByName(guildName) {
        const guildSlug = slugifier.slugify(guildName);

        return this.getBySlug(guildSlug);
    }


    dbGetBySlug(guildSlug) {
        const now = Math.floor(Date.now() / 1000);
        const maxAge = now - MAX_DB_AGE;

        const queryParams = {
            guildSlug,
            maxAge,
        };

        return query(QUERY_GUILD_BYSLUG, queryParams)
            .then(recordset => [...recordset])
            .then(recordset => recordset[0])
            .then(result => this.convertRecordsToGuild(result));
    }

    dbGetById(guildId) {
        const now = Math.floor(Date.now() / 1000);
        const maxAge = now - MAX_DB_AGE;

        const queryParams = {
            guildId,
            maxAge,
        };

        return query(QUERY_GUILD_BYID, queryParams)
            .then(recordset => [...recordset])
            .then(recordset => recordset[0])
            .then(result => this.convertRecordsToGuild(result));
    }

    dbGetSample(limit) {
        const now = Math.floor(Date.now() / 1000);
        const maxAge = now - MAX_DB_AGE;

        const queryParams = {
            limit,
            maxAge,
        };

        return query(QUERY_GUILD_SAMPLE, queryParams)
            .then(recordset => [...recordset])
            .then(recordset => recordset.map((guild) => this.convertRecordsToGuild(guild)));
    }

    dbGetAll() {
        const queryParams = {

        };

        return query(QUERY_GUILD_ALL, queryParams)
            .then(recordset => [...recordset])
            .then(recordset => recordset.map((guild) => this.convertRecordsToGuild(guild)));
    }


    remoteGetBySlug(guildSlug, cacheKey) {
        const queryParams = {
            guild_name: slugifier.deslugify(guildSlug),
        };

        return this.getRemote(queryParams, cacheKey)
            .then(guild => {
                guild.slug = slugifier.slugify(guild.guild_name);
                return guild;
            });
    }

    remoteGetById(guildId, cacheKey) {
        const queryParams = {
            guild_id: guildId,
        };

        return this.getRemote(queryParams, cacheKey);
    }



    /*
    *
    *   Private Methods
    *
    */

    convertRecordsToGuild(result) {
        if (!result || !result.guild_id) {
            return null;
        }

        const emblem = {
            background_id: result.background_id,
            foreground_id: result.foreground_id,
            background_color_id: result.background_color_id,
            foreground_primary_color_id: result.foreground_primary_color_id,
            foreground_secondary_color_id: result.foreground_secondary_color_id,
            flags: [],
        };

        if (result.flags_flip_bg_horizontal) {
            emblem.flags = emblem.flags.concat('FlipBackgroundHorizontal');
        }
        if (result.flags_flip_bg_vertical) {
            emblem.flags = emblem.flags.concat('FlipBackgroundVertical');
        }
        if (result.flags_flip_fg_horizontal) {
            emblem.flags = emblem.flags.concat('FlipForegroundHorizontal');
        }
        if (result.flags_flip_fg_vertical) {
            emblem.flags = emblem.flags.concat('FlipForegroundVertical');
        }

        const guild = {
            guild_id: result.guild_id,
            guild_name: result.guild_name,
            tag: result.tag,
            slug: slugifier.slugify(result.guild_name),
            modified_date: result.modified_date,
            created_date: result.created_date,
            emblem,
        };

        return guild;
    }

    saveGuild(guildData) {
        const {
            guild_id,
            guild_name,
            tag,
            slug,
        } = guildData;

        // console.log('saveGuld', guildData);

        const emblem = {
            background_id: (guildData.emblem) ? guildData.emblem.background_id : null,
            foreground_id: (guildData.emblem) ? guildData.emblem.foreground_id : null,
            background_color_id: (guildData.emblem) ? guildData.emblem.background_color_id : null,
            foreground_primary_color_id: (guildData.emblem) ? guildData.emblem.foreground_primary_color_id : null,
            foreground_secondary_color_id: (guildData.emblem) ? guildData.emblem.foreground_secondary_color_id : null,
            flags_flip_bg_horizontal: (guildData.emblem) ? guildData.emblem.flags.indexOf('FlipBackgroundHorizontal') > -1 : null,
            flags_flip_bg_vertical: (guildData.emblem) ? guildData.emblem.flags.indexOf('FlipBackgroundVertical') > -1 : null,
            flags_flip_fg_horizontal: (guildData.emblem) ? guildData.emblem.flags.indexOf('FlipForegroundHorizontal') > -1 : null,
            flags_flip_fg_vertical: (guildData.emblem) ? guildData.emblem.flags.indexOf('FlipForegroundVertical') > -1 : null,
        };

        const queryParams = {
            guild_id,
            guild_name,
            tag,
            slug,
            now: Math.floor(Date.now() / 1000),
            ...emblem,
        };

        return query(QUERY_GUILD_UPSERT, queryParams)
            .then(() => guildData)
            .catch((err) => {
                console.log('saveGuild::err', err)
                throw(err);
            });
    }

    getRemote(queryParams, cacheKey) {
        // console.log('getRemote', queryParams);

        return request('https://api.guildwars2.com/v1/guild_details', queryParams, cacheKey);
            // .then((guildData) => {
            //     console.log('getRemote', guildData);
            //     return guildData;
            // });
    }
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = GuildsDB;

























































// dbCreateGuild(data, fnCB) {
//     console.log({data})
//     const guildSlug = slugifier.slugify(data.guild_name);
//
//     const qryOptions = {
//         name: `dbCreateGuild`,
//         key: `dbCreateGuild::${data.guild_id}`,
//         params: [
//             data.guild_id
//             , data.guild_name
//             , guildSlug
//             , data.tag
//             , data.emblem.background_id
//             , data.emblem.foreground_id
//             , data.emblem.background_color_id
//             , data.emblem.foreground_primary_color_id
//             , data.emblem.foreground_secondary_color_id
//             , data.emblem.flags.indexOf('FlipBackgroundHorizontal') > -1
//             , data.emblem.flags.indexOf('FlipBackgroundVertical') > -1
//             , data.emblem.flags.indexOf('FlipForegroundHorizontal') > -1
//             , data.emblem.flags.indexOf('FlipForegroundVertical') > -1
//         ],
//         single: true,
//         qry: `
//             INSERT INTO guilds(
//                 guild_id
//         		, guild_name
//         		, slug
//         		, tag
//         		, background_id
//         		, foreground_id
//         		, background_color_id
//         		, foreground_primary_color_id
//         		, foreground_secondary_color_id
//         		, flags_flip_bg_horizontal
//         		, flags_flip_bg_vertical
//         		, flags_flip_fg_horizontal
//         		, flags_flip_fg_vertical
//             )
//             VALUES (
//                 $1::uuid
//                 , $2::text
//                 , $3::text
//                 , $4::text
//                 , $5::integer
//                 , $6::integer
//                 , $7::integer
//                 , $8::integer
//                 , $9::integer
//                 , $10::boolean
//                 , $11::boolean
//                 , $12::boolean
//                 , $13::boolean
//             )
//         `,
//     };
//
//     return cachedQuery(qryOptions, fnCB);
// }


//     __setGuild(guildData, fnCallback) {
//         const slug = slugifier.slugify(guildData.guild_name);
//
//         let guild = Immutable.fromJS(guildData);
//
//         guild = guild.merge({
//             slug: slug,
//             expires: Date.now() + _.random(cacheTimeMin, cacheTimeMax),
//         });
//
//         // console.log('__setGuild', guild.toJS());
//
//         this.index = this.index.set(slug, guild);
//
//         fnCallback(null, guild);
//
//         // queue off __writeIndex
//         async.nextTick(
//             __writeIndex.bind(null, this.indexPath, this.index)
//         );
//     }
//
//
//
//     __deleteGuildById(guildid) {
//         const guild = this.index.find(g => g.get('guild_id') === guildid);
//
//         this.__deleteGuild(guild);
//     }
//
//
//     __deleteGuildBySlug(guildid) {
//         const guild = this.index.get(guildSlug);
//
//         this.__deleteGuild(guild);
//     }
//
//
//     __deleteGuild(guild) {
//         if (guild && Immutable.Map.isMap(guild)) {
//             this.index = this.index.deleteIn([guild.get('slug')]);
//
//             async.nextTick(
//                 __writeIndex.bind(null, this.indexPath, this.index)
//             );
//         }
//     }
//
//
//
//     __refresh(guild, fnCallback=_.noop) {
//         const refreshThreshold = Date.now() + cacheRefresh;
//         const isDueForRefresh = (guild.get('expires') < refreshThreshold);
//
//
//         if (isDueForRefresh) {
//             const guildId = guild.get('guild_id');
//             const progressKey  = guildId;
//             const remoteParams = {guild_id: guildId};
//
//             // console.log(
//             //     'REFRESH GUILD',
//             //     (guild.get('expires') - refreshThreshold) / 1000 / 60,
//             //     guild.get('guild_name')
//             // );
//             // console.log(guild.get('expires') < refreshThreshold);
//             // console.log(new Date(guild.get('expires')));
//             // console.log(new Date(Date.now()));
//             // console.log((guild.get('expires') - refreshThreshold) / 1000 / 60);
//
//             async.nextTick(this.getRemote.bind(this, remoteParams, progressKey, fnCallback, fnCallback));
//         }
//     }
//
//
//     __freshmaker() {
//         // try {
//         //     const refreshThreshold = Date.now() + cacheRefresh;
//         //     const fresherCycle     = _.random(fresherCycleMin, fresherCycleMax);
//         //     const toRefresh        = this.index.toSeq()
//         //                                .filter(g => g.get('expires') < refreshThreshold)
//         //                                .sortBy(g => g.get('expires'));
//         //
//         //
//         //     console.log('__freshmaker', toRefresh.size, this.index.size);
//         //
//         //     toRefresh
//         //         .take(fresherCycle)
//         //         .forEach(g => async.nextTick(this.__refresh.bind(this, g)));
//         // }
//         // catch(junk){
//         //     console.log('__freshmaker', 'ERROR', junk);
//         // }
//         //
//         // async.nextTick(this.__freshmakerReschedule.bind(this));
//     }
//
//     __freshmakerReschedule() {
//         setTimeout(
//             this.__freshmaker.bind(this),
//             _.random(fresherDelayMin, fresherDelayMax)
//         )
//     }
// }
//
//
// function __loadIndex(indexPath, fnCallback) {
//     console.log('__loadIndex()', indexPath);
//
//     fs.readFile(indexPath, (err, data) => {
//
//         if (err) {
//             console.log('__loadIndex():ERR', indexPath, err);
//             data = {};
//         }
//         else {
//             try {
//                 data = JSON.parse(data);
//                 console.log('__loadIndex() size', Object.keys(indexPath).length);
//             }
//             catch (err) {
//                 data = {};
//                 console.log('ERROR:', err);
//             }
//         }
//
//         let guildsIndex = Immutable.fromJS(data);
//
//         fnCallback(null, guildsIndex);
//     });
// }
//
//
//
// const __writeIndex = _.debounce(__writeIndexBase, toDiskThrottle);
//
// function __writeIndexBase(indexPath, guildData, fnCallback=_.noop) {
//     console.log('__writeIndexBase', indexPath);
//
//     let _toDisk;
//
//     try {
//         _toDisk = JSON.stringify(guildData.toJS());
//     }
//     catch (err) {
//         _toDisk = '{}';
//     }
//
//     fs.writeFile(indexPath, _toDisk, (err) => {
//         if(err) {
//             console.log('__writeIndexBase::complete', 'ERR', err);
//         }
//         fnCallback(err);
//     });
// }
//
//
//
// function parseJSON(jsonString, defaultVal) {
//     try {
//         return JSON.parse(jsonString);
//     }
//     catch(junk) {
//         return defaultVal;
//     }
