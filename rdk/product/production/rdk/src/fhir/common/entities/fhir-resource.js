'use strict';
var rdk = require('../../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
//var _ = rdk.utils.underscore;
var constants = require('../utils/constants');
var helpers = require('../utils/helpers');

var MedicationDispenseStatus = {
    'in-progress': 'in-progress',
    'on-hold': 'on-hold',
    'suspended': 'on-hold',
    'completed': 'completed',
    'entered in error': 'entered in error',
    'stopped': 'stopped'
};
module.exports.MedicationDispenseStatus = MedicationDispenseStatus;

var MedicationAdministrationStatus = {
    // vaStatus: DSTU2_MedicationAdministration_Status
    'discontinued': 'stopped',
    'complete': 'completed',
    'hold': 'on-hold',
    'flagged': 'on-hold',
    'pending': 'in-progress',
    'active': 'in-progress',
    'expired': 'completed',
    'delayed': 'on-hold',
    'unreleased': 'in-progress',
    'discontinued/edit': 'stopped',
    'cancelled': 'stopped',
    'lapsed': 'stopped',
    'renewed': 'in-progress',
    'no status': 'on-hold'
};

function getMedicationAdministrationStatus(vaStatus) {
    return MedicationAdministrationStatus[vaStatus.toLowerCase()];
}
module.exports.getMedicationAdministrationStatus = getMedicationAdministrationStatus;

var MedicationPrescriptionStatus = {
    // vaStatus: DSTU2_MedicationPrescription_Status
    'pending': 'active',
    'active': 'active',
    'unreleased': 'active',
    'renewed': 'active',
    'continued': 'active',
    'hold': 'on-hold',
    'flagged': 'on-hold',
    'delayed': 'on-hold',
    'no status': 'on-hold',
    'complete': 'completed',
    'discontinued': 'stopped',
    'discontinued/edit': 'stopped',
    'cancelled': 'stopped',
    'lapsed': 'stopped',
    'expired': 'stopped',
    'suspend': 'stopped'
};

function getMedicationPrescriptionStatus(vaStatus) {
    return MedicationPrescriptionStatus[vaStatus.toLowerCase()];
}
module.exports.getMedicationPrescriptionStatus = getMedicationPrescriptionStatus;

var DiagnosticReportStatus = {
    'registered': 'registered',
    'partial': 'partial',
    'final': 'final',
    'corrected': 'corrected',
    'amended': 'amended',
    'appended': 'appended',
    'cancelled': 'cancelled',
    'entered in error': 'entered in error'
};
module.exports.DiagnosticReportStatus = DiagnosticReportStatus;

function Bundle2(link, entry, totalResults) {
    this.resourceType = 'Bundle';
    this.type = 'collection';
    this.id = helpers.generateUUID();
    this.link = link || [];
    this.total = totalResults || 0;
    this.entry = entry || [];
}

function Bundle(title, link, entry, author, totalResults, updated) {
    this.resourceType = 'Bundle';

    this.type = 'collection';
    this.title = 'Search Result';
    this.id = 'urn:uuid:' + helpers.generateUUID();
    this.link = link || [];
    this.total = 0;
    this.updated = updated || new Date();
    this.author = author || [];
    this.entry = entry || [];
}
module.exports.Bundle = Bundle;
module.exports.Bundle2 = Bundle2;

function MedicationStatement(identifier, status, patient) {
    this.resourceType = 'MedicationStatement';
    this.status = status || '';
    this.patient = patient || new ReferenceResource();
}
module.exports.MedicationStatement = MedicationStatement;

function MedicationDispense(identifier, status, patient, dispenser) {
    this.resourceType = 'MedicationDispense';
    this.status = status || '';
    this.patient = patient || new ReferenceResource();
    this.dispenser = dispenser || new ReferenceResource();
}
module.exports.MedicationDispense = MedicationDispense;

function DiagnosticReport(name, status, issued, subject, performer) {
    this.resourceType = 'DiagnosticReport';
    this.name = name || new CodeableConcept();
    this.status = DiagnosticReportStatus[status] || '';
    this.issued = issued || null; //dateTime
    this.subject = subject || new ReferenceResource();
    this.performer = performer || new ReferenceResource();
}
module.exports.DiagnosticReport = DiagnosticReport;

function Encounter(id) {
    this.resourceType = 'Encounter';
    this.id = id || '';
}
module.exports.Encounter = Encounter;

function Organization(id) {
    this.resourceType = 'Organization';
    this.id = id || '';
}
module.exports.Organization = Organization;

function Location(id, name, identifier) {
    this.resourceType = 'Location';
    this.id = id || '';
    if (nullchecker.isNotNullish(name)) {
        this.name = name;
        this.text = new Narrative('<div>' + name + '</div>');
    }
    if (nullchecker.isNotNullish(identifier)) {
        this.identifier = identifier;
    }
}
module.exports.Location = Location;

function Practitioner(id, name) {
    this.resourceType = 'Practitioner';
    this.id = id || '';
    if (nullchecker.isNotNullish(name)) {
        this.name = name;
    }
}
module.exports.Practitioner = Practitioner;

/**
 * This is the DSTU1 version of the Practitioner object. This is currently in
 * use by orderResource. #US8265
 *
 * TODO: Delete this once the Order FHIR resource gets migrated to DSTU2.
 */
function Practitioner_DSTU1(id, name) {
    this.resourceType = 'Practitioner';
    this._id = id || '';
    if (nullchecker.isNotNullish(name)) {
        this.name = name;
    }
}
module.exports.Practitioner_DSTU1 = Practitioner_DSTU1;

function HumanName(text, use) {
    this.text = text;
    this.use = use;
}
module.exports.HumanName = HumanName;

function Specimen(id, subject, type, collectedDateTime, containerType) {
    this.resourceType = 'Specimen';
    this.id = id || '';
    this.type = type;
    this.subject = subject || new ReferenceResource();
    if (collectedDateTime) {
        this.collection = {
            collectedDateTime: collectedDateTime
        };
    }
    if (nullchecker.isNotNullish(containerType)) {
        this.container = {};
        this.container.type = containerType;
    }
}
module.exports.Specimen = Specimen;

function Observation(id, code, status, reliability, valueX, x) {
    this.resourceType = 'Observation';
    this.id = id || '';
    this.code = code || new CodeableConcept();
    this.status = status;
    if (nullchecker.isNotNullish(reliability)) {
        this.reliability = reliability;
    }
    this['value' + (x || 'String')] = valueX;
}
module.exports.Observation = Observation;

function Quantity(value, units, code, system, comparator) {
    if (nullchecker.isNotNullish(value)) {
        this.value = parseFloat(value);
    }
    if (nullchecker.isNotNullish(units)) {
        this.units = units;
    }
    if (nullchecker.isNotNullish(code)) {
        this.code = code;
    }
    if (nullchecker.isNotNullish(system)) {
        this.system = system;
    }
    if (nullchecker.isNotNullish(comparator)) {
        this.comparator = comparator;
    }
}
module.exports.Quantity = Quantity;

function Address(text, country, state, city, lines, zip, use, period) {
    this.text = text;
    this.country = country;
    this.state = state;
    this.city = city;
    this.lines = lines;
    this.zip = zip;
    this.use = use;
    this.period = period;
}
module.exports.Address = Address;

function CodeableConcept(text, coding) {
    if (nullchecker.isNotNullish(text)) {
        this.text = text;
    }
    if (nullchecker.isNotNullish(coding)) {
        this.coding = [];
        if (Object.prototype.toString.call(coding) === Object.prototype.toString.call([])) {
            this.coding = coding;
        } else {
            this.coding.push(coding);
        }
    }
}
module.exports.CodeableConcept = CodeableConcept;

function Coding(code, display, system, version, primary) {
    if (nullchecker.isNotNullish(system)) {
        this.system = system;
    }
    if (nullchecker.isNotNullish(version)) {
        this.version = version;
    }
    if (nullchecker.isNotNullish(code)) {
        this.code = code;
    }
    if (nullchecker.isNotNullish(display)) {
        this.display = display;
    }
    if (nullchecker.isNotNullish(primary)) {
        this.primary = primary;
    }
}
module.exports.Coding = Coding;


function RelatedResource(type, reference, display) {

    if (nullchecker.isNotNullish(type)) {
        this.type = type;
    }
    var t = {};
    if (nullchecker.isNotNullish(reference)) {
        t.reference = reference;
    }
    if (nullchecker.isNotNullish(display)) {
        t.display = display;
    }
    this.target = t;
}
module.exports.RelatedResource = RelatedResource;

function ReferenceResource(reference, display) {
    if (nullchecker.isNotNullish(reference)) {
        this.reference = reference;
    }
    if (nullchecker.isNotNullish(display)) {
        this.display = display;
    }
}
module.exports.ReferenceResource = ReferenceResource;

function Extension(url, valueX, x) {
    this.url = url || '';
    switch (x.toLowerCase()) {
        case 'string':
            this.valueString = valueX;
            break;
        case 'datetime':
            this.valueDateTime = valueX;
            break;
        default:
            this['value' + x] = valueX;
    }
}
module.exports.Extension = Extension;

function Identifier(value, system, use, type, assigner, period) {
    if (nullchecker.isNotNullish(use)) {
        this.use = use;
    }
    if (nullchecker.isNotNullish(type)) {
        this.type = type;
    }
    if (nullchecker.isNotNullish(system)) {
        this.system = system;
    }
    if (nullchecker.isNotNullish(value)) {
        this.value = value;
    }
    if (nullchecker.isNotNullish(period)) {
        this.period = period;
    }
    if (nullchecker.isNotNullish(assigner)) {
        this.assigner = assigner;
    }
}
module.exports.Identifier = Identifier;

/**
 * This is the DSTU1 version of the Identifier object. This is currently in
 * use by orderResource. #US8265
 *
 * TODO: Delete this once the Order FHIR resource gets migrated to DSTU2.
 */
function Identifier_DSTU1(value, system, use, label, assigner, period) {
    if (nullchecker.isNotNullish(use)) {
        this.use = use;
    }
    if (nullchecker.isNotNullish(label)) {
        this.label = label;
    }
    if (nullchecker.isNotNullish(system)) {
        this.system = system;
    }
    if (nullchecker.isNotNullish(value)) {
        this.value = value;
    }
    if (nullchecker.isNotNullish(period)) {
        this.period = period;
    }
    if (nullchecker.isNotNullish(assigner)) {
        this.assigner = assigner;
    }
}
module.exports.Identifier_DSTU1 = Identifier_DSTU1;

var NarrativeStatus = {
    generated: 'generated',
    extensions: 'extensions',
    additional: 'additional'
};
module.exports.NarrativeStatus = NarrativeStatus;

function Narrative(div, status) {
    this.status = status || NarrativeStatus.generated;
    this.div = div;
}
module.exports.Narrative = Narrative;

function Link(url, relation) {
    this.relation = relation;
    this.url = url;
}
module.exports.Link = Link;

function Author(name, uri) {
    this.name = name || constants.application.APP_NAME;
    this.uri = uri || constants.application.APP_URI;
}
module.exports.Author = Author;

function Entry(resource) {
    this.resource = resource;
}
module.exports.Entry = Entry;

function Order(id, dateTime) {
    this.resourceType = 'Order';
    this._id = id || ''; // Order is still DSTU1
    this.date = dateTime;
}
module.exports.Order = Order;

function DiagnosticOrder(id, subject, status, orderer, items) {
    this.resourceType = 'DiagnosticOrder';
    this._id = id || ''; // DiagnosticOrder is still DSTU1
    this.subject = subject || null;
    if (nullchecker.isNotNullish(status)) {
        this.status = status;
    }
    if (nullchecker.isNotNullish(orderer)) {
        this.orderer = orderer;
    }
    this.item = [];
    if (nullchecker.isNotNullish(items)) {
        if (Object.prototype.toString.call(items) === Object.prototype.toString.call([])) {
            this.item = items;
        } else {
            this.item.push(items);
        }
    }
}
module.exports.DiagnosticOrder = DiagnosticOrder;

function MedicationPrescription(id, patient, status, prescriber, medication) {
    this.resourceType = 'MedicationPrescription';
    this.id = id || '';
    this.patient = patient || null;
    if (nullchecker.isNotNullish(status)) {
        this.status = status;
    }
    if (nullchecker.isNotNullish(prescriber)) {
        this.prescriber = prescriber;
    }
    if (nullchecker.isNotNullish(medication)) {
        this.medication = medication;
    }
}
module.exports.MedicationPrescription = MedicationPrescription;

function MedicationAdministration_DSTU2(id, vaStatus) {
    this.resourceType = 'MedicationAdministration';
    this.id = id || '';

    if (nullchecker.isNotNullish(vaStatus)) {
        this.status = getMedicationAdministrationStatus(vaStatus);
    }
}
module.exports.MedicationAdministration_DSTU2 = MedicationAdministration_DSTU2;

function MedicationPrescription_DSTU2(id, vaStatus) {
    this.resourceType = 'MedicationPrescription';
    this.id = id || '';

    if (nullchecker.isNotNullish(vaStatus)) {
        this.status = getMedicationPrescriptionStatus(vaStatus);
    }
}
module.exports.MedicationPrescription_DSTU2 = MedicationPrescription_DSTU2;

function Medication(id, name, code) {
    this.resourceType = 'Medication';
    this.id = id || '';
    this.name = name;
    this.code = code;
}
module.exports.Medication = Medication;

function Substance(id, type, description) {
    this.resourceType = 'Substance';
    this.id = id || '';
    if (nullchecker.isNotNullish(type)) {
        this.type = type;
    }
    if (nullchecker.isNotNullish(description)) {
        this.description = description;
    }
}
module.exports.Substance = Substance;

function Schedule() {}
module.exports.Schedule = Schedule;

function Period(start, end) {
    this.start = start;
    this.end = end;
}
module.exports.Period = Period;

function Composition(id, date, type, status, subject, author) {
    this.resourceType = 'Composition';
    this.id = id;
    if (nullchecker.isNotNullish(date)) {
        this.date = date;
    }
    if (nullchecker.isNotNullish(type)) {
        this.type = type;
    }
    if (nullchecker.isNotNullish(status)) {
        this.status = status;
    }
    if (nullchecker.isNotNullish(subject)) {
        this.subject = subject;
    }
    if (nullchecker.isNotNullish(author)) {
        this.author = author;
    }
}
module.exports.Composition = Composition;

function List(id, status, mode, text) {
    this.resourceType = 'List';
    this.id = id;
    this.status = status;
    this.mode = mode;
    this.text = {
        status: 'generated',
        div: '<div>' + text + '</div>'
    };
}
module.exports.List = List;

function ReferralRequest(id, status) {
    this.resourceType = 'ReferralRequest';
    this.id = id;
    this.status = status;
}
module.exports.ReferralRequest = ReferralRequest;
