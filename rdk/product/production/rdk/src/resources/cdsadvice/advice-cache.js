'use strict';

var NodeCache = require('node-cache');
var adviceCache = new NodeCache();

function isObjectEmpty(o) {
    return !o || Object.keys(o).length === 0;
}

function createKey(sessionId, pid, use) {
    return 'cds-advice' + sessionId + pid + use;
}

function _get(sessionId, pid, use) {
    var key = createKey(sessionId, pid, use);
    var cached = adviceCache.get(key);
    return isObjectEmpty(cached) ? null : cached[key];
}

module.exports = {
    /**
     * Retrieves the cached advice.
     *
     * We cache advice by session id because we want the
     * performance gains of not generating advice more
     * than needed on a session, but we want to generate
     * advice at least once per session.
     *
     * @param {string} sessionId The HTTP request object
     * @param {string} pid Patient Id
     * @param {string} use Rules execution intent
     */
    get: function (sessionId, pid, use) {
        var cached = _get(sessionId, pid, use);
        return cached ? { data: cached.value, readStatus: cached.readStatus } : null;
    },
    /**
     * Sets advice results to cache.
     *
     * We cache advice by session id because we want the
     * performance gains of not generating advice more
     * than needed on a session, but we want to generate
     * advice at least once per session.
     *
     * @param {string} sessionId The HTTP request object
     * @param {string} pid Patient Id
     * @param {string} use Rules execution intent
     * @param {array} adviceList List of advice to cache
     * @param {string} readStatus Read status filter applied to adviceList. Provides context for cached data.
     */
    set: function (sessionId, pid, use, adviceList, readStatus, cacheLife /*life in seconds*/ ) {
        var cacheObj = {
            value: adviceList,
            readStatus: readStatus,
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
        adviceCache.set(createKey(sessionId, pid, use), cacheObj, cacheLife);
    },
    /**
     * Retrieves an advice from the cached advice list.
     *
     * @param {string} sessionId The HTTP request object
     * @param {string} pid Patient Id
     * @param {string} use Rules execution intent
     */
    getCachedAdvice: function (sessionId, pid, use, readStatus, id) {
        var cached = _get(sessionId, pid, use, readStatus);
        return cached ? cached.hash[id] : null;
    }
};
