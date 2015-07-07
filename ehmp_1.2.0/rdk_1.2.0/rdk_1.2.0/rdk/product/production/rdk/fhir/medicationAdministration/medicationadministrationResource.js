'use strict';
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var helpers = require('../common/utils/helpers.js');
var fhirUtils = require('../common/utils/fhirUtils');
var errors = require('../common/errors.js');
var querystring = require('querystring');

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
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
        path: '/fhir/medicationadministration',
        nickname: 'fhir-medicationadministration',
        summary: 'Converts the vpr inpatient medication resource into a FHIR medicationAdministration resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        get: getFhirMedicationAdministration,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: []
    }];
};

function getFhirMedicationAdministration(req, res, next) {
    getMedicationAdministration(req, res, next);
}

function getMedicationAdministration(req, res, next, startFrom, previousResults) {
    startFrom = startFrom || 0;
    previousResults = previousResults || [];
    var limit = req.param('limit');

    var pid = req.query['subject.identifier'];
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    getMedicationAdministrationData(req, pid, function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.send(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.send(rdk.httpstatus.not_found, err.error);
        } else if (err) {
            res.send(rdk.httpstatus.internal_server_error, err.message);
        } else {

            var outJSON = {};
            outJSON = convertToFhir(inputJSON, req, previousResults, limit);

            if (!nullchecker.isNullish(limit) && limit > outJSON.entry.length && inputJSON.data.items && inputJSON.data.items.length > 0) {
                getMedicationAdministration(req, res, next, startFrom + inputJSON.data.items.length, outJSON.entry);
            } else {
                res.send(200, outJSON);
            }
        }
    }, next, startFrom, limit);
}

function convertToFhir(result, req, previousResults, limit) {
    previousResults = previousResults || [];
    var pid = req.query['subject.identifier'];
    var link = req.protocol + '://' + req.headers.host + req.originalUrl;
    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.title = 'MedicationAdministration with subject identifier \'' + pid + '\'';
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

    fhirResult.entry = previousResults;
    var items = result.data.items;
    var itemsTransformed = [];
    var iterator = 1;
    for (var i = 0; i < items.length; i++) {
        if (itemsTransformed.length === (parseInt(limit) - previousResults.length)) {
            break;
        }
        if (items[i].products !== undefined && items[i].products.length > 0) {
            if (items[i].products.length === 1) {
                itemsTransformed.push(items[i]);
            } else {
                iterator = 1;
                for (var j = 0; j < items[i].products.length; j++) {
                    if (itemsTransformed.length === (parseInt(limit) - previousResults.length)) {
                        break;
                    }
                    var itemTransformed = {};
                    itemTransformed.uid = items[i].uid + ':' + iterator;
                    iterator++;
                    itemTransformed.summary = items[i].summary;
                    itemTransformed.pid = items[i].pid;
                    itemTransformed.facilityCode = items[i].facilityCode;
                    itemTransformed.facilityName = items[i].facilityName;
                    itemTransformed.localId = items[i].localId;
                    itemTransformed.productFormName = items[i].productFormName;
                    itemTransformed.sig = items[i].sig;
                    itemTransformed.overallStart = items[i].overallStart;
                    itemTransformed.overallStop = items[i].overallStop;
                    itemTransformed.stopped = items[i].stopped;
                    itemTransformed.medStatus = items[i].medStatus;
                    itemTransformed.medStatusName = items[i].medStatusName;
                    itemTransformed.medType = items[i].medType;
                    itemTransformed.vaType = items[i].vaType;
                    itemTransformed.vaStatus = items[i].vaStatus;
                    itemTransformed.supply = items[i].supply;
                    itemTransformed.qualifiedName = items[i].qualifiedName;
                    itemTransformed.units = items[i].units;
                    itemTransformed.kind = items[i].kind;
                    itemTransformed.IMO = items[i].IMO;
                    itemTransformed.name = items[i].name;
                    itemTransformed.fills = [];
                    itemTransformed.administrations = [];
                    itemTransformed.products = [];
                    itemTransformed.dosages = [];
                    itemTransformed.orders = [];
                    itemTransformed.rxncodes = [];
                    itemTransformed.rxncodes = items[i].rxncodes;
                    itemTransformed.codes = [];
                    itemTransformed.codes = items[i].codes;
                    if (_.isArray(items[i].fills)) {
                        if (items[i].fills.length === 1) {
                            itemTransformed.fills.push(items[i].fills[0]);
                        } else if (items[i].fills.length > j) {
                            itemTransformed.fills.push(items[i].fills[j]);
                        }
                    }
                    if (_.isArray(items[i].administrations)) {
                        if (items[i].administrations.length === 1) {
                            itemTransformed.administrations.push(items[i].administrations[0]);
                        } else if (items[i].administrations.length > j) {
                            itemTransformed.administrations.push(items[i].administrations[j]);
                        }
                    }

                    if (_.isArray(items[i].products) && items[i].products.length > j) {
                        itemTransformed.products.push(items[i].products[j]);
                    }
                    if (_.isArray(items[i].dosages)) {
                        if (items[i].dosages.length === 1) {
                            itemTransformed.dosages.push(items[i].dosages[0]);
                        } else if (items[i].dosages.length > j) {
                            itemTransformed.dosages.push(items[i].dosages[j]);
                        }
                    }
                    if (_.isArray(items[i].orders)) {
                        if (items[i].orders.length === 1) {
                            itemTransformed.orders.push(items[i].orders[0]);
                        } else if (items[i].orders.length > j) {
                            itemTransformed.orders.push(items[i].orders[j]);
                        }
                    }
                    itemsTransformed.push(itemTransformed);

                }
            }
        }
    }
    fhirResult.totalResults = itemsTransformed.length;

    for (i = 0; i < itemsTransformed.length; i++) {
        createMedicationAdministration(itemsTransformed[i], fhirResult.entry, req, fhirResult.updated);
    }
    fhirResult.totalResults = fhirResult.entry.length;
    return fhirResult;
}

