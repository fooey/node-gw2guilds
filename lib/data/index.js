'use strict';

/**/


const fs   = require ('fs-extra');
const path = require('path');

const Guilds = require('./guilds');


/*
var data = "do shash'owania";
var crypto = require('crypto');
crypto.createHash('md5').update(data).digest("hex");
*/


class DB {
    constructor(pathRoot) {
        console.log('DB::constructor', arguments);

        this.pathRoot = pathRoot;

        fs.mkdirsSync(this.pathRoot);

        this.guilds = new Guilds(this);
    }

    truncate(){
        fs.removeSync(this.dataRoot);
    }
}




/*
*
*   Use as a singleton
*
*/

const dataRoot = path.join(process.cwd(), 'data');
const dbInstance = new DB(dataRoot);

module.exports = dbInstance;