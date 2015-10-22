'use strict';

var rdk = require('../../core/rdk');
var rpcUtil = require('../../utils/rpc-config');
var httpUtil = require('../../utils/http');
var vista = require('../../VistaJS/VistaJS');
var nullchecker = require('../../utils/nullchecker');
var SENSITIVITY_RPC = 'HMPCRPC RPC';
var RPC_COMMAND_PATIENT_ACCESS = 'logPatientAccess';
var _ = require('underscore');
var _str = require('underscore.string');
var pepOptions = require('../../interceptors/authorization/pep-options');

/**
 * Check for authorization via policy rules
 *
 * @namespace buildPepObject
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} pepCallback A pepCallback function
 * @return {undefined}
 */
var buildPepObject = function(req, res, pepCallback) {
    var requestUser = req.session.user || undefined;
    var patientIdentifier = '';
    var isPatientIdPid = false;
    var config = req.app.config;
    req.audit.sensitive = 'false';
    var options = _.clone(pepOptions.policyOptions);
    try {
        var requestPid;
        if (req.query.pid) {
            requestPid = req.query.pid;
        } else if (req.params.pid) {
            requestPid = req.params.pid;
        } else {
            requestPid = req.body.pid;
        }
        if (requestPid.indexOf(';') !== -1) {
            var splitPid = requestPid.split(';');
            isPatientIdPid = true;
            patientIdentifier = splitPid[1];
        } else {
            patientIdentifier = requestPid;
        }
    } catch (e) {
        req.logger.warn('Could not get pid field from request.');
    }

    // Stop if there is no patient
    if (nullchecker.isNullish(patientIdentifier) === true) {
        req.logger.warn('No patient could be identified to authorize against.');
        res.status(rdk.httpstatus.forbidden).rdkSend();
        return;
    }
    if (req.query._ack) {
        options.breakglass = _str.toBoolean(req.query._ack);
    }

    if (typeof requestUser === 'object') {
        if (requestUser.hasOwnProperty('rptTabs')) {
            options.rptTabs = _str.toBoolean(requestUser.rptTabs);
        }
        if (requestUser.hasOwnProperty('corsTabs')) {
            options.corsTabs = _str.toBoolean(requestUser.corsTabs);
        }
        if (requestUser.hasOwnProperty('dgRecordAccess')) {
            options.dgRecordAccess = _str.toBoolean(requestUser.dgRecordAccess);
        }
        if (requestUser.hasOwnProperty('dgSensitiveAccess')) {
            options.dgSensitiveAccess = _str.toBoolean(requestUser.dgSensitiveAccess);
        }
    }

    var buildPep = function(err) {

        if (err) {
            req.logger
                .error('An error occured in pep while gathering data from JDS' + err);
            res.status(rdk.httpstatus.internal_server_error).rdkSend();
            return;
        }

        // no access -> 403 httpstatus.forbidden
        // access but no _ack -> 308 httpstatus.permanent_redirect
        // full access -> 200 httpstatus.ok
        req.logger.debug('PEP: processing pep request');

        return pepCallback(options);

    };

    var sensitivityReponseRPC = function(localpid, serverConfig) {
        if (typeof serverConfig !== 'object' && nullchecker.isNullish(patientIdentifier)) {
            return;
        }
        req.logger.debug('PEP: calling sensative rpc call to Vista' + serverConfig.name);

        vista.callRpc(req.logger, serverConfig, SENSITIVITY_RPC, [{
            '"command"': RPC_COMMAND_PATIENT_ACCESS,
            '"patientId"': localpid
        }], function(err, result) {
            if (err) {
                req.logger.warn('PEP: Sensitive RPC call error: ' + err);
            }

            if (result) {
                req.logger.debug('PEP: Sensitive RPC results: ' + result);
            }
        });
    };

    var patientDataInformation = function(statusCode, response) {
        if (typeof response === 'string') {
            // TODO
            // this should be inside a try catch
            response = JSON.parse(response);
        }
        if (typeof response !== 'object') {
            return;
        }
        if (!response.hasOwnProperty('data')) {
            return;
        }
        if (!(response.data.hasOwnProperty('items') && config
                .hasOwnProperty('vistaSites'))) {
            req.logger
                .warn('PEP: Not enough information available to build an authorization request.');
            return;
        }
        if (response.data.items instanceof Array) {
            // check if ssn match the user and the patient
            // ssn must be filled in and match
            // an empty string is considered false
            if (req.session.user && req.session.user.hasOwnProperty('ssn') && req.session.user.ssn && response.data.items.length > 0 && response.data.items[0].hasOwnProperty('ssn') && response.data.items[0].ssn && (req.session.user.ssn === response.data.items[0].ssn)) {
                // must be a string of true
                options.requestingOwnRecord = true;
            }
            _
                .each(
                    response.data.items,
                    function(patientObj) {
                        var key = patientObj.pid.split(';')[0];
                        var localpid = patientObj.pid.split(';')[1];
                        if (patientObj.sensitive === true) {
                            options.sensitive = true;
                            req.audit.sensitive = true;
                            if (options.breakglass === true) {
                                var serverConfig = rpcUtil
                                    .getVistaRpcConfiguration(
                                        config, key);

                                serverConfig.accessCode = requestUser.accessCode;
                                serverConfig.verifyCode = requestUser.verifyCode;
                                sensitivityReponseRPC(localpid,
                                    serverConfig);
                            }
                        }
                        if (nullchecker.isNullish(patientObj.ssn)) {
                            options.hasSSN = false;
                        }
                    });
        }
    };

    // Trigger the JDS fetch and run the check for sensative data on a patient
    // and finally run the pep
    // paths can be as follows
    // http://10.2.2.110:9080/data/index/pt-select-icn/?range=5123456789V027402
    // http://10.2.2.110:9080/data/index/pt-select-pid/?range=9E7A;18

    // /////////////////////////////////////////////////////////////
    // NOTE: You MUST NOT add server configurations EXCEPT to //
    // the config file. Adding NEW server configurations //
    // REQUIRES that you coordinate with dev-ops or you will //
    // BREAK the build on Jenkins. //
    // /////////////////////////////////////////////////////////////
    var jdsPath = '/data/index/pt-select-';
    jdsPath += isPatientIdPid ? 'pid' : 'icn';
    jdsPath += '?range=' + req.query.pid;
    var jdsConfig = req.app.config.jdsServer;
    var httpConfig = {
        cacheTimeout: 15 * 60 * 1000,
        timeoutMillis: 5000,
        protocol: 'http',
        logger: req.logger,
        options: {
            host: jdsConfig.host,
            port: jdsConfig.port,
            path: jdsPath,
            method: 'GET'
        }
    };

    httpUtil.fetch(config, httpConfig, buildPep, patientDataInformation);
};

