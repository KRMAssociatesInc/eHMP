'use strict';
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var errors = require('../common/errors.js');
var helpers = require('../common/utils/helpers.js');
var fhirUtils = require('../common/utils/fhir-converter');
var fhirResource = require('../common/entities/fhir-resource');


var conceptCategory = 'ED';

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
        //path: '/fhir/educations',
        //nickname: 'fhir-patient-educations',
        summary: 'Converts a vpr educations resource into a FHIR educations resource',
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
        name: 'educations',
        path: '',
        get: getEducations,
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
    }];
};

function getEducations(req, res, next) {

    var pid = req.query['subject.identifier'];
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    req._pid = pid;
    getData(req, pid, function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {

            var outJSON = {};
            outJSON = convertToFhir(inputJSON.data.items, req);

            res.status(200).send(buildBundle(outJSON, req, inputJSON.data.totalItems));
        }
    });

}

function getData(req, pid, callback) {

    var config = req.app.config;
    var jdsPath = '/vpr/' + pid + '/find/education/';
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
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

function buildBundle(results, req, total) {
    var link;
    var entry = [];

    if (req) {
        link = [new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self')];
    }
    for (var i = 0; i < results.length; i++) {
        entry.push(new fhirResource.Entry(results[i]));
    }
    return (new fhirResource.Bundle2(link, entry, total));
}

//function convertToFhir(result, req) {
//    var link = 'http://' + req._remoteAddress + req.url;
//
//    var fhirResult = {};
//    fhirResult.resourceType = 'Bundle';
//    fhirResult.type = 'collection';
//    fhirResult.id = helpers.generateUUID(); //'urn:uuid:' + helpers.generateUUID(); --> this old pattern violates DSTU2 "id" type
//    fhirResult.link = [{
//        'rel': 'self',
//        'href': link
//    }];
//
//    fhirResult.entry = [];
//
//    var items = result.data.items;
//    for (var i = 0; i < items.length; i++) {
//        createItem(items[i], fhirResult.entry, req._remoteAddress, fhirResult.updated);
//    }
//
//    fhirResult.total = fhirResult.entry.length;
//    return fhirResult;
function convertToFhir(items, req) {
    var fhirItems = [];
    for (var i = 0; i < items.length; i++) {
        fhirItems.push(createItem(items[i], req._pid));
    }
    return fhirItems;
}

/**
 *
 * @param jdsItem
 * @param fhirItems
 * @param host
 * @param updated
 */
function createItem(jdsItem, pid) {
    var fhirItem = {};

    fhirItem.resource = {};
    fhirItem.resource.resourceType = 'Procedure';

    fhirItem.resource.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };

    var orgUid = helpers.generateUUID();
    fhirItem.resource.contained = [{
        'resourceType': 'Organization',
        '_id': orgUid,
        'identifier': [{
            //'label': 'facility-code',
            'system': 'urn:oid:2.16.840.1.113883.6.233',
            'value': jdsItem.facilityCode
        }],
        'name': jdsItem.facilityName
    }];

    //---------------------------------------------------------------------
    //    "identifier"
    fhirItem.resource.identifier = [{
        'use': 'official',
        //'label': 'uid',
        'system': 'http://vistacore.us/fhir/id/uid',
        'value': jdsItem.uid
    }];

    //---------------------------------------------------------------------
    //    "patient"
    //    var splitUid = jdsItem.uid.split(':');
    //    if (splitUid.length > 5) {
    //        fhirItem.resource.patient = {
    //            'reference': 'Patient/' + splitUid[4]
    //        };
    //    }
    fhirItem.resource.patient = {
        'reference': 'Patient/' + pid
    };

    //---------------------------------------------------------------------
    //    "status"
    fhirItem.resource.status = 'completed';

    //---------------------------------------------------------------------
    //    "category"

    //---------------------------------------------------------------------
    //    "type"
    fhirItem.resource.type = {};
    fhirItem.resource.type.coding = [{
        'system': 'http://ehmp.domain/terminology/1.0',
        'code': '/concept/' + conceptCategory + '.' + encodeURI(jdsItem.name),
        'display': jdsItem.name
    }];

    //---------------------------------------------------------------------
    //    "bodySite" : [{ // Precise location details
    //      // site[x]: Precise location details. One of these 2:
    //      "siteCodeableConcept" : { CodeableConcept }
    //      "siteReference" : { Reference(BodySite) }
    //    }],

    //---------------------------------------------------------------------
    //    "indication" : [{ CodeableConcept }], // Reason procedure performed

    //---------------------------------------------------------------------
    //      "performer" : [{ // The people who performed the procedure
    //        "person" : { Reference(Practitioner|Patient|RelatedPerson) }, //
    //          The reference to the practitioner
    //        "role" : { CodeableConcept } // The role the person was in
    //      }],

    //---------------------------------------------------------------------
    // performed[x]: Date/Period the procedure was performed. One of these 2:
    if (jdsItem.entered !== undefined) {
        fhirItem.resource.performedDateTime = fhirUtils.convertToFhirDateTime(jdsItem.entered);
    }

    //---------------------------------------------------------------------
    //      "encounter" : { Reference(Encounter) }, // The encounter when procedure performed
    fhirItem.resource.encounter = {
        'reference': jdsItem.encounterUid,
        'display': jdsItem.encounterName
    };

    //---------------------------------------------------------------------
    //      "location" : { Reference(Location) }, // Where the procedure happened
    fhirItem.resource.location = {
        'reference': jdsItem.locationUid,
        'display': jdsItem.locationName
    };

    //---------------------------------------------------------------------
    //      "outcome" : { CodeableConcept }, // What was result of procedure?
    fhirItem.resource.outcome = {
        'text': jdsItem.result
    };

    //---------------------------------------------------------------------
    //      "report" : [{ Reference(DiagnosticReport) }], // Any report that results from the procedure
    //---------------------------------------------------------------------
    //      "complication" : [{ CodeableConcept }], // Complication following the procedure
    //---------------------------------------------------------------------
    //      "followUp" : [{ CodeableConcept }], // Instructions for follow up

    //---------------------------------------------------------------------
    //      "relatedItem" : [{ // A procedure that is related to this one
    //        "type" : "<code>", // caused-by | because-of
    //        "target" : { Reference(AllergyIntolerance|CarePlan|Condition|
    //        DiagnosticReport|FamilyMemberHistory|ImagingStudy|Immunization|
    //        ImmunizationRecommendation|MedicationAdministration|MedicationDispense|
    //        MedicationPrescription|MedicationStatement|Observation|Procedure) }  // The related item - e.g. a procedure
    //      }],

    //---------------------------------------------------------------------
    //      "notes" : "<string>", // Additional information about procedure

    //---------------------------------------------------------------------
    //      "device" : [{ // Device changed in procedure
    //        "action" : { CodeableConcept }, // Kind of change to device
    //        "manipulated" : { Reference(Device) } // R!  Device that was changed
    //      }],

    //---------------------------------------------------------------------
    //      "used" : [{ Reference(Device|Medication|Substance) }] // Items used during procedure



    //    fhirItems.push(fhirItem);
    return fhirItem.resource;
}


module.exports.buildBundle = buildBundle;
module.exports.convertToFhir = convertToFhir;
module.exports.createItem = createItem;
module.exports.getResourceConfig = getResourceConfig;
module.exports.getEducations = getEducations;
