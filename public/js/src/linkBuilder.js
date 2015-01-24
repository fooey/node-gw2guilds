

var $linkBuilder;
var guildNameUrl;
var $emblem;
var $emblemSize, $emblemBgColor;
var $emblemCodes, $emblemURL, $emblemHTML, $emblemBBCODE;

var $previewPNG, $previewSVG, $downloadPNG, $downloadSVG;

try {
	var canvas = document.createElement('canvas');
}
catch (junk) {}



module.exports = function($form) {
	$linkBuilder = $form;
	console.log('linkBuilder', $form);

	// init globals
	setGlobals($linkBuilder);


	// init DOM
	updateDOM(true);


	// attach event listeners
	$linkBuilder.on(
		'keyup change blur load',
		'#emblemSize,#emblemBgColor',
		debouncedUpdateDOM.bind($linkBuilder, false)
	);


	$emblem
		.on("load", setDownloadLinks)
		.trigger('load');
};




function setGlobals($linkBuilder) {
	guildNameUrl = $linkBuilder.data('guildnameurl');

	$emblem = $linkBuilder.find('#emblem');

	$emblemSize = $linkBuilder.find('#emblemSize');
	$emblemBgColor = $linkBuilder.find('#emblemBgColor');

	$emblemCodes = $linkBuilder.find('#emblemCodes');
	$emblemURL = $emblemCodes.find('#emblemURL');
	$emblemHTML = $emblemCodes.find('#emblemHTML');
	$emblemBBCODE = $emblemCodes.find('#emblemBBCODE');

	$previewPNG = $linkBuilder.find('#previewPNG');
	$previewSVG = $linkBuilder.find('#previewSVG');

	$downloadPNG = $linkBuilder.find('#downloadPNG');
	$downloadSVG = $linkBuilder.find('#downloadSVG');
}



/*
*	DOM Updaters
*/

function updateDOM(forceUpdate, e) {
	var size = $emblemSize.val();
	var bgColor = $emblemBgColor.val().replace(/#/g, '');

	var emblemUrl = getEmblemUrl(size, bgColor);
	if (forceUpdate || $emblem.attr('src') !== emblemUrl) {
		setImage(emblemUrl, size);
		setCodes(emblemUrl, size);
	}
}

var debouncedUpdateDOM = _.debounce(updateDOM, 250);



function setImage(emblemUrl, size) {
	$emblem
		.attr('src', emblemUrl)
		.css({width: size, height: size});

}



/*
*	Sample Codes
*/

function setCodes(emblemUrl, size) {
	setEmblemSampleURL(emblemUrl);
	setEmblemSampleHtml(emblemUrl, size);
	setEmblemSampleBBCode(emblemUrl, size);
}



function setEmblemSampleURL(emblemUrl) {
	$emblemURL.empty().append(
		$('<a>', {
			'href': emblemUrl,
			'text': getCanonical(emblemUrl),
		})
	);
}



function setEmblemSampleHtml(emblemUrl, size) {
	var text = '<img src="' + getCanonical(emblemUrl) + '" width=' + size + ' height=' + size + ' />';
	// console.log('setEmblemSampleHtml()', text);

	$emblemHTML.text(text);
}



function setEmblemSampleBBCode(emblemUrl, size) {
	var text = (
		'[img width="' + size + '" height="' + size + '"]'
			+ getCanonical(emblemUrl)
		+ '[/img]'
	);
	// console.log('setEmblemSampleBBCode()', text);

	$emblemBBCODE.text(text);
}



/*
*	Image Preview and Download
*/

function setDownloadLinks() {
	generatePng();

	setSvgDownload();
	setSvgPreview();

	setPngPreview();
	setPngDownload();
}



function setSvgPreview() {
	$previewSVG.text('SVG');
	$previewSVG.attr('href', $emblem.attr('src'));
}



function setSvgDownload() {
	$downloadSVG.text('SVG');
	$downloadSVG.attr('download', guildNameUrl + '.svg');
	$downloadSVG.attr('href', $emblem.attr('src'));
}



function setPngPreview() {
	try {
		if (canvas && canvas.toDataURL) {
			$previewPNG.attr('href', canvas.toDataURL('data:image/png'));
			$previewPNG.text('PNG');
		}
	}
	catch (junk) {
		console.log('png generation failed', junk);
	}
}



function setPngDownload() {
	try {
		if (canvas && canvas.toDataURL) {
			$downloadPNG.attr('href', canvas.toDataURL('data:image/png'));
			$downloadPNG.attr('download', guildNameUrl + '.png');
			$downloadPNG.text('PNG');
		}
	}
	catch (junk) {
		console.log('png generation failed', junk);
	}
}


function generatePng() {
	try {
		var size = $emblemSize.val();
		canvas.width = size;
		canvas.height = size;

		var context = canvas.getContext('2d');
		context.drawImage($emblem[0], 0, 0);

		$downloadPNG.text('PNG');
		// $downloadPNG.attr('download', guildNameUrl + '.png');
		$downloadPNG.attr('href', canvas.toDataURL('image/png'));
	}
	catch (junk) {
		console.log('png generation failed', junk);
		delete canvas;
	}
}



/*
*	UTILITY
*/

function getEmblemUrl(size, bgColor) {
	return [
		'',
		'guilds',
		guildNameUrl,
		getSvgFileName(size, bgColor)
	].join('/');
}



function getSvgFileName(size, bgColor) {
	var svgFileName = [size];
	if (bgColor && bgColor.length && bgColor !== 'transparent' && bgColor !== 'none') {
		svgFileName.push(bgColor);
	}
	svgFileName.push('svg');

	return svgFileName.join('.');
}



function getCanonical(stub) {
	var hostName = (window.location.port === '80') ? window.location.hostname : window.location.host;
	return 'http://' + hostName + stub;
}
