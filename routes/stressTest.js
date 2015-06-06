'use strict';

const _ = require('lodash');
const async = require('async');
// const Immutable = require('immutable');
// const cache = require('../lib/cache');
// const guilds = require('../lib/guilds');


// const guildList = require('../cache/guildMap.json');

const guildList = require('../cache/seed.json');
const sampleSize = 32;//guildList.length;

module.exports = function(req, res) {
    // let sampleGuilds = _.sample(_.keys(guildList), sampleSize);
    let sampleGuilds = _.sample(guildList, sampleSize);

    console.log(sampleGuilds.length);
    // let sampleGuilds = guildList;

    async.concat(
        sampleGuilds,
        __getImageTags,
        __buildHtml
    );



    function __getImageTags(guildName, nextGuild) {
        async.concat([
            // 256,
            // 190,
            160,
            // 96,
            // 64,
            // 48,
            // 32,
            // 24,
            // 16,
        ],
        function(size, nextSize) {
            // let slug = guilds.slugify(guildName);
            const slug = guildName;
            let guildLink;
            guildLink = `/guilds/${slug}`;
            // guildLink = `http://guilds.gw2w2w.com/guilds/${slug}`;

            nextSize(null, `<a href="${guildLink}"><img src="${guildLink}/256.svg" title="${slug}" /></a>`);
        },
        function(err, results) {
            nextGuild(null, results.join(''));
        });
    }


    function __buildHtml(err, urlNodes) {
        urlNodes.unshift(`<style>
            a {border: none;}
            img {width: 64px; height: 64px; pading: 0; margin: 0; display: inline-block;}
        </style>`);
        let html = urlNodes.join('\n');

        _sendToClient(html);
    }


    function _sendToClient(html) {
        res.header('content-type', 'text/html');
        res.send(html);
    }


};