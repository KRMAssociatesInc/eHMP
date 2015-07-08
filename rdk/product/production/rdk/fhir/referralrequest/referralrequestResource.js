/*jslint node: true */
'use strict';
var ra = require('../common/entities/referralrequestObjects.js'),
    errors = require('../common/errors'),
    //   helpers = require('../common/utils/helpers.js'),
    domains = require('../common/domainmap.js'),
    fhirResource = require('../common/entities/fhirResource'),
    fhirUtils = require('../common/utils/fhirUtils'),
    constants = require('../common/utils/constants'),
    querystring = require('querystring'),
    rdk = require('../../rdk/rdk'),
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
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'authorization']
        },
        permissions: []
    }];
}

function getReferralRequest(req, res) {
    getData(req, function(err, data) {
        if (err) {
            req.logger.error(err.message);
            res.send(rdk.httpstatus.internal_server_error, err.message);
        } else {
            res.send(rdk.httpstatus.ok,
                buildBundle(convertToFhir(data, req), req) // convertToFhir(data, req)
            );
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
            timeoutMillis: 120000,
            logger: req.logger,
            options: options
        };
    if (nullchecker.isNullish(pid)) {
        return next();
    }

    rdk.utils.http.fetch(httpConfig, function(error, result) {

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

function convertToFhir(inputJSON) {
    var outJSON = [],
        items = inputJSON.data.items;
    for (var i = 0, l = items.length; i < l; i++) {
        outJSON.push(ra.referralrequestFactory('ReferralRequestItem', items[i]));
    }
    return outJSON;
}

function buildBundle(results, req) {
    var b = new fhirResource.Bundle();
    b.updated = fhirUtils.convertDate2FhirDateTime(new Date());
    b.author.push(new fhirResource.Author());
    if (req) {
        b.link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self'));
        if (req._pid !== undefined) {
            b.title = 'Condition with subject.identifier \'' + req._pid + '\'';
        }
    }
    b.totalResults += results.length;
    for (var i in results) {
        if (nullchecker.isNotNullish(results[i])) {
            var e = new fhirResource.Entry(results[i]);
            e.title = 'referralrequest for patient [' + req._pid + ']';
            e.id = constants.conditionsFhir.CONDITION_PREFIX + (e.content._id || e.content.id || 'null');
            e.link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + '/fhir/referralrequest/' + (e.content._id || e.content.id || '@null'), 'self'));
            e.updated = fhirUtils.convertDate2FhirDateTime(new Date());
            e.published = fhirUtils.convertDate2FhirDateTime(new Date());
            e.author.push(new fhirResource.Author());

            b.entry.push(e);
        }
    }

    return b;
}
module.exports.convertToFhir = convertToFhir;
module.exports.getResourceConfig = getResourceConfig;
