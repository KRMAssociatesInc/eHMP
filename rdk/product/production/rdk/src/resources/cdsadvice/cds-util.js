'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var NodeCache = require('node-cache');
var dfnCache = new NodeCache();

FetchError.prototype = Error.prototype;
NotFoundError.prototype = Error.prototype;

function isNotFound(obj) {
    return obj.error.code && String(obj.error.code) === String(rdk.httpstatus.not_found);
}

function FetchError(message, error) {
    this.name = 'FetchError';
    this.error = error;
    this.message = message;
}

function NotFoundError(message, error) {
    this.name = 'NotFoundError';
    this.error = error;
    this.message = message;
}

module.exports = {
    getDFN: function (req, pid, callback) {
        var cacheKey = 'dfn' + pid;
        var cachedValue = dfnCache.get(cacheKey);
        if (Object.keys(cachedValue).length !== 0) {
            req.logger.debug('dfn cache hit for pid: ' + pid + ' value: ' + cachedValue[cacheKey]);
            return callback(cachedValue[cacheKey]);
        }

        var config = req.app.config;
        var jdsPath = '/vpr/' + pid + '/find/patient?start=0';

        var options = _.extend({}, config.jdsServer, {
            path: jdsPath,
            method: 'GET'
        });

        var httpConfig = {
            protocol: 'http',
            logger: req.logger,
            options: options
        };

        rdk.utils.http.fetch(req.app.config, httpConfig, function (error, result) {
            req.logger.debug('callback from fetch()');
            if (error) {
                callback(new FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
            } else {
                var obj = JSON.parse(result);
                if (obj.data && obj.data.items && obj.data.items.length > 0) {
                    req.logger.debug('caching dfn for pid:' + pid + ' dfn:' + obj.data.items[0].localId);
                    dfnCache.set(cacheKey, obj.data.items[0].localId, 3600); //1 hour cache life
                    return callback(obj.data.items[0].localId);
                } else if ('error' in obj) {
                    if (isNotFound(obj)) {
                        return callback(new NotFoundError('Object not found', obj));
                    }
                }
                return callback(new Error('There was an error processing your request.'));
            }
        });
    }
};
