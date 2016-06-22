'use strict';

import _ from 'lodash';
import async from 'async';
import request from 'request';

import defaultColors from 'lib/gw2emblem/defs.color2.json';



class ColorsDB {
    constructor(DB) {
        console.log('DB::colors::constructor');
        this.DB = DB;

        this.index = _.keyBy(defaultColors, 'id');

        // this.dataPath = path.join(DB.pathRoot, 'colors');
    }



    init(fnCallback) {
        console.log('DB::colors::init');

        async.nextTick(this.__getRemoteColors.bind(this, _.noop));
        fnCallback();
    }



    getById(id) {
        return this.index.get(id.toString());
    }



    __getRemoteColors(fnCallback) {
        // console.log('ColorsDB::__getRemoteColors');
        const requestOpts = {
            url: `https://api.guildwars2.com/v2/colors?ids=all`,
            gzip: true,
        };

        // request(requestOpts, (err, response, body) => {
        //     const data = parseJSON(body, []);
        //
        //     // console.log('ColorsDB::__getRemoteColors', data.length);
        //
        //     if (response.statusCode === 200 && !err && Array.isArray(data) && data.length >= 472) {
        //         console.log('ColorsDB::__getRemoteColors', 'Remote Update Successful', data.length);
        //         this.index = _.keyBy(data, 'id');
        //     }
        //
        // });
    }
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

module.exports = ColorsDB;
