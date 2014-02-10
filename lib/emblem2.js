/*
*	EMBLEM data from https://github.com/mtodor/gw2emblem
*/


"use strict"

const fs = require ('fs');
const path = require('path');


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
		flags: {
			"FlipBackgroundVertical": 1,
			"FlipBackgroundHorizontal": 2,
			"FlipForegroundVertical": 4,
			"FlipForegroundHorizontal": 8,
		},
	},


	// used for shadow over color
	pto2_color: '#000000',
	pto2_op: 0.3,

	// used for emblem background
	bg_op: 1.0, //0.3

	// config required for transformation
	base_size: 256,
	// flip: 0, // 1 - flipV_Bg, 2 - flipH_Bg, 4 - flipV_Fg, 8 - flipH_Fg
};




/*
*
*   PUBLIC METHODS
*
*/

Controller.draw = function(emblemData, size, bgColor, onDrawComplete) {
	if(bgColor !== 'transparent'){
		bgColor = '#' + bgColor;
	};

	onDrawComplete([
		__getSvgStyle(size),
			'<desc>Created by http://guilds.gw2w2w.com</desc>',
			__getSvgRect(size, bgColor),
			__drawBackground(emblemData, size),
			__drawForeground(emblemData, size),
		'</svg>',
	].join('\n'));
};






/*
*
*   PRIVATE METHODS
*
*/


function __drawShapes(shapes, fill, opacity, matrix){
	let paths = [];

	const pathAttribs = [
		'stroke="none"',
		'fill="' + fill + '"',
		'opacity="' + opacity + '"',
		'transform="matrix(' + matrix.join(',') + ')"',
	];

	_.forEach(shapes, function(pathData){
		let path = [
			'<path',
				pathAttribs.join(' '),
				'd="' + pathData + '"',
			'></path>'
		].join(' ');

		paths.push(path)
	});

	return paths;
};


function __drawBackground(emblemData, size) {	
	let bgPaths = [];
	if(emblemData && emblemData.background_id && __INSTANCE.defs.background[emblemData.background_id]){
		const bg = __INSTANCE.defs.background[emblemData.background_id] || '';
		const bgColor = __getColor(emblemData.background_color_id) || '#000000';

		const opacity = bg.t ? __INSTANCE.bg_op : 1;
		const matrix = __getMatrix('bg', emblemData.flags, size);

		bgPaths = bgPaths.concat(__drawShapes(bg.p, bgColor, opacity, matrix));
	}

	return bgPaths.join('\n')
}


function __drawForeground(emblemData, size) {	
	let fgPaths = [];

	if(emblemData && emblemData.foreground_id && __INSTANCE.defs.foreground[emblemData.foreground_id]){
		const fg = __INSTANCE.defs.foreground[emblemData.foreground_id] || '';
		const color1 = __getColor(emblemData.foreground_secondary_color_id) || '#FFFFFF';
		const color2 = __getColor(emblemData.foreground_primary_color_id) || '#FF0000';

		const matrix = __getMatrix('fg', emblemData.flags, size);

		fgPaths = fgPaths.concat(__drawShapes(fg.p1, color1, 1, matrix));
		fgPaths = fgPaths.concat(__drawShapes(fg.p2, color2, 1, matrix));
		fgPaths = fgPaths.concat(__drawShapes(fg.pto2, __INSTANCE.pto2_color, __INSTANCE.pto2_op, matrix));
		fgPaths = fgPaths.concat(__drawShapes(fg.pt1, color1, __INSTANCE.pt1_op, matrix));
	}

	return fgPaths.join('\n')
}




/*
* UTIL
*/

function __getSvgStyle(size){
	return '<svg style="overflow: hidden; position: absolute; left: 0px; top: 0px;" height="' + size + '" width="' + size + '" version="1.1" xmlns="http://www.w3.org/2000/svg">';
}

function __getSvgRect(size, bgColor){
	return '<rect x="0" y="0" width="' + size + '" height="' + size + '" fill="' + bgColor + '" stroke="none"></rect>';
}



function __getMatrix(piece, flags, size){
	let matrix = [0,0,0,0,0,0];

	if(size !== __INSTANCE.base_size){
		const scale = (size / __INSTANCE.base_size);
		matrix[0] = scale;
		matrix[3] = scale;
	}

	let flips = __getFlips(flags);

	if(
		(piece === 'bg' && flips['FlipBackgroundHorizontal'])
		||  (piece === 'fg' && flips['FlipForegroundHorizontal'])
	){
		matrix[0] = -matrix[0];
		matrix[4] = size;
	}

	if(
		(piece === 'bg' && flips['FlipBackgroundVertical'])
		||  (piece === 'fg' && flips['FlipForegroundVertical'])
	){
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
	let hexRGB = rgbToHex(
		decRGB[0],
		decRGB[1],
		decRGB[2]
	);

	return hexRGB;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}