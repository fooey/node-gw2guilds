'use strict';

const path = require('path');

const errorHandler = require('errorhandler');
const morgan = require('morgan');
const serveFavicon = require('serve-favicon');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

const pubFolder = path.join(process.cwd(), 'public');
const faviconPath = path.join(pubFolder, 'images/gw2-dragon-32.png');


module.exports = function(app/*, express*/) {

    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'jade');


    app.use(compression());
    app.use(cors());
    app.use(cookieParser());
    app.use(serveFavicon(faviconPath));
    app.use(serveStatic(pubFolder));

    if (process.env.NODE_ENV === 'development') {
        app.use(errorHandler({ dumpExceptions: true, showStack: true }));
        app.locals.pretty = true;
        app.use(morgan('dev'));
    }
    else {
        app.use(errorHandler());
        app.use(morgan('combined'));
        app.set('view cache', true);
    }


    // set a cookie
    app.use((req, res, next) => {
        let uaUUID = req.cookies.uaUUID;

        if (!uaUUID) {
            uaUUID = require('uuid').v4();

            const cookieMaxAge = 1000 * 60 * 60 * 24 * 356 * 2; // 2 years
            res.cookie('uaUUID', uaUUID, { maxAge: cookieMaxAge, httpOnly: true});
        }

        next(); // <-- important!
    });
};
