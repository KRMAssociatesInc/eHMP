/*jslint node: true */
'use strict';
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var querystring = require('querystring');
var fhirUtils = require('../common/utils/fhirUtils');
var constants = require('../common/utils/constants');
var helpers = require('../common/utils/helpers');
var fhirResource = require('../common/entities/fhirResource');
var errors = require('../common/errors');
//TO DO:
// As JSON.parse and JSON.stringify work in a blocking manner perhaps we should switch to a streaming parser as this one:
// https://github.com/dominictarr/JSONStream

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        // start: {
        //     required: false,
        //     regex: /\d+/,
        //     description: 'start showing results from this 0-based index'
        // },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        }
    }
};

var orderDetailMap = {
    'LR': 'DiagnosticOrder',
    'RA': 'DiagnosticOrder',
    'PSO': 'MedicationPrescription',
    'PSJ': 'MedicationPrescription',
    'PSIV': 'MedicationPrescription',
    'PSH': 'MedicationPrescription'
};

var clinicianRolePriority = {
    'S': 40,
    'N': 30,
    'C': 20,
    'R': 10
};

var statusDiagOrderMap = {
    'COMPLETE': 'completed',
    'PENDING': 'requested',
    'DISCONTINUED': 'suspended',
    'DISCONTINUED/EDIT': 'suspended',
    'ACTIVE': 'in progress',
    'EXPIRED': 'failed'
};

var statusMedPrescriptionMap = {
    'COMPLETE': 'completed',
    'PENDING': 'active',
    'DISCONTINUED': 'stopped',
    'DISCONTINUED/EDIT': 'stopped',
    'ACTIVE': 'active',
    'EXPIRED': 'stopped'
};

