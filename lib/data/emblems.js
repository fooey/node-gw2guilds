'use strict';


const fs   = require ('fs-extra');
const path = require('path');

const async     = require('async');
// const Immutable = require('immutable');
// const _         = require('lodash');


const Colors  = require('./colors');


class EmblemsDB {
    constructor(DB) {
        console.log('DB::emblems::constructor');
        this.DB = DB;

        this.dataPath = path.join(DB.pathRoot, 'emblems');

        this.colors  = new Colors(this.DB);
        this.shapes  = {
            foreground: require('../gw2emblem/defs.foreground.json'),
            background: require('../gw2emblem/defs.background.json'),
        };
    }



    init(fnCallback) {
        console.log('DB::emblems::init');
        async.auto({
            mkdirs: [fs.mkdirs.bind(null, this.dataPath)],
            colors : [this.colors.init.bind(this.colors)],
        }, (err) => {
            console.log('DB::emblems:complete');
            fnCallback(err);
        });
    }



    truncate() {
        fs.removeSync(this.dataPath);
    }
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = EmblemsDB;