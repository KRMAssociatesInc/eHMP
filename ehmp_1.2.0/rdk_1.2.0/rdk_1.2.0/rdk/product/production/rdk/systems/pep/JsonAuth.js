/* jslint node: true */
'use strict';

var _ = require('underscore');
_.str = require('underscore.string');
var rulesEngine = require('../../pdp/rulesEngine.js');

/**
 * The jsonAuth 'class' builds the JSON REST request to be sent to PDP Server
 *
 * @class
 * @return {JsonAuth}
 */
var JsonAuth = function() {

    var _this = this;

    var sendJsonRequest = function(params, callback) {

        var pdpResponse = {
            code: '',
            reason: '',
            text: ''
        };

        var data = {
            breakglass: _.str.toBoolean(params.breakglass),
            sensitive: _.str.toBoolean(params.sensitive),
            hasSSN: _.str.toBoolean(params.hasSSN),
            requestingOwnRecord: _.str.toBoolean(params.requestingOwnRecord),
            rptTabs: _.str.toBoolean(params.rptTabs),
            corsTabs: _.str.toBoolean(params.corsTabs),
            dgRecordAccess: _.str.toBoolean(params.dgRecordAccess),
            dgSensitiveAccess: _.str.toBoolean(params.dgSensitiveAccess)

        };

        // Entry point to PDP - Node-rules
        rulesEngine.execute(data, function(res) {
            var result = res.result;
            if (result) {
                pdpResponse.code = result.code;
                if (result.text) {
                    pdpResponse.text = result.text;

                }
                if (result.reason) {
                    pdpResponse.reason = result.reason;
                }
            }

            callback(null, pdpResponse);

        });

    };

    /**
     * @param {Object} params Required parameters for building the xacml request
     *            (resource, breakglass, subject)
     * @param {Function} callback
     * @return {JsonAuth}
     * @memberOf JsonAuth
     */
    this.getAuth = function(params, callback) {

        callback = (typeof callback === 'function') ? callback : function() {};

        sendJsonRequest(params, callback);

    };

    return this;

};

module.exports = JsonAuth;
