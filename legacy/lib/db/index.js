"use strict";

// import Promise from 'bluebird';
// import LRU from 'lru-cache';
// const cacheProvider = LRU({
//     max: 128,
//     // maxAge: (1000 * 60 * 5),
//     maxAge: (1),
// });


/*
*
*   PASSTHROUGH DATA PROVIDER
*
*/

import db, {QueryFile} from './pg.js';
export default db;

export { QueryFile as QueryFile};


/*
*
*   EXPORTED METHODS
*
*/



export function query(queryString, queryParams) {
    // console.log('query', queryParams);
    // console.log('query', queryString, queryParams);

    return db.query(queryString, queryParams)
        // .then((data, ...moar) => {
        //     console.log('query result', data, {moar});
        //     return data;
        // })
        .catch((err) => {
            console.log('query::err', err);
            throw(err);
        });
}



// export function cachedQuery(cacheKey, qs, params) {
//     const timerName = `TIMER::cachedQuery::${cacheKey}`;
//     console.time(timerName);
//
//     console.log('cachedQuery', cacheKey, params);
//
//     if (!cacheProvider.has(cacheKey)) {
//         console.log('cachedQuery', cacheKey, 'cache miss');
//
//         cacheProvider.set(cacheKey, query(qs, params));
//     }
//
//     console.log('get', cacheProvider.get(cacheKey));
//
//     return cacheProvider.get(cacheKey)
//         .catch((err) => {
//             console.log('cachedQuery::err', err);
//             throw(err);
//         });
//         // .finally(() => console.timeEnd(timerName))
// }
