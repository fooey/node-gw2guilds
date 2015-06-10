'use strict';

const _ = require('lodash');

const DB = require('../data');



/*
*
*   PUBLIC METHODS
*
*/


function getById(id) {
    const idStr = id.toString();
    if (_.has(DB.emblems.colors.index, idStr)) {
        return DB.emblems.colors.index[idStr];
    }
    else {
        console.log('COLOR NOT FOUND', id);
    }
}



function getHexColor(color) {
    if (!color) {
        return null;
    }

    return rgbToHex.apply(null, color.cloth.rgb);
}



function getHexColorById(id) {
    return getHexColor(getById(id));
}



function getRGBById(id) {
    const color = getById(id);
    return color ? color.cloth.rgb : null;
}





/*
*
*   PRIVATE METHODS
*
*/

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}



function rgbToHex(r, g, b) {
    return ['#', componentToHex(r), componentToHex(g), componentToHex(b)].join('');
}





/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
    getById,
    getHexColor,
    getHexColorById,
    getRGBById,
};