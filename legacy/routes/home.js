'use strict';

const DB = require('lib/data');


module.exports = function(req, res) {
    const renderStart = Date.now();

    DB.guilds.dbGetSample(12).then((guilds) => {
        res.render('home', {
            renderStart: renderStart,
            searchBar: false,
            guilds,

            title: 'GW2 Guilds',
        });
    });

};
