'use strict';
var rdk = require('../../../core/rdk');
var _ = rdk.utils.underscore;
var errors = require('../common/errors');


function getData(req, pid, refferenceDate, callback) {
    var config = req.app.config;
    var jdsPath = '/vpr/' + pid + '/index/allergy?filter=ne(removed,true)';
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(config, httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, buildResult(obj));
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}
module.exports.getData = getData;

function buildResult(result) {
    var res = {};
    res.allergy = [];
    res.allergy = result.data.items;
    return res;
}
module.exports.buildResult = buildResult;
