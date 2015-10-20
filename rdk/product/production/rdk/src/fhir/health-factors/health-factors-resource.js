'use strict';
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var errors = require('../common/errors.js');
var helpers = require('../common/utils/helpers.js');
var fhirUtils = require('../common/utils/fhir-converter');

var conceptCategory = 'HF';

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
        //path: '/fhir/healthFactors',
        //nickname: 'fhir-patient-healthfactors',
        summary: 'Converts a vpr healthfactors resource into a FHIR healthfactors resource',
        notes: '',
        //method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return [{
        name: 'healthFactors',
        path: '',
        get: getHealthFactors,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
    }];
};

function getHealthFactors(req, res, next) {

    var pid = req.query['subject.identifier'];
    if (nullchecker.isNullish(pid)) {
        return next();
    }

    getHFData(req, pid, function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {

            var outJSON = {};
            outJSON = convertToFhir(inputJSON, req, inputJSON.data.totalItems);

            res.status(200).send(outJSON);
        }
    });

}

function getHFData(req, pid, callback) {

    var config = req.app.config;
    var jdsPath = '/vpr/' + pid + '/find/factor/';
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(config, httpConfig, function(error, result) {
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

function getFhirItems(result,req) {

    var fhirResult = {};
    fhirResult = convertToFhir(result, req);

    var fhirItems = [];
    fhirItems = fhirResult.entry;

    return fhirItems;
}

function convertToFhir(result, req, total) {
    var link = 'http://' + req._remoteAddress + req.url;

    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.type = 'collection';
    fhirResult.id = helpers.generateUUID(); //'urn:uuid:' + helpers.generateUUID();
    fhirResult.link = [{
        'rel': 'self',
        'href': link
    }];

    fhirResult.entry = [];

    var items = result.data.items;
    for (var i = 0; i < items.length; i++) {
        createHF(items[i], fhirResult.entry);
    }

    fhirResult.total = total;
    return fhirResult;
}

/**
 *
 * @param jdsItem
 * @param fhirItems
 * @param host
 * @param updated
 */
function createHF(jdsItem, fhirItems) {
    var fhirItem = {};

    fhirItem.resource = {};
    fhirItem.resource.resourceType = 'Observation';
    fhirItem.resource.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };
    var orgUid = helpers.generateUUID();
    fhirItem.resource.contained = [{
        'resourceType': 'Organization',
        'id': orgUid,
        'identifier': [{
            //'label': 'facility-code',
            'system': 'urn:oid:2.16.840.1.113883.6.233',
            'value': jdsItem.facilityCode
        }],
        'name': jdsItem.facilityName
    }];

    fhirItem.resource.code = {};
    fhirItem.resource.code.coding = [{
        'system': 'http://ehmp.domain/terminology/1.0',
        'code': '/concept/' + conceptCategory + '.' + encodeURI(jdsItem.name),
        'display': jdsItem.name
    }];

    if (jdsItem.entered !== undefined) {
        fhirItem.resource.appliesDateTime = fhirUtils.convertToFhirDateTime(jdsItem.entered);
    }

    //    fhirItem.resource.issued  --> SOURCE?

    fhirItem.resource.status = 'final';
    fhirItem.resource.reliability = 'unknown';
    fhirItem.resource.identifier = [{
        'use': 'official',
        //'label': 'uid',
        'system': 'http://vistacore.us/fhir/id/uid',
        'value': jdsItem.uid
    }];

    //Extracting Patient dfn given uid of pattern = urn:va:<collection>:<site>:<dfn>:<ien>
    var splitUid = jdsItem.uid.split(':');
    if (splitUid.length > 5) {
        fhirItem.resource.subject = {
            'reference': 'Patient/' + splitUid[4]
        };
    }
    fhirItem.resource.performer = [{
        'reference': orgUid,
        'display': jdsItem.facilityName
    }];



    fhirItems.push(fhirItem);
}


module.exports.getResourceConfig = getResourceConfig;
module.exports.getHealthFactors = getHealthFactors;
module.exports.getFhirItems = getFhirItems;
