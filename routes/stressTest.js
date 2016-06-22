
import _ from 'lodash';

const guildList = require('data/guilds/guilds-index');
const guildNames = Object.keys(guildList);
const sampleSize = 32; // guildList.length;


module.exports = function(req, res) {
    let sampleGuilds;
    sampleGuilds = _.sampleSize(guildNames, sampleSize);
    // sampleGuilds = guildNames.slice(0, sampleSize);

    console.log(`${sampleGuilds.length} / ${guildNames.length}`);

    const images = sampleGuilds.map((slug) => {
        let guildLink;
        guildLink = `/guilds/${slug}`;
        guildLink = `https://guilds.gw2w2w.com${guildLink}`;

        return `<a href="${guildLink}"><img src="${guildLink}.svg" title="${slug}" /></a>`;
    }).join('\n');


    res.send(`
        <style>
            body {
                display: flex;
                justify-content: space-around;
                height: auto;
                align-items: flex-start;
                flex-flow: row wrap;
            }
            a {
                border: none;
            }
            img {
                width: 96px;
                height: 96px;
                pading: 0;
                margin: 8px;
                display: inline-block;
            }
        </style>
        ${images}
    `);
};
