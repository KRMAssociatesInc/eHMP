/*jslint node: true */
'use strict';
var ra = require('../common/entities/outpatientmedsObjects.js'),
    errors = require('../common/errors'),
    //   helpers = require('../common/utils/helpers.js'),
    domains = require('../common/domainmap.js'),
    fhirResource = require('../common/entities/fhirResource'),
    fhirUtils = require('../common/utils/fhirUtils'),
    constants = require('../common/utils/constants'),
    rdk = require('../../rdk/rdk'),
    querystring = require('querystring'),
    _ = rdk.utils.underscore,
    nullchecker = rdk.utils.nullchecker,
    parameters = {
        get: {
            'subject.identifier': {
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
            }
        }
    };

var apiDocs = {
    spec: {
        path: '/fhir/medicationdispense',
        nickname: 'fhir-medicationdispense',
        summary: 'Converts the vpr \'outpatient\' medication resource into the FHIR \'medicationdispense\' resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.commonParams.uid(false),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

function getResourceConfig() {
    return [{
        name: 'getMedicationDispense',
        path: '',
        get: getMedicationDispense,
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



function getMedicationDispense(req, res) {
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
    req.audit.dataDomain = 'Medication Dispense';
    req.audit.logCategory = 'MEDICATION_DISPENSE';

    var pid = req.param('subject.identifier'),
        uid = req.param('uid'),
        start = req.param('start') || 0,
        limit = req.param('limit'),
        config = req.app.config,
        jdsResource,
        jdsPath,
        jdsQuery = {
            start: start,
            filter: 'eq(vaType,O)'
        };
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    if (limit) {
        jdsQuery.limit = limit;
    }
    if (uid) {
        jdsQuery.filter = 'like("uid","' + uid + '")';
    }

    jdsResource = '/vpr/' + pid + '/index/' + domains.jds('med');
    jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);
    var options = _.extend({}, config.jdsServer, {
            path: jdsPath,
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
        outJSON.push(ra.outpatientmedsFactory('MedicationDispenseItem', items[i]));
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
            b.title = 'MedicationDispense with subject.identifier \'' + req._pid + '\'';
        }
    }
    b.totalResults += results.length;
    for (var i in results) {
        if (nullchecker.isNotNullish(results[i])) {
            var e = new fhirResource.Entry(results[i]);
            e.title = 'MedicationDispense for patient [' + req._pid + ']';
            e.id = constants.conditionsFhir.CONDITION_PREFIX + (e.content._id || e.content.id || 'null');
            e.link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + '/fhir/medicationdispense/' + (e.content._id || e.content.id || '@null'), 'self'));
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
