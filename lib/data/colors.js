'use strict';

import _ from 'lodash';
import Promise from 'bluebird';
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

        setTimeout(() => this.getColorsFromRemote(), 0);

        return Promise.resolve();
    }



    getById(id) {
        return this.index.get(id.toString());
    }



    getColorsFromRemote() {
        // console.log('ColorsDB::getColorsFromRemote');
        return request(`https://api.guildwars2.com/v2/colors`, { ids: 'all' }, 'getColors')
            .then((data) => this.setColorsFromRemote(data));
    }

    setColorsFromRemote(data) {
        if (Array.isArray(data) && data.length >= 472) {
            console.log('ColorsDB::setColorsFromRemote', 'Remote Update Successful', data.length);
            this.index = _.keyBy(data, 'id');
        }

        return this.index;
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
