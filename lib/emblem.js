"use strict"

const fs = require ('fs');
const path = require('path');


// const async = require('async');
// const _ = require('lodash');



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
		color: require('./gw2emblem/defs.color.json'),
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
	bg_op: 0.3,

	// paper background
	// gw2emblem.bg_color: bgColor || '',
	bg_color: '',
	bg_img: 'img_bg.png',

	// config required for transformation
	base_size: 256,
	flip: 0, // 1 - flipV_Bg, 2 - flipH_Bg, 4 - flipV_Fg, 8 - flipH_Fg
};




/*
*
*   PUBLIC METHODS
*
*/

Controller.draw = function(emblemData, size, bgColor, onInitDone) {
	const raphael = require('./node-raphael');

	var svg = raphael.generate(size, size, function draw(paper) {
		paper.clear();


		// set background
		paper.rect(0, 0, paper.width, paper.height).attr({'fill':bgColor, 'stroke':bgColor});


		if(emblemData){
			__drawBackground(paper, emblemData);
			__drawForeground(paper, emblemData);
		}


		//console.log('paper', paper);
	});

	onInitDone(svg);

};




/*
*
*   PRIVATE METHODS
*
*/



const __drawBackground = function(paper, emblemData) {
	const bg = __INSTANCE.defs.background[emblemData.background_id] || '';
	const bgColor = __INSTANCE.defs.color[emblemData.background_color_id] || '#000000';

	const opacity = bg.t ? __INSTANCE.bg_op : 1;
	const flip = __getFlip(emblemData.flags);
	const scale = __getScale(paper.width);

	let transformStr = __getTransformStr(scale);


	if ((flip & 1) !== 0 || (flip & 2) !== 0)
	{
		transformStr = transformStr.concat(' s',((flip & 2) !== 0) ? -1 : 1,',',((flip & 1) !== 0) ? -1 : 1,',',__INSTANCE.base_size/2,',',__INSTANCE.base_size/2);
	}

	// console.log('transformStr', transformStr)

	let paths = [];

	if(bg.p) {
		for(let i = 0; i < bg.p.length; i++) {
			paths.push(
				paper.path(bg.p[i])
					.attr({
						'fill':bgColor,
						'stroke':'none',
						'opacity': opacity
					})
					.transform(transformStr)
			);
		}
	}

	return paths;
}

const __drawForeground = function(paper, emblemData) {
	const fg = __INSTANCE.defs.foreground[emblemData.foreground_id] || '';
	const color1 = __INSTANCE.defs.color[emblemData.foreground_secondary_color_id] || '#FFFFFF';
	const color2 = __INSTANCE.defs.color[emblemData.foreground_primary_color_id] || '#FF0000';

	const flip = __getFlip(emblemData.flags);
	const scale = __getScale(paper.width);

	let transformStr = __getTransformStr(scale);

	if (flip > 3) {
		transformStr = transformStr.concat(' s',((flip & 8) !== 0) ? -1 : 1,',',((flip & 4) !== 0) ? -1 : 1,',',__INSTANCE.base_size/2,',',__INSTANCE.base_size/2);
	}

	let paths = [];
	if (fg.p1) {
		for(let i = 0; i < fg.p1.length; i++) {
			paths.push(
				paper.path(fg.p1[i])
					.attr({'fill':color1, 'stroke':'none'})
					.transform(transformStr)
			);
		}
	}

	if (fg.p2) {
		for(let i = 0; i < fg.p2.length; i++) {
			paths.push(
				paper.path(fg.p2[i])
					.attr({'fill':color2, 'stroke':'none'})
					.transform(transformStr)
			);
		}
	}

	if (fg.pto2) {
		for(let i = 0; i < fg.pto2.length; i++) {
			paths.push(
				paper.path(fg.pto2[i])
					.attr({'fill':__INSTANCE.pto2_color, 'stroke':'none', 'opacity':__INSTANCE.pto2_op})
					.transform(transformStr)
			);
		}
	}

	if (fg.pt1) {
		for(let i = 0; i < fg.pt1.length; i++) {
			paths.push(
				paper.path(fg.pt1[i])
					.attr({'fill':color1, 'stroke':'none', 'opacity':__INSTANCE.pt1_op})
					.transform(transformStr)
			);
		}
	}
}




/*
* UTIL
*/

const __getFlip = function(flags) {
	let flip = 0;

	for(var i=0; i<flags.length; i++)
	{
		if (__INSTANCE.defs.flags[flags[i]])
		{
			flip += __INSTANCE.defs.flags[flags[i]];
		}
	}

	return flip;
};



const __getScale = function(paperWidth) {
	return paperWidth / __INSTANCE.base_size;
}



const __getTransformStr = function(scale) {
	return (scale != 1) ? 's'.concat(scale, ',', scale, ',0,0') : '';
}