'use strict';
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var async = require('async');
var vitals = require('./vitals/vitalsResource.js');
var errors = require('../common/errors.js');

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
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

var apiDocs = {
    spec: {
        path: '/fhir/observation',
        nickname: 'fhir-observation',
        summary: 'Converts a vpr \'vitals\' resource into a FHIR \'observation\' resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            // rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return [{
        name: 'observation',
        path: '',
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        get: getObservation,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: []
    }];
};

function getObservation(req, res, next) {

    var pid = req.query['subject.identifier'];
    var limit = req.param('limit');
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    async.waterfall([

            function(callback) {
                vitals.getVitalsData(req, pid, limit, function(err, inputJSON) {
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
                        // res.send(rdk.httpstatus.internal_server_error, err.message);
                        err.code = rdk.httpstatus.internal_server_error;
                        err.msg = err.error;
                        return callback(err, null);
                    } else {
                        return callback(null, vitals.convertToFhir(inputJSON, req, limit));
                    }
                });
            }
        ],
        function(err, results) {
            if (!err) {
                res.send(200, results);
            } else {
                res.send(err.code, err.msg);
            }
        }
    );

}

module.exports.getResourceConfig = getResourceConfig;
module.exports.getObservation = getObservation;
