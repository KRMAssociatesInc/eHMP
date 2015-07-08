'use strict';
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var helpers = require('../common/utils/helpers.js');
var fhirUtils = require('../common/utils/fhirUtils');
var errors = require('../common/errors.js');
var querystring = require('querystring');

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        get: getImmunization,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: []
    }];
};

var parameters = {
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
        path: '/fhir/immunization',
        nickname: 'fhir-immunization',
        summary: 'Converts a vpr \'immunization\' resource into a FHIR \'immunization\' resource.',
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

function getImmunization(req, res, next) {

    var pid = req.query['subject.identifier'];
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    getImmunizationData(req, pid, function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.send(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.send(rdk.httpstatus.not_found, err.error);
        } else if (err) {
            res.send(rdk.httpstatus.internal_server_error, err.message);
        } else {

            var outJSON = {};
            //var items = inputJSON.data.items;

            outJSON = convertToFhir(inputJSON, req);

            res.send(200, outJSON);
        }
    });
}

function getImmunizationData(req, pid, callback) {
    var config = req.app.config;
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    var jdsPath = '/vpr/' + pid + '/find/immunization/' + '?' + querystring.stringify(jdsQuery);

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

function convertToFhir(result, req) {
    var pid = req.query['subject.identifier'];
    var link = req.protocol + '://' + req.headers.host + req.originalUrl;
    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.title = 'Observation with subject identifier \'' + pid + '\'';
    fhirResult.id = 'urn:uuid:' + helpers.generateUUID();
    fhirResult.link = [{
        'rel': 'self',
        'href': link
    }];

    var now = new Date();
    fhirResult.updated = fhirUtils.convertDate2FhirDateTime(now);
    fhirResult.author = [{
        'name': 'eHMP',
    }];
    fhirResult.entry = [];
    var items = result.data.items;
    for (var i = 0; i < items.length; i++) {
        createImmunization(items[i], fhirResult.entry, req, fhirResult.updated);
    }
    fhirResult.totalResults = fhirResult.entry.length;
    return fhirResult;
}

function createImmunization(jdsItem, fhirItems, req, updated) {
    var fhirItem = {};
    fhirItem.title = 'immunization for patient [' + jdsItem.pid + ']';
    fhirItem.id = 'immunization/' + jdsItem.pid + '/' + jdsItem.uid;
    fhirItem.link = [{
        'rel': 'self',
        'href': req.protocol + '://' + req.headers.host + '/fhir/immunization/@' + jdsItem.uid
    }];
    fhirItem.updated = updated;
    fhirItem.published = updated;
    fhirItem.author = [{
        'name': 'eHMP',
    }];
    fhirItem.content = {};
    fhirItem.content.resourceType = 'Immunization';
    fhirItem.content.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };

    fhirItem.content.subject = {
        'reference': 'Patient/' + jdsItem.pid
    };
    var orgUid = helpers.generateUUID();
    fhirItem.content.contained = [{
        'resourceType': 'Organization',
        '_id': orgUid,
        'identifier': [{
            'label': 'facility-code',
            'value': jdsItem.facilityCode
        }],
        'name': jdsItem.facilityName,
        'text': {
            'div': '<div>' + jdsItem.facilityName + '</div>',
            'status': 'generated'
        }
    }];
    fhirItem.content.date = fhirUtils.convertToFhirDateTime(jdsItem.administeredDateTime);

    fhirItem.content.extension = [];
    var ext = {};
    if (jdsItem.contraindicated !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/immunization#contraindicated',
            'valueBoolean': jdsItem.contraindicated
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.encounterUid !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/immunization#encounterUid',
            'valueString': jdsItem.encounterUid
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.encounterName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/immunization#encounterName',
            'valueString': jdsItem.encounterName
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.seriesName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/immunization#seriesName',
            'valueString': jdsItem.seriesName
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.comment !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/immunization#comment',
            'valueString': jdsItem.comment
        };
        fhirItem.content.extension.push(ext);
    }
    fhirItem.content.vaccineType = {};
    fhirItem.content.vaccineType.coding = [];
    if (jdsItem.cptCode !== undefined) {
        fhirItem.content.vaccineType.coding.push({
            'code': jdsItem.cptCode,
            'display': jdsItem.cptName
        });
    }
    if (jdsItem.codes !== undefined && jdsItem.codes.length > 0) {
        for (var i = 0; i < jdsItem.codes.length; i++) {
            fhirItem.content.vaccineType.coding.push({
                'code': jdsItem.codes[i].code,
                'display': jdsItem.codes[i].display,
                'system': jdsItem.codes[i].system
            });
        }
    }

    if (jdsItem.performerUid !== undefined) {
        orgUid = helpers.generateUUID();
        fhirItem.content.contained.push({
            'resourceType': 'Practitioner',
            '_id': orgUid,
            'identifier': [{
                'label': 'uid',
                'value': jdsItem.performerUid
            }],
            'name': jdsItem.performerName,
            'text': {
                'div': '<div>' + jdsItem.performerName + '</div>',
                'status': 'generated'
            }
        });
        fhirItem.content.performer = {
            'reference': orgUid,
            'display': jdsItem.performerName
        };
    }
    if (jdsItem.locationUid !== undefined) {
        orgUid = helpers.generateUUID();
        fhirItem.content.contained.push({
            'resourceType': 'Location',
            '_id': orgUid,
            'identifier': [{
                'label': 'uid',
                'value': jdsItem.locationUid
            }],
            'name': jdsItem.locationName,
            'text': {
                'div': '<div>' + jdsItem.locationName + '</div>',
                'status': 'generated'
            }
        });
        fhirItem.content.location = {
            'reference': orgUid,
            'display': jdsItem.locationName
        };
    }
    if (jdsItem.reactionName !== undefined) {
        fhirItem.content.reaction = {};
        fhirItem.content.reaction.detail = {};
        fhirItem.content.reaction.detail.symptom = {};
        fhirItem.content.reaction.detail.symptom.code = {};
        fhirItem.content.reaction.detail.symptom.code.text = jdsItem.reactionName;
        fhirItem.content.reaction.detail.subject = fhirItem.content.subject;
        fhirItem.content.reaction.detail.didNotOccurFlag = false;
    }
    fhirItem.content.reported = false;
    fhirItem.content.refusedIndicator = false;



    fhirItems.push(fhirItem);
}
module.exports.getImmunizationData = getImmunizationData;
module.exports.convertToFhir = convertToFhir;
module.exports.getResourceConfig = getResourceConfig;
module.exports.getImmunization = getImmunization;