function getResourceConfig() {
    return [{
        name: 'order',
        path: '',
        get: getFhirOrders,
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

var apiDocs = {
    spec: {
        path: '/fhir/order',
        nickname: 'fhir-order',
        summary: 'Converts a vpr \'order\' resource into a FHIR \'order\' resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            // rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

function getFhirOrders(req, res, next) {
    getOrders(req, res, next);
}

function getOrders(req, res, next, startFrom, previousResults) {
    startFrom = startFrom || 0;
    previousResults = previousResults || [];
    var limit = req.param('limit');

    getVprData(req, 'order', function(err, inputJSON) {
        var results = null;
        var bundle = null;

        if (err instanceof errors.NotFoundError) {
            res.send(rdk.httpstatus.not_found, err.error);
        } else if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.send(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
        } else if (err) {
            res.send(rdk.httpstatus.internal_server_error, err.message);
        } else {
            results = convertToFhir(inputJSON, req, previousResults, limit);
            if (!nullchecker.isNullish(limit) && limit > results.length && inputJSON.data.items && inputJSON.data.items.length > 0) {
                getOrders(req, res, next, startFrom + inputJSON.data.items.length, results);
            } else {
                bundle = buildBundle(results, req);
                res.send(200, bundle);
            }
        }
    }, next, startFrom, limit);
}

function convertToFhir(inputJSON, req, previousResults, limit) {
    var outJSON = previousResults || [];
    var items = inputJSON.data.items;

    for (var i = 0; i < items.length; i++) {
        outJSON = outJSON.concat(createOrders(items[i], req));
        if (outJSON.length >= limit) {
            break;
        }
    }
    if (nullchecker.isNullish(limit)) {
        limit = outJSON.length;
    }
    return _.first(outJSON, limit);
}

function buildBundle(results, req) {
    var b = new fhirResource.Bundle();
    var pid = null;
    b.updated = fhirUtils.convertDate2FhirDateTime(new Date());
    b.author.push(new fhirResource.Author());
    if (req) {
        b.link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self'));
        pid = req.param('subject.identifier');
        if (pid !== undefined) {
            b.title = 'Order with subject.identifier \'' + pid + '\'';
        }
    }
    b.totalResults += results.length;
    for (var i in results) {
        if (nullchecker.isNotNullish(results[i])) {
            var e = new fhirResource.Entry(results[i]);
            e.title = 'order for patient [' + pid + ']';
            e.id = constants.ordersFhir.ORDER_PREFIX + (e.content._id || e.content.id || 'null');
            e.link.push(new fhirResource.Link(req.protocol + '://' + req.headers.host + '/fhir/order/' + (e.content._id || e.content.id || '@null'), 'self'));
            e.updated = fhirUtils.convertDate2FhirDateTime(new Date());
            e.published = fhirUtils.convertDate2FhirDateTime(new Date());
            e.author.push(new fhirResource.Author());

            b.entry.push(e);
        }
    }

    return b;
}

function getVprData(req, domain, callback, next, start, limit) {

    var pid = req.param('subject.identifier');
    // var start = req.param('start') || 0;
    // var limit = req.param('limit');
    var config = req.app.config;

    if (nullchecker.isNullish(pid)) {
        return next();
    }
    var jdsResource;
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }

    jdsResource = '/vpr/' + pid + '/index/' + domain;
    var jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);
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

function createOrders(item, req, parentUid) {
    if (nullchecker.isNullish(item)) {
        return null;
    }

    var orderList = [];

    if (nullchecker.isNullish(item.service)) {
        return orderList;
    } else {
        if (nullchecker.isNullish(orderDetailMap[item.service])) {
            return orderList;
        }
    }

    var order = new fhirResource.Order(item.uid, fhirUtils.convertToFhirDateTime(item.entered));
    var childOrders = [];
    // when.schedule
    if (nullchecker.isNotNullish(item.start) || nullchecker.isNotNullish(item.stop)) {
        order.when = {
            schedule: new fhirResource.Schedule()
        };
        order.when.schedule.event = [];
        order.when.schedule.event.push(new fhirResource.Period(fhirUtils.convertToFhirDateTime(item.start), fhirUtils.convertToFhirDateTime(item.stop)));
    }
    // subject
    var pid = item.pid || req.param('pid') || req.param('subject') || req.param('subject.identifier');
    if (nullchecker.isNotNullish(pid)) {
        order.subject = new fhirResource.ReferenceResource(constants.ordersFhir.PATIENT_PREFIX + pid);
    }
    // extensions
    order.extension = [];

    if (nullchecker.isNotNullish(item.kind)) {
        order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'kind', item.kind, 'String'));
    }
    if (nullchecker.isNotNullish(item.service)) {
        order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'service', item.service, 'String'));
    }
    if (nullchecker.isNotNullish(item.localId)) {
        order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'localId', item.localId, 'String'));
    }
    if (nullchecker.isNotNullish(item.displayGroup)) {
        order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'displayGroup', item.displayGroup, 'String'));
    }
    if (nullchecker.isNotNullish(item.predecessor)) {
        order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'predecessor',
            new fhirResource.ReferenceResource(constants.ordersFhir.ORDER_PREFIX + item.predecessor),
            'Resource'));
    }
    if (nullchecker.isNotNullish(item.successor)) {
        order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'successor',
            new fhirResource.ReferenceResource(constants.ordersFhir.ORDER_PREFIX + item.successor),
            'Resource'));
    }
    if (nullchecker.isNotNullish(parentUid)) {
        order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'parent',
            new fhirResource.ReferenceResource(constants.ordersFhir.ORDER_PREFIX + parentUid),
            'Resource'));
    }
    if (nullchecker.isNotNullish(item.children)) {
        _.each(item.children, function(child) {
            order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'child',
                new fhirResource.ReferenceResource(constants.ordersFhir.ORDER_PREFIX + (child.uid || '@null')),
                'Resource'));
            // recursive add children of current order
            childOrders = childOrders.concat(createOrders(child, req, item.uid));
        });
    }
    if (nullchecker.isNotNullish(item.results)) {
        _.each(item.results, function(result) {
            if (nullchecker.isNotNullish(result.uid)) {
                order.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'result', result.uid, 'String')); //this should be a reference to another FHIR resource
            }
        });
    }

    if (order.extension.length === 0) {
        order.extension = undefined;
    }

    // contained resources
    order.contained = [];
    order.detail = [];
    // - provider
    if (nullchecker.isNotNullish(item.providerName)) {
        var contPractProvider = new fhirResource.Practitioner(helpers.generateUUID());
        if (nullchecker.isNotNullish(item.providerDisplayName)) {
            contPractProvider.text = new fhirResource.Narrative('<div>' + item.providerDisplayName + '</div>');
        }
        contPractProvider.name = convertToFhirHumanName(item.providerName);
        if (nullchecker.isNotNullish(item.providerUid)) {
            contPractProvider.identifier = [new fhirResource.Identifier(item.providerUid, undefined, undefined, 'provider-uid')];
        }

        order.contained.push(contPractProvider);
        // source
        order.source = new fhirResource.ReferenceResource('#' + (contPractProvider._id || contPractProvider.id || 'null'), contPractProvider.name.text);
    }
    // - location
    if (nullchecker.isNotNullish(item.locationUid)) {
        var contLocLocation = new fhirResource.Location(helpers.generateUUID());
        if (nullchecker.isNotNullish(item.locationName)) {
            contLocLocation.text = new fhirResource.Narrative('<div>' + item.locationName + '</div>');
        }
        contLocLocation.name = item.locationName;
        contLocLocation.identifier = new fhirResource.Identifier(item.locationUid, undefined, undefined, 'location-uid');

        order.contained.push(contLocLocation);
    }
    // - facility
    if (nullchecker.isNotNullish(item.facilityCode)) {
        var contOrgFacility = new fhirResource.Organization(helpers.generateUUID());
        if (nullchecker.isNotNullish(item.facilityName)) {
            contOrgFacility.text = new fhirResource.Narrative('<div>' + item.facilityName + '</div>');
        }
        contOrgFacility.name = item.facilityName;
        contOrgFacility.identifier = [new fhirResource.Identifier(item.facilityCode, undefined, undefined, 'facility-code')];

        order.contained.push(contOrgFacility);
    }
    // - clinicians
    if (nullchecker.isNotNullish(item.clinicians)) {
        var sourcePractitioner = {
            rolePriority: -1,
            resource: null
        };
        _.each(item.clinicians, function(clinician) {
            var contPractClinician = new fhirResource.Practitioner(helpers.generateUUID());
            if (nullchecker.isNotNullish(clinician.name)) {
                contPractClinician.text = new fhirResource.Narrative('<div>' + clinician.name + '</div>');
            }
            contPractClinician.name = convertToFhirHumanName(clinician.name);
            contPractClinician.identifier = [new fhirResource.Identifier(clinician.uid, undefined, undefined, 'uid')];
            if (nullchecker.isNotNullish(clinician.role)) {
                contPractClinician.extension = contPractClinician.extension || [];
                contPractClinician.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'clinicianRole', clinician.role, 'String'));
            }
            if (nullchecker.isNotNullish(clinician.signedDateTime)) {
                contPractClinician.extension = contPractClinician.extension || [];
                contPractClinician.extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'clinicianSignedDateTime',
                    fhirUtils.convertToFhirDateTime(String(clinician.signedDateTime)), 'DateTime'));
            }

            order.contained.push(contPractClinician);
            if (sourcePractitioner.rolePriority < clinicianRolePriority[clinician.role]) {
                sourcePractitioner.resource = contPractClinician;
                sourcePractitioner.rolePriority = clinicianRolePriority[clinician.role];
            }
        });
        // source
        if (nullchecker.isNullish(order.source) && nullchecker.isNotNullish(sourcePractitioner.resource)) {
            order.source = new fhirResource.ReferenceResource('#' + (sourcePractitioner.resource._id || sourcePractitioner.resource.id || 'null'), sourcePractitioner.resource.name.text);
        }
    }
    // - ordered item
    if (orderDetailMap[item.service] === 'DiagnosticOrder') {
        var contDiagOrder = createDiagnosticOrder(item, order);
        order.contained.push(contDiagOrder);
        // detail
        order.detail.push(new fhirResource.ReferenceResource('#' + (contDiagOrder._id || contDiagOrder.id || 'null'), fhirUtils.removeDivFromText(contDiagOrder.text.div)));
    } else if (orderDetailMap[item.service] === 'MedicationPrescription') {
        var contMedPrescription = createMedicationPrescription(item, order);
        order.contained.push(contMedPrescription);
        // detail
        order.detail.push((new fhirResource.ReferenceResource('#' + (contMedPrescription._id || contMedPrescription.id || 'null'), fhirUtils.removeDivFromText(contMedPrescription.text.div))));
    }

    if (order.contained.length === 0) {
        order.contained = undefined;
    }
    if (order.detail.length === 0) {
        order.detail = undefined;
    }
    // text
    var t = '<div>Request for ' + (item.kind || '') + ' (on patient \'' + (pid || '@null') + '\' @ ' + (item.providerDisplayName || '') + ')\r\n' + (item.summary || '') + '</div>';
    order.text = new fhirResource.Narrative(t);

    orderList.push(order);
    if (nullchecker.isNotNullish(childOrders) && childOrders.length > 0) {
        orderList = orderList.concat(childOrders);
    }

    return orderList;
}

