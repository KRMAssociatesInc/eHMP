/* jslint node: true */
'use strict';

var rdk = require('../../core/rdk');
var _ = require('underscore');
var dd = require('drilldown');
var rulesEngine = require('../pdp/rules-engine');
var pepBinder = require('./pep-binder');
/**
 * The jsonAuth 'class' builds the JSON REST request to be sent to PDP Server
 *
 * @class
 * @return {JsonAuth}
 */
var JsonAuth = function() {
    var index = 0;
    var pepUtility = _.result(pepBinder, 'policy');
    var pepHandlers = [];

    var sendJsonRequest = function(req, res, params, rules, pepCallback) {

        rulesEngine.init();
        rulesEngine.register(rules);
        var executeHandlerPartial = _.partial(executeHandler, req, res, pepCallback);

        // Entry point to PDP - Node-rules
        rulesEngine.execute(params, function(response) {

            if (!dd(response)('result').val) {
                var error = {
                    status: rdk.httpstatus.internal_server_error,
                    message: 'There was internal PDP server error.'
                };

                return pepUtility.handler.executePdpResponse(req, res, error, null, executeHandlerPartial);

            }
            return pepUtility.handler.executePdpResponse(req, res, null, response.result, executeHandlerPartial);

        });
    };

    function executeHandler(req, res, pepCallback) {
        if (index < pepHandlers.length) {
            pepUtility = _.result(pepBinder, pepHandlers[index++]);

            var rules = pepUtility.rules;
            pepUtility.handler.buildPepObject(req, res, _.partial(sendJsonRequest, req, res, _, rules, pepCallback));
        } else {
            return pepCallback();
        }

    }
    /**
     * @param {Object} params Required parameters for building the xacml request
     *            (resource, breakglass, subject)
     * @param {Function} pepCallback
     * @return {JsonAuth}
     * @memberOf JsonAuth
     */
    this.getAuth = function(req, res, pepCallback) {
        var pep = req._resourceConfigItem.interceptors.pep;
        if (_.isArray(dd(pep)('handlers').val)) {
            pepHandlers = pep.handlers;
        } else if (pep === true) {
            pepHandlers = ['policy'];
        } else {
            res.status(rdk.httpstatus.forbidden).rdkSend(
                'PEP is disabled.');
            return;
        }

        executeHandler(req, res, pepCallback);
    };

    return this;

};

module.exports = JsonAuth;
