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

        async.auto({
            set   : [__getRemoteColors.bind(this)],
        }, fnCallback);

    }



    getById(id) {
        return this.index.get(id.toString());
    }



}



function __getRemoteColors(fnCallback) {
    fnCallback(null);

    async.nextTick(gw2api.getColors.bind(this, {ids: 'all'}, (err, data) => {
        let colorIndex;

        if (!err && data && data.length >= 472) {
            console.log('ColorsDB::__getRemoteColors', 'Remote Update Successful');
            colorIndex = data;
            this.index = _.indexBy(colorIndex, 'id');
        }

    }));
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = ColorsDB;