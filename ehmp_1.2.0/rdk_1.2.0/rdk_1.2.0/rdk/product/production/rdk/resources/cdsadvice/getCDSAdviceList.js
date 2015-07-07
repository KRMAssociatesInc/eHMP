/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var _ = rdk.utils.underscore;
var nullchecker = rdk.utils.nullchecker;
var httpUtil = require('../../utils/http-wrapper/http');
var auditUtil = require('../../utils/audit/auditUtil');
var util = require('util');
var cdsUtil = require('./cdsUtil');
var async = require('async');
var cdsConfig = require('./config');

// Clinical Reminders
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var filemanDateUtil = require('../../utils/filemanDateUtil');
var errorVistaJSCallback = 'VistaJS RPC callback error: ';

// Cache
var adviceCache = require('./adviceCache');

//begin code to remove after verification for US3793/US3798
var request = require('request');
var logResponseUri = 'http://10.2.2.49:3000/api/logresponse';
var logRequestUri = 'http://10.2.2.49:3000/api/logrequest';

/**
 * Specifies the invocation intent.
 */
var RULES_INVOCATION_USE = {
    FAMILY_MED: 'FamilyMedicine',
    OCCUPATIONAL_MED: 'OccupationalMedicine',
    NONE: 'none'
};

var apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.swagger.paramTypes.query('use', 'Rules invocation context', 'string', true)
        ],
        responseMessages: []
    }
};

function logResponse(body, code) {
    var options = {
        uri: logResponseUri,
        method: 'POST',
        json: {
            'source': 'RDK CDS Advice',
            'destination': 'CDS Advice Applet',
            'code': code,
            'body': body
        }
    };
    request(options, function( /*error, response, body*/ ) {
        //Just drop the error on the floor if we have one...this is non-essential stuff...
        //console.log(error);
    });
}

function logRequest(type, url) {
    var options = {
        uri: logRequestUri,
        method: 'POST',
        json: {
            'source': 'CDS Advice Applet',
            'destination': 'RDK CDS Advice',
            'type': type,
            'url': url,
            'body': ''
        }
    };
    request(options, function( /*error, response, body*/ ) {
        //Just drop the error on the floor if we have one...this is non-essential stuff...
        //console.log(error);
    });
}

function getUrl(req) {
        if (req && req.headers) {
            return (req.protocol || '{unknown}') + '://' + (req.headers.host || '{unknown}') +
                (req.originalUrl || req.url || '/{unknown}');
        } else {
            return '{no request information is available}';
        }
    }
    // end of logger verification code

/**
 * Transform the data returned from rules invocation into a UI usable common form
 *
 * @param {object} adviceList List of json objects containing advice information
 * @param {object} common List of transformed advice information objects
 */
function transformAdviceList(adviceList, common) {
        for (var i = 0; i < adviceList.length; i++) {
            var item = {};
            item.id = 'advice' + i;
            item.priority = adviceList[i].priority;
            item.title = adviceList[i].title;
            item.details = {
                detail: adviceList[i].details,
                provenance: adviceList[i].provenance
            };
            item.type = adviceList[i].type;
            item.dueDate = '';
            item.doneDate = '';
            common.push(item);
        }
    }
    /**
     *  Transform the data returned from clinical reminders into a UI usable common form
     *
     * @param {object} reminders List of json objects containing advice information
     * @param {object} common List of transformed advice information objects
     */
function transformReminders(reminders, common) {
    for (var i = 0; i < reminders.length; i++) {
        var item = {};
        item.id = reminders[i].reminderId;
        item.priority = 0; // None
        item.title = reminders[i].title;
        item.details = null;
        item.type = 'reminder'; // Reminder
        item.dueDate = reminders[i].dueDate;
        item.doneDate = reminders[i].doneDate;
        common.push(item);
    }
}

/**
 * Merge the advice and reminders lists
 *
 * @param {object} adviceList List of json objects containing advice information
 * @param {object} reminders List of json objects containing advice information
 */
function mergeLists(adviceList, reminders) {
        var merged = [];
        transformAdviceList(adviceList, merged);
        transformReminders(reminders, merged);
        return merged;
    }
    /**
     * Make an RPC call to retrieve clinical reminders. Uses the site id that is stored in the user session.
     *
     * @param {object} req The HTTP request object
     * @param {object} res The HTTP response object
     * @param {callback} next The next function
     * @param {string} pid The user identfier
     * @param {callback} callback The provided callback when complete
     */
function getClinicalRemindersList(req, res, next, pid, callback) {
    cdsUtil.getDFN(req, pid, function(data) {
        if (data instanceof Error) {
            req.logger.error('CDS Advice - Error retrieving clinical reminders: ' + data.message);
            callback(null, []); // Return empty list here!
        } else {
            req.logger.info('retrieve clinical reminder list');

            var dfn = data;
            req.logger.debug('DFN: ' + dfn);
            if (nullchecker.isNullish(dfn)) {
                req.logger.error('CDS Advice - Error retrieving clinical reminders, DFN is nullish.');
                callback(null, []); // Return empty list here!
            } else {
                VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORQQPX REMINDERS LIST', [VistaJS.RpcParameter.literal(dfn)], function(error, result) {
                    if (error) {
                        req.logger.error(errorVistaJSCallback + error);
                        callback(null, []); // Return empty list here!
                    } else {
                        req.logger.info('Successfully retrieved clinical reminder list from VistA.');

                        var reminders = result.split('\r\n');
                        var reminder = '';
                        var items = [];
                        for (var i = 0, end = reminders.length - 1; i < end; i++) {
                            reminder = reminders[i].split('^');
                            if (reminder) {
                                var item = {};
                                item.reminderId = reminder[0];
                                item.title = reminder[1];
                                var dueDateStr = reminder[2];
                                if (!dueDateStr) {
                                    item.dueDate = '';
                                } else if (dueDateStr === 'DUE NOW') {
                                    item.dueDate = filemanDateUtil.getVprDateTime(filemanDateUtil.getFilemanDateTime(new Date()));
                                } else {
                                    item.dueDate = filemanDateUtil.getVprDateTime(dueDateStr);
                                }
                                var doneDateStr = reminder[3];
                                if (!doneDateStr) {
                                    item.doneDate = '';
                                } else {
                                    item.doneDate = filemanDateUtil.getVprDateTime(doneDateStr);
                                }
                                items.push(item);
                            }
                        }
                        callback(null, items);
                    }
                });
            }
        }
    });
}

