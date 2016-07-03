'use strict';

import _ from 'lodash';
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

const QUERY_GUILD_BYSLUG = new QueryFile(process.cwd() + '/data/guild-bySlug.sql', {minify: true});
const QUERY_GUILD_BYID = new QueryFile(process.cwd() + '/data/guild-byId.sql', {minify: true});
const QUERY_GUILD_SAMPLE = new QueryFile(process.cwd() + '/data/guild-sample.sql', {minify: true});
const QUERY_GUILD_UPSERT = new QueryFile(process.cwd() + '/data/guild-upsert.sql', {minify: true});
const QUERY_GUILD_ALL = new QueryFile(process.cwd() + '/data/guild-all.sql', {minify: true});


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
