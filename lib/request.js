
// import Promise from 'bluebird';
// import request from 'superagent';
import request from 'request-promise';
import hash from 'object-hash';

import LRU from 'lru-cache';
const cacheProvider = LRU({
    max: 32,
    maxAge: (1000 * 60)
});


export default (
    url,
    params,
    cacheKey = `request::${hash({url, params})}`
) => {
    if (!cacheProvider.has(cacheKey)) {
        const requestOptions = {
            uri: url,
            qs: params,
            json: true,
            gzip: true,
        };

        cacheProvider.set(cacheKey, request(requestOptions));
    }

    return cacheProvider.get(cacheKey);
};
