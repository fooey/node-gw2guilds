
import Promise from 'bluebird';

const Colors  = require('lib/data/colors');


class EmblemsDB {
    constructor(DB) {
        console.log('DB::emblems::constructor');
        this.DB = DB;

        this.shapes  = {
            foregrounds: require('lib/gw2emblem/defs.foreground.json'),
            backgrounds: require('lib/gw2emblem/defs.background.json'),
        };
    }



    init() {
        console.log('DB::emblems::init');

        return Promise.resolve();
    }


    getForeground(id) {
        const idStr = id.toString();
        return this.shapes.foregrounds[idStr];
    }


    getBackground(id) {
        const idStr = id.toString();
        return this.shapes.backgrounds[idStr];
    }
}




/*
*
*   DEFINE EXPORT
*
*/

module.exports = EmblemsDB;
