"use strict";

import Promise from 'bluebird';
import cacheProvider from 'lib/cache';




/*
*
*   PASSTHROUGH DATA PROVIDER
*
*/

import db from './pg.js';
export default db;
export let qrm = {
    /** Single row is expected. */
    one: 1,
    /** One or more rows expected. */
    many: 2,
    /** Expecting no rows. */
    none: 4,
    /** many|none - any result is expected. */
    any: 6
};




/*
*
*   EXPORTED METHODS
*
*/



export function query(queryString, queryParams, mask) {
    return db.query(queryString, queryParams, mask);
}



export function cachedQuery(cacheKey, qs, params, mask) {
    const timerName = `TIMER::cachedQuery::${cacheKey}`;
    console.time(timerName);

    console.log('cachedQuery', cacheKey, params);

    if (!cacheProvider.has(cacheKey)) {
        console.log('cachedQuery', cacheKey, 'cache miss');

        cacheProvider.set(cacheKey, query(qs, params, mask));
    }

    console.log('get', cacheProvider.get(cacheKey));

    return cacheProvider.get(cacheKey)
        .catch((err) => {
            console.log('cachedQuery::err', err);
            throw(err);
        });
        // .finally(() => console.timeEnd(timerName))
}
