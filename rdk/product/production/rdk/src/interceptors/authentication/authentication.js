'use strict';

var util = require('util');
var rdk = require('../../core/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var httpUtil = require('../../utils/http');
var _ = require('lodash');
var _s = require('underscore.string');
var async = require('async');
var moment = require('moment');

var USERKEYS_RPC = 'YTQ ALLKEYS';
var USERCLASS_RPC = 'HMPCRPC RPC';
var DG_RECORD_ACCESS = 'DG RECORD ACCESS';
var DG_SENSITIVITY = 'DG SENSITIVITY';
var DG_SECURITY_OFFICER = 'DG SECURITY OFFICER';
var CORTABS_INDEX = 21;
var RPC_INDEX = 22;
var NAME_INDEX = 1;
var USERINFO_RPC = 'ORWU USERINFO';
var JDS_HTTP_FETCH_TIMEOUT_MILLS = 5000;
var USERS_COLLECTION = 'ehmpUsers';
var nullChecker = rdk.utils.nullchecker;
var mongoStore = rdk.utils.mongoStore;

module.exports = function(req, res, next) {

    var config = req.app.config;

    if ('interceptors' in config && 'authentication' in config.interceptors && config.interceptors.authentication.disabled) {
        req.logger.warn('authentication disabled');
        return next();
    }

    if (req.session && req.session.user) {
        if (req._resourceConfigItem.title === 'authentication-authentication') {
            if (req.param('accessCode') === req.session.user.accessCode &&
                req.param('verifyCode') === req.session.user.password &&
                req.param('site') === req.session.user.site) {
                req.logger.debug('ALREADY LOGGED IN: ' + util.inspect(req.session.user, {
                    depth: null
                }));
                return next();
            } else {
                // regenerate session if session user doesn't match req user
                req.session.regenerate(regenerateCallback);
            }
        } else {
            return next();
        }
    }

    function regenerateCallback(err) {
        if (err) {
            req.logger.error('There was an error trying to regenerate an express session for a new user ' + err);
            return;
        }
    }

    req.logger.info('DOING LOGIN');
    processAuthentication(req, res, next);
};



/**
 * Modifys a default user object to put in the body response
 * @param  {Object} req -typical default Express request object
 * @param  {Object} res -typical default Express response object
 * @param  {Object} next - typical Express middleware next function
 * @return {Object} || undefined
 */
var processAuthentication = function(req, res, next) {
    req.audit.dataDomain = 'Authentication';
    req.audit.logCategory = 'AUTH';

    var statuscode = rdk.httpstatus.ok;
    var errorObj = {};

    var accessCode = req.param('accessCode', '');
    var verifyCode = req.param('verifyCode', '');
    var site = req.param('site', '');

    req.logger.debug('Authentication = { accessCode: %s, verifyCode: %s, site: %s }', accessCode, verifyCode, site);
    //check required parameters
    if (_.isEmpty(accessCode) === true ||
        _.isEmpty(verifyCode) === true ||
        _.isEmpty(site) === true) {
        statuscode = rdk.httpstatus.bad_request;
        errorObj = {
            'message': 'Missing Required Credential',
            'status': statuscode
        };
        res.status(statuscode).rdkSend(errorObj);
        return;
    }

    //check for existence of site code in sites configuration
    //get corresponding host and port and assign to configuration
    var vistaSites = req.app.config.vistaSites;
    if (_.isEmpty(vistaSites[site]) === true) {
        statuscode = rdk.httpstatus.bad_request;
        errorObj = {
            'message': 'Invalid Site Code',
            'status': statuscode
        };
        res.status(statuscode).rdkSend(errorObj);
        return;
    }

    //create return object
    var user = {
        accessCode: accessCode,
        verifyCode: verifyCode,
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
        infoButtonOid: '',
        provider: false,
        permissions: [],
        pcmm: [],
        uid: ''
    };

    //create VistaJS configuration variables
    var vistaConfig = {
        context: '',
        host: '',
        port: 0,
        accessCode: '',
        verifyCode: '',
        localIP: '',
        localAddress: ''
    };

    vistaConfig.context = req.app.config.rpcConfig.context;
    vistaConfig.accessCode = accessCode;
    vistaConfig.verifyCode = verifyCode;
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

                        VistaJS.authenticate(req.logger, vistaConfig, function(error, vistaJSAuthResult) {

                            if (error) {
                                req.logger.debug('Error during login: ' + util.inspect(error, {
                                    depth: null
                                }));
                                //Error Handling for Authentication
                                statuscode = rdk.httpstatus.unauthorized;
                                errorObj = {
                                    'error': error.toString()
                                };
                                req.session.destroy(); // todo: find a cleaner way to handle invalid logins destroying the session
                                innerCallback(errorObj);
                            } else if (vistaJSAuthResult === undefined || !vistaJSAuthResult) { //_.isObject(vistaJSAuthResult)
                                statuscode = rdk.httpstatus.unauthorized;
                                errorObj = {
                                    'error': 'No Result'
                                };
                                req.session.destroy();
                                innerCallback(errorObj);
                            } else {
                                //Pull the users first and last names from the greeting
                                var greeting = vistaJSAuthResult.greeting.split(' ');
                                var name = greeting[2].split(',');

                                //Valid user so fill in result
                                var obj = {
                                    duz: {}
                                };
                                obj.username = site + ';' + vistaJSAuthResult.accessCode;
                                obj.password = vistaJSAuthResult.verifyCode;
                                obj.facility = vistaSites[site].name;
                                obj.firstname = name[1];
                                obj.lastname = name[0];
                                obj.duz[site] = vistaJSAuthResult.duz;
                                obj.infoButtonOid = vistaSites[site].infoButtonOid;
                                user.infoButtonOid = obj.infoButtonOid;

                                //set the audit username
                                req.audit.authuser = obj.duz;

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

                            rdk.utils.http.fetch(req.app.config, {
                                timeoutMillis: JDS_HTTP_FETCH_TIMEOUT_MILLS,
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
                                    obj.uid = userInfo.data.items[0].uid || '';
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
                        statuscode = rdk.httpstatus.ok;
                    }

                    //pass the data objects to the callback
                    callback(null, data);
                });

            },
            // call to get dg records
            'userKeysRpc': function(callback) {
                VistaJS.callRpc(req.logger, vistaConfig, USERKEYS_RPC, function(error, result) {

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
                VistaJS.callRpc(req.logger, vistaConfig, USERINFO_RPC, function(error, result) {

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
                        obj.name = result[NAME_INDEX];

                        // This checks if the user has access to either CPRS tab setting
                        // This code should likely move to PEP/PDP as it related to authorization
                        // and is not an authentication issue. This is a short-term solution.
                        if (obj.corsTabs === 'true' || obj.rptTabs === 'true') {
                            callback(null, obj);
                        } else {
                            statuscode = rdk.httpstatus.forbidden;
                            errorObj = {
                                'error': 'User is not authorized to access this system.'
                            };

                            callback(errorObj, null);
                        }


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
                // assign custom login error messages
                if (errorObj.error.match(/ACCESS CODE\/VERIFY CODE/)) {
                    errorObj.message = 'Not a valid ACCESS CODE/VERIFY CODE pair.';
                } else if (errorObj.error.match(/context .+ does not exist/)) {
                    errorObj.message = 'Invalid rpc context.';
                } else if (errorObj.error.match(/MULTIPLE SIGNONS/)) {
                    errorObj.message = 'Multiple signons not allowed.';
                } else {
                    errorObj.message = errorObj.error;
                }
                errorObj.status = statuscode;
                return res.status(statuscode).rdkSend(errorObj);
            }
            var auth = data.authentication.authenticate;
            var jds = data.authentication.jds;
            var keys = data.userKeysRpc;
            var userInfo = data.userInfoRPC;
            async.series({
                // call to get User Classes
                'userClassRPC': function(callback) {
                    VistaJS.callRpc(req.logger, vistaConfig, USERCLASS_RPC, {
                            '"command"': 'getUserInfo',
                            '"userId"': user.duz[site]
                        },
                        function(error, result) {

                            if (error) {

                                req.logger.debug('Error during User Class Request: ' + util.inspect(error, {
                                    depth: null
                                }));
                                //Error Handling for Authentication
                                statuscode = rdk.httpstatus.unauthorized;
                                errorObj = {
                                    'error': error.toString()
                                };

                                callback(errorObj, null);

                            } else {
                                try {
                                    result = JSON.parse(result);
                                } catch (ex) {
                                    req.logger.error('Unable to parse results due to ' + ex + ' exception.');
                                }
                                var returnObj = {
                                    userClassRPC: result,
                                    roles: []
                                };
                                //Gets User Roles for User
                                mongoStore.getCollection(USERS_COLLECTION, req, res, function(ehmpUsers) {
                                    if (_.isUndefined(ehmpUsers) || _.isNull(ehmpUsers)) {
                                        req.logger.info('Nothing was returned from the ehmp user store for user ' + jds.uid + '.');
                                        callback(null, returnObj);
                                        return;
                                    }
                                    if (_.size(ehmpUsers) > 0) {
                                        var userCount = _.size(ehmpUsers);
                                        ehmpUsers.count(function(err, count) {
                                            req.logger.info('There are ' + count + ' users in the database');
                                        });
                                        req.logger.info('jds.uid:' + jds.uid);
                                        if (userCount === 0) {
                                            req.logger.info('There are no users in the database.');
                                            callback(null, returnObj);
                                            return;
                                        }
                                        ehmpUsers.findOne({
                                            uid: jds.uid
                                        }, function(err, result) {
                                            if (!_.isEmpty(err) && !_.isNull(err) || nullChecker.isNullish(result)) {
                                                req.logger.error('Mongo search for ' + jds.uid + ' user id came back with no results.');
                                                callback(null, returnObj);
                                                return;
                                            } else {
                                                returnObj.roles = result.roles;
                                                callback(null, returnObj);
                                                return;
                                            }
                                        });
                                    }
                                });

                            }

                        });
                }
            }, function(finalError, finalData) {
                if (!_.isUndefined(finalData) && !nullChecker.isNullish(finalData)) {
                    var userClass = finalData.userClassRPC;
                    var userRoles = finalData.userClassRPC.roles;
                    var nameParts = userInfo.name.split(',');
                    var firstName = nameParts[1];
                    var lastName = nameParts[0];

                    //set the user info off the callback objects
                    user.username = auth.username;
                    user.password = auth.password;
                    user.facility = auth.facility;
                    user.firstname = firstName;
                    user.lastname = lastName;
                    user.duz = auth.duz;
                    user.ssn = jds.ssn;
                    user.uid = jds.uid;
                    user.title = jds.title;
                    user.vistaKeys = jds.vistaKeys;
                    user.dgRecordAccess = keys.dgRecordAccess;
                    user.dgSensitiveAccess = keys.dgSensitiveAccess;
                    user.dgSecurityOfficer = keys.dgSecurityOfficer;
                    user.corsTabs = userInfo.corsTabs;
                    user.rptTabs = userInfo.rptTabs;
                    user.site = site;
                    user.roles = userRoles;

                    if (_.isNull(userClass.vistaUserClass) || _.isUndefined(userClass.vistaUserClass)) {
                        user.vistaUserClass = [];
                    } else {
                        user.vistaUserClass = userClass.vistaUserClass;
                    }

                    if (_.contains(jds.vistaKeys, 'PROVIDER')) {
                        user.provider = true;
                    }

                    //user roles for JBPM
                    user.pcmm = rdk.rolesConfig.user[accessCode] || [];

                    req.session.user = user;

                    // Save details of active user for osync
                    async.series({
                        osync: function(os) {
                            saveUserToJDS(req, user, os);
                        }
                    }, function(activeError, activeResult) {
                        if (_.isNull(activeError)) {
                            req.logger.debug('Saved Active user for osync ' + activeResult);
                        } else {
                            req.logger.debug('Failed to Save Active user for osync ' + activeError);
                        }

                        next();

                    });
                }
            });

        });
    } catch (e) {

        statuscode = rdk.httpstatus.internal_server_error;

        req.logger.debug('Error during parallel Vista Call: ' + util.inspect(e, {
            depth: null
        }));
        errorObj = {
            'message': e.toString(),
            'status': statuscode
        };

        res.status(statuscode).rdkSend(errorObj);
        return;
    }

    function saveUserToJDS(req, user, callback) {
        var logger = req.logger;
        var users_list_screen_id = 'osyncusers';
        var result = {
            '_id': users_list_screen_id,
            'users': []
        };
        // Get the current list of users
        async.series({
            currentUsers: function(cb) {
                getOsyncActiveUserList(req, function(err, data) {
                    cb(err, data);
                });
            }
        }, function(currentError, currentData) {
            if (!_.isUndefined(currentError)) {
                logger.debug('Error connecting to JDS to get active user list for osync');
                return callback(true, null);
            }

            var newData = JSON.parse(currentData.currentUsers).users;
            if (!_.isUndefined(newData)) {
                logger.debug('active user list was NOT undefined');
                _.remove(newData, function(item) {
                    if (item.accessCode === user.accessCode) {
                        return true;
                    }
                });

                newData.push({
                    accessCode: user.accessCode,
                    verifyCode: user.verifyCode,
                    lastlogin: moment().format()
                });

                result.users = newData;
            } else {
                logger.debug('active user list WAS undefined');
                result.users = [{
                    accessCode: user.accessCode,
                    verifyCode: user.verifyCode,
                    lastlogin: moment().format()
                }];
            }

            logger.debug('About to save to JDS osync active users ' + result);

            // Save to JDS
            async.series({
                saveUsers: function(cb) {
                    setOsyncActiveUserList(req, result, cb);
                }
            }, function(saveError, saveData) {
                if (!_.isNull(saveError) || !_.isUndefined(saveError)) {
                    logger.debug('Failed to save osync Active User list to JDS');
                    return callback(true, null);
                }
                logger.debug('Saved osync Active Users to JDS ' + result + ' - ' + saveData);
                callback(null, result);
            });

        });
    }

    function getOsyncActiveUserList(req, callback) {
        var users_list_screen_id = 'osyncusers';
        var options = _.extend({}, req.app.config.jdsServer, {
            method: 'GET',
            path: '/user/get/' + users_list_screen_id
        });
        var config = {
            options: options,
            protocol: 'http',
        };
        httpUtil.fetch(req.app.config, config, callback);
    }

    function setOsyncActiveUserList(req, details, callback) {
        var options = _.extend({}, req.app.config.jdsServer, {
            method: 'POST',
            path: '/user/set/this'
        });
        var config = {
            options: options,
            protocol: 'http',
        };
        console.dir(config);
        console.log('SR');
        console.dir(details);
        httpUtil.post(details, req.app.config, config, callback);
    }
};
