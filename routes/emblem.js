"use strict";

const Immutable = require('immutable');

const guilds = require('../lib/guilds');
const emblem = require('../lib/emblem');


module.exports = function(req, res) {
    const slug = req.params.guildSlug;
    const size = req.params.size;
    const bgColor = req.params.bgColor;

    guilds.getBySlug(slug, function(err, guild) {
        if (guild && Immutable.Map.isMap(guild)) {

            const canonical = getCanonical(size, bgColor, guild);

            if (req.url !== canonical) {
                res.redirect(301, canonical);
            }
            else if (!guild.has('emblem')) {
                // console.log('no emblem', guild);
                res.sendFile('./public/images/none.svg', {root: process.cwd()});
            }
            else {
                sendEmblem(res, guild, size, bgColor);
            }

            setTimeout(gaqTrackEvent.bind(null, req, size), 10);
        }
        else {
            res.status(404).send('Guild not found');
        }
    });
};



function getCanonical(size, bgColor, guild) {
    let svgPath = [size];
    if (bgColor) {
        svgPath.push(bgColor);
    }
    svgPath.push('svg');

    return [
        '',
        'guilds',
        guild.get('slug'),
        svgPath.join('.')
    ].join('/');
}


function sendEmblem(res, guild, size, bgColor) {
    const path = require('path');
    const fs   = require('fs-extra');

    const dataRoot = (process.env.NODE_ENV === 'development')
        ? path.join(process.cwd(), 'data')
        : '/data';

    const emblemHash = guild.get('emblem').hashCode();
    const emblemFile = [emblemHash, size, ''].join('/') + (bgColor || 'emblem') + '.svg';
    const emblemPath = path.join(dataRoot, 'emblems', emblemFile);

    // console.log(emblemHash, emblemFile, emblemPath);

    // const startTime = Date.now();
    fs.exists(emblemPath, function(exists) {
        if (exists) {
            res.sendFile(emblemPath);
            // console.log('Output Time: ', Date.now() - startTime, guild.get('slug'));
        }
        else {
            emblem.get(guild.get('emblem').toJS(), size, bgColor, function(svg) {

                fs.outputFile(emblemPath, svg, function(err){
                    if (err) {
                        console.log('writeSvg()::err', err);
                        res.send(svg);
                    }
                    else {
                        res.sendFile(emblemPath);
                    }
                    // console.log('Render Time: ', Date.now() - startTime, guild.get('slug'));
                });

            });
        }

    });

}


function gaqTrackEvent(req, size) {
    const referer = req.get('referer');

    const isHotlink = (
        !referer
        || (
            referer.indexOf('localhost') === -1
            && referer.indexOf('guilds.gw2w2w.com') === -1
        )
    );

    if (isHotlink) {
        const ua = require('universal-analytics');
        const uaUUID = (req.cookies && req.cookies.uaUUID) ? req.cookies.uaUUID : null;
        const visitor = ua('UA-51384-40', uaUUID);

        //Visitor#event(category, action, label, value)
        visitor.event('emblem-hotlink', req.params.guildSlug, referer, size).send();
    }
}