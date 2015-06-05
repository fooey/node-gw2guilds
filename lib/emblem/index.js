'use strict';

/*
 *  EMBLEM data from https://github.com/mtodor/gw2emblem
 */


// const async = require('async');
const _ = require('lodash');

// const SVGO = require('svgo');
// const svgo = new SVGO({
//     // pretty: true,
//     // plugins: [
//     //     {removeViewBox: false},

//     //     {convertPathData: true},
//     //     {convertTransform : false},
//     //     {mergePaths: true},
//     //     {convertShapeToPath: true},
//     //     {transformsWithOnePath: false},
//     // ],
// });


const colors = require('./colors');
const FOREGROUNDS = require('../gw2emblem/defs.foreground.json');
const BACKGROUNDS = require('../gw2emblem/defs.background.json');




/*
 *
 *   PRIVATE PROPERTIES
 *
 */

const INSTANCE = {
    pto2_color: '#000000',  // used for shadow over color
    pto2_op   : 0.3,

    // used for emblem background
    // bg_op: 0.3,
    bg_op: 1.0,

    // config required for transformation
    base_size: 256,

    defaultMatrix: [1, 0, 0, 1, 0, 0],
};




/*
 *
 *   PUBLIC METHODS
 *
 */

function get(emblemData, size, bgColor, fnCallback) {
    bgColor = (bgColor) ? ('#' + bgColor) : 'none';

    const foreground = getForeground(emblemData, size);
    const background = getBackground(
        emblemData.background_id,
        emblemData.background_color_id,
        emblemData.flags,
        size
    );

    const emblemSvg = [
        `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" version="1.1" xmlns="http://www.w3.org/2000/svg">`,
            '<desc>Created by http://guilds.gw2w2w.com/</desc>',
            `<rect x="0" y="0" width="${size}" height="${size}" fill="${bgColor}" stroke="none" />`,
            background,
            foreground,
        '</svg>',
    ].join('');


    fnCallback(emblemSvg);
    // optimizeSVG(emblemSvg, fnCallback);
}






/*
 *
 *   PRIVATE METHODS
 *
 */

function getBackground(id, colorId, flags, size) {
    const bg = BACKGROUNDS[id];

    if (!bg) {
        console.log(bg);
        return '';
    }

    const bgColor   = getColorHex(colorId) || '#000000';
    const opacity   = bg.t ? INSTANCE.bg_op : 1;
    const transform = getTransformAttrib('bg', flags, size);

    return [
        `<g ${transform}>`,
            drawShapes(bg.p, bgColor, opacity),
        `</g>`,
    ].join('\n');
}


function getForeground(emblemData, size) {
    if (!emblemData || !emblemData.foreground_id || !FOREGROUNDS[emblemData.foreground_id]) {
        return '';
    }

    const fg        = FOREGROUNDS[emblemData.foreground_id] || '';
    const color1    = getColorHex(emblemData.foreground_secondary_color_id) || '#FFFFFF';
    const color     = getColorHex(emblemData.foreground_primary_color_id) || '#FF0000';
    const transform = getTransformAttrib('fg', emblemData.flags, size);

    return [
        `<g ${transform}>`,
            drawShapes(fg.p1, color1, 1),
            drawShapes(fg.p2, color, 1),
            drawShapes(fg.pto2, INSTANCE.pto2_color, INSTANCE.pto2_op),
            drawShapes(fg.pt1, color1, INSTANCE.pt1_op),
        `</g>`,
    ].join('\n');
}



function drawShapes(shapes, fill, opacity) {
    let results = '';

    if (shapes && shapes.length) {
        // const matrix = matrixArray.join(',');

        let pathAttribs = [
            `fill="${fill}"`,
        ];
        if (opacity !== 1) {
            pathAttribs.push(`opacity="${opacity}"`);
        }

        // if (!_.isEqual(matrixArray, INSTANCE.defaultMatrix)) {
        //     pathAttribs.push(`transform="matrix(${matrixArray.join()})"`);
        // }

        const pathOpen = '<path d="';
        const pathClose = '" />';

        const paths = (
            pathOpen
            + [...shapes].join(pathClose + '\n' + pathOpen)
            + pathClose
        );

        results = `<g ${pathAttribs.join(' ')}>${paths}</g>`;
    }
    else {
        results = '';
    }

    return results;
}



function optimizeSVG(svgString, fnCallback) {
    svgo.optimize(svgString, result => fnCallback(result.data));
    // callback(null, asyncAutoData.merge);
}




/*
 * UTIL
 */



function getTransformMatrix(layer, flags, size) {
    const flips = getFlips(flags);

    const flipBackgroundHorizontal = (layer === 'bg' && flips.FlipBackgroundHorizontal);
    const flipForegroundHorizontal = (layer === 'fg' && flips.FlipForegroundHorizontal);
    const flipBackgroundVertical   = (layer === 'bg' && flips.FlipBackgroundVertical);
    const flipForegroundVertical   = (layer === 'fg' && flips.FlipForegroundVertical);

    const flipLayerHorizontal      = (flipBackgroundHorizontal || flipForegroundHorizontal);
    const flipLayerVertical        = (flipBackgroundVertical || flipForegroundVertical);

    const needsTransform = (
        size !== INSTANCE.base_size
        || flipLayerHorizontal
        || flipLayerVertical
    );


    if (!needsTransform) {
        return INSTANCE.defaultMatrix;
    }
    else {
        let matrix = _.clone(INSTANCE.defaultMatrix); // (scaleX, 0, 0, scaleY, transformX, transformY)

        if (size !== INSTANCE.base_size) {
            const scale = (size / INSTANCE.base_size);
            matrix[0] = scale;
            matrix[3] = scale;
        }

        if (flipLayerHorizontal) {
            matrix[0] = -matrix[0];
            matrix[4] = size;
        }

        if (flipLayerVertical) {
            matrix[5] = size;
            matrix[3] = -matrix[3];
        }

        return matrix;
    }
}


function getTransformAttrib(layer, flags, size) {
    const transformMatrix = getTransformMatrix(layer, flags, size);
    return (_.isEqual(transformMatrix, INSTANCE.defaultMatrix))
        ? ''
        : `transform="matrix(${transformMatrix.join()})"`;

}


function getFlips(flags) {
    let flips = {
        FlipBackgroundHorizontal: 0,
        FlipBackgroundVertical  : 0,
        FlipForegroundHorizontal: 0,
        FlipForegroundVertical  : 0,
    };

    _.forEach(flags,
        flag => flips[flag] = 1 // IS AN ASSIGNMENT, NOT A CONDITIONAL
    );

    return flips;
}


function getColorHex(colorId) {
    const color = colors.getById(colorId);

    return color ? colors.getHexColor(color) : null;
}







/*
 *
 *   DEFINE EXPORT
 *
 */

module.exports = {
    get: get,
};