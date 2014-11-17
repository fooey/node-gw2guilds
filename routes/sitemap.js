"use strict";

const qs = require('querystring');
const async = require('async');
const cache = require('../lib/cache');


module.exports = function(req, res) {
	const renderStart = Date.now();

	cache.get(
		'guildMap',
		null,
		function(cbCacheMiss) { cbCacheMiss(null, {})},
		__onGuildData
	);



	function __onGuildData(err, guilds) {
		async.concat(
			Object.keys(guilds),
			__buildUrlNode,
			__buildSitemapXml
		);
	}



	function __buildUrlNode(guildName, nextGuild) {
		nextGuild(null, [
			'<url>',
				'<loc>' + __getGuildUrl(guildName) + '</loc>',
				// '<lastmod>2005-01-01</lastmod>',
				// '<changefreq>monthly</changefreq>',
				// '<priority>0.8</priority>',
			'</url> ',
		].join(''));
	}

	function __buildSitemapXml(err, urlNodes) {
		__sendXml([
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
				urlNodes.join('\n'),
			'</urlset>'
		]);
	}


	function __sendXml(xmlArray) {
		res.header('content-type', 'application/xml');
		res.end(xmlArray.join('\n'));
	}




	function __getGuildUrl(guildName) {
		const guildNameUrl = qs.escape(guildName.replace(/ /g, '-'));

		return __getCanonicalUrl([
			'',
			'guilds',
			guildNameUrl
		].join('/'));
	}

	function __getCanonicalUrl(stub) {
		return [
			'http://',
			req.headers.host,
			stub,
		].join('');
	}


};
