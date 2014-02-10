"use strict"

const qs = require('querystring')
const async = require('async');
const cache = require('../lib/cache');


module.exports = function (req, res) {
    const renderStart = Date.now()

    cache.get(
        'guildMap',
        null,
        function(cbCacheMiss){cbCacheMiss(null, {})},
        __onGuildData
    );



    function __onGuildData(err, guilds){
        async.concat(
            Object.keys(guilds),
            __buildImg,
            __buildHtml
        );
    }
    


    function __buildImg(guildName, nextGuild){        
        nextGuild(null, [
            '<img src="' + __getImageUrl(guildName, 256) + '" />',
            // '<img src="' + __getImageUrl(guildName, 190) + '" />',
            // '<img src="' + __getImageUrl(guildName, 128) + '" />',
            // '<img src="' + __getImageUrl(guildName, 96) + '" />',
            // '<img src="' + __getImageUrl(guildName, 64) + '" />',
            // '<img src="' + __getImageUrl(guildName, 32) + '" />',
            // '<img src="' + __getImageUrl(guildName, 24) + '" />',
            // '<img src="' + __getImageUrl(guildName, 16) + '" />',
        ].join(''));
    }
    

    function __buildHtml(err, urlNodes){
        _sendToClient(urlNodes);
    }
    

    function _sendToClient(xmlArray){
        res.header('content-type', 'text/html');
        res.end(xmlArray.join('\n'));
    }




    function __getGuildUrl(guildName){
        const guildNameUrl = qs.escape(guildName.replace(/ /g, '-'));

        return __getCanonicalUrl([
            '',
            'guilds',
            guildNameUrl
        ].join('/'));
    }



    function __getImageUrl(guildName, size){
        return __getGuildUrl(guildName) + '/' + size + '.svg';
    }



    function __getCanonicalUrl(stub){
        return [
            'http://',
            req.headers.host,
            stub,
        ].join('');
    }


};