'use strict';
var rdk = require('../../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var async = require('async');
var moment = require('moment');
var errors = require('../common/errors');
var utils = require('./utils');

//TO DO:
// As JSON.parse and JSON.stringify work in a blocking manner perhaps we should switch to a streaming parser as this one:
// https://github.com/dominictarr/JSONStream

var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        encounterUid: {
            required: false,
            description: 'referral encounter id'
        },
        date: {
            required: false,
            description: 'reference date - ONLY FOR DEBUG'
        }
    }
};

var apiDocs = {
    spec: {
        path: '/vler/{pid}/table-of-contents',
        summary: '',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.id('query', 'referral encounter', false),
            rdk.docs.swagger.paramTypes.query('date.reference', 'reference date - ONLY FOR DEBUG', 'string', false)
        ],
        responseMessages: []
    }
};

var sections = {
    header: require('./header'),
    problems: require('./problems-section'),
    encounters: require('./encounters-section'),
    allergies: require('./allergies-section'),
    medications: require('./medications-section'),
    vitalsigns: require('./vital-signs-section'),
    procedures: require('./procedures-section'),
    immunizations: require('./immunizations-section'),
    results: require('./results-section'),
    assessment: require('./assessment-section'),
    planOfCare: require('./plan-of-care-section')
};

function getResourceConfig() {
    return [{
        name: 'toc',
        path: '',
        get: getToC,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: [

            function() {
                return true;
            }
        ],
        permissions: []
    }];
}
module.exports.getResourceConfig = getResourceConfig;

function getSectionData(sectionName, getSectionDataFunction, req, pid, refferenceDate, callback) {
    getSectionDataFunction(req, pid, refferenceDate, function(err, data) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            err.code = rdk.httpstatus.internal_server_error;
            err.msg = 'There was an error processing your request. The error has been logged.';
            return callback(err, null);
        } else if (err instanceof errors.NotFoundError) {
            err.code = rdk.httpstatus.not_found;
            err.msg = err.error;
            return callback(err, null);
        } else if (err) {
            // res.status(rdk.httpstatus.internal_server_error).rdkSend(err.message);
            err.code = rdk.httpstatus.internal_server_error;
            err.msg = err.error;
            return callback(err, null);
        } else {
            var sectionResult = {};
            sectionResult[sectionName] = data;
            return callback(null, sectionResult);
        }
    });
}

function getToC(req, res, next) {

    var pid = req.query.pid;
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    var encounterUid = req.query.encounterUid;
    var referenceDate = req.query.date || new Date();
    utils.getFromJds(req, '/vpr/' + pid + '/index/encounter?filter=ne(remove,true),eq(uid,' + encounterUid + ')', function(err, result) {
        if (!err && nullchecker.isNotNullish(result) && nullchecker.isNotNullish(result.data) && nullchecker.isNotNullish(result.data.items) && result.data.items.length > 0 && nullchecker.isNotNullish(result.data.items[0].dateTime)) {
            referenceDate = moment(result.data.items[0].dateTime, 'YYYYMMDD').add(1,'days');
        }

        var taskArr = [];
        for (var name in sections) {
            if (sections[name].getData) {
                taskArr.push(getSectionData.bind(null, name, sections[name].getData, req, pid, referenceDate));
            }
        }

        async.parallel(taskArr,
            function(err, results) {
                if (!err) {
                    var finalResult = {};
                    _.each(results, function(result) {
                        finalResult = _.extend(finalResult, result);
                    });
                    res.status(200).rdkSend(finalResult);
                } else {
                    res.status(err.code).rdkSend(err.msg);
                }
            }
        );
    });
}
