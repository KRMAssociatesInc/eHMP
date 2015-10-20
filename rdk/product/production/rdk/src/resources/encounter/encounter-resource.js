'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var jdsFilter = require('jds-filter');
var querystring = require('querystring');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = rdk.utils.http;
var domains = require('../../fhir/common/domain-map.js');
var encounterFields = require('./encounter-data-obj');
var async = require('async');
var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        dateTime: {
            required: true,
            description: 'Location datetime'
        },
        locationUid: {
            required: true,
            description: 'Location UID'
        }
    }
};

var apiDocs = {
    spec: {
        summary: 'Get encounter info for specific location and datetime',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.swagger.paramTypes.query('dateTime', 'Datetime of location', 'string', true),
            rdk.docs.swagger.paramTypes.query('locationUid', 'Location uid', 'string', true)
        ],
        responseMessages: []
    }
};

function getResourceConfig() {
    return [{
        name: 'encounterInfo',
        path: '/info',
        get: getEncounterData,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        outerceptors: ['emulateJdsResponse'],
        permissions: [],
        permitResponseFormat: true
    }];
}

function getEncounterData(req, res, next) {
    var config = req.app.config;
    var pid = req.param('pid');
    var dateTime = req.param('dateTime');
    var locationUid = req.param('locationUid');
    if (nullchecker.isNullish(pid) || nullchecker.isNullish(dateTime) || nullchecker.isNullish(locationUid)) {
        req.logger.error("Missing required query params");
        res.rdkSend('There was an error retrieving encounter.');
        return;
    }
    var jdsQuery = {
        filter: 'like("dateTime","' + dateTime + '"),like("locationUid","' + locationUid + '")'
    }

    var jdsPath = '/vpr/' + pid + '/index/' + domains.jds('visit');
    jdsPath += '?' + querystring.stringify(jdsQuery);
    var fetchDataFromJds = function(jdsPath, callback) {
        var options = _.extend({}, config.jdsServer, {
            path: jdsPath,
            method: 'GET'
        });
        var httpConfig = {
            protocol: 'http',
            logger: req.logger,
            options: options
        };
        httpUtil.fetch(config, httpConfig, function(err, response) {
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
            }
            return callback(JSON.parse(response));
        });
    };
    var getProblems = function(diagnoses, callback) {
        var problems = [];
        async.forEach(diagnoses, function(item, callback) {
            jdsQuery = {
                filter: 'like("icdCode","' + item.icdCode + '")'
            }
            jdsPath = '/vpr/' + pid + '/index/' + domains.jds('problem');
            jdsPath += '?' + querystring.stringify(jdsQuery);
            fetchDataFromJds(jdsPath, function(response) {
                if ('data' in response && !_.isEmpty(response.data.items)) {
                    var item = response.data.items[0];
                    problems.push(_.defaults(_.pick(item, _.keys(encounterFields.problemDefaults)), encounterFields.problemDefaults));
                }
                callback(null);
            });
        }, function(err) {
            return callback(problems);
        });

    };
    var getDiagnoses = function(encounterUid, callback) {
        jdsQuery = {
            filter: 'like("encounterUid","' + encounterUid + '")'
        }
        jdsPath = '/vpr/' + pid + '/index/' + domains.jds('pov');
        jdsPath += '?' + querystring.stringify(jdsQuery);
        var diagnoses = [];
        var problems = [];
        fetchDataFromJds(jdsPath, function(response) {
            if ('data' in response && !_.isEmpty(response.data.items)) {
                _.each(response.data.items, function(item) {
                    diagnoses.push(_.defaults(_.pick(item, _.keys(encounterFields.diagnosisDefaults)), encounterFields.diagnosisDefaults));
                });
                return callback(diagnoses);
            } else {
                return callback(diagnoses);
            }
        });
    };
    var getProcedures = function(encounterUid, callback) {
        jdsQuery = {
            filter: 'like("encounterUid","' + encounterUid + '")'
        }
        jdsPath = '/vpr/' + pid + '/index/' + domains.jds('cpt');
        jdsPath += '?' + querystring.stringify(jdsQuery);
        var procedures = [];
        fetchDataFromJds(jdsPath, function(response) {
            if ('data' in response && !_.isEmpty(response.data.items)) {
                _.each(response.data.items, function(item) {
                    procedures.push(_.defaults(_.pick(item, _.keys(encounterFields.procedureDefaults)), encounterFields.procedureDefaults));
                });
                return callback(procedures);
            } else {
                return callback(procedures);
            }

        });
    };
    var parseEncounterData = function(response) {
        if ('data' in response && !_.isEmpty(response.data.items)) {
            var encounter = {};
            var result = response.data.items[0];
            encounter = _.defaults(_.pick(result, _.keys(encounterFields.encounterDefaults)), encounterFields.encounterDefaults);
            encounter[encounterFields.providers] = [];
            _.each(result.providers, function(provider) {
                encounter[encounterFields.providers].push(_.defaults(_.pick(provider, _.keys(encounterFields.providerDefaults)), encounterFields.providerDefaults));
            });
            getProcedures(result.uid, function(procedures) {
                encounter[encounterFields.procedures] = procedures || [];
            });
            async.series([
                function(callback) {
                    getDiagnoses(result.uid, function(diagnoses) {
                        encounter[encounterFields.diagnoses] = diagnoses || [];
                        callback();
                    });
                },
                function(callback) {
                    encounter[encounterFields.problems] = [];
                    if (!_.isEmpty(encounter[encounterFields.diagnoses])) {
                        getProblems(encounter[encounterFields.diagnoses], function(problems) {
                            encounter[encounterFields.problems] = problems || [];
                            callback();
                        });
                    } else {
                        callback();
                    }
                }
            ], function(err) {
                return res.rdkSend(encounter);
            });
        }
    };

    fetchDataFromJds(jdsPath, parseEncounterData);
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
module.exports.getResourceConfig = getResourceConfig;
