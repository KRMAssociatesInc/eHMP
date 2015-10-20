'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var jdsFilter = require('jds-filter');
var querystring = require('querystring');
var nullchecker = rdk.utils.nullchecker;
var async = require('async');
var paramUtil = require('../../utils/param-converter');
var moment = require('moment');
var array = require('lodash');

FetchError.prototype = Error.prototype;
NotFoundError.prototype = Error.prototype;

var description = {
    get: 'Get timeline data for one patient'
};

var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        uid: {
            required: false,
            description: 'must be a uid inside the data of this patient'
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        },
        filter: {
            required: false,
            regex: /eq("[^"]*","[^"]*")/,
            description: 'see the wiki for full documentation: https://wiki.vistacore.us/display/VACORE/JDS+Parameters+and+Filters'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};

// List of JDS indexes that will be queried
var jdsIndexConfig = [{
    name: 'news-feed'
}, {
    name: 'appointment',
    filter: function() {
        // filter out all appointments before today (except DoD appointments -- those are treated as visits)
        return [
            [
                'or',
                ['eq', 'kind', 'DoD Appointment'],
                ['gte', 'dateTime', moment().format('YYYYMMDD')],
                ['lte', 'dateTime', moment().format('YYYYMMDD')]
            ]
        ];
    }
}, {
    name: 'laboratory'
},{
    name: 'visittreatment'   // ptf domain
}];

var apiDocs = {
    spec: {
        summary: 'Get timeline data for a patient',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.uid('timeline', false),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.filter,
            rdk.docs.commonParams.jds.order
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        get: getPatientTimeline,
        parameters: parameters,
        apiDocs: apiDocs,
        description: description,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        interceptors: {
            jdsFilter: true
        },
        outerceptors: ['emulateJdsResponse'],
        permissions: []
    }];
};

function getPatientTimeline(req, res, next) {

    var config = req.app.config;
    var pid = req.param('pid');
    var uid = req.param('uid');
    var start = Math.max(0, paramUtil.parseIntParam(req, 'start', 0, 0));
    var limit = paramUtil.parseIntParam(req, 'limit', undefined, -1);
    var filter = req.interceptorResults.jdsFilter.filter || [];
    var order = req.query.order;
    var sortField = null;
    var sortDir = null;

    if (nullchecker.isNullish(pid)) {
        return next();
    }

    if (limit !== undefined && limit !== null && limit <= 0) {
        req.logger.error('For request parameter limit: invalid value "' + req.param('limit') + '": must be an integer greater than or equal to 0');
        res.rdkSend('There was an error processing your request. The error has been logged.');
        return;
    }

    if (!nullchecker.isNullish(order)) {
        var groups = order.split(/\s+/);
        sortField = groups[0];
        if (groups.length > 1) {
            sortDir = groups[1].toLowerCase();
        }
        // if direction is missing or invalid, default to 'asc' sort
        if (sortDir !== 'asc' && sortDir !== 'desc') {
            sortDir = 'asc';
        }
    }

    var baseJdsResource = '/vpr/' + pid + '/index/';
    if (uid) {
        filter.push(['like', 'uid', uid]);
    }
    var results = [];

    // Query each JDS resource for timeline data.
    async.forEach(jdsIndexConfig, function(jdsIndex, callback) {
        var domainFilter = _.clone(filter);

        var jdsQuery = {};
        if (!nullchecker.isNullish(order)) {
            jdsQuery.order = order;
        }

        if (jdsIndex.filter) {
            var domainFilterVals = _.isFunction(jdsIndex.filter) ? jdsIndex.filter() : jdsIndex.filter;
            domainFilter = domainFilter.concat(domainFilterVals);
        }

        var filterString = jdsFilter.build(domainFilter);
        if (filterString) {
            if(jdsIndex.name != "visittreatment"){ // no filters for PTF domain
                jdsQuery.filter = filterString;
            }
        }
        var jdsQueryString = querystring.stringify(jdsQuery);
        var path = baseJdsResource + jdsIndex.name + (jdsQueryString ? '?' + jdsQueryString : '');
        var options = _.extend({}, config.jdsServer, {
            path: path,
            method: 'GET'
        });
        var httpConfig = {
            protocol: 'http',
            logger: req.logger,
            options: options
        };

        fetchData(httpConfig, req, jdsIndex.name, function(err, result) {
            if (!err && result) {
                result.domain = jdsIndex.name; //add domain name to result
                results.push(result);
            }
            callback(err);
        });

    }, function(err) {
        if (err instanceof FetchError) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).rdkSend('There was an error processing your request. The error has been logged.');
            return;
        } else if (err instanceof NotFoundError) {
            res.status(rdk.httpstatus.not_found).rdkSend(err.error);
            return;
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).rdkSend(err.message);
            return;
        } else {
            // unify dates into a common field
            unifyData(results);
            // merge results of all the resources that were queried
            var mergedResults = mergeResults(results, sortField, sortDir);
            var totalItems = mergedResults.length;

            if (limit > 0) {
                mergedResults = mergedResults.slice(start, start + limit);
            } else if (start > 0) {
                mergedResults = mergedResults.slice(start);
            }

            var responseData = {
                totalItems: totalItems,
                currentItemCount: totalItems,
                items: mergedResults
            };

            return res.rdkSend(responseData);
        }
    });
}

