'use strict';

var rdk = require('../core/rdk');
var _ = require('underscore');
var httpUtil = rdk.utils.http;
var util = require('util');
var async = require('async');
var moment = require('moment');
var whiteList = ['SCHEDULED/KEPT','CHECKED IN', 'INPATIENT APPOINTMENT', 'FUTURE', 'NON-COUNT', 'ACTION REQUIRED'];

function getResourceConfig() {
    return [{
        name: 'getTimeline',
        path: '',
        get: getTimeline,
        parameters: {
            get: {
                pid: {
                    required: true,
                    description: 'patient id'
                }
            }
        },
        apiDocs: apiDocs,
        interceptors: {
            pep: false
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jdsSync']
        }
    }];
}

var apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid
        ],
        responseMessages: []
    }
};

function trimResultObjects(value, key, list) {
    //normalize time lengths to YYYYMMDDhhmmss
    if (value.dateTime) {
        value.dateTime = rightPad(value.dateTime);
    }

    if (value.referenceDateTime) {
        value.referenceDateTime = rightPad(value.referenceDateTime);
    }

    list[key] = _.pick(value, 'kind', 'dateTime', 'referenceDateTime', 'stay');
}

function rightPad(num) {
    num = num + '';
    if (num.length >= 14) {
        return num;
    }

    var pad = '00000000000000' + '';
    return num + pad.substring(0, pad.length - num.length);
}

function sortByDateTime(a, b) {
    a = a.dateTime || a.referenceDateTime;
    if (!a) {
        return 0;
    }

    b = b.dateTime || b.referenceDateTime;
    if (!b) {
        return 0;
    }

    return a - b;
}

function getTimeline(req, res) {
    req.audit.dataDomain = 'Global Timeline';
    req.audit.logCategory = 'TIMELINE';

    getData(req, function(err, data) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {
            res.status(rdk.httpstatus.ok).rdkSend(data);
        }
    });
}

function getData(req, callback) {
    var pid = req.param('pid');

    //encounter: http://10.2.2.110:9080/vpr/10108V420871/index/encounter

    async.parallel({
            encounters: function(callback) {
                makeJdsCall(req.app.config, '/vpr/' + pid + '/index/encounter', req.logger, callback);
            }
        },
        function(err, results) {
            if (err) {
                req.logger.error(err);
                callback(err);
            } else {
                results = sortInpatientOutpatient(results, req.logger);
            }
            callback(null, results);
        });
}

function makeJdsCall(appConfig, jdsPath, logger, callback) {
    var options = _.extend({}, appConfig.jdsServer, {
        method: 'GET',
        path: jdsPath
    });

    var config = {
        options: options,
        protocol: 'http',
        //timeoutMillis: 120000,
        logger: logger || {}
    };

    httpUtil.fetch(appConfig, config, function(err, result) {
        if (err) {
            config.logger.error(err.message);
            callback(err);
            return;
        }
        var returnedData;
        try {
            returnedData = JSON.parse(result);
        } catch (ex) {
            config.logger.error(err.message);
            callback(err);
            return;
        }
        if (returnedData.hasOwnProperty('data')) {
            callback(null, returnedData);
        } else {
            //malformed json
            err = new Error('Unexpected JSON format');
            config.logger.error(err.message);
            callback(err);
            return;
        }

    });
}