/**
 * Make a REST call into the CDS Invocation service to retrieve advice
 *
 * @param {object} req The HTTP request object
 * @param {object} res The HTTP response object
 * @param {string} pid The user identfier
 * @param {string} use The use request code
 * @param {callback} The provided callback when complete
 */
function getRulesResultsList(req, res, pid, use, callback) {

    if (use === RULES_INVOCATION_USE.NONE) {
        return callback(null, []); // No CDS rules to execute, skip this part.
    }

    var config = {
        timeoutMillis: 50000,
        protocol: 'http',
        logger: req.logger,
        options: {
            host: cdsConfig.cdsInvocationServer.host,
            port: cdsConfig.cdsInvocationServer.port,
            path: cdsConfig.cdsInvocationServer.path,
            method: cdsConfig.cdsInvocationServer.method
        }
    };

    var content = {
        context: {
            patientId: pid,
            userId: req.session.user.username, // req.session.user.duz[0],
            siteId: req.session.user.site,
            credentials: '11111' // req.session.cookie
        },
        reason: use
    };

    req.logger.info('CDS Advice - service post called');
    httpUtil.post(content, config, function(err, response) {
        req.logger.debug('callback from fetch()');
        response = JSON.parse(response);

        if (err || !response) {
            // there was an error calling the invocationserver
            req.logger.debug('CDS Advice: error calling cds invocation server=' + util.inspect(err, {
                depth: null
            }));
            callback(null, []); // Return empty list here!
        } else {
            if (response.status && response.status.code !== '0' /* 0 == OK*/ ) {
                var invocationError = getInvocationError(response.status.info);
                // HTTP request was successful but the CDS Invocation service reported an error.
                req.logger.debug('CDS Advice: cds invocation server returned error=' +
                    util.inspect(invocationError, {
                        depth: null
                    }));
                callback(null, []); // Return empty list here!
            } else {
                callback(null, response.results);
            }
        }
    });
}

/**
 * Retrieve the status from the invocation result
 *
 * @param {object} info the returned payload from an invocation call
 */
function getInvocationError(info) {
    return _.map(info, function(o) {
        return o.text;
    }).join(' ');
}

/**
 * Make asynchronous calls for both cds advice and clinical reminders
 *
 * @param {object} req The HTTP request object
 * @param {object} res The HTTP response object
 * @param {callback} next The next function
 */
function getCDSAdviceList(req, res, next) {
    req.logger.info('CDS Advice - list resource GET called');

    var pid = req.param('pid');
    var use = req.param('use');
    var useCachedValue = req.param('cache');

    req.logger.debug('PID: ' + pid);
    req.logger.debug('USE: ' + use);
    req.logger.debug('USE CACHED RESULTS: ' + useCachedValue);

    // Audit this access
    req.audit.dataDomain = 'CDS';
    req.audit.logCategory = 'ADVICE';
    req.audit.patientId = pid;
    auditUtil.addAdditionalMessage(req, 'use', use);
    auditUtil.addAdditionalMessage(req, 'cache', useCachedValue);

    //begin remove after verification for US3793/US3798
    logRequest('GET', getUrl(req));
    //end remove after verification for US3793/US3798

    if (nullchecker.isNullish(pid) || nullchecker.isNullish(use)) {
        req.logger.error('CDS Advice - missing or null parameters');
        return res.status(rdk.httpstatus.bad_request).end('CDS Advice - missing or null parameters');
    }

    //if we scope this to the session, we can get it here: 'req.session.id';
    var cachedValue = adviceCache.get(pid, use);

    if (useCachedValue === 'true' && cachedValue) {
        req.logger.debug('CDS Advice cache hit for pid/use: ' + pid + '/' + use + ' value: ' + cachedValue);
        res.send(rdk.httpstatus.ok, cachedValue);
    } else {
        async.parallel([

                function(callback) {
                    getRulesResultsList(req, res, pid, use, callback);
                },
                function(callback) {
                    getClinicalRemindersList(req, res, next, pid, callback);
                }
            ],
            function(err, results) {
                if (err) {
                    //begin remove after verification for US3793/US3798
                    logResponse(err, rdk.httpstatus.internal_server_error);
                    //end remove after verification for US3793/US3798
                    return res.status(rdk.httpstatus.internal_server_error).json(err);
                } else {
                    var mergedList = mergeLists(results[0], results[1]);
                    var responseBody = JSON.stringify({
                        data: {
                            items: mergedList
                        }
                    });
                    adviceCache.set(pid, use, mergedList, 900 /* 15 minute cache life */ );

                    //begin remove after verification for US3793/US3798
                    logResponse(responseBody, rdk.httpstatus.ok);
                    //end remove after verification for US3793/US3798

                    return res.status(rdk.httpstatus.ok).send(responseBody);
                }
            });
    }
}

module.exports.getCDSAdviceList = getCDSAdviceList;
module.exports.apiDocs = apiDocs;
