'use strict';

const async     = require('async');
const _         = require('lodash');


const gw2api    = require('gw2api');

const defaultColors = require('../gw2emblem/defs.color2.json');


class ColorsDB {
    constructor(DB) {
        console.log('DB::colors::constructor');
        this.DB = DB;

        this.index = _.indexBy(defaultColors, 'id');

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

        gw2api.getColors({ids: 'all'}, (err, data) => {

            if (!err && data && data.length >= 472) {
                console.log('ColorsDB::__getRemoteColors', 'Remote Update Successful', data.length);
                this.index = _.indexBy(data, 'id');
            }

        });
    }



}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = ColorsDB;