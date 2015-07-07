/*jslint node: true */
'use strict';
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var async = require('async');
var querystring = require('querystring');
var labResults = require('./labresultResource');
var radReports = require('./radiologyreportResource');
var fhirUtils = require('../common/utils/fhirUtils');
var fhirResource = require('../common/entities/fhirResource');
var errors = require('../common/errors');
//TO DO:
// As JSON.parse and JSON.stringify work in a blocking manner perhaps we should switch to a streaming parser as this one:
// https://github.com/dominictarr/JSONStream


// FetchError.prototype = Error.prototype;
// NotFoundError.prototype = Error.prototype;

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        service: {
            required: false,
            description: 'Which diagnostic discipline/department created the report'
        },
        domain: {
            required: false,
            description: 'domain'
        },
        // start: {
        //     required: false,
        //     regex: /\d+/,
        //     description: 'start showing results from this 0-based index'
        // },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        }
    }
};

var domains = {
    'lab': 'laboratory',
    'rad': 'imaging',
    'ap': 'accession'
};

var apiDocs = {
    spec: {
        path: '/fhir/diagnosticreport',
        nickname: 'fhir-diagnosticreport',
        summary: 'Converts \'laboratory\' \'imaging\' or \'accession\' vpr resource into a FHIR diagnostic resport.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.swagger.paramTypes.query('service', 'Which diagnostic discipline/department created the report', 'string', false),
            rdk.docs.swagger.paramTypes.query('domain', 'domain', 'string', false, _.values(domains)),
            // rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

var labCategoryPrefix = 'urn:va:lab-category:';

var laboratoryServiceCategories = ['LAB', 'CH', 'MB'];
var imagingServiceCategories = ['RAD'];
var accessionServiceCategories = ['LAB', 'OTH', 'SP', 'CP', 'AP'];

function getResourceConfig() {
    return [{
        name: 'diagnosticreport',
        path: '',
        get: getDiagnosticReports,
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: []
    }];
}

function getDiagnosticReports(req, res, next) {
    var domain = req.param('domain');
    var service = req.param('service');
    var limit = req.param('limit');
    var serviceCategories = [];
    req._pid = req.param('subject') || req.param('subject.identifier') || req.param('pid');
    if (nullchecker.isNullish(service)) {
        if (nullchecker.isNotNullish(domain)) {
            serviceCategories.push(domain.toUpperCase());
        } else {
            serviceCategories = serviceCategories.concat(laboratoryServiceCategories);
            serviceCategories = serviceCategories.concat(imagingServiceCategories);
            serviceCategories = serviceCategories.concat(accessionServiceCategories);
        }
    } else {
        serviceCategories = serviceCategories.concat(service.toUpperCase().split(','));
    }
    var asyncTasks = [];
    asyncTasks.push(function(callback) {
        callback(null, []);
    });
    // laboratory
    if (nullchecker.isNullish(serviceCategories) || (nullchecker.isNotNullish(serviceCategories) && _.intersection(laboratoryServiceCategories, serviceCategories).length > 0)) {
        var labCategoryCodes = [];
        var intersectionLaboratory = [];
        if (nullchecker.isNotNullish(serviceCategories)) {
            intersectionLaboratory = _.intersection(laboratoryServiceCategories, serviceCategories);
        }
        if (!_.contains(intersectionLaboratory, 'LAB')) {
            for (var labCC in labResults.categoryMap) {
                if (_.contains(intersectionLaboratory, labResults.categoryMap[labCC].code)) {
                    labCategoryCodes.push(labCategoryPrefix + labCC);
                }
            }
        }
        asyncTasks.push(function(previousResults, callback) {
            var limitRemainder = limit;
            if (nullchecker.isNotNullish(limit) && previousResults && previousResults.length) {
                limitRemainder -= previousResults.length;
            }
            if (limitRemainder === 0) {
                callback(null, previousResults);
                return;
            }
            getVprData(req, domains.lab, labCategoryCodes, limitRemainder, function(err, inputJSON) {
                var error = null;
                var result = null;

                if (err instanceof errors.NotFoundError) {
                    error = {
                        code: rdk.httpstatus.not_found,
                        message: err.error
                    };
                } else if (err instanceof errors.FetchError) {
                    req.logger.error(err.message);
                    error = {
                        code: rdk.httpstatus.internal_server_error,
                        message: 'There was an error processing your request. The error has been logged.'
                    };
                } else if (err) {
                    error = {
                        code: rdk.httpstatus.internal_server_error,
                        message: err.message
                    };
                } else {
                    result = labResults.convertToFhir(inputJSON, req);
                }

                result = previousResults.concat(result);
                callback(error, result); //call final callback

            }, next);
        });
    }
    // accession
    if (nullchecker.isNullish(serviceCategories) || (nullchecker.isNotNullish(serviceCategories) && _.intersection(accessionServiceCategories, serviceCategories).length > 0)) {
        var apCategoryCodes = [];
        var intersectionAccession = [];
        if (nullchecker.isNotNullish(serviceCategories)) {
            intersectionAccession = _.intersection(accessionServiceCategories, serviceCategories);
        }
        if (_.intersection(intersectionAccession, ['LAB', 'AP']).length === 0) {
            for (var apCC in labResults.categoryMap) {
                if (_.contains(intersectionAccession, labResults.categoryMap[apCC].code)) {
                    apCategoryCodes.push(labCategoryPrefix + apCC);
                }
            }
        }
        asyncTasks.push(function(previousResults, callback) {
            var limitRemainder = limit;
            if (nullchecker.isNotNullish(limit) && previousResults && previousResults.length) {
                limitRemainder -= previousResults.length;
            }
            if (limitRemainder === 0) {
                callback(null, previousResults);
                return;
            }
            getVprData(req, domains.ap, apCategoryCodes, limitRemainder, function(err, inputJSON) {
                var error = null;
                var result = null;

                if (err instanceof errors.NotFoundError) {
                    error = {
                        code: rdk.httpstatus.not_found,
                        message: err.error
                    };
                } else if (err instanceof errors.FetchError) {
                    req.logger.error(err.message);
                    error = {
                        code: rdk.httpstatus.internal_server_error,
                        message: 'There was an error processing your request. The error has been logged.'
                    };
                } else if (err) {
                    error = {
                        code: rdk.httpstatus.internal_server_error,
                        message: err.message
                    };
                } else {
                    result = labResults.convertToFhir(inputJSON, req);
                }

                result = previousResults.concat(result);
                callback(error, result); //call final callback

            }, next);
        });
    }
    // imaging
    if (nullchecker.isNullish(serviceCategories) || (nullchecker.isNotNullish(serviceCategories) && _.intersection(imagingServiceCategories, serviceCategories).length > 0)) {
        var radCategoryCodes = [];
        asyncTasks.push(function(previousResults, callback) {
            var limitRemainder = limit;
            if (nullchecker.isNotNullish(limit) && previousResults && previousResults.length) {
                limitRemainder -= previousResults.length;
            }
            if (limitRemainder === 0) {
                callback(null, previousResults);
                return;
            }
            getVprData(req, domains.rad, radCategoryCodes, limitRemainder, function(err, inputJSON) {
                var error = null;
                var result = null;

                if (err instanceof errors.NotFoundError) {
                    error = {
                        code: rdk.httpstatus.not_found,
                        message: err.error
                    };
                } else if (err instanceof errors.FetchError) {
                    req.logger.error(err.message);
                    error = {
                        code: rdk.httpstatus.internal_server_error,
                        message: 'There was an error processing your request. The error has been logged.'
                    };
                } else if (err) {
                    error = {
                        code: rdk.httpstatus.internal_server_error,
                        message: err.message
                    };
                } else {
                    result = radReports.convertToFhir(inputJSON, req);
                }

                result = previousResults.concat(result);
                callback(error, result); //call final callback

            }, next);
        });
    }

    async.waterfall(asyncTasks, function(err, results) { //final callback
        if (nullchecker.isNotNullish(err)) {
            res.send(err.code, err.message);
        } else {
            var bundle = buildBundle(results, req);
            res.send(200, bundle);
        }
    });
}

function buildBundle(results, req) {
    var b = new fhirResource.Bundle();
    var pid = null;
    b.updated = fhirUtils.convertDate2FhirDateTime(new Date());
    b.author.push(new fhirResource.Author());
    if (req) {
        b.link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self'));
        pid = req.param('subject.identifier');
        if (pid !== undefined) {
            b.title = 'DiagnosticReport with subject.identifier \'' + pid + '\'';
        }
    }
    // for (var i in results) {
        if (nullchecker.isNotNullish(results)) {
            b.totalResults += results.length;
            for (var res in results) {
                if (nullchecker.isNotNullish(results[res])) {
                    var e = new fhirResource.Entry(results[res]);
                    e.title = 'diagnosticreport for patient [' + pid + ']';
                    e.id = 'diagnosticreport/' + pid + '/' + (e.content._id || e.content.id || 'null');
                    e.link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + '/fhir/diagnosticreport/' + (e.content._id || e.content.id || '@null'), 'self'));
                    e.updated = fhirUtils.convertDate2FhirDateTime(new Date());
                    e.published = fhirUtils.convertDate2FhirDateTime(new Date());
                    e.author.push(new fhirResource.Author());

                    b.entry.push(e);
                }
            }
        }
    // }

    return b;
}

