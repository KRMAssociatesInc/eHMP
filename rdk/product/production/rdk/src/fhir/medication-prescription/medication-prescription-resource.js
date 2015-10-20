/*jsling node: true*/
'use strict';

var rdk = require('../../core/rdk');
var medicationPrescription = require('./medication-prescription');
var domains = require('../common/domain-map.js');
var errors = require('../common/errors');
var _ = rdk.utils.underscore;
var nullchecker = rdk.utils.nullchecker;

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        }
    }
};

var apiDocs = {
    spec: {
        path: '/fhir/medicationprescription',
        nickname: 'fhir-medicationprescription',
        summary: '',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si
        ]
    }
};

function getResourceConfig() {
    return [{
        name: 'medicationprescription',
        path: '',
        get: getmedicationPrescription,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
    }];
}

function getmedicationPrescription(req, res, next) {
    getData(req, next, function(err, data) {
        if (err) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {
            res.status(rdk.httpstatus.ok).send(
                medicationPrescription.buildBundle(
                    medicationPrescription.convertToFhir(data.items, req), req, data.totalItems));
        }
    });
}

function getData(req, next, callback) {
    var pid = req._pid = req.param('subject.identifier');

    if (nullchecker.isNullish(pid)) {
        return next();
    }

    req.audit.dataDomain = 'Medication Prescription';
    req.audit.logCategory = 'MEDICATION_PRESCRIPTION';

    var jdsResource = '/vpr/' + pid + '/index/' + domains.jds('med') + '?filter=eq(vaType,O)';
    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsResource,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };
    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var json = JSON.parse(result);
            if ('data' in json) {
                callback(null, json.data);
            } else if (('error' in json) && errors.isNotFound(json)) {
                callback(new errors.NotFoundError('Object not found'));
            } else {
                callback(new Error('There was an error processing your request. The error has been logged.'));
            }
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
