"use strict"


module.exports = function (req, res) {
    const renderStart = Date.now()

    res.render('home', {
        renderStart: renderStart,

        title: 'GW2 Guilds',
    });
};