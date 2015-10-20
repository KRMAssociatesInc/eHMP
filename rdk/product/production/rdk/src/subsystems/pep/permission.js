/*jslint node: true */
'use strict';

var _ = require('underscore');
var rdk = require('../../core/rdk');
var options = require('../../interceptors/authorization/pep-options').permissionOptions;

/**
 * Check for authorization via permission decision point
 *
 * @namespace pep
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next A pepCallback function
 * @return {undefined}
 */
var buildPepObject = function(req, res, pepCallback) {

    if (_.isObject(req.session.user) === false) {
        res.status(rdk.httpstatus.internal_server_error).rdkSend('No user defined for this session.');
        return;
    }

    var requestUser = req.session.user || undefined;

    if (_.isObject(requestUser)) {
        options.roles = requestUser.roles || options.roles;
    }
    return pepCallback(options);
};

function executePdpResponse(req, res, err, pdpResult, pepCallback) {
    if (err) {
        res.status(err.status).rdkSend(err.message);
        return;
    }

    if (_.isArray(pdpResult) === true) {
        req.session.user.permissions = pdpResult;
    } else {
        res.status(rdk.httpstatus.internal_server_error).rdkSend('User Permissions not formatted properly.');
        return;
    }

    return pepCallback();

}

module.exports.buildPepObject = buildPepObject;
module.exports.executePdpResponse = executePdpResponse;
