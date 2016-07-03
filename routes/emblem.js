'use strict';

const path = require('path');
const async = require('async');
const Promise = require('bluebird');

const guilds = require('lib/guilds');
const emblem = require('lib/emblem');

const getSvg = Promise.promisify(emblem.getGuildSVG);


module.exports = function(req, res) {
    const slug = req.params.guildSlug;
    const size = req.params.size;
    const bgColor = req.params.bgColor;

    const opts = {size, bgColor};

    // console.log('Routes::emblem', req.params);


    // const startTime = Date.now();

    return guilds.getBySlug(slug)
        .then((guild) => {
            if (!guild.guild_id) {
                throw({ type: 'NotFound' })
            }

            const canonicalUrl = getCanonicalUrl(guild, opts);
            const currentUrl = req.url;

            if (currentUrl !== canonicalUrl && decodeURI(currentUrl) !== decodeURI(canonicalUrl)) {
                throw({ type: 'NotCanonical', canonicalUrl })
            }

            return guild;
        })
        .then((guild) => {
            return getSvg(guild, opts)
                .then((svg) => res.type('image/svg+xml').send(svg));
        })
        .catch((err) => {
            // console.log(err.message, err.type, err);

            if (err.type && err.type === 'NotCanonical') {
                return res.redirect(301, err.canonicalUrl);
            }
            else if (err.type && err.type === 'NotFound') {
                return res.status(404).send('Guild not found');
            }
            else if (err.message === 'NoEmblem' || (err.type && err.type === 'NoEmblem')) {
                return res.sendFile('public/images/none.svg', {root: process.cwd()});
            }
            else if (err.response && err.error && err.statusCode === 400) {
                return res.status(404).send(err.error);
            }
            else {
                return res.send(err);
            }
        });

    // async.auto({
    //     guild    : [guilds.getBySlug.bind(guilds, slug)],
    //     canonical: ['guild', (cb, results) => isCanonical(req.url, results.guild, opts, cb)],
    //     svg      : ['canonical', (cb, results) => emblem.getGuildSVG(results.guild, opts, cb)],
    // }, (err, results) => {
    //     if (err) {
    //         if (err === 'NotCanonical') {
    //             res.redirect(301, results.canonical);
    //         }
    //         else if (err === 'NotFound') {
    //             res.status(404).send('Guild not found');
    //         }
    //         else if (err === 'NoEmblem') {
    //             res.sendFile('public/images/none.svg', {root: process.cwd()});
    //         }
    //         else {
    //             console.log('ERROR', slug, err);
    //             res.status(500).send(JSON.stringify(err));
    //         }
    //     }
    //     else {
    //         res.type('image/svg+xml').send(results.svg);
    //
    //         // console.log('Render Time: ', Date.now() - startTime, slug);
    //
    //         async.nextTick(gaqTrackEvent.bind(null, req, size));
    //     }
    // });
};



function getCanonicalUrl(guild, opts) {
    const svgPath = [opts.size];
    if (opts.bgColor) {
        svgPath.push(opts.bgColor);
    }
    svgPath.push('svg');

    const canonicalUrl = [
        '',
        'guilds',
        guild.slug,
        svgPath.join('.'),
    ].join('/');

    return canonicalUrl;
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
        visitor.event('emblem-hotlink', req.params.guildSlug, referer, size).send();
    }
}



    // async.auto({
    //     guild    : [guilds.getBySlug.bind(guilds, slug)],
    //     canonical: ['guild', (cb, results) => isCanonical(req.url, results.guild, opts, cb)],
    //     svg      : ['canonical', (cb, results) => emblem.getGuildSVG(results.guild, opts, cb)],
    // }, (err, results) => {
    //     if (err) {
    //         if (err === 'NotCanonical') {
    //             res.redirect(301, results.canonical);
    //         }
    //         else if (err === 'NotFound') {
    //             res.status(404).send('Guild not found');
    //         }
    //         else if (err === 'NoEmblem') {
    //             res.sendFile('public/images/none.svg', {root: process.cwd()});
    //         }
    //         else {
    //             console.log('ERROR', slug, err);
    //             res.status(500).send(JSON.stringify(err));
    //         }
    //     }
    //     else {
    //         res.type('image/svg+xml').send(results.svg);
    //
    //         // console.log('Render Time: ', Date.now() - startTime, slug);
    //
    //         async.nextTick(gaqTrackEvent.bind(null, req, size));
    //     }
    // });
