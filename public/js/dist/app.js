(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

/*
*
*   DEFINE EXPORT
*
*/

module.exports = {
	slugify: function slugify(str) {
		return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
	},
	deslugify: function deslugify(str) {
		return decodeURIComponent(str).replace(/-/g, ' ');
	}
};

},{}],2:[function(require,module,exports){
'use strict';

$(function () {

    var $searchForm = $('form.guildSearch');
    if ($searchForm && $searchForm.length) {
        require('./search.js')($searchForm);
    }

    var $linkBuilder = $('#linkBuilder');
    if ($linkBuilder && $linkBuilder.length) {
        require('./linkBuilder.js')($linkBuilder);
    }

    require('./contact.js')('.contact');
});

},{"./contact.js":3,"./linkBuilder.js":4,"./search.js":5}],3:[function(require,module,exports){
'use strict';

module.exports = function nospam(selector) {
    var addr = getAddr();

    $(selector).each(function (i, el) {
        var $el = $(el);

        $el.replaceWith($('<a>', {
            href: 'mailto:' + addr,
            html: addr
        }));
    });
};

function getAddr() {
    var src = '@ gw2w2w schtuph com .'.split(' ');
    var addr = [src[1], src[0], src[2], src[4], src[3]].join('');

    return addr;
}

},{}],4:[function(require,module,exports){
'use strict';

var $linkBuilder;
var guildNameUrl;
var $emblem;
var $emblemSize, $emblemBgColor;
var $emblemCodes, $emblemURL, $emblemHTML, $emblemBBCODE;

var $previewPNG, $previewSVG, $downloadPNG, $downloadSVG;

module.exports = function ($form) {
    $linkBuilder = $form;

    // init globals
    setGlobals($linkBuilder);

    // init DOM
    updateDOM(true);

    // attach event listeners
    $linkBuilder.on('keyup change blur load', '#emblemSize,#emblemBgColor', debouncedUpdateDOM.bind($linkBuilder, false));

    $emblem.on('load', setDownloadLinks).trigger('load');
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
*   DOM Updaters
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
    $emblem.attr('src', emblemUrl).css({ width: size, height: size });
}

/*
*   Sample Codes
*/

function setCodes(emblemUrl, size) {
    setEmblemSampleURL(emblemUrl);
    setEmblemSampleHtml(emblemUrl, size);
    setEmblemSampleBBCode(emblemUrl, size);
}

function setEmblemSampleURL(emblemUrl) {
    $emblemURL.empty().append($('<a>', {
        'href': emblemUrl,
        'text': getCanonical(emblemUrl)
    }));
}

function setEmblemSampleHtml(emblemUrl, size) {
    var text = '<img src="' + getCanonical(emblemUrl) + '" width=' + size + ' height=' + size + ' />';
    // console.log('setEmblemSampleHtml()', text);

    $emblemHTML.text(text);
}

function setEmblemSampleBBCode(emblemUrl, size) {
    var text = '[img width="' + size + '" height="' + size + '"]' + getCanonical(emblemUrl) + '[/img]';
    // console.log('setEmblemSampleBBCode()', text);

    $emblemBBCODE.text(text);
}

/*
*   Image Preview and Download
*/

function setDownloadLinks() {
    var emblemUrl = $emblem.attr('src');

    $.ajax({
        url: emblemUrl,
        crossDomain: true,
        dataType: 'xml'
    }).done(function onAjaxDone(svgData) {
        var svgDataUri = generateSvgDataUri(svgData);

        setSvgDownload(svgDataUri);
        setSvgPreview(svgDataUri);

        generatePng(svgDataUri, function (err, pngData) {

            if (!err && pngData && pngData.length) {
                setPngPreview(pngData);
                setPngDownload(pngData);
            } else {
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

    image.onload = function () {
        try {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            canvas.width = size;
            canvas.height = size;
            context.drawImage(image, 0, 0);

            cb(null, canvas.toDataURL('data:image/png'));
        } catch (err) {
            console.log('png generation failed', err);
            cb(err);
        }
    };

    image.onerror = function () {
        var err = 'failed to load source image';
        console.log('png generation failed', err);
        cb(err);
    };
}

/*
*   UTILITY
*/

function getEmblemUrl(size, bgColor) {
    return ['', 'guilds', guildNameUrl, getSvgFileName(size, bgColor)].join('/');
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
    return 'https://guilds.gw2w2w.com' + stub;
}

function generateSvgDataUri(svgData) {
    var size = $emblemSize.val();
    var $svg = $(svgData);

    $svg.find('svg').attr({
        'width': size,
        'height': size
    });

    // convert dom nodes to xml string
    var svgXml = new XMLSerializer().serializeToString($svg[0]);

    return 'data:image/svg+xml,' + escape(svgXml);
}

},{}],5:[function(require,module,exports){
'use strict';

var slugifier = require('../../../lib/slugifier.js');

/*
*
*   DEFINE EXPORT
*
*/

module.exports = function init($form) {
	$form.on('submit', search);
};

function search(e) {
	e.preventDefault();

	var guildName = $(this).find('input.guildName').val();
	var guildNameUrl = slugifier.slugify(guildName);
	var guildUrl = '/guilds/' + guildNameUrl;

	window.location = guildUrl;
}

},{"../../../lib/slugifier.js":1}]},{},[2]);
