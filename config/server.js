"use strict";

const path = require('path');

const errorHandler = require('errorHandler');
const morgan = require('morgan');
const serveFavicon = require('serve-favicon');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const pubFolder = path.join(process.cwd(), 'public');
const faviconPath = path.join(pubFolder, 'images/gw2-dragon-32.png');


module.exports = function(app, express) {
	if (process.env.NODE_ENV === 'development') {
		app.use(errorHandler({ dumpExceptions: true, showStack: true }));
		app.locals.pretty = true;
		app.use(morgan('dev'));
	}
	else {
		app.use(errorHandler());
		app.use(morgan('combined'));
	}




	app.use(cors());
	app.use(cookieParser());



	// set a cookie
	app.use(function(req, res, next) {
		var uaUUID = req.cookies.uaUUID;

		if (!uaUUID) {
	    	uaUUID = require('uuid').v4();

			const cookieMaxAge = 1000 * 60 * 60 * 24 * 356 * 2; // 2 years
			res.cookie('uaUUID', uaUUID, { maxAge: cookieMaxAge, httpOnly: true});
		}

		next(); // <-- important!
	});

	app.set('port', process.env.PORT || 3000);

	app.set('views', path.join(process.cwd(), 'views'));
	app.set('view engine', 'jade');
	app.set('view cache', true);


	app.use(serveFavicon(faviconPath));
	// app.use(app.router);
	app.use(serveStatic(pubFolder));
	app.use(require('compression')({
		threshold: 512
	}));
};
