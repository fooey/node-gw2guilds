'use strict';

var $linkBuilder;
var guildNameUrl;
var $emblem;
var $emblemSize, $emblemBgColor;
var $emblemCodes, $emblemURL, $emblemHTML, $emblemBBCODE;

var $previewPNG, $previewSVG, $downloadPNG, $downloadSVG;



module.exports = function($form) {
	$linkBuilder = $form;

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
		.on('load', setDownloadLinks)
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
	var emblemUrl = $emblem.attr('src');


	$.ajax({
		url: emblemUrl,
		crossDomain: true,
		dataType: 'xml',
	})
		.done(function onAjaxDone(svgData) {
			var svgDataUri = generateSvgDataUri(svgData);

			setSvgDownload(svgDataUri);
			setSvgPreview(svgDataUri);

			generatePng(svgDataUri, function(err, pngData) {

				if (!err && pngData && pngData.length) {
					setPngPreview(pngData);
					setPngDownload(pngData);
				}
				else {
					$previewPNG.hide();
					$downloadPNG.hide();
				}

			});

		});
}



function setSvgPreview(dataUri) {
	$previewSVG.text('SVG');
	$previewSVG.attr('href', dataUri);
}



function setSvgDownload(dataUri) {
	$downloadSVG.text('SVG');
	$downloadSVG.attr('download', guildNameUrl + '.svg');
	$downloadSVG.attr('href', dataUri);
}



function setPngPreview(pngData) {
	$previewPNG.attr('href', pngData);
	$previewPNG.text('PNG');
	$previewPNG.show();
}



function setPngDownload(pngData) {
	$downloadPNG.attr('href', pngData);
	$downloadPNG.attr('download', guildNameUrl + '.png');
	$downloadPNG.text('PNG');
	$downloadPNG.show();
}



function generatePng(dataUri, cb) {
	var size = $emblemSize.val();

	var image = new Image();
	image.src = dataUri;
	image.width = size;
	image.height = size;

	image.onload = function() {
		try {
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');

			canvas.width = size;
			canvas.height = size;
			context.drawImage(image, 0, 0);

			cb(null, canvas.toDataURL('data:image/png'));
		}
		catch (err) {
			console.log('png generation failed', err);
			cb(err);
		}
	};

	image.onerror = function() {
		var err = 'failed to load source image';
		console.log('png generation failed', err);
		cb(err);
	};
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



function generateSvgDataUri(svgData) {
	var size = $emblemSize.val();
	var $svg = $(svgData);

	$svg.find('svg')
		.attr({
			'width': size,
			'height': size,
		});

	// convert dom nodes to xml string
	var svgXml = (new XMLSerializer()).serializeToString($svg[0]);

	return 'data:image/svg+xml,' + escape(svgXml);
}