function sortInpatientOutpatient(results, logger) {

    //return results; //uncomment to shortcircuit parsing and return raw JDS results

    // JDS indexes to parse
    // ;;encounter
    //  ;;    collections: visit, appointment
    //  ;;    fields: dateTime/V/0
    //  ;;    sort: dateTime desc

    //  Business logic definitions are located on the F299 Global Date Timeline Technical Approach wiki

    var newResults = {
        inpatient: [],
        outpatient: []
    };

    logger = logger || {
        error: function() {}
    };
    var encounters;
    if (results.hasOwnProperty('encounters') && results.encounters.hasOwnProperty('data') && results.encounters.data.hasOwnProperty('items')) {
        encounters = results.encounters.data.items;
        var apptCutoffDate = moment();
        _.each(encounters, function(encounter, key, list) {
            switch (encounter.kind) {
                case 'Discharge Summary':
                    newResults.inpatient.push(encounter);
                    break;
                case 'Admission':
                case 'Visit':
                    //check if we are processing an appointment
                    if (encounter.appointmentStatus) {
                        //allow only whitelisted appointment statuses
                        if (whiteList.indexOf(encounter.appointmentStatus) >= 0) {
                            //if it is a valid appointment make sure it is future
                            var rawVisitDate = encounter.dateTime || encounter.referenceDateTime;
                            if (rawVisitDate) {
                                var apptDate = moment(rawVisitDate, 'YYYYMMDDHHmmss');
                                if (apptDate.isAfter(apptCutoffDate)) {
                                    if (encounter.patientClassCode && encounter.patientClassCode === 'urn:va:patient-class:IMP') {
                                        newResults.inpatient.push(encounter);
                                    } else {
                                        //AMB and EMER
                                        newResults.outpatient.push(encounter);
                                    }
                                }
                                //discard invalid or non-future appointments via no-op
                            }
                        }
                    } else {
                        //continue to process non-appointment visit & admission events normally
                        if (encounter.patientClassCode && encounter.patientClassCode === 'urn:va:patient-class:IMP') {
                            newResults.inpatient.push(encounter);
                        } else {
                            //AMB and EMER
                            newResults.outpatient.push(encounter);
                        }
                    }
                    break;
                case 'DoD Appointment':
                    var rawDate = encounter.dateTime || encounter.referenceDateTime;
                    if (rawDate) {
                        var apptDateDoD = moment(rawDate, 'YYYYMMDDHHmmss');
                        if (apptDateDoD.isAfter(apptCutoffDate)) {
                            if (encounter) {
                                // process only PENDING and BOOKED DoD Appointments
                                if (!encounter.hasOwnProperty('appointmentStatus') || (encounter.appointmentStatus === 'PENDING') || (encounter.appointmentStatus === 'BOOKED')) {
                                    if (encounter.typeName) {
                                        if (encounter.typeName === 'INPATIENT') {
                                            newResults.inpatient.push(encounter);
                                        } else if (encounter.typeName === 'RNDS*') {
                                            //INPATIENT WARD APPT
                                            newResults.inpatient.push(encounter);
                                        } else {
                                            newResults.outpatient.push(encounter);
                                        }
                                    } else {
                                        newResults.outpatient.push(encounter);
                                    }
                                }
                            }
                        }
                        //discard invalid or non-future appointments
                    }
                    break;
                case 'DoD Encounter':
                    if (encounter && encounter.typeName) {
                        if (encounter.typeName === 'INPATIENT') {
                            newResults.inpatient.push(encounter);
                        } else if (encounter.typeName === 'RNDS*') {
                            //INPATIENT WARD APPT
                            newResults.inpatient.push(encounter);
                        } else {
                            newResults.outpatient.push(encounter);
                        }
                    } else if (encounter) {
                        newResults.outpatient.push(encounter);
                    }

                    break;
                default:
                    logger.error('Unparseable encounter encountered: ' + util.inspect(encounter, {
                        showHidden: true,
                        depth: null,
                        colors: true
                    }));
                    //  noop - exclude from results if no kind
            }
        });
    }

    _.each(newResults.inpatient, trimResultObjects);
    _.each(newResults.outpatient, trimResultObjects);

    newResults.inpatientCount = newResults.inpatient.length;
    newResults.outpatientCount = newResults.outpatient.length;

    newResults.inpatient = newResults.inpatient.sort(sortByDateTime);
    newResults.outpatient = newResults.outpatient.sort(sortByDateTime);

    return newResults;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports._trimResultObjects = trimResultObjects;
module.exports._rightPad = rightPad;
module.exports._sortByDateTime = sortByDateTime;
module.exports._sortInpatientOutpatient = sortInpatientOutpatient;
