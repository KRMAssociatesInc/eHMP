'use strict';
var referralRequest = require('./referral-request.js'),
    errors = require('../common/errors'),
    domains = require('../common/domain-map.js'),
    querystring = require('querystring'),
    rdk = require('../../core/rdk'),
    _ = rdk.utils.underscore,
    nullchecker = rdk.utils.nullchecker,
    parameters = {
        get: {
            'subject.identifier': {
                required: true,
                description: 'patient id'
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
            }
        }
    };

var apiDocs = {
    spec: {
        path: '/fhir/referralrequest',
        nickname: 'fhir-referralrequest',
        summary: 'Converts a vpr \'consult\' resource into a FHIR \'referralrequest\' resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

function getResourceConfig() {
    return [{
        name: 'getReferralRequest',
        path: '',
        get: getReferralRequest,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
    }];
}

function getReferralRequest(req, res) {
    getData(req, function(err, inputJSON) {
        if (err) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {
            res.status(rdk.httpstatus.ok).send(referralRequest.convertToFhir(inputJSON, req));
        }
    });
}



function getData(req, callback, next) {
    req._pid = req.param('subject.identifier');
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    var pid = req._pid,
        config = req.app.config,
        jdsResource = '/vpr/' + pid + '/index/' + domains.jds('consult'),
        options = _.extend({}, config.jdsServer, {
            path: jdsResource + '?' + querystring.stringify(jdsQuery),
            method: 'GET'
        }),
        httpConfig = {
            protocol: 'http',
            logger: req.logger,
            options: options
        };
    if (nullchecker.isNullish(pid)) {
        return next();
    }

    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {

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

module.exports.getResourceConfig = getResourceConfig;
