'use strict';

/**/


const fs   = require ('fs-extra');
const path = require('path');

const async = require('async');

const Guilds  = require('./guilds');
const Emblems = require('./emblems');


class DB {
    constructor(pathRoot) {
        console.log('DB::constructor', arguments);

        this.pathRoot = pathRoot;

        this.guilds  = new Guilds(this);
        this.emblems = new Emblems(this);

    }

    init(fnCallback) {
        console.log('DB::init');
        async.auto({
            mkdirs: [fs.mkdirs.bind(fs, this.pathRoot)],
            guilds : ['mkdirs', this.guilds.init.bind(this.guilds)],
            emblems: ['guilds', this.emblems.init.bind(this.emblems)],
        }, (err) => {
            console.log('DB::init:complete');
            fnCallback(err);
        });
    }



    truncate() {
        fs.removeSync(this.dataRoot);
    }
}




/*
*
*   Expor a singleton
*
*/

const dataRoot = (process.env.NODE_ENV === 'development')
    ? path.join(process.cwd(), 'data')
    : '/data';

const dbInstance = new DB(dataRoot);

module.exports = dbInstance;