function getVprData(req, domain, categoryCodes, limit, callback, next) {

    var pid = req.param('subject.identifier');
    var start = req.param('start') || 0;
    // var limit = req.param('limit');
    var config = req.app.config;

    if (nullchecker.isNullish(pid)) {
        return next();
    }
    var jdsResource;
    var jdsQuery = {
        start: start
    };
    if (nullchecker.isNotNullish(limit)) {
        jdsQuery.limit = limit;
    }
    if (nullchecker.isNotNullish(categoryCodes) && categoryCodes.length > 0) {
        var filterCategory = '';
        _.each(categoryCodes, function(code) {
            filterCategory += (filterCategory !== '' ? ',' : '') + '"' + code + '"';
        });
        jdsQuery.filter = 'in(categoryCode,[' + filterCategory + '])';
    }

    jdsResource = '/vpr/' + pid + '/index/' + domain;
    var jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

// function isNotFound(obj) {
//     return ('code' in obj.error && String(obj.error.code) === String(rdk.httpstatus.not_found));
// }

// function FetchError(message, error) {
//     this.name = 'FetchError';
//     this.error = error;
//     this.message = message;
// }

// function NotFoundError(message, error) {
//     this.name = 'NotFoundError';
//     this.error = error;
//     this.message = message;
// }

module.exports.getResourceConfig = getResourceConfig;
