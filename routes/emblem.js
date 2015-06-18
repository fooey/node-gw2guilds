'use strict';

const path  = require('path');
const async = require('async');

const guilds = require('lib/guilds');
const emblem = require('lib/emblem');


module.exports = function(req, res) {
    const slug    = req.params.guildSlug;
    const size    = req.params.size;
    const bgColor = req.params.bgColor;

    const opts    = {size, bgColor};

    // console.log('Routes::emblem', req.params);


    // const startTime = Date.now();

    async.auto({
        guild    : [guilds.getBySlug.bind(guilds, slug)],
        canonical: ['guild', (cb, results) => isCanonical(req.url, results.guild, opts, cb)],
        svg      : ['canonical', (cb, results) => emblem.getGuildSVG(results.guild, opts, cb)],
    }, (err, results) => {
        if (err) {
            if (err === 'NotCanonical') {
                res.redirect(301, results.canonical);
            }
            else if (err === 'NotFound') {
                res.status(404).send('Guild not found');
            }
            else if (err === 'NoEmblem') {
                res.sendFile('public/images/none.svg', {root: process.cwd()});
            }
            else {
                console.log('ERROR', slug, err);
                res.status(500).send(JSON.stringify(err));
            }
        }
        else {
            res.type('image/svg+xml').send(results.svg);

            // console.log('Render Time: ', Date.now() - startTime, slug);

            async.nextTick(gaqTrackEvent.bind(null, req, size));
        }
    });
};



function isCanonical(currentUrl, guild, opts, cb) {
    let svgPath = [opts.size];
    if (opts.bgColor) {
        svgPath.push(opts.bgColor);
    }
    svgPath.push('svg');

    const canonicalUrl = [
        '',
        'guilds',
        guild.get('slug'),
        svgPath.join('.'),
    ].join('/');

    const err = (currentUrl !== canonicalUrl)
        ? 'NotCanonical'
        : null;

    cb(err, canonicalUrl);
}


// function sendEmblem(res, guild, size, bgColor) {

//     const emblemHash = guild.get('emblem').hashCode();
//     const emblemFile = [emblemHash, size, ''].join('/') + (bgColor || 'emblem') + '.svg';
//     const emblemPath = path.join(dataRoot, 'emblems', emblemFile);

//     // console.log(emblemHash, emblemFile, emblemPath);

//     // const startTime = Date.now();
//     fs.exists(emblemPath, function(exists) {
//         if (exists) {
//             res.sendFile(emblemPath);
//             // console.log('Output Time: ', Date.now() - startTime, guild.get('slug'));
//         }
//         else {
//             emblem.getGuildSVG(guild, size, bgColor, function(err, svg) {

//                 fs.outputFile(emblemPath, svg, function(err) {
//                     if (err) {
//                         console.log('writeSvg()::err', err);
//                         res.send(svg);
//                     }
//                     else {
//                         res.sendFile(emblemPath);
//                     }
//                     // console.log('Render Time: ', Date.now() - startTime, guild.get('slug'));
//                 });

//             });
//         }

//     });

// }


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