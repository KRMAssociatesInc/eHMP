/*jslint node: true */
'use strict';
var rdk = require('../../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
//var _ = rdk.utils.underscore;
var constants = require('../utils/constants');
var helpers = require('../utils/helpers');

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

function Bundle(title, link, entry, author, totalResults, updated) {
    this.resourceType = 'Bundle';
    this.title = 'Search Result';
    this.id = 'urn:uuid:' + helpers.generateUUID();
    this.link = link || [];
    this.totalResults = 0;
    this.updated = updated || new Date();
    this.author = author || [];
    this.entry = entry || [];
}
module.exports.Bundle = Bundle;

function DiagnosticReport(name, status, issued, subject, performer) {
    this.resourceType = 'DiagnosticReport';
    this.name = name || new CodeableConcept();
    this.status = DiagnosticReportStatus[status] || '';
    this.issued = issued || null; //dateTime
    this.subject = subject || new ReferenceResource();
    this.performer = performer || new ReferenceResource();
}
module.exports.DiagnosticReport = DiagnosticReport;

function Organization(id) {
    this.resourceType = 'Organization';
    this._id = id || '';
}
module.exports.Organization = Organization;

function Location(id, name, identifier) {
    this.resourceType = 'Location';
    this._id = id || '';
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
    this._id = id || '';
    if (nullchecker.isNotNullish(name)) {
        this.name = name;
    }
}
module.exports.Practitioner = Practitioner;

function HumanName(text, use) {
    this.text = text;
    this.use = use;
}
module.exports.HumanName = HumanName;

function Specimen(id, subject, type, collectedDateTime, containerType) {
    this.resourceType = 'Specimen';
    this._id = id || '';
    this.type = type;
    this.subject = subject || new ReferenceResource();
    this.collection = {};
    this.collection.collectedDateTime = collectedDateTime;
    if (nullchecker.isNotNullish(containerType)) {
        this.container = {};
        this.container.type = containerType;
    }
}
module.exports.Specimen = Specimen;

function Observation(id, name, status, reliability, valueX, x) {
    this.resourceType = 'Observation';
    this._id = id || '';
    this.name = name;
    this.status = status;
    this.reliability = reliability;
    this['value' + (x || 'String')] = valueX;
}
module.exports.Observation = Observation;

function Quantity(value, units, code, system, comparator) {
    this.value = parseFloat(value);
    this.units = units;
    this.code = code;
    this.system = system;
    this.comparator = comparator;
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

function Coding(code, display, system, valueSet, version, primary) {
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
    if (nullchecker.isNotNullish(valueSet)) {
        this.valueSet = valueSet;
    }
}
module.exports.Coding = Coding;

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

function Identifier(value, system, use, label, assigner, period) {
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
module.exports.Identifier = Identifier;

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

function Link(href, rel) {
    this.rel = rel;
    this.href = href;
}
module.exports.Link = Link;

function Author(name, uri) {
    this.name = name || constants.application.APP_NAME;
    this.uri = uri || constants.application.APP_URI;
}
module.exports.Author = Author;

function Entry(content, title, id, link, author, updated, published) {
    this.title = title || '';
    this.id = id || '';
    this.link = link || [];
    this.updated = updated;
    this.published = published;
    this.author = author || [];
    this.content = content;
}
module.exports.Entry = Entry;

function Order(id, dateTime) {
    this.resourceType = 'Order';
    this._id = id || '';
    this.date = dateTime;
}
module.exports.Order = Order;

function DiagnosticOrder(id, subject, status, orderer, items) {
    this.resourceType = 'DiagnosticOrder';
    this._id = id || '';
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
    this._id = id || '';
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

function Medication(id, name, code) {
    this.resourceType = 'Medication';
    this._id = id || '';
    this.name = name;
    this.code = code;
}
module.exports.Medication = Medication;

function Schedule() {}
module.exports.Schedule = Schedule;

function Period(start, end) {
    this.start = start;
    this.end = end;
}
module.exports.Period = Period;
