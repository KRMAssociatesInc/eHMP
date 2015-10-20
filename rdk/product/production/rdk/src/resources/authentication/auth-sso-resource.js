'use strict';

var util = require('util');
var VistaJS = require('../../VistaJS/VistaJS');
var httpUtil = require('../../utils/http');
var async = require('async');
var _ = require('underscore');
var _s = require('underscore.string');
var rdk = require('../../core/rdk');
var userUtil = require('../user/user-whitelist');

var USERKEYS_RPC = 'YTQ ALLKEYS';
var DG_RECORD_ACCESS = 'DG RECORD ACCESS';
var DG_SENSITIVITY = 'DG SENSITIVITY';
var DG_SECURITY_OFFICER = 'DG SECURITY OFFICER';
var CORTABS_INDEX = 21;
var RPC_INDEX = 22;
var USERINFO_RPC = 'ORWU USERINFO';


/**
 * Modifys a default user object to put in the body response
 * @param  {Object} req -typical default Express request object
 * @param  {Object} res -typical default Express response object
 * @return {Object} || undefined
 */
function processSSOAuthentication(req, res, greetingObj, ccowObject, processSSOCallback) {
    req.audit.dataDomain = 'Authentication';
    req.audit.logCategory = 'AUTH';

    //200 OK (accepted)
    //401 Unauthorized (rejected - wrong creds)
    //400 Bad Request (rejected - missing creds)
    //400 Bad Request (rejected - invalid site code)
    //500 (error - runtime error)

    //TODO requires password reset?
    //TODO have to select between divisions?
    var statuscode = 200;
    var errorObj = {};

    var accessCode = greetingObj.accessCode;
    var site = greetingObj.site;

    req.logger.debug('access %s verify %s site %s', accessCode, site);
    //check required parameters
    if (!(accessCode.length && site.length)) {
        statuscode = 400;
        errorObj = {
            'error': 'Missing Required Credential'
        };
        return res.status(statuscode).rdkSend(errorObj);
    }

    //check for existence of site code in sites configuration
    //get corresponding host and port and assign to configuration
    var vistaSites = req.app.config.vistaSites;

    if (!vistaSites[site]) {
        statuscode = 400;
        errorObj = {
            'error': 'Invalid Site Code'
        };
        return res.status(statuscode).rdkSend(errorObj);
    }

    //create return object
    var user = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        facility: '',
        vistaKeys: [],
        title: '',
        section: 'Medicine',
        disabled: false,
        requiresReset: false,
        divisionSelect: false,
        dgRecordAccess: 'false',
        dgSensitiveAccess: 'false',
        dgSecurityOfficer: 'false',
        duz: {},
        site: '',
        ccowObject: ccowObject,
        provider: false,
        permissions: []
    };

    //create VistaJS configuration variables
    var vistaConfig = {
        context: '',
        host: '10.2.2.101',
        port: 9210,
        accessCode: '',
        verifyCode: '',
        localIP: '10.2.2.1',
        localAddress: 'localhost'
    };

    vistaConfig.context = req.app.config.rpcConfig.context;
    vistaConfig.accessCode = accessCode;
    vistaConfig.verifyCode = '';
    vistaConfig.host = vistaSites[site].host;
    vistaConfig.port = vistaSites[site].port;

    var jds = req.app.config.jdsServer;

    try {

        // perform calls to Vista in parallel
        async.parallel({
            //User Information (inner) series calls
            'authentication': function(callback) {

                async.series({
                    // call to vista for authentication
                    'authenticate': function(innerCallback) {
                        VistaJS.authenticateSSO(req.logger, vistaConfig, function(error, vistaJSAuthResult) {

                            if (error) {
                                req.logger.debug('Error during login: ' + util.inspect(error, {
                                    depth: null
                                }));
                                //Error Handling for Authentication
                                statuscode = rdk.httpstatus.unauthorized;
                                errorObj = {
                                    'error': error.toString()
                                };

                                innerCallback(errorObj);
                            } else if (vistaJSAuthResult === undefined || !vistaJSAuthResult) { //_.isObject(vistaJSAuthResult)
                                statuscode = rdk.httpstatus.unauthorized;
                                errorObj = {
                                    'error': 'No Result'
                                };
                                innerCallback(errorObj);
                            } else {
                                //Pull the users first and last names from the greeting
                                var greeting = vistaJSAuthResult.greeting.split(' ');
                                var name = greeting[2].split(',');

                                req.logger.debug('GREETING', greeting);

                                //Valid user so fill in result
                                var obj = {
                                    duz: {}
                                };
                                obj.username = site + ';' + vistaJSAuthResult.accessCode;
                                obj.password = ''; //vistaJSAuthResult.verifyCode;
                                obj.facility = vistaSites[site].name;
                                obj.firstname = name[1];
                                obj.lastname = name[0];
                                obj.duz[site] = vistaJSAuthResult.duz;

                                //set the audit username
                                req.audit.authuser = obj.username;

                                //have to set this one thing for the jds function to operate
                                user.duz[site] = obj.duz[site];

                                innerCallback(null, obj);
                            }
                        });
                    },
                    // call to get user SSN
                    'jds': function(innerCallback) {
                        // the username format being sent to the jds end point is site code combined with user duz
                        // ex. siteCode:username

                        var obj = {
                            ssn: ''
                        };

                        if (!_s.isBlank(user.duz)) {
                            var jdsPath = '/data/urn:va:user:';
                            jdsPath += site + ':' + user.duz[site];

                            httpUtil.fetch(req.app.config, {
                                timeoutMillis: 5000,
                                logger: req.logger,
                                options: {
                                    host: jds.host,
                                    port: jds.port,
                                    path: jdsPath,
                                    method: 'GET'
                                }
                            }, function(err) {
                                if (err) {
                                    statuscode = rdk.httpstatus.unauthorized;
                                    errorObj = {
                                        'error': err.toString()
                                    };
                                }
                            }, function(statusCode, response) {

                                try {
                                    var userInfo = JSON.parse(response);
                                    obj.ssn = userInfo.data.items[0].ssn || '';
                                    obj.title = userInfo.data.items[0].specialty || 'Clinician';
                                    obj.vistaKeys = [];
                                    if (userInfo.data.items[0].vistaKeys) {
                                        for (var i = 0, keys = userInfo.data.items[0].vistaKeys; i < keys.length; i++) {
                                            if (keys[i].name) {
                                                obj.vistaKeys.push(keys[i].name);
                                            }

                                        }
                                    }
                                } catch (e) {
                                    statuscode = rdk.httpstatus.unauthorized;
                                    errorObj = {
                                        'error': 'Invalid JDS User Info'
                                    };
                                    innerCallback(errorObj, obj);
                                    return;
                                }

                                innerCallback(null, obj);

                            });
                        } else {
                            innerCallback(null, obj);
                        }
                    }
                }, function(err, data) {

                    if (err) {
                        statuscode = 200;
                    }

                    //pass the data objects to the callback
                    callback(null, data);
                });

            },
            // call to get dg records
            'userKeysRpc': function(callback) {
                VistaJS.callRpcSSO(req.logger, vistaConfig, USERKEYS_RPC, function(error, result) {

                    if (error) {

                        req.logger.debug('Error during DG Request: ' + util.inspect(error, {
                            depth: null
                        }));

                        statuscode = rdk.httpstatus.unauthorized;
                        errorObj = {
                            'error': error.toString()
                        };

                        callback(errorObj, null);

                    } else if (typeof result === 'string') {

                        var obj = {
                            dgRecordAccess: 'false',
                            dgSensitiveAccess: 'false',
                            dgSecurityOfficer: 'false'

                        };
                        if (result.indexOf(DG_RECORD_ACCESS) !== -1) {
                            //DG RECORD ACCESS exists
                            obj.dgRecordAccess = 'true';
                        }

                        if (result.indexOf(DG_SENSITIVITY) !== -1) {
                            //DG RECORD ACCESS exists
                            obj.dgSensitiveAccess = 'true';
                        }

                        if (result.indexOf(DG_SECURITY_OFFICER) !== -1) {
                            //DG RECORD ACCESS exists
                            obj.dgSecurityOfficer = 'true';
                        }

                        callback(null, obj);

                    } else {

                        statuscode = rdk.httpstatus.unauthorized;
                        errorObj = {
                            'error': 'No DG Results'
                        };

                        callback(errorObj, null);
                    }

                });
            },
            // call to get corsTabs and rptTabs
            'userInfoRPC': function(callback) {
                VistaJS.callRpcSSO(req.logger, vistaConfig, USERINFO_RPC, function(error, result) {

                    if (error) {

                        req.logger.debug('Error during Tabs Request: ' + util.inspect(error, {
                            depth: null
                        }));
                        //Error Handling for Authentication
                        statuscode = rdk.httpstatus.unauthorized;
                        errorObj = {
                            'error': error.toString()
                        };

                        callback(errorObj, null);

                    } else if (typeof result === 'string') {

                        result = result.split('^');

                        var obj = {};
                        obj.corsTabs = (result[CORTABS_INDEX] === '1') ? 'true' : 'false';
                        obj.rptTabs = (result[RPC_INDEX] === '1') ? 'true' : 'false';

                        callback(null, obj);

                    } else {

                        statuscode = rdk.httpstatus.unauthorized;
                        errorObj = {
                            'error': 'No Tabs Results'
                        };

                        callback(errorObj, null);
                    }

                });
            }
        }, function(err, data) {
            if (err) {
                return res.status(statuscode).rdkSend(errorObj);
            }
            var auth = data.authentication.authenticate;
            var jds = data.authentication.jds;
            var keys = data.userKeysRpc;
            var userInfo = data.userInfoRPC;

            //set the user info off the callback objects
            user.username = auth.username;
            user.password = auth.password;
            user.facility = auth.facility;
            user.firstname = auth.firstname;
            user.lastname = auth.lastname;
            user.duz = auth.duz;
            user.ssn = jds.ssn;
            user.title = jds.title;
            user.vistaKeys = jds.vistaKeys;
            user.dgRecordAccess = keys.dgRecordAccess;
            user.dgSensitiveAccess = keys.dgSensitiveAccess;
            user.dgSecurityOfficer = keys.dgSecurityOfficer;
            user.corsTabs = userInfo.corsTabs;
            user.rptTabs = userInfo.rptTabs;
            user.site = site;
            if (_.contains(jds.vistaKeys, 'PROVIDER')) {
                user.provider = true;
            }
            if (rdk.permissionsConfig.user[accessCode]) {
                user.permissions = rdk.permissionsConfig.user[accessCode];
            } else {
                user.permissions = rdk.permissionsConfig.edition[req.app.edition];
            }

            req.session.user = user;

            return res.status(statuscode).rdkSend(userUtil.sanitizeUser(user));
        });
    } catch (e) {

        statuscode = 500;
        errorObj = {
            'error': e.toString()
        };

        if (processSSOCallback && typeof processSSOCallback === 'function') {
            processSSOCallback(errorObj);
        }
    }

}

module.exports.processSSOAuthentication = processSSOAuthentication;