function fetchData(httpConfig, req, index, callback) {
    var pid = req.param('pid');

    req.audit.patientId = pid;
    req.audit.dataDomain = index;
    req.audit.logCategory = 'RETRIEVE';

    req.logger.info('Retrieve pid=%s index=%s from server %s:%s', pid, index, httpConfig.host, httpConfig.port);
    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
        if (error) {
            callback(new FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (isNotFound(obj)) {
                    return callback(new NotFoundError('Object not found', obj));
                }
            }
            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

/**
 * Performs operations to unify data from multiple domains.
 * Currently it just adds a common date field for sorting
 */
function unifyData(allResults) {
    allResults.forEach(function(indexResults) {
        indexResults = indexResults.data.items;

        indexResults.forEach(function(item) {
            item.activityDateTime = getActivityDateTime(item);
        });
    });
}

/**
 * Combines JDS results from multiple collections into one big sorted collection.
 */
function mergeResults(allResults, sortField, sortDir) {
    // extract PTF data from allResults
    var ptf = _.where(allResults, {domain: "visittreatment"});
    // flatten the PTF result set
    ptf = _.map(ptf, function(indexResults) {
        return indexResults.data.items;
    });
    var arrPTF = _.flatten(ptf, true);
    // filter out PTF from allResults
    allResults = _.reject(allResults, function(resultItem){
        return resultItem.domain === "visittreatment";
    });
    // flatten the result sets
    allResults = _.map(allResults, function(indexResults) {
        return indexResults.data.items;
    });

    // merge results into a single array
    var mergedResults = _.flatten(allResults, true);

    // remove duplicate uids
    mergedResults = _.uniq(mergedResults, false, function(resultItem) {
        return resultItem.uid;
    });

    // enrich admission events with discharge diagnosis from PTF
    var indResults =-1;
    for(var indPTF=0; indPTF < arrPTF.length; indPTF++){
        if(!_.isUndefined(arrPTF[indPTF].admissionUid)){
            indResults = array.findIndex(mergedResults,{uid: arrPTF[indPTF].admissionUid});
            if(indResults != -1){
                if(_.isUndefined(mergedResults[indResults].dischDiagn)){
                    mergedResults[indResults].dischDiagn = [];
                }
                mergedResults[indResults].dischDiagn.push(arrPTF[indPTF]);
            }
        }
    }

    // sort the results
    if (!nullchecker.isNullish(sortField) && !nullchecker.isNullish(sortDir)) {
        var val1, val2, result;
        mergedResults.sort(function(item1, item2) {

            // Use === to compare the elements (handles primitives but not objects)
            // treat undefined/null as being < any defined value
            val1 = item1[sortField];
            val2 = item2[sortField];
            result = 0;

            // compare assuming ascending sort
            if (val1 === undefined || val1 === null) {
                result = -1;
            } else if (val2 === undefined || val2 === null) {
                result = 1;
            } else if (val1 < val2) {
                result = -1;
            } else if (val1 === val2) {
                result = 0;
            } else {
                result = 1;
            }

            // if descending, reverse result
            if (sortDir === 'desc') {
                result *= -1;
            }
            return result;
        });
    }

    return mergedResults;
}

function getActivityDateTime(resultItem) {
    if (isVisit(resultItem)) {
        if (isHospitalization(resultItem) && isDischargedOrAdmitted(resultItem)) {
            return resultItem.stay.dischargeDateTime;
        }
        return resultItem.dateTime;
    } else if (isImmunization(resultItem)) {
        return resultItem.administeredDateTime;
    } else if (isLaboratory(resultItem)) {
        return resultItem.observed;
    } else {
        //generally it's dateTime, so try that if there is an unhandled usecase
        return resultItem.dateTime;
    }
}

function isVisit(resultItem) {
    if (resultItem.kind) {
        var kind = resultItem.kind.toLowerCase();
        return kind === 'visit' || kind === 'admission';
    }
    return false;
}

function isHospitalization(resultItem) {
    return resultItem.categoryCode === 'urn:va:encounter-category:AD';
}

//returns true if discharged, false if admitted
function isDischargedOrAdmitted(resultItem) {
    if (resultItem.stay) {
        return resultItem.stay.dischargeDateTime !== undefined;
    }
    return false;
}

function isImmunization(resultItem) {
    if (resultItem.kind) {
        var kind = resultItem.kind.toLowerCase();
        return kind === 'immunization';
    }
    return false;
}

function isLaboratory(resultItem) {
    if (resultItem.kind) {
        var kind = resultItem.kind.toLowerCase();
        return kind === 'laboratory' || kind === 'microbiology';
    }
    return false;
}

function isNotFound(obj) {
    return ('code' in obj.error && String(obj.error.code) === String(rdk.httpstatus.not_found));
}

function FetchError(message, error) {
    this.name = 'FetchError';
    this.error = error;
    this.message = message;
}

function NotFoundError(message, error) {
    this.name = 'NotFoundError';
    this.error = error;
    this.message = message;
}

exports.getResourceConfig = getResourceConfig;
exports.mergeResults = mergeResults; // for testing only
exports.getActivityDateTime = getActivityDateTime; // for testing only
exports.isVisit = isVisit; // for testing only
exports.isHospitalization = isHospitalization; // for testing only
exports.isDischargedOrAdmitted = isDischargedOrAdmitted; // for testing only
exports.isImmunization = isImmunization; // for testing only
exports.isLaboratory = isLaboratory; // for testing only
