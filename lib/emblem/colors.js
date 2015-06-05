"use strict";

const _ = require('lodash');

const DB = require('../data');






/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
    getById,
    getHexColor,
    getHexColorById,
};



/*
*
*   PUBLIC METHODS
*
*/



function getById(id) {
    return DB.emblems.colors.index[id.toString()];
}


function getHexColor(color) {
    const rgb = color.cloth.rgb;

    return rgbToHex.apply(null, rgb);
}

function getHexColorById(id) {
    return getHexColor(getById(id));
}



function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return ["#", componentToHex(r), componentToHex(g), componentToHex(b)].join('');
}
