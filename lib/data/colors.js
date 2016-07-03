'use strict';

import _ from 'lodash';
import request from 'lib/request';

import defaultColors from 'lib/gw2emblem/defs.color2.json';



class ColorsDB {
    constructor(DB) {
        console.log('DB::colors::constructor');
        this.DB = DB;

        this.index = _.keyBy(defaultColors, 'id');

        // this.dataPath = path.join(DB.pathRoot, 'colors');
    }



    init() {
        console.log('DB::colors::init');

        return this.__getRemoteColors();
    }



    getById(id) {
        return this.index.get(id.toString());
    }



    __getRemoteColors() {
        // console.log('ColorsDB::__getRemoteColors');
        const requestOpts = {
            url: `https://api.guildwars2.com/v2/colors?ids=all`,
            gzip: true,
        };

        return request(`https://api.guildwars2.com/v2/colors`, { ids: 'all' })
            .then((data) => {

                if (Array.isArray(data) && data.length >= 472) {
                    console.log('ColorsDB::__getRemoteColors', 'Remote Update Successful', data.length);
                    this.index = _.keyBy(data, 'id');
                }

                return this.index;
            });
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
