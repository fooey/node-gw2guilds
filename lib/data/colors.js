'use strict';

const async     = require('async');
const _         = require('lodash');


const gw2api    = require('gw2api');


//https://github.com/fontello/svgpath


class ColorsDB {
    constructor(DB) {
        console.log('DB::colors::constructor');
        this.DB = DB;

        this.index = require('../gw2emblem/defs.color2.json');

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
    gw2api.getColors({ids:'all'}, (err, data) => {

        let colorIndex;

        if (!err && data && data.length >= 472) {
            console.log('ColorsDB::__getRemoteColors', 'Remote Update Successful');
            colorIndex = data;
        }
        else {
            console.log('ColorsDB::__getRemoteColors', 'FAILED', err, data);
            colorIndex = require('../gw2emblem/defs.color2.json')
        }

        this.index = _.indexBy(colorIndex, 'id');

        fnCallback(err);
    });
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = ColorsDB;