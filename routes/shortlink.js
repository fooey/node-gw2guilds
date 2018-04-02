'use strict';

const guilds = require('lib/guilds');

module.exports = function(req, res) {
    // const renderStart = Date.now();

    const guildId = req.params.guildId;
    const size = req.params.size || 256;
    const bgColor = req.params.bgColor;
    const extension = req.params.extension;


    return guilds.getById(guildId).then((data)  => {
        if (data && data.guild_name) {
            if (!extension) {
                return res.redirect(301, '/guilds/' + data.slug);
            }
            else if (extension === 'svg') {
                let svgPath = [size];
                if (bgColor) {svgPath.push(bgColor);}
                svgPath.push('svg');

                return res.redirect(301, '/guilds/' + data.slug + '/' + svgPath.join('.'));
            }
            else {
                console.log(req.params);
                return res.status(500).send('kaboom');
            }
        }
        else {
            return res.status(404).send('Guild not found');
        }
    })
    .catch((err) => {
        // console.log(err.message, err.type, err);

        if (err.type && err.type === 'NotCanonical') {
            return res.redirect(301, err.canonicalUrl);
        }
        else if (err.type && err.type === 'NotFound') {
            return res.status(404).send('Guild not found');
        }
        else if (err.response && err.error && err.statusCode === 400) {
            return res.status(404).send(err.error);
        }
        else {
            return res.status(500).send(err);
        }
    });

};
