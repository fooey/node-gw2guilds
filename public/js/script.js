$(function() {

    var $guildSearch = $('form.guildSearch');
    if ($guildSearch.length) {
        $guildSearch.on('submit', __doGuildSearch);
    }


    var $linkBuilder = $('#linkBuilder');

    var guildNameUrl;
    var $emblem
    var $emblemSize, $emblemBgColor;
    var $emblemCodes, $emblemURL, $emblemHTML, $emblemBBCODE;

    if ($linkBuilder.length) {

        __setLinkBuilderGlobals($linkBuilder);
        __updateEmblemInfo(true);

        $linkBuilder.on(
            'keyup change blur load',
            '#emblemSize,#emblemBgColor',
            _.debounce(__updateEmblemInfo.bind(null, false), 500)
        );
    }


    /*
     *
     *  PRIVATE METHODS
     *
     */


    /*
     *  GLOBAL
     */

    function __doGuildSearch(e) {
        e.preventDefault();

        var $form = $(this);
        var guildNameUrl = $form.find('input.guildName').val().replace(/ /g, '-');
        var guildUrl = '/guilds/' + guildNameUrl;

        window.location = guildUrl;
    }



    /*
     *  GUILDS :: linkBuilder
     */

    function __setLinkBuilderGlobals($linkBuilder) {
        guildNameUrl = $linkBuilder.data('guildnameurl');

        $emblem = $linkBuilder.find('#emblem');

        $emblemSize = $linkBuilder.find('#emblemSize');
        $emblemBgColor = $linkBuilder.find('#emblemBgColor');

        $emblemCodes = $linkBuilder.find('#emblemCodes');
        $emblemURL = $emblemCodes.find('#emblemURL')
        $emblemHTML = $emblemCodes.find('#emblemHTML')
        $emblemBBCODE = $emblemCodes.find('#emblemBBCODE');
    }


    function __updateEmblemInfo(forceUpdate, e) {
        var size = $emblemSize.val();
        var bgColor = $emblemBgColor.val().replace(/#/g, '');

        var emblemUrl = __getEmblemUrl(size, bgColor);
        if (forceUpdate || $emblem.attr('src') !== emblemUrl) {
            __updateEmblem(emblemUrl, size);
            __updateEmblemCodes(emblemUrl, size);
        }

    }



    function __updateEmblem(emblemUrl, size) {
        $emblem
            .attr('src', emblemUrl)
            .css({
                width: size,
                height: size
            });
    }


    function __getEmblemUrl(size, bgColor) {
        return [
            '',
            'guilds',
            guildNameUrl,
            __getSvgFileName(size, bgColor)
        ].join('/');
    }



    function __getSvgFileName(size, bgColor) {
        var svgFileName = [size];
        if (bgColor && bgColor.length && bgColor !== 'transparent' && bgColor !== 'none') {
            svgFileName.push(bgColor);
        }
        svgFileName.push('svg');

        return svgFileName.join('.');
    }



    function __updateEmblemCodes(emblemUrl, size) {
        __setEmblemSampleURL(emblemUrl);
        __setEmblemSampleHtml(emblemUrl, size);
        __setEmblemSampleBBCode(emblemUrl, size);
    }


    function __setEmblemSampleURL(emblemUrl) {
        $emblemURL.empty().append(
            $('<a>', {
                'href': emblemUrl,
                'text': __getCanonical(emblemUrl),
            })
        );
    };


    function __setEmblemSampleHtml(emblemUrl, size) {
        var text = '<img src="' + __getCanonical(emblemUrl) + '" width=' + size + ' height=' + size + ' />';
        // console.log('__setEmblemSampleHtml()', text);

        $emblemHTML.text(text);
    };


    function __setEmblemSampleBBCode(emblemUrl, size) {
        var text = '[img width="' + size + '" height="' + size + '"]' + __getCanonical(emblemUrl) + '[/img]';
        // console.log('__setEmblemSampleBBCode()', text);

        $emblemBBCODE.text(text);
    };





    /*
     *  UTILITY
     */

    function __getCanonical(stub) {
        var hostName = (window.location.port === '80') ? window.location.hostname : window.location.host;
        return 'https://' + hostName + stub;
    }



    function nospam(selector) {
        console.log(selector);
        var addr = getAddr();

        $(selector).each(function(i, el) {
            var $el = $(el);
            console.log($el);

            $el.replaceWith($('<a>', {
                href: 'mailto:' + addr,
                html: $el.html()
            }));
        });
    }
    nospam('.contact');

    function getAddr() {
        var src = '@ gw2w2w schtuph com .'.split(' ');
        var addr = [src[1], src[0], src[2], src[4], src[3]].join('');

        return addr;
    }

});
