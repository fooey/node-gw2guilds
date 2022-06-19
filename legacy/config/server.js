'use strict';

import path from 'path';

import errorHandler from 'errorhandler';
import morgan from 'morgan';
import serveFavicon from 'serve-favicon';
import serveStatic from 'serve-static';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const pubFolder = path.join(process.cwd(), 'public');
const pubDataFolder = path.join(process.cwd(), 'data');
const faviconPath = path.join(pubFolder, 'images/gw2-dragon-32.png');


module.exports = function(app/*, express*/) {

    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'pug');


    app.use(cors());
    app.use(cookieParser());
    app.use(serveFavicon(faviconPath));
    app.use(serveStatic(pubFolder));
    app.use('/data', serveStatic(pubDataFolder));

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
};