function createDiagnosticOrder(item, order) {
    var diagOrder = new fhirResource.DiagnosticOrder(helpers.generateUUID(), order.subject, statusDiagOrderMap[item.statusName], order.source);
    diagOrder.text = new fhirResource.Narrative('<div>' + (item.oiName || item.name) + '</div>');
    if (nullchecker.isNotNullish(item.uid)) {
        diagOrder.identifier = diagOrder.identifier || [];
        diagOrder.identifier.push(new fhirResource.Identifier(item.uid, undefined, undefined, 'uid'));
    }
    diagOrder.item = [];
    var itemOI = {
        code: new fhirResource.CodeableConcept(item.oiName || item.name)
    };
    if (nullchecker.isNotNullish(item.oiCode)) {
        itemOI.code.coding = itemOI.code.coding || [];
        itemOI.code.coding.push(new fhirResource.Coding(item.oiCode, item.oiName, 'oi-code'));
        if (nullchecker.isNotNullish(item.oiPackageRef)) {
            itemOI.code.coding[0].extension = [];
            itemOI.code.coding[0].extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'oiPackageRef', item.oiPackageRef, 'String'));
        }
    }
    if (nullchecker.isNotNullish(item.codes)) {
        itemOI.code.coding = itemOI.code.coding || [];
        _.each(item.codes, function(code) {
            itemOI.code.coding.push(new fhirResource.Coding(code.code, code.display, code.system));
        });
    }
    if (nullchecker.isNotNullish(itemOI)) {
        diagOrder.item.push(itemOI);
    }

    return diagOrder;
}

