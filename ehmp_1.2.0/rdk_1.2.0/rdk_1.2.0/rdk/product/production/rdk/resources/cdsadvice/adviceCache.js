/*jslint node: true */
'use strict';

var NodeCache = require('node-cache');
var adviceCache = new NodeCache();

function isObjectEmpty(o) {
    return !o || Object.keys(o).length === 0;
}

function createKey(pid, use) {
    return 'cds-advice' + pid + use;
}

function _get(pid, use) {
    var key = createKey(pid, use);
    var cached = adviceCache.get(key);
    return isObjectEmpty(cached) ? null : cached[key];
}

module.exports = {

    get: function (pid, use) {
        var cached = _get(pid, use);
        return cached ? cached.value : null;
    },
    set: function (pid, use, adviceList, cacheLife /*life in seconds*/ ) {
        var cacheObj = {
            value: adviceList,
            hash: []
        };
        if (adviceList.constructor === Array && adviceList.length > 0) {
            for (var i = 0; i < adviceList.length; i++) {
                var advice = adviceList[i];
                if (advice && advice.id) {
                    cacheObj.hash[advice.id] = advice;
                }
            }
        }
        adviceCache.set(createKey(pid, use), cacheObj, cacheLife);
    },
    getCachedAdvice: function (pid, use, id) {
        var cached = _get(pid, use);
        return cached ? cached.hash[id] : null;
    }
};
