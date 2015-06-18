'use strict';

/*
 *  EMBLEM data from https://github.com/mtodor/gw2emblem
 */


const Immutable = require('immutable');
const _         = require('lodash');
// const SVGO      = require('svgo');
// const svgo      = new SVGO({});



const DB     = require('lib/data');
const colors = require('lib/emblem/colors');




/*
*
*   CONSTANTS
*
*/

const SHADOW_COLOR   = '#000';
const SHADOW_OPACITY = 0.3;

const BG_OPACITY     = 1.0;
const BLEND_OPACITY  = 0.3;

const BASE_SIZE      = 256;
const DEFAULT_MATRIX = [1, 0, 0, 1, 0, 0];



const COLORID_ABYSS     = 473;
const COLORID_RED       = 673;
const COLORID_CELESTIAL = 6;




/*
*
*   PUBLIC METHODS
*
*/

function getGuildSVG(guild, opts, fnCallback) {
    if (!guild || !Immutable.Map.isMap(guild)) {
        fnCallback('NotFound');
    }
    else if (!guild.has('emblem')) {
        fnCallback('NoEmblem');
    }
    else {
        getSVG(
            guild.get('emblem'),
            opts,
            fnCallback
        );
    }
}



function getSVG(emblem, opts, fnCallback) {
    if (!Immutable.Map.isMap(emblem) || emblem.isEmpty()) {
        fnCallback('NoEmblem');
    }
    else {
        const size    = _.parseInt(opts.size).toString();
        const bgColor = (_.isString(opts.bgColor) && opts.bgColor.length > 0)
            ? `#${opts.bgColor}`
            : 'none';

        const background = getEmblemBackground(emblem, size);
        const foreground = getEmblemForeground(emblem, size);


        const emblemSvg = [
            `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" version="1.1" xmlns="http://www.w3.org/2000/svg">`,
                '<desc>Created by http://guilds.gw2w2w.com/</desc>',
                `<rect x="0" y="0" width="${size}" height="${size}" fill="${bgColor}" stroke="none" />`,
                background,
                foreground,
            '</svg>',
        ].join('');


        fnCallback(null, emblemSvg);
        // optimizeSVG(emblemSvg, fnCallback);
    }
}






/*
*
*   PRIVATE METHODS
*
*/



/*
*   BACKGROUND
*/

function getEmblemBackground(emblem, size) {
    const id      = emblem.get('background_id');
    const colorId = emblem.get('background_color_id') || COLORID_ABYSS;
    const flags   = emblem.get('flags').toArray();

    return getBackground(id, colorId, flags, size);
}



function getBackground(id, colorId, flags, size) {
    const bg = DB.emblems.getBackground(id);

    if (!bg || !bg.p || !_.isArray(bg.p) || !bg.p.length) {
        return '';
    }

    const bgColor   = getRGB(colorId);
    const transform = getTransformAttrib('bg', flags, size);

    return [
        `<g ${transform}>`,
            drawShapes(bg.p, bgColor, BG_OPACITY),
        `</g>`,
    ].join('\n');
}



/*
*   FOREGROUND
*/

function getEmblemForeground(emblem, size) {
    const id       = emblem.get('foreground_id');
    const colorId  = emblem.get('foreground_primary_color_id') || COLORID_RED;
    const colorId2 = emblem.get('foreground_secondary_color_id') || COLORID_CELESTIAL;
    const flags    = emblem.get('flags').toArray();

    return getForeground(id, colorId, colorId2, flags, size);
}



function getForeground(id, colorId, colorId2, flags, size) {
    const fg = DB.emblems.getForeground(id);

    if (!fg || !_.isObject(fg) || !Object.keys(fg).length) {
        return '';
    }


    const color     = getRGB(colorId);
    const color2    = getRGB(colorId2);
    const transform = getTransformAttrib('fg', flags, size);

    return [
        `<g ${transform}>`,
            drawShapes(fg.p1, color2, 1),
            drawShapes(fg.p2, color, 1),
            drawShapes(fg.pto2, SHADOW_COLOR, SHADOW_OPACITY),
            drawShapes(fg.pt1, color2, BLEND_OPACITY),
        `</g>`,
    ].join('\n');
}



/*
*   SHAPES
*/

function drawShapes(shapes, fill, opacity) {
    let results = '';

    if (!shapes || !_.isArray(shapes) || !shapes.length) {
        return '';
    }

    let pathAttribs = [
        `fill="${fill}"`,
    ];
    if (opacity !== 1) {
        pathAttribs.push(`opacity="${opacity}"`);
    }

    const pathOpen = '<path d="';
    const pathClose = '" />';

    const paths = (
        pathOpen
        + [...shapes].join(pathClose + '\n' + pathOpen)
        + pathClose
    );

    return `<g ${pathAttribs.join(' ')}>${paths}</g>`;
}




/*
*   SVG TRANSFORMATION
*/

// function optimizeSVG(svgString, fnCallback) {
//     svgo.optimize(svgString, result => fnCallback(null, result.data));
//     // callback(null, asyncAutoData.merge);
// }

function getTransformMatrix(layer, flags, size) {
    const flips = getFlips(flags);

    const flipBackgroundHorizontal = (layer === 'bg' && flips.FlipBackgroundHorizontal);
    const flipForegroundHorizontal = (layer === 'fg' && flips.FlipForegroundHorizontal);
    const flipBackgroundVertical   = (layer === 'bg' && flips.FlipBackgroundVertical);
    const flipForegroundVertical   = (layer === 'fg' && flips.FlipForegroundVertical);

    const flipLayerHorizontal      = (flipBackgroundHorizontal || flipForegroundHorizontal);
    const flipLayerVertical        = (flipBackgroundVertical || flipForegroundVertical);

    const needsTransform = (
        size !== BASE_SIZE
        || flipLayerHorizontal
        || flipLayerVertical
    );


    if (!needsTransform) {
        return DEFAULT_MATRIX;
    }
    else {
        let matrix = _.clone(DEFAULT_MATRIX); // (scaleX, 0, 0, scaleY, transformX, transformY)

        if (size !== BASE_SIZE) {
            const scale = (size / BASE_SIZE);
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
    return (_.isEqual(transformMatrix, DEFAULT_MATRIX))
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
        flag => {
            // IS AN ASSIGNMENT, NOT A CONDITIONAL
            flips[flag] = 1;
        }
    );

    return flips;
}



/*
*   COLORS
*/

function getColorHex(colorId) {
    const color = colors.getById(colorId);

    return color ? colors.getHexColor(color) : null;
}



function getRGB(colorId) {
    const rgb = colors.getRGBById(colorId);
    return `rgb(${rgb.join(',')})`;
}







/*
 *
 *   DEFINE EXPORT
 *
 */

module.exports = {
    getSVG: getSVG,
    getGuildSVG: getGuildSVG,
};