function createMedicationAdministration(jdsItem, fhirItems, req, updated) {
    var fhirItem = {};
    fhirItem.title = 'medicationadministration for patient [' + jdsItem.pid + ']';
    fhirItem.id = 'medicationadministration/' + jdsItem.pid + '/' + jdsItem.uid;
    fhirItem.link = [{
        'rel': 'self',
        'href': req.protocol + '://' + req.headers.host + '/fhir/medicationadministration/@' + jdsItem.uid
    }];
    fhirItem.updated = updated;
    fhirItem.published = updated;
    fhirItem.author = [{
        'name': 'eHMP',
    }];
    fhirItem.content = {};
    fhirItem.content.resourceType = 'MedicationAdministration';

    fhirItem.content.identifier = [];
    var id = {};
    id.system = 'urn:oid:2.16.840.1.113883.6.233';
    id.value = jdsItem.uid;
    fhirItem.content.identifier.push(id);

    if (jdsItem.vaStatus !== undefined) {
        switch (jdsItem.vaStatus) {
            case 'DISCONTINUED':
                {
                    fhirItem.content.status = 'stopped';
                }
                break;
            case 'COMPLETE':
                {
                    fhirItem.content.status = 'completed';
                }
                break;
            case 'HOLD':
                {
                    fhirItem.content.status = 'on hold';
                }
                break;
            case 'FLAGGED':
                {
                    fhirItem.content.status = 'on hold';
                }
                break;
            case 'PENDING':
                {
                    fhirItem.content.status = 'in progress';
                }
                break;
            case 'ACTIVE':
                {
                    fhirItem.content.status = 'in progress';
                }
                break;
            case 'EXPIRED':
                {
                    fhirItem.content.status = 'completed';
                }
                break;
            case 'DELAYED':
                {
                    fhirItem.content.status = 'on hold';
                }
                break;
            case 'UNRELEASED':
                {
                    fhirItem.content.status = 'in progress';
                }
                break;
            case 'DISCONTINUED/EDIT':
                {
                    fhirItem.content.status = 'stopped';
                }
                break;
            case 'CANCELLED':
                {
                    fhirItem.content.status = 'stopped';
                }
                break;
            case 'LAPSED':
                {
                    fhirItem.content.status = 'stopped';
                }
                break;
            case 'RENEWED':
                {
                    fhirItem.content.status = 'in progress';
                }
                break;
            case 'NO STATUS':
                {
                    fhirItem.content.status = 'on hold';
                }
                break;
        }
    }
    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0) {
        fhirItem.content.whenGiven = {};
        if (jdsItem.dosages[0].start !== undefined) {
            fhirItem.content.whenGiven.start = fhirUtils.convertToFhirDateTime(jdsItem.dosages[0].start);
        }
        if (jdsItem.dosages[0].stop !== undefined) {
            fhirItem.content.whenGiven.end = fhirUtils.convertToFhirDateTime(jdsItem.dosages[0].stop);
        }
    }

    fhirItem.content.extension = [];
    var ext = {};
    if (jdsItem.kind !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#kind',
            'valueString': jdsItem.kind
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].orderUid !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#orderUid',
            'valueString': jdsItem.orders[0].orderUid
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].pharmacistUid !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#pharmacistUid',
            'valueString': jdsItem.orders[0].pharmacistUid
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].pharmacistName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#pharmacistName',
            'valueString': jdsItem.orders[0].pharmacistName
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.administrations !== undefined && jdsItem.administrations.length > 0) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#administrations',
            'valueString': jdsItem.administrations
        };
        fhirItem.content.extension.push(ext);
    }
    if (jdsItem.supply !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#supply',
            'valueBoolean': jdsItem.supply
        };
        fhirItem.content.extension.push(ext);
    }

    fhirItem.content.patient = {
        'reference': 'Patient/' + jdsItem.pid
    };

    //dosages
    fhirItem.content.dosage = [];
    var dosage = {};
    dosage.extension = [];

    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0 && jdsItem.dosages[0].relativeStart !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#relativeStart',
            'valueString': jdsItem.dosages[0].relativeStart
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0 && jdsItem.dosages[0].relativeStop !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#relativeStop',
            'valueString': jdsItem.dosages[0].relativeStop
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].successor !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#successor',
            'valueString': jdsItem.orders[0].successor
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].predecessor !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#predecessor',
            'valueString': jdsItem.orders[0].predecessor
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0 && jdsItem.dosages[0].dose !== undefined) {
        dosage.quantity = {};
        dosage.quantity.value = jdsItem.dosages[0].dose;
        dosage.quantity.units = jdsItem.dosages[0].units;
    }
    if (jdsItem.fills !== undefined && jdsItem.fills.length > 0) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#fills',
            'valueString': jdsItem.fills[0]
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.administrations !== undefined && jdsItem.administrations.length > 0) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#administrations',
            'valueString': jdsItem.administrations[0]
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.IMO !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#IMO',
            'valueBoolean': jdsItem.IMO
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0 && jdsItem.dosages[0].ivRate !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#ivRate',
            'valueString': jdsItem.dosages[0].ivRate
        };
        dosage.extension.push(ext);
    }
    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0 && jdsItem.dosages[0].scheduleName !== undefined) {
        var timingPeriod = {};
        timingPeriod.extension = [];
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#scheduleName',
            'valueString': jdsItem.dosages[0].scheduleName
        };
        timingPeriod.extension.push(ext);
        dosage.timing = [];
        dosage.timing.push(timingPeriod);
    }
    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0 && jdsItem.dosages[0].routeName !== undefined) {
        dosage.route = {};
        dosage.route.text = jdsItem.dosages[0].routeName;
    }


    fhirItem.content.dosage.push(dosage);



    fhirItem.content.contained = [];
    var locationUid, encounterUid, substanceUid, practitionerUid, medicationUid;

    //location
    var orgUid = helpers.generateUUID();
    var contained = {};
    contained.resourceType = 'Location';
    contained._id = orgUid;
    locationUid = orgUid;
    contained.identifier = {
        'label': 'facility-code',
        'value': jdsItem.facilityCode
    };

    contained.name = jdsItem.facilityName;
    fhirItem.content.contained.push(contained);

    //encounter
    orgUid = helpers.generateUUID();
    encounterUid = orgUid;
    contained = {};
    contained.resourceType = 'Encounter';
    contained._id = orgUid;
    contained.location = [];
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0) {
        var loc = {};
        loc.period = {};
        loc.period.start = fhirUtils.convertToFhirDateTime(jdsItem.orders[0].ordered);
        loc.period.end = fhirUtils.convertToFhirDateTime(jdsItem.orders[0].ordered);
        loc.location = {};
        loc.location.display = jdsItem.orders[0].locationName;
        loc.location.reference = 'Location/' + locationUid;
        contained.location.push(loc);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].locationUid !== undefined) {
        contained.extension = [];
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#locationUid',
            'valueString': jdsItem.orders[0].locationUid
        };
        contained.extension.push(ext);
    }
    contained.type = [];
    var type = {};
    type.text = jdsItem.vaType;
    contained.type.push(type);

    fhirItem.content.contained.push(contained);

    //substance
    orgUid = helpers.generateUUID();
    substanceUid = orgUid;
    contained = {};
    contained.resourceType = 'Substance';
    contained._id = orgUid;
    contained.description = jdsItem.qualifiedName;
    contained.type = {};
    contained.type.text = jdsItem.name;
    type.coding = [];
    var coding1 = {},
        coding2 = {};
    if (jdsItem.products !== undefined && jdsItem.products.length > 0) {
        if (jdsItem.products[0].ingredientCode !== undefined) {
            coding1.code = jdsItem.products[0].ingredientCode;
            coding1.display = jdsItem.products[0].ingredientCodeName;
            coding1.system = 'urn:oid:2.16.840.1.113883.6.233';
        }
        if (jdsItem.products[0].ingredientRole !== undefined && jdsItem.products[0].ingredientRole.indexOf('urn:sct:') > -1) {
            coding2.code = jdsItem.products[0].ingredientRole;
            coding2.system = 'SNOMED-CT';
            coding2.display = jdsItem.products[0].ingredientName;
        }
        type.coding.push(coding1);
        type.coding.push(coding2);
    }
    fhirItem.content.contained.push(contained);

    //practitioner
    orgUid = helpers.generateUUID();
    practitionerUid = orgUid;
    contained = {};
    contained.resourceType = 'Practitioner';
    contained._id = orgUid;
    contained.name = {};
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].providerName !== undefined) {
        contained.name.text = jdsItem.orders[0].providerName;
    }
    contained.identifier = [];
    var identifier = {};
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].providerUid !== undefined) {
        identifier.label = 'provider-uid';
        identifier.value = jdsItem.orders[0].providerUid;
    }
    contained.identifier.push(identifier);
    fhirItem.content.contained.push(contained);

    //medication
    contained = {};
    contained.resourceType = 'Medication';
    contained._id = 'Medication/' + jdsItem.uid;
    medicationUid = 'Medication/' + jdsItem.uid;
    contained.name = jdsItem.name;
    contained.product = {};
    contained.product.form = {};
    contained.product.form.text = jdsItem.productFormName;
    contained.product.ingredient = [];
    var item = {};
    item.item = {};
    item.item.reference = '#' + substanceUid;
    contained.product.ingredient.push(item);

    contained.code = {};
    contained.code.text = jdsItem.name;
    contained.code.coding = [];
    _.each(jdsItem.rxncodes, function(rxncode) {
        contained.code.coding.push({
            'code': rxncode
        });
    });
    _.each(jdsItem.codes, function(code) {
        contained.code.coding.push({
            'code': code.code,
            'system': code.system,
            'display': code.display
        });
    });
    contained.extension = [];
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].drugClassCode !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#drugClassCode',
            'valueString': jdsItem.products[0].drugClassCode
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].drugClassName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#drugClassName',
            'valueString': jdsItem.products[0].drugClassName
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].suppliedCode !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#suppliedCode',
            'valueString': jdsItem.products[0].suppliedCode
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].suppliedName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#suppliedName',
            'valueString': jdsItem.products[0].suppliedName
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].strength !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#strength',
            'valueString': jdsItem.products[0].strength
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].ingredientRXNCode !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#ingredientRXNCode',
            'valueString': jdsItem.products[0].ingredientRXNCode
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].ingredientCode !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#ingredientCode',
            'valueString': jdsItem.products[0].ingredientCode
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].ingredientCodeName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#ingredientCodeName',
            'valueString': jdsItem.products[0].ingredientCodeName
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].ingredientRole !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#ingredientRole',
            'valueString': jdsItem.products[0].ingredientRole
        };
        contained.extension.push(ext);
    }
    if (jdsItem.products !== undefined && jdsItem.products.length > 0 && jdsItem.products[0].volume !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#volume',
            'valueString': jdsItem.products[0].volume
        };
        contained.extension.push(ext);
    }

    fhirItem.content.contained.push(contained);

    //MedicationPrescription
    contained = {};
    contained.resourceType = 'MedicationPrescription';
    contained._id = 'MedicationPrescription/' + jdsItem.uid;

    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].ordered !== undefined) {
        contained.dateWritten = fhirUtils.convertToFhirDateTime(jdsItem.orders[0].ordered);
    }
    contained.status = {};
    if (jdsItem.medStatusName !== undefined) {
        switch (jdsItem.medStatusName) {
            case 'historical':
                {
                    contained.status.code = 'completed';
                }
                break;
            case 'not active':
                {
                    contained.status.code = 'stopped';
                }
                break;
            case 'hold':
                {
                    contained.status.code = 'on hold';
                }
                break;
            case 'active':
                {
                    contained.status.code = 'active';
                }
                break;
        }
    }
    contained.dispense = {};
    if (jdsItem.IMO !== undefined) {
        contained.dispense.extension = [];
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#IMO',
            'valueBoolean': jdsItem.IMO
        };
        contained.dispense.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].fillsAllowed !== undefined) {
        contained.dispense.numberOfRepeatsAllowed = jdsItem.orders[0].fillsAllowed;
    }
    contained.dispense.validityPeriod = {};
    contained.dispense.validityPeriod.start = fhirUtils.convertToFhirDateTime(jdsItem.overallStart);
    contained.dispense.validityPeriod.end = fhirUtils.convertToFhirDateTime(jdsItem.overallStop);
    contained.dispense.validityPeriod.extension = [];
    ext = {
        'url': 'http://vistacore.us/fhir/extensions/med#stopped',
        'valueString': jdsItem.stopped
    };
    contained.dispense.validityPeriod.extension.push(ext);

    contained.dosageInstruction = [];
    var dosageInstruction = {};
    dosageInstruction.extension = [];

    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#relativeStart',
            'valueString': jdsItem.dosages[0].relativeStart
        };
        dosageInstruction.extension.push(ext);
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#relativeStop',
            'valueString': jdsItem.dosages[0].relativeStop
        };
        dosageInstruction.extension.push(ext);
        if (jdsItem.dosages[0].noun !== undefined) {
            ext = {
                'url': 'http://vistacore.us/fhir/extensions/med#noun',
                'valueString': jdsItem.dosages[0].noun
            };
            dosageInstruction.extension.push(ext);
        }
        if (jdsItem.dosages[0].instructions !== undefined) {
            ext = {
                'url': 'http://vistacore.us/fhir/extensions/med#instructions',
                'valueString': jdsItem.dosages[0].instructions
            };
            dosageInstruction.extension.push(ext);
        }
        if (jdsItem.dosages[0].amount !== undefined) {
            ext = {
                'url': 'http://vistacore.us/fhir/extensions/med#amount',
                'valueString': jdsItem.dosages[0].amount
            };
            dosageInstruction.extension.push(ext);
        }
        dosageInstruction.timing = {};
        dosageInstruction.timing.start = fhirUtils.convertToFhirDateTime(jdsItem.dosages[0].start);
        dosageInstruction.timing.end = fhirUtils.convertToFhirDateTime(jdsItem.dosages[0].stop);
        dosageInstruction.timing.extension = [];
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#scheduleName',
            'valueString': jdsItem.dosages[0].scheduleName
        };
        dosageInstruction.timing.extension.push(ext);
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#scheduleType',
            'valueString': jdsItem.dosages[0].scheduleType
        };
        dosageInstruction.timing.extension.push(ext);
        dosageInstruction.route = {};
        if (jdsItem.dosages[0].routeName !== undefined) {
            switch (jdsItem.dosages[0].routeName) {
                case 'AP':
                    {
                        dosageInstruction.route.text = 'Apply Externally';
                    }
                    break;
                case 'B':
                    {
                        dosageInstruction.route.text = 'Buccal';
                    }
                    break;
                case 'DT':
                    {
                        dosageInstruction.route.text = 'Dental';
                    }
                    break;
                case 'EP':
                    {
                        dosageInstruction.route.text = 'Epidural';
                    }
                    break;
                case 'ET':
                    {
                        dosageInstruction.route.text = 'Endotrachial Tube';
                    }
                    break;
                case 'GTT':
                    {
                        dosageInstruction.route.text = 'Gastrostomy Tube';
                    }
                    break;
                case 'GU':
                    {
                        dosageInstruction.route.text = 'GU Irrigant';
                    }
                    break;
                case 'IA':
                    {
                        dosageInstruction.route.text = 'Intra-arterial';
                    }
                    break;
                case 'IB':
                    {
                        dosageInstruction.route.text = 'Intrabursal';
                    }
                    break;
                case 'IC':
                    {
                        dosageInstruction.route.text = 'Intracardiac';
                    }
                    break;
                case 'ICV':
                    {
                        dosageInstruction.route.text = 'Intracervical (uterus)';
                    }
                    break;
                case 'ID':
                    {
                        dosageInstruction.route.text = 'Intradermal';
                    }
                    break;
                case 'IH':
                    {
                        dosageInstruction.route.text = 'Inhalation';
                    }
                    break;
                case 'IHA':
                    {
                        dosageInstruction.route.text = 'Intrahepatic Artery';
                    }
                    break;
                case 'IM':
                    {
                        dosageInstruction.route.text = 'Intramuscular';
                    }
                    break;
                case 'IMR':
                    {
                        dosageInstruction.route.text = 'Immerse (Soak) Body Part';
                    }
                    break;
                case 'IN':
                    {
                        dosageInstruction.route.text = 'Intranasal';
                    }
                    break;
                case 'IO':
                    {
                        dosageInstruction.route.text = 'Intraocular';
                    }
                    break;
                case 'IP':
                    {
                        dosageInstruction.route.text = 'Intraperitoneal';
                    }
                    break;
                case 'IS':
                    {
                        dosageInstruction.route.text = 'Intrasynovial';
                    }
                    break;
                case 'IT':
                    {
                        dosageInstruction.route.text = 'Intrathecal';
                    }
                    break;
                case 'IU':
                    {
                        dosageInstruction.route.text = 'Intrauterine';
                    }
                    break;
                case 'IV':
                    {
                        dosageInstruction.route.text = 'Intravenous';
                    }
                    break;
                case 'MM':
                    {
                        dosageInstruction.route.text = 'Mucous Membrane';
                    }
                    break;
                case 'MTH':
                    {
                        dosageInstruction.route.text = 'Mouth/Throat';
                    }
                    break;
                case 'NG':
                    {
                        dosageInstruction.route.text = 'Nasogastric';
                    }
                    break;
                case 'NP':
                    {
                        dosageInstruction.route.text = 'Nasal Prongs';
                    }
                    break;
                case 'NS':
                    {
                        dosageInstruction.route.text = 'Nasal';
                    }
                    break;
                case 'NT':
                    {
                        dosageInstruction.route.text = 'Nasotrachial Tube';
                    }
                    break;
                case 'OP':
                    {
                        dosageInstruction.route.text = 'Ophthalmic';
                    }
                    break;
                case 'OT':
                    {
                        dosageInstruction.route.text = 'Otic';
                    }
                    break;
                case 'OTH':
                    {
                        dosageInstruction.route.text = 'Other/Miscellaneous';
                    }
                    break;
                case 'PF':
                    {
                        dosageInstruction.route.text = 'Perfusion';
                    }
                    break;
                case 'PO':
                    {
                        dosageInstruction.route.text = 'Oral';
                    }
                    break;
                case 'PR':
                    {
                        dosageInstruction.route.text = 'Rectal';
                    }
                    break;
                case 'RM':
                    {
                        dosageInstruction.route.text = 'Rebreather Mask';
                    }
                    break;
                case 'SC':
                    {
                        dosageInstruction.route.text = 'Subcutaneous';
                    }
                    break;
                case 'SD':
                    {
                        dosageInstruction.route.text = 'Soaked Dressing';
                    }
                    break;
                case 'SL':
                    {
                        dosageInstruction.route.text = 'Sublingual';
                    }
                    break;
                case 'TD':
                    {
                        dosageInstruction.route.text = 'Transdermal';
                    }
                    break;
                case 'TL':
                    {
                        dosageInstruction.route.text = 'Translingual';
                    }
                    break;
                case 'TP':
                    {
                        dosageInstruction.route.text = 'Topical';
                    }
                    break;
                case 'TRA':
                    {
                        dosageInstruction.route.text = 'Tracheostomy';
                    }
                    break;
                case 'UR':
                    {
                        dosageInstruction.route.text = 'Urethral';
                    }
                    break;
                case 'VG':
                    {
                        dosageInstruction.route.text = 'Vaginal';
                    }
                    break;
                case 'VM':
                    {
                        dosageInstruction.route.text = 'Ventimask';
                    }
                    break;
                case 'WND':
                    {
                        dosageInstruction.route.text = 'Wound';
                    }
                    break;
            }
        }
    }
    dosageInstruction.text = jdsItem.sig;
    contained.dosageInstruction.push(dosageInstruction);

    contained.encounter = {};
    contained.encounter.reference = 'Encounter/' + encounterUid;
    contained.patient = {};
    contained.patient.reference = 'Patient/' + jdsItem.pid;
    contained.prescriber = {};
    contained.prescriber.reference = 'Practitioner/' + practitionerUid;
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].providerName !== undefined) {
        contained.prescriber.display = jdsItem.orders[0].providerName;
    }
    contained.medication = {};
    contained.medication.reference = medicationUid;

    contained.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };

    contained.identifier = [];

    id = {};
    id.system = 'urn:oid:2.16.840.1.113883.6.233';
    id.value = jdsItem.uid;
    contained.identifier.push(id);
    id = {};
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].orderUid !== undefined) {
        id.system = 'urn:oid:2.16.840.1.113883.6.233';
        id.value = jdsItem.orders[0].orderUid;
        contained.identifier.push(id);
    }
    id = {};
    id.use = 'pid';
    id.value = jdsItem.pid;
    contained.identifier.push(id);

    contained.extension = [];
    ext = {};
    if (jdsItem.localId !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#localId',
            'valueString': jdsItem.localId
        };
        contained.extension.push(ext);
    }
    if (jdsItem.medStatus !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#medStatus',
            'valueString': jdsItem.medStatus
        };
        contained.extension.push(ext);
    }
    if (jdsItem.medStatusName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#medStatusName',
            'valueString': jdsItem.medStatusName
        };
        contained.extension.push(ext);
    }
    if (jdsItem.medType !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#medType',
            'valueString': jdsItem.medType
        };
        contained.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].pharmacistUid !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#pharmacistUid',
            'valueString': jdsItem.orders[0].pharmacistUid
        };
        contained.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].pharmacistName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#pharmacistName',
            'valueString': jdsItem.orders[0].pharmacistName
        };
        contained.extension.push(ext);
    }
    if (jdsItem.supply !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#supply',
            'valueBoolean': jdsItem.supply
        };
        contained.extension.push(ext);
    }
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].orderUid !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#orderUid',
            'valueString': jdsItem.orders[0].orderUid
        };
        contained.extension.push(ext);
    }
    if (jdsItem.kind !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#kind',
            'valueString': jdsItem.kind
        };
        contained.extension.push(ext);
    }
    if (jdsItem.dosages !== undefined && jdsItem.dosages.length > 0 && jdsItem.dosages[0].scheduleFreq !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/med#scheduleFreq',
            'valueString': jdsItem.dosages[0].scheduleFreq
        };
        contained.extension.push(ext);
    }


    fhirItem.content.contained.push(contained);


    fhirItem.content.encounter = {};
    fhirItem.content.encounter.reference = 'Encounter/' + encounterUid;

    fhirItem.content.practitioner = {};
    fhirItem.content.practitioner.reference = 'Practitioner/' + practitionerUid;
    if (jdsItem.orders !== undefined && jdsItem.orders.length > 0 && jdsItem.orders[0].providerName !== undefined) {
        fhirItem.content.practitioner.display = jdsItem.orders[0].providerName;
    }

    fhirItems.push(fhirItem);
}

function getMedicationAdministrationData(req, pid, callback, next, start, limit) {
    var config = req.app.config;
    var jdsPath = '';
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    jdsPath = '/vpr/' + pid + '/index/medication?filter=in(vaType,%5B%22V%22,%22I%22%5D)' + '&' + querystring.stringify(jdsQuery);
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

module.exports.getMedicationAdministrationData = getMedicationAdministrationData;
module.exports.getResourceConfig = getResourceConfig;
module.exports.getMedicationAdministration = getMedicationAdministration;
module.exports.convertToFhir = convertToFhir;
