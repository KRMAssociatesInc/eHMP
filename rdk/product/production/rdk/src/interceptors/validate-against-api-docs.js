/**
 * Created by alexluong on 3/23/15.
 */

'use strict';

var _ = require('lodash');
var validate = require('swagger-validation');
var rdk = require('../core/rdk');

/**
 * Validates requests against their swagger apiDocs.
 * Invalid requests return status 400 Bad Request with details specifying the invalid input.
 * Recommended interceptor order: ['audit', 'metrics', 'authentication', 'pep', 'operationalDataCheck', 'validateAgainstApiDocs']
 */

module.exports = function(req, res, next) {
    var ret = validate(req._resourceConfigItem.apiDocs.spec, _.cloneDeep(req), req._resourceConfigItem.apiDocs.models);
    if (ret.length) {
        var errors = _.pluck(_.pluck(ret, 'error'), 'message');
        _.each(errors, function(error) {
            req.logger.error('Invalid input: ' + error);
        });
        return res.status(rdk.httpstatus.bad_request).rdkSend(errors.join('\n'));
    }
    next();
};
