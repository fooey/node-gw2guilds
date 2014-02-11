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
	if(bgColor){
		bgColor = '#' + bgColor;
	}
	else{
		bgColor = 'none';
	}

	let svg = [
		__getSvgStyle(size),
		'<desc>Created by http://guilds.gw2w2w.com</desc>',
		__getSvgRect(size, bgColor),
		null,
		null,
		'</svg>'
	];

	async.series([
		function(next){
			__drawBackground(emblemData, size, function(err, bgSvg){
				svg[3] = bgSvg;
				next(null);
			});
		},
		function(next){
			__drawForeground(emblemData, size, function(err, fgSvg){
				svg[4] = fgSvg;
				next(null);
			});
		},
	],
	function(err){
		onDrawComplete(svg.join('\n'))
	});
};






/*
*
*   PRIVATE METHODS
*
*/


function __drawShapes(shapes, fill, opacity, matrix, callback){
	let paths = [];

	if(shapes){
		const pathAttribs = util.format(
			'stroke="none" fill="%s" opacity="%s" transform="matrix(%s)"',
			fill,
			opacity,
			matrix.join(',')
		);

		async.eachSeries(
			shapes, 
			function(pathData, next){
				paths.push(util.format(
					'<path %s d="%s"></path>', 
					pathAttribs, 
					pathData
				));
				next(null);
			},
			function(err){
				callback(err, paths)
			}
		);
 	}
 	else{
 		callback(null, paths)
 	}


};


function __drawBackground(emblemData, size, callback) {
	if(emblemData && emblemData.background_id && __INSTANCE.defs.background[emblemData.background_id]){
		const bg = __INSTANCE.defs.background[emblemData.background_id] || '';
		const bgColor = __getColor(emblemData.background_color_id) || '#000000';

		const opacity = bg.t ? __INSTANCE.bg_op : 1;
		const matrix = __getMatrix('bg', emblemData.flags, size);

		
		__drawShapes(bg.p, bgColor, opacity, matrix, function(err, shapes){
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

		const matrix = __getMatrix('fg', emblemData.flags, size);
	
		let fgPaths = [];
		async.series([
			function(next){
				__drawShapes(fg.p1, color1, 1, matrix, function(err, shapes){
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next){
				__drawShapes(fg.p2, color2, 1, matrix, function(err, shapes){
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next){
				__drawShapes(fg.pto2, __INSTANCE.pto2_color, __INSTANCE.pto2_op, matrix, function(err, shapes){
					fgPaths = fgPaths.concat(shapes);
					next();
				});
			},
			function(next){
				__drawShapes(fg.pt1, color1, __INSTANCE.pt1_op, matrix, function(err, shapes){
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




/*
* UTIL
*/

function __getSvgStyle(size){
	return util.format(
		'<svg style="overflow: hidden; position: absolute; left: 0px; top: 0px;" height="%d" width="%d" version="1.1" xmlns="http://www.w3.org/2000/svg">',
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



function __getMatrix(piece, flags, size){
	const flips = __getFlips(flags);
	let matrix = [0,0,0,0,0,0];

	if(size !== __INSTANCE.base_size){
		const scale = (size / __INSTANCE.base_size);
		matrix[0] = scale;
		matrix[3] = scale;
	}


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
	return rgbToHex(decRGB[0], decRGB[1], decRGB[2]);
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return ["#", componentToHex(r), componentToHex(g), componentToHex(b)].join('');
}