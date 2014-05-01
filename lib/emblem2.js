/*
*	EMBLEM data from https://github.com/mtodor/gw2emblem
*/


"use strict"

const util = require('util');

const async = require('async');
const _ = require('lodash');




/*
*
*   DEFINE EXPORT
*
*/

let Controller = {};
module.exports = Controller;




/*
*
*   PRIVATE PROPERTIES
*
*/

const __INSTANCE = {
	defs: {
		foreground: require('./gw2emblem/defs.foreground.json'),
		background: require('./gw2emblem/defs.background.json'),
		// color: require('./gw2emblem/defs.color.json'),
		color2: require('./gw2emblem/defs.color2.json'),
	},


	// used for shadow over color
	pto2_color: '#000000',
	pto2_op: 0.3,

	// used for emblem background
	bg_op: 1.0, //0.3

	// config required for transformation
	base_size: 256,

	defaultMatrix: [1,0,0,1,0,0],
};




/*
*
*   PUBLIC METHODS
*
*/

Controller.draw = function(emblemData, size, bgColor, onDrawComplete) {
	bgColor = (bgColor) ? ('#' + bgColor) : 'none';

	async.auto({
		drawBG: __drawBackground.bind(null, emblemData, size),
		drawFG: __drawForeground.bind(null, emblemData, size),

		merge: ['drawBG', 'drawFG', __mergeSVG.bind(null, size, bgColor)],

		optimize: ['merge', __optimizeSVG],
	},
	function(callback, data){
		onDrawComplete(data.optimize);
	});
};






/*
*
*   PRIVATE METHODS
*
*/

function __drawBackground(emblemData, size, callback) {
	if(emblemData && emblemData.background_id && __INSTANCE.defs.background[emblemData.background_id]){
		const bg = __INSTANCE.defs.background[emblemData.background_id] || '';
		const bgColor = __getColor(emblemData.background_color_id) || '#000000';

		const opacity = bg.t ? __INSTANCE.bg_op : 1;
		const transformMatrix = __getTransformMatrix('bg', emblemData.flags, size);
		
		__drawShapes(bg.p, bgColor, opacity, transformMatrix, function(err, shapes){
			callback(null, shapes.join('\n'));
		});
	}
	else{
		callback(null, null);
	}
}


function __drawForeground(emblemData, size, callback) {
	if(emblemData && emblemData.foreground_id && __INSTANCE.defs.foreground[emblemData.foreground_id]){
		const fg = __INSTANCE.defs.foreground[emblemData.foreground_id] || '';
		const color1 = __getColor(emblemData.foreground_secondary_color_id) || '#FFFFFF';
		const color2 = __getColor(emblemData.foreground_primary_color_id) || '#FF0000';

		const transformMatrix = __getTransformMatrix('fg', emblemData.flags, size);
	
		let fgPaths = [];
		async.series([
			function(next){
				__drawShapes(fg.p1, color1, 1, transformMatrix, function(err, shapes){
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next){
				__drawShapes(fg.p2, color2, 1, transformMatrix, function(err, shapes){
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next){
				__drawShapes(fg.pto2, __INSTANCE.pto2_color, __INSTANCE.pto2_op, transformMatrix, function(err, shapes){
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next){
				__drawShapes(fg.pt1, color1, __INSTANCE.pt1_op, transformMatrix, function(err, shapes){
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
		],
		function(err){
			callback(null, fgPaths.join('\n'))
		});
	}
	else{
		callback(null, null);
	}
}



function __drawShapes(shapes, fill, opacity, matrixArray, callback){
	if(shapes){
		const matrix = matrixArray.join(',');

		let pathAttribs = [
			'stroke="none"',
			util.format('fill="%s"', fill),
		];
		if(opacity !== 1){
			pathAttribs.push(util.format('opacity="%d"', opacity));
		}
		if(matrix !== __INSTANCE.defaultMatrix.join(',')){
			pathAttribs.push(util.format('transform="matrix(%s)"', matrix));
		}

		async.concat(
			shapes, 
			function(shapePath, nextPath){
				nextPath(null, util.format('<path %s d="%s"></path>', pathAttribs.join(' '), shapePath));
			},
			callback
		);
 	}
 	else{
 		callback(null, [])
 	}
}



function __mergeSVG(size, bgColor, callback, autoData){
	callback(null, [
		__getSvgStyle(size),
		'<desc>Created by http://guilds.gw2w2w.com</desc>',
		__getSvgRect(size, bgColor),
		autoData.drawBG,
		autoData.drawFG,
		'</svg>'
	].join(''));
}



function __optimizeSVG(callback, autoData){
	const SVGO = require('svgo');
	const svgo = new SVGO();
	svgo.optimize(autoData.merge, function(result) {
		callback(null, result.data);
	});
}




/*
* UTIL
*/

function __getSvgStyle(size){
	return util.format(
		'<svg width="100%" height="100%" viewBox="0 0 %d %d" version="1.1" xmlns="http://www.w3.org/2000/svg">',
		size,
		size
	);
}

function __getSvgRect(size, bgColor){
	return util.format(
		'<rect x="0" y="0" width="%d" height="%d" fill="%s" stroke="none"></rect>',
		size,
		size,
		bgColor
	);
}



function __getTransformMatrix(layer, flags, size){
	const flips = __getFlips(flags);

	const flipBackgroundHorizontal	= (layer === 'bg' && flips['FlipBackgroundHorizontal']);	
	const flipForegroundHorizontal	= (layer === 'fg' && flips['FlipForegroundHorizontal']);
	const flipBackgroundVertical	= (layer === 'bg' && flips['FlipBackgroundVertical']);
	const flipForegroundVertical	= (layer === 'fg' && flips['FlipForegroundVertical']);
	const flipLayerHorizontal 		= (flipBackgroundHorizontal || flipForegroundHorizontal);
	const flipLayerVertical 		= (flipBackgroundVertical || flipForegroundVertical);


	let matrix = _.clone(__INSTANCE.defaultMatrix); // (scaleX, 0, 0, scaleY, transformX, transformY)

	if(size !== __INSTANCE.base_size){
		const scale = (size / __INSTANCE.base_size);
		matrix[0] = scale;
		matrix[3] = scale;
	}

	if(flipLayerHorizontal){
		matrix[0] = -matrix[0];
		matrix[4] = size;
	}

	if(flipLayerVertical){
		matrix[5] = size;
		matrix[3] = -matrix[3];
	}

	return matrix;
}


function __getFlips(flags){
	let flips = {
		'FlipBackgroundHorizontal': 0,
		'FlipBackgroundVertical': 0,
		'FlipForegroundHorizontal': 0,
		'FlipForegroundVertical': 0,
	};

	_.forEach(flags, function(flag){
		flips[flag] = 1;
	});

	return flips;
}


function __getColor(colorId){
	const decRGB = __INSTANCE.defs.color2[colorId].cloth.rgb;
	return rgbToHex(decRGB[0], decRGB[1], decRGB[2]);
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return ["#", componentToHex(r), componentToHex(g), componentToHex(b)].join('');
}