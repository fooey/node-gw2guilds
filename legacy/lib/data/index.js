
const Promise = require('bluebird');

const Guilds  = require('lib/data/guilds');
const Colors = require('lib/data/colors');
const Emblems = require('lib/data/emblems');


class DB {
    constructor(pathRoot) {
        console.log('DB::constructor', arguments);

        this.guilds = new Guilds(this);
        this.colors = new Colors(this);
        this.emblems = new Emblems(this);
    }

    init() {
        console.log('DB::init');

        return Promise.all([
            this.guilds.init(),
            this.emblems.init(),
            this.colors.init(),
        ]).then((initResults) => {
            console.log('DB::init:complete');

            return initResults;
        });
    }
}




/*
*
*   Export a singleton
*
*/

const dbInstance = new DB();

module.exports = dbInstance;
