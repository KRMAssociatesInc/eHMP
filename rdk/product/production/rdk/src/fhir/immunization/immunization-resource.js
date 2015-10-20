'use strict';
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var helpers = require('../common/utils/helpers.js');
var fhirResource = require('../common/entities/fhir-resource');
var fhirUtils = require('../common/utils/fhir-converter');
var constants = require('../common/utils/constants');
var errors = require('../common/errors.js');
var querystring = require('querystring');

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        parameters: parameters,
        get: getImmunization,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
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
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {

            var outJSON = {};
            outJSON = convertToFhir(inputJSON, req);

            res.status(200).send(outJSON);
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

function getFhirItems(result, req) {

    var fhirResult = {};
    fhirResult = convertToFhir(result, req);

    var fhirItems = [];
    fhirItems = fhirResult.entry;

    return fhirItems;
}

function convertToFhir(result, req) {
    var pid = req.query['subject.identifier'];
    var link = req.protocol + '://' + req.headers.host + req.originalUrl;
    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.id = 'urn:uuid:' + helpers.generateUUID();
    fhirResult.link = [{
        'rel': 'self',
        'href': link
    }];

    var now = new Date();
    fhirResult.meta = {
        'lastUpdated': now.getFullYear() + '-' + ('0' + fhirUtils.generateMonth(now)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2) + '.000-00:00'
    };

    fhirResult.entry = [];
    var items = result.data.items;
    for (var i = 0; i < items.length; i++) {
        createImmunization(items[i], fhirResult.entry, req, fhirResult.updated);
    }
    fhirResult.total = result.data.totalItems;
    return fhirResult;
}



function createVaccineType(jdsItem, fhirItem) {
    if ((jdsItem.codes === undefined) && (jdsItem.cptCode === undefined)) {
        // IF NO JDS codes OR cptCodes are given, JDS item is invalid since
        // Fhir DSTU2 requires at least one vaccine code entry.
        // What should be done in this condition?
        console.log("\n**** ERROR: INVALID JDS DATA. NO VACCINE CODES GIVEN. ****\n");

    } else {
        var coding;

        // Prep all JDS.codes
        var coding = _.each(jdsItem.codes, function(c) {
            new fhirResource.Coding(c.code, c.display, c.system);
        });

        // Prep any CPT codes
        if ((jdsItem.cptCode !== undefined) && (nullchecker.isNotNullish(jdsItem.cptCode))) {

            if (coding === undefined) {
                var coding = new fhirResource.Coding(jdsItem.cptCode, jdsItem.cptName);
            } else {
                coding.push(new fhirResource.Coding(jdsItem.cptCode, jdsItem.cptName));
            }
        }
        // Add all codes to fhir resource
        fhirItem.resource.vaccineType = new fhirResource.CodeableConcept(null, coding);

    }
}


function createExtension(key, valueX, x) {
    if (nullchecker.isNotNullish(valueX)) {
        return (new fhirResource.Extension(constants.immunization.IMMUNIZATION_EXTENSION_URL_PREFIX + key, valueX, x));
    } else {
        return null;
    }
}

function setExtensions(jdsItem, fhirItem) {
    var ext = [];

    if (jdsItem.contraindicated !== undefined) {
        ext.push(createExtension('contraindicated', jdsItem.contraindicated, 'Boolean'));
    }
    if (jdsItem.seriesCode !== undefined) {
        ext.push(createExtension('seriesCode', jdsItem.seriesCode, 'String'));
    }
    if (jdsItem.seriesName !== undefined) {
        ext.push(createExtension('seriesName', jdsItem.seriesName, 'String'));
    }
    if (jdsItem.stampTime !== undefined) {
        ext.push(createExtension('stampTime', jdsItem.stampTime, 'String'));
    }
    if (jdsItem.comment !== undefined) {
        ext.push(createExtension('stampTime', jdsItem.comment, 'String'));
    }


    fhirItem.resource.extension = _.compact(ext); // remove all null entries from ext
}

/**
 * createImmunization
 *
 * @param jdsItem
 * @param fhirItems
 * @param req
 * @param updated
 */
function createImmunization(jdsItem, fhirItems, req, updated) {
    var fhirItem = {};

    //================================
    // SET RESOURCE TYPE
    //================================
    fhirItem.resource = {};

    fhirItem.resource.resourceType = 'Immunization';
    fhirItem.resource.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };

    //================================
    // SET IDENTIFIER
    //================================
    if (nullchecker.isNotNullish(jdsItem.uid)) {
        fhirItem.resource.identifier = [new fhirResource.Identifier(jdsItem.uid, "urn:oid:2.16.840.1.113883.6.233")];
    }

    //================================
    // PREP ORGNAIZATION contained node
    // ......but don't know which reference attribute to declare for it.
    //================================
    var containedOrg = new fhirResource.Organization(helpers.generateUUID());

    if (nullchecker.isNotNullish(jdsItem.facilityCode)) {
        containedOrg.identifier = [new fhirResource.Identifier(jdsItem.facilityCode, "urn:oid:2.16.840.1.113883.6.233")];
    }
    containedOrg.name = jdsItem.facilityName;
    containedOrg.text = {
        'div': '<div>' + jdsItem.facilityName + '</div>',
        'status': 'generated'
    }


    //================================
    // SET DATE
    //================================
    fhirItem.resource.date = fhirUtils.convertToFhirDateTime(jdsItem.administeredDateTime);

    //================================
    // SET VACCINETYPE
    // Note: JDS.codes is an array of codes.
    //================================
    createVaccineType(jdsItem, fhirItem);

    //================================
    // SET PATIENT
    //================================
    if (nullchecker.isNotNullish(jdsItem.pid)) {
        fhirItem.resource.patient = new fhirResource.ReferenceResource(constants.immunization.PATIENT_PREFIX + jdsItem.pid);
    }

    //================================
    // SET WASNOTGIVEN - Was immunization NOT given?
    // Note:  If immunization was administered then wasNotGiven=false
    //================================
    fhirItem.resource.wasNotGiven = false;

    //================================
    // SET REPORTED
    //================================
    fhirItem.resource.reported = false;

    //================================
    // SET PERFORMER
    //================================
    if (jdsItem.performerUid !== undefined) {
        var performerRefId = helpers.generateUUID();
        fhirItem.resource.performer = new fhirResource.ReferenceResource('#' + performerRefId);

        // PREP PERFORMER contained node
        var containedPerformer = new fhirResource.Practitioner(performerRefId, jdsItem.performerUid);

        if (nullchecker.isNotNullish(jdsItem.performerUid)) {
            containedPerformer.identifier = [new fhirResource.Identifier(jdsItem.performerUid, "http://vistacore.us/fhir/id/uid")];
        }
        containedPerformer.name = jdsItem.performerName;
        containedPerformer.text = {
            'div': '<div>' + jdsItem.performerName + '</div>',
            'status': 'generated'
        }
    }

    //================================
    // SET REQUESTER
    //      NO USEABLE JDS DATA GIVEN
    //================================

    //================================
    // SET ENCOUNTER
    //================================
    if (jdsItem.encounterUid !== undefined) {

        var encounterRefId = helpers.generateUUID();
        fhirItem.resource.encounter = new fhirResource.ReferenceResource('#' + encounterRefId);

        // PREP ENCOUNTER contained node
        var containedEncounter = new fhirResource.Encounter(encounterRefId);
        containedEncounter.text = {
            'div': '<div>' + jdsItem.encounterName + '</div>',
            'status': 'generated'
        }
        containedEncounter.status = 'finished';
        containedEncounter.identifier = [new fhirResource.Identifier(jdsItem.encounterUid, "http://vistacore.us/fhir/id/uid")];
    }

    //================================
    // SET MANUFACTURER
    //      NO USEABLE JDS DATA GIVEN
    //================================

    //================================
    // SET LOCATION
    //================================
    if (jdsItem.locationUid !== undefined) {
        var locationRefId = helpers.generateUUID();
        fhirItem.resource.location = new fhirResource.ReferenceResource('#' + locationRefId);

        var identifier = [new fhirResource.Identifier(jdsItem.locationUid, "http://vistacore.us/fhir/id/uid")];

        // PREP LOCATION contained node
        var containedLocation = new fhirResource.Location(locationRefId, jdsItem.locationName, identifier);
    }

    //================================
    // SET LOTNUMBER
    //      NO USEABLE JDS DATA GIVEN
    //================================
    //================================
    // SET EXPIRATIONDATE
    //      NO USEABLE JDS DATA GIVEN
    //================================
    //================================
    // SET SITE
    //      NO USEABLE JDS DATA GIVEN
    //================================
    //================================
    // SET ROUTE
    //      NO USEABLE JDS DATA GIVEN
    //================================
    //================================
    // SET DOSEQUANTITY
    //      NO USEABLE JDS DATA GIVEN
    //================================

    //================================
    // SET EXPLANATION
    //      NO USEABLE JDS DATA GIVEN
    // Note: Mapping logic to use later when JDS data are given.
    // explanation.reason[]  --> SHOULD NOT BE PRESENT if wasNotGiven = true ELSE, MAY be present.
    // explanation.reasonNotGiven[] --> SHOULD NOT BE PRESENT if wasNotGiven = false ELSE, MAY be present.
    //================================

    //================================
    // SET REACTION
    // Note: SHOULD NOT BE PRESENT if wasNotGiven = true
    //================================
    if (!fhirItem.resource.wasNotGiven && (jdsItem.reactionName !== undefined)) {

        var reactionRefId = helpers.generateUUID();
        fhirItem.resource.reaction = {};
        fhirItem.resource.reaction.detail = new fhirResource.ReferenceResource('#' + reactionRefId);


        // PREP REACTION contained node
        var coding = new fhirResource.Coding(jdsItem.reactionCode, jdsItem.reactionName);
        var code = new fhirResource.CodeableConcept(null, coding);

        var containedReaction = new fhirResource.Observation(
            reactionRefId,
            code,
            'final',
            'unknown',
            jdsItem.reactionName,
            'String');
        containedReaction.text = {
            'div': '<div>' + jdsItem.reactionName + '</div>',
            'status': 'generated'
        }

    }

    //================================
    // SET VACCINATIONPROTOCOL
    //
    // Requires following data which are NOT given by JDS:
    //    doseSequence
    //    doseTarget
    //    doseStatus
    //================================

    //================================
    // SET CONTAINS RESOURCES
    //================================
    fhirItem.resource.contained = [];
    if (containedOrg !== undefined) {
        fhirItem.resource.contained.push(containedOrg);
    }
    if (containedPerformer !== undefined) {
        fhirItem.resource.contained.push(containedPerformer);
    }
    if (containedLocation !== undefined) {
        fhirItem.resource.contained.push(containedLocation);
    }
    if (containedReaction !== undefined) {
        fhirItem.resource.contained.push(containedReaction);
    }
    if (containedEncounter !== undefined) {
        fhirItem.resource.contained.push(containedEncounter);
    }

    //================================
    // SET EXTENSIONS
    //================================
    setExtensions(jdsItem, fhirItem);


    //================================
    // ADD COMPLETED fhirItem
    //================================
    fhirItems.push(fhirItem);
}
module.exports.getImmunizationData = getImmunizationData;
module.exports.convertToFhir = convertToFhir;
module.exports.getResourceConfig = getResourceConfig;
module.exports.getImmunization = getImmunization;
module.exports.getFhirItems = getFhirItems;
