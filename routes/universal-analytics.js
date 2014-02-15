"use strict"
"use strict"

const ua = require('universal-analytics');


module.exports = function (req, res) {
	const cookieMaxAge = 1000 * 60 * 60 * 24 * 356 * 2; // 2 years

	let uaUUID = (req.cookies && req.cookies.uaUUID) ? req.cookies.uaUUID : null;

	if(!uaUUID){
    	uaUUID = require('uuid').v4();
		res.cookie('uaUUID', uaUUID, { maxAge: cookieMaxAge, httpOnly: true});
	}

	return ua('UA-51384-40', uaUUID);
};