/**
 * Execute PDP response for policy rules
 *
 * @namespace executePdpResponse
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Object} err The error object
 * @param {Object} pdpResponse The response object from rules engine
 * @param {Object} requestCache The cache object
 * @param {Function} pepCallback A pepCallback function
 * @return {undefined}
 */
function executePdpResponse(req, res, err, pdpResponse, pepCallback) {
    var status = rdk.httpstatus.forbidden;
    var sendBodyText = pdpResponse.text;
    var pepResponseCode = {
        permit: 'Permit',
        breakglass: 'BreakGlass',
        notapplicable: 'NotApplicable',
        indeterminate: 'Indeterminate',
        deny: 'Deny'
    };

    if (err) {
        req.logger.error('PEP: error from JsonAuth' + err);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(
            sendBodyText);
    }
    req.logger.debug('PEP: ' + pdpResponse.code + ' pep response received.');
    switch (pdpResponse.code) {
        case pepResponseCode.permit:
            status = rdk.httpstatus.ok;
            break;
        case pepResponseCode.breakglass:
            /*
             * This is a non-default pdp response. We set this when the
             * PDP returns a breakglass value.
             */
            status = rdk.httpstatus.permanent_redirect;
            res.header('BTG', pdpResponse.reason);
            break;
        default:
            // default to deny for Deny, Not Applicable and Indeterminate
            // results
            status = rdk.httpstatus.forbidden;
    }

    res.status(status);

    if (status === rdk.httpstatus.ok) {
        return pepCallback();
    } else {
        return res.rdkSend(sendBodyText);
    }
}
module.exports.buildPepObject = buildPepObject;
module.exports.executePdpResponse = executePdpResponse;
