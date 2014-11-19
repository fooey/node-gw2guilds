/*
*	EMBLEM data from https://github.com/mtodor/gw2emblem
*/


"use strict";

const util = require('util');

const async = require('async');
const _ = require('lodash');

const SVGO = require('svgo');
const svgo = new SVGO();




/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	draw: draw,
};




/*
*
*   PRIVATE PROPERTIES
*
*/

const INSTANCE = {
	defs: {
		foreground: require('./gw2emblem/defs.foreground.json'),
		background: require('./gw2emblem/defs.background.json'),
		color: require('./gw2emblem/defs.color2.json'),
	},


	// used for shadow over color
	pto2_color: '#000000',
	pto2_op: 0.3,

	// used for emblem background
	bg_op: 1.0, //0.3

	// config required for transformation
	base_size: 256,

	defaultMatrix: [1, 0, 0, 1, 0, 0],
};




/*
*
*   PUBLIC METHODS
*
*/

function draw(emblemData, size, bgColor, onDrawComplete) {
	bgColor = (bgColor) ? ('#' + bgColor) : 'none';

	async.auto({
		drawBG: drawBackground.bind(null, emblemData, size),
		drawFG: drawForeground.bind(null, emblemData, size),

		merge: ['drawBG', 'drawFG', mergeSVG.bind(null, size, bgColor)],

		optimize: ['merge', optimizeSVG],
	},
	function(callback, data) {
		onDrawComplete(data.optimize);
	});
}






/*
*
*   PRIVATE METHODS
*
*/

function drawBackground(emblemData, size, callback) {
	if (emblemData && emblemData.background_id && INSTANCE.defs.background[emblemData.background_id]) {
		const bg = INSTANCE.defs.background[emblemData.background_id] || '';
		const bgColor = getColor(emblemData.background_color_id) || '#000000';

		const opacity = bg.t ? INSTANCE.bg_op : 1;
		const transformMatrix = getTransformMatrix('bg', emblemData.flags, size);

		drawShapes(bg.p, bgColor, opacity, transformMatrix, function(err, shapes) {
			callback(null, shapes.join('\n'));
		});
	}
	else {
		callback(null, null);
	}
}


function drawForeground(emblemData, size, callback) {
	if (emblemData && emblemData.foreground_id && INSTANCE.defs.foreground[emblemData.foreground_id]) {
		const fg = INSTANCE.defs.foreground[emblemData.foreground_id] || '';
		const color1 = getColor(emblemData.foreground_secondary_color_id) || '#FFFFFF';
		const color = getColor(emblemData.foreground_primary_color_id) || '#FF0000';

		const transformMatrix = getTransformMatrix('fg', emblemData.flags, size);

		var fgPaths = [];
		async.series([
			function(next) {
				drawShapes(fg.p1, color1, 1, transformMatrix, function(err, shapes) {
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next) {
				drawShapes(fg.p2, color, 1, transformMatrix, function(err, shapes) {
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next) {
				drawShapes(fg.pto2, INSTANCE.pto2_color, INSTANCE.pto2_op, transformMatrix, function(err, shapes) {
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next) {
				drawShapes(fg.pt1, color1, INSTANCE.pt1_op, transformMatrix, function(err, shapes) {
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
		],
		function(err) {
			callback(null, fgPaths.join('\n'));
		});
	}
	else {
		callback(null, null);
	}
}



function drawShapes(shapes, fill, opacity, matrixArray, callback) {
	if (shapes) {
		const matrix = matrixArray.join(',');

		var pathAttribs = [
			'stroke="none"',
			util.format('fill="%s"', fill),
		];
		if (opacity !== 1) {
			pathAttribs.push(util.format('opacity="%d"', opacity));
		}
		if (matrix !== INSTANCE.defaultMatrix.join(',')) {
			pathAttribs.push(util.format('transform="matrix(%s)"', matrix));
		}

		async.concat(
			shapes,
			function(shapePath, nextPath) {
				nextPath(null, util.format('<path %s d="%s"></path>', pathAttribs.join(' '), shapePath));
			},
			callback
		);
 	}
 	else {
 		callback(null, []);
 	}
}



function mergeSVG(size, bgColor, callback, autoData) {
	callback(null, [
		getSvgStyle(size),
		'<desc>Created by http://guilds.gw2w2w.com</desc>',
		getSvgRect(size, bgColor),
		autoData.drawBG,
		autoData.drawFG,
		'</svg>'
	].join(''));
}



function optimizeSVG(callback, autoData) {
	svgo.optimize(autoData.merge, function(result) {
		callback(null, result.data);
	});
}




/*
* UTIL
*/

function getSvgStyle(size) {
	return util.format(
		'<svg width="100%" height="100%" viewBox="0 0 %d %d" version="1.1" xmlns="http://www.w3.org/2000/svg">',
		size,
		size
	);
}

function getSvgRect(size, bgColor) {
	return util.format(
		'<rect x="0" y="0" width="%d" height="%d" fill="%s" stroke="none"></rect>',
		size,
		size,
		bgColor
	);
}



function getTransformMatrix(layer, flags, size) {
	const flips = getFlips(flags);

	const flipBackgroundHorizontal	= (layer === 'bg' && flips['FlipBackgroundHorizontal']);
	const flipForegroundHorizontal	= (layer === 'fg' && flips['FlipForegroundHorizontal']);
	const flipBackgroundVertical	= (layer === 'bg' && flips['FlipBackgroundVertical']);
	const flipForegroundVertical	= (layer === 'fg' && flips['FlipForegroundVertical']);
	const flipLayerHorizontal 		= (flipBackgroundHorizontal || flipForegroundHorizontal);
	const flipLayerVertical 		= (flipBackgroundVertical || flipForegroundVertical);


	var matrix = _.clone(INSTANCE.defaultMatrix); // (scaleX, 0, 0, scaleY, transformX, transformY)

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


function getFlips(flags) {
	var flips = {
		'FlipBackgroundHorizontal': 0,
		'FlipBackgroundVertical': 0,
		'FlipForegroundHorizontal': 0,
		'FlipForegroundVertical': 0,
	};

	_.forEach(flags, function(flag) {
		flips[flag] = 1;
	});

	return flips;
}


function getColor(colorId) {
	const decRGB = INSTANCE.defs.color[colorId].cloth.rgb;
	return rgbToHex(decRGB[0], decRGB[1], decRGB[2]);
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return ["#", componentToHex(r), componentToHex(g), componentToHex(b)].join('');
}
