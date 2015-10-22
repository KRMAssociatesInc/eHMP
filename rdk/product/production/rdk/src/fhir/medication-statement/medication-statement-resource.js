'use strict';

var rdk = require('../../core/rdk');
var ms = require('./medication-statement-objects');
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
        path: '/fhir/medicationstatement',
        nickname: 'fhir-medicationstatement',
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
        name: 'getMedicationStatement',
        path: '',
        get: getMedicationStatement,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
    }];
}

function getMedicationStatement(req, res, next) {
    getData(req, next, function(err, data) {
        if (err) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {
            res.send(rdk.httpstatus.ok,
                ms.buildBundle(ms.convertToFhir(data.items, req), req, data.totalItems));
        }
    });
}

function getData(req, next, callback) {

    // SET and CHECK Patient Id
    var pid = req.param('subject.identifier');
    if (nullchecker.isNullish(pid)) {
        return next();
    }

    req.audit.dataDomain = 'Medication Statement';
    req.audit.logCategory = 'MEDICATION_STATEMENT';

    var jdsResource = '/vpr/' + pid + '/index/' + domains.jds('med') + '?filter=eq(vaType,N)';

    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsResource,
        method: 'GET'
    });

    // FETCH DATA from source
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };
    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj.data);
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
