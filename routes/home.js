'use strict';

const DB = require('lib/data');
import Immutable from 'immutable';


module.exports = function(req, res) {
    const renderStart = Date.now();

    // let sampleGuilds = DB.guilds.index
    //     .toSeq()
    //     .filter(g => g.has('emblem'))
    //     .sortBy(Math.random.bind(Math))
    //     .take(5);

    res.render('home', {
        renderStart: renderStart,
        searchBar: false,
        guilds: [],

        title: 'GW2 Guilds',
    });

};
