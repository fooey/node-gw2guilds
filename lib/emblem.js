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
			"FlipForegroundHorizontal": 8
		}
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

Controller.draw = function(emblemData, size, bgColor, onInitDone) {

	var svg = require('./node-raphael').generate(size, size, function draw(paper) {
		if(emblemData){
			if(bgColor !== 'transparent'){
				bgColor = '#' + bgColor;
			}
			console.log(emblemData, size, bgColor);
			
			async.series([
				function(nextSeries){
					paper.clear();
					nextSeries(null);
				},
				function(nextSeries){
					paper.rect(0, 0, paper.width, paper.height).attr({'fill':bgColor, 'stroke-width':0});
					nextSeries(null);
				},
				__drawBackground.bind(null, paper, emblemData),
				__drawForeground.bind(null, paper, emblemData),
			]);
		}
	});

	emblemData = null;

	onInitDone(svg);
};




/*
*
*   PRIVATE METHODS
*
*/


function __drawShapes(paper, shapes, attributes, callback){
	if(shapes){
		async.each(
			shapes,
			__drawShape.bind(null, paper, attributes),
			callback
		);
	}
	else{
		shapes = null;
		callback(null);
	}
};

function __drawShape(paper, attributes, shape, callback){
	paper.path(shape).attr(attributes);
	shape = null;
	callback(null);
}


function __drawBackground(paper, emblemData, onDone) {
	const bg = __INSTANCE.defs.background[emblemData.background_id] || '';
	const bgColor = __getColor(paper, emblemData.background_color_id) || '#000000';

	const opacity = bg.t ? __INSTANCE.bg_op : 1;
	const flip = __getFlip(emblemData.flags);
	const scale = __getScale(paper.width);

	let transformStr = __getTransformStr(scale);

	if ((flip & 1) !== 0 || (flip & 2) !== 0) {
		transformStr = transformStr.concat(' s',((flip & 2) !== 0) ? -1 : 1,',',((flip & 1) !== 0) ? -1 : 1,',',__INSTANCE.base_size/2,',',__INSTANCE.base_size/2);
	}

	__drawShapes(paper, bg.p, {'fill':bgColor, 'stroke':'none', 'opacity': opacity, 'transform': transformStr}, onDone);
}


function __drawForeground(paper, emblemData, onDone) {
	const fg = __INSTANCE.defs.foreground[emblemData.foreground_id] || '';
	const color1 = __getColor(paper, emblemData.foreground_secondary_color_id) || '#FFFFFF';
	const color2 = __getColor(paper, emblemData.foreground_primary_color_id) || '#FF0000';

	const scale = __getScale(paper.width);
	let transformStr = __getTransformStr(scale);


	async.series([
		function(nextSeries){
			const flip = __getFlip(emblemData.flags);
			if (flip > 3) {
				transformStr = transformStr.concat(' s',((flip & 8) !== 0) ? -1 : 1,',',((flip & 4) !== 0) ? -1 : 1,',',__INSTANCE.base_size/2,',',__INSTANCE.base_size/2);
			}
			nextSeries(null);
		},
		__drawShapes.bind(null, paper, fg.p1, {'fill':color1, 'stroke':'none', 'transform': transformStr}),
		__drawShapes.bind(null, paper, fg.p2, {'fill':color2, 'stroke':'none', 'transform': transformStr}),
		__drawShapes.bind(null, paper, fg.pto2, {'fill':__INSTANCE.pto2_color, 'stroke':'none', 'opacity':__INSTANCE.pto2_op, 'transform': transformStr}),
		__drawShapes.bind(null, paper, fg.pt1, {'fill':color1, 'stroke':'none', 'opacity':__INSTANCE.pt1_op, 'transform': transformStr}),
	], onDone);
}




/*
* UTIL
*/

function __getFlip(flags) {
	let flip = 0;

	for(var i=0; i<flags.length; i++) {
		if (__INSTANCE.defs.flags[flags[i]]) {
			flip += __INSTANCE.defs.flags[flags[i]];
		}
	}

	return flip;
};



function __getScale(paperWidth) {
	return paperWidth / __INSTANCE.base_size;
}



function __getTransformStr(scale) {
	return (scale != 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';
}


function __getColor(paper, colorId){
	const decRGB = __INSTANCE.defs.color2[colorId].cloth.rgb;
	let hexRGB = paper.raphael.rgb(
		decRGB[0],
		decRGB[1],
		decRGB[2]
	);

	return hexRGB;
}