function createMedicationPrescription(item, order) {
    var medPrescription = new fhirResource.MedicationPrescription(helpers.generateUUID(), order.subject, statusMedPrescriptionMap[item.statusName], order.source);
    medPrescription.text = new fhirResource.Narrative('<div>' + (item.oiName || item.name) + '</div>');
    if (nullchecker.isNotNullish(item.uid)) {
        medPrescription.identifier = medPrescription.identifier || [];
        medPrescription.identifier.push(new fhirResource.Identifier(item.uid, undefined, undefined, 'uid'));
    }
    var medicationOI = new fhirResource.Medication(helpers.generateUUID(), item.oiName || item.name, new fhirResource.CodeableConcept(item.oiName));
    if (nullchecker.isNotNullish(item.oiCode)) {
        medicationOI.code.coding = medicationOI.code.coding || [];
        medicationOI.code.coding.push(new fhirResource.Coding(item.oiCode, item.oiName, 'oi-code'));
        if (nullchecker.isNotNullish(item.oiPackageRef)) {
            medicationOI.code.coding[0].extension = [];
            medicationOI.code.coding[0].extension.push(new fhirResource.Extension(constants.ordersFhir.ORDER_EXTENSION_URL_PREFIX + 'oiPackageRef', item.oiPackageRef, 'String'));
        }
    }
    if (nullchecker.isNotNullish(item.codes)) {
        medicationOI.code.coding = medicationOI.code.coding || [];
        _.each(item.codes, function(code) {
            medicationOI.code.coding.push(new fhirResource.Coding(code.code, code.display, code.system));
        });
    }
    if (nullchecker.isNotNullish(medicationOI)) {
        order.contained = order.contained || [];
        order.contained.push(medicationOI);
        medPrescription.medication = new fhirResource.ReferenceResource('#' + (medicationOI._id || medicationOI.id || 'null'), medicationOI.name);
    }

    return medPrescription;
}

function convertToFhirHumanName(sFullName) {
    var fhirHumanName = null;

    if (nullchecker.isNotNullish(sFullName)) {
        fhirHumanName = new fhirResource.HumanName(sFullName);
        fhirHumanName.family = [];
        fhirHumanName.given = [];
        var names = sFullName.split(',');
        if (names.length === 2) {
            _.each(names[0].split(' '), function(familyName) {
                if (nullchecker.isNotNullish(familyName.trim())) {
                    fhirHumanName.family.push(familyName.trim());
                }
            });
            _.each(names[1].split(' '), function(givenName) {
                if (nullchecker.isNotNullish(givenName.trim())) {
                    fhirHumanName.given.push(givenName.trim());
                }
            });
        }
        if (fhirHumanName.family.length === 0) {
            fhirHumanName.family = undefined;
        }
        if (fhirHumanName.given.length === 0) {
            fhirHumanName.given = undefined;
        }
    }

    return fhirHumanName;
}
module.exports.getResourceConfig = getResourceConfig;
module.exports.convertToFhir = convertToFhir;
