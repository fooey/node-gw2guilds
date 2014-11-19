"use strict";

const qs = require('querystring');
const util = require('util');

const _ = require('lodash');
const async = require('async');
const cache = require('../lib/cache');
const guilds = require('../lib/guilds');


module.exports = function(req, res) {
	const renderStart = Date.now();

	cache.get(
		'guildMap',
		null,
		function(cbCacheMiss) {cbCacheMiss(null, {})},
		__onGuildData
	);



	function __onGuildData(err, guilds) {
		var sampleGuilds = _.sample(_.keys(guilds), 32);

		// console.log(guilds);
		console.log(sampleGuilds);

		async.concat(
			sampleGuilds,
			__getImageTags,
			__buildHtml
		);
	}



	function __getImageTags(guildName, nextGuild) {
		async.concat([
			// 256,
			// 190,
			128,
			// 96,
			// 64,
			// 48,
			// 32,
			// 24,
			// 16,
		],
		function(size, nextSize) {
			var slug = guilds.slugify(guildName);
			nextSize(null, util.format('<img src="/guilds/%s/256.svg" style="width:%dpx;height:%dpx;" />', slug, size, size));
		},
		function(err, results) {
			nextGuild(null, results.join(''));
		});
	}


	function __buildHtml(err, urlNodes) {
		_sendToClient(urlNodes.join('\n'));
	}


	function _sendToClient(html) {
		res.header('content-type', 'text/html');
		res.send(html);
	}




	function __getGuildUrl(guildName) {
		return __getCanonicalUrl([
			'',
			'guilds',
			guildNameUrl
		].join('/'));
	}



	function __getImageUrl(guildName, size) {
		return __getGuildUrl(guildName) + '/' + size + '.svg';
	}



	function __getCanonicalUrl(stub) {
		return [
			'http://',
			req.headers.host,
			stub,
		].join('');
	}


};