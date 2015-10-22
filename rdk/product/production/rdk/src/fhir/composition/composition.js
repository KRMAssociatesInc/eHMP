'use strict';

/**
 * Composition - FHIR DSTU2 mapping.
 *
 * source: http://www.hl7.org/FHIR/2015May/composition.html
 */

var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var helpers = require('../common/utils/helpers.js');
var fhirResource = require('../common/entities/fhir-resource');
var fhirUtils = require('../common/utils/fhir-converter');
var constants = require('../common/utils/constants');


var jdsToFHIRStatusMap = {
    ACTIVE: 'preliminary',
    COMPLETED: 'final',
    'N/A': 'appended',
    AMENDED: 'amended',
    RETRACTED: 'retracted',
    DRAFT: 'preliminary',
    get: function(jdsStatus) {
        return this[jdsStatus];
    }
};

function convertToFhir(result, req) {
    var link = [new fhirResource.Link(req.protocol + '://' + req.headers.host + req.originalUrl, 'self')];
    var entry = [];
    var items = result.data.items;
    _.forEach(items, function(item) {
        entry.push(new fhirResource.Entry(convertToComposition(item, req)));
    });
    return new fhirResource.Bundle2(link, entry, result.data.totalItems);
}

function buildAttester(clinicians) {
    if (nullchecker.isNullish(clinicians)) {
        return undefined;
    }
    var attesters = [];
    _.forEach(clinicians, function(clinician, index) {
        // Include only clinicians in a signer role (e.g. signer (S) or cosigner (C))
        if (clinician.role === 'S' || clinician.role === 'C') {
            var attester = {
                mode: ['professional'],
                party: new fhirResource.ReferenceResource('Provider/' + clinician.uid),
                extension: [
                    createExtension('clinicians[' + index + '].role', clinician.role, 'String')
                ]
            };
            if (nullchecker.isNotNullish(clinician.signedDateTime)) {
                attester.time = fhirUtils.convertToFhirDateTime(clinician.signedDateTime);
            }
            attesters.push(attester);
        }
    });
    return attesters.length > 0 ? attesters : undefined;
}

function createCustodianOrganization(name, code) {
    var org = new fhirResource.Organization(helpers.generateUUID());
    org.identifier = new fhirResource.Identifier(code, constants.composition.COMPOSITION_UID_IDENTIFIER_SYSTEM);
    org.name = name;
    return org;
}

function setCustodian(fhirItem, jdsItem) {
    var custodian = createCustodianOrganization(jdsItem.facilityName, jdsItem.facilityCode);
    fhirItem.contained.push(custodian);
    fhirItem.custodian = new fhirResource.ReferenceResource('#' + custodian.id);
}

function createSection(text, index, contained) {
    var textPrefix = 'text[' + index + '].';
    var list = new fhirResource.List(helpers.generateUUID(), 'current', 'working', _.escape(text.content));
    var section = {
        code: new fhirResource.CodeableConcept(
            undefined,
            new fhirResource.Coding(text.uid, undefined, constants.composition.COMPOSITION_UID_IDENTIFIER_SYSTEM)),
        content: new fhirResource.ReferenceResource('#' + list.id),
        extension: [
            createExtension(textPrefix + 'author', text.author, 'String'),
            createExtension(textPrefix + 'attending', text.attending, 'String'),
            createExtension(textPrefix + 'attendingDisplayName', text.attendingDisplayName, 'String'),
            createExtension(textPrefix + 'attendingUid', text.attendingUid, 'String'),
            createExtension(textPrefix + 'authorDisplayName', text.authorDisplayName, 'String'),
            createExtension(textPrefix + 'authorUid', text.authorUid, 'String'),
            createExtension(textPrefix + 'dateTime', text.dateTime, 'String'),
            createExtension(textPrefix + 'cosigner', text.cosigner, 'String'),
            createExtension(textPrefix + 'cosignerDisplayName', text.cosignerDisplayName, 'String'),
            createExtension(textPrefix + 'cosignerUid', text.cosignerUid, 'String'),
            createExtension(textPrefix + 'signer', text.signer, 'String'),
            createExtension(textPrefix + 'signerDisplayName', text.signerDisplayName, 'String'),
            createExtension(textPrefix + 'signerUid', text.signerUid, 'String'),
            createExtension(textPrefix + 'status', text.status, 'String'),
            createExtension(textPrefix + 'summary', text.summary, 'String'),
        ]
    };
    contained.push(list);

    _.forEach(text.clinicians, function(clinician, index) {
        var clinicianPrefix = 'clinicians[' + index + '].';
        section.extension.push(createExtension(textPrefix + clinicianPrefix + 'uid', clinician.uid, 'String'));
        section.extension.push(createExtension(textPrefix + clinicianPrefix + 'name', clinician.name, 'String'));
        section.extension.push(createExtension(textPrefix + clinicianPrefix + 'role', clinician.role, 'String'));
        section.extension.push(createExtension(textPrefix + clinicianPrefix + 'displayName', clinician.displayName, 'String'));
        section.extension.push(createExtension(textPrefix + clinicianPrefix + 'signature', clinician.signature, 'String'));
        section.extension.push(createExtension(textPrefix + clinicianPrefix + 'signedDateTime', clinician.signedDateTime, 'String'));
        section.extension.push(createExtension(textPrefix + clinicianPrefix + 'summary', clinician.summary, 'String'));

    });
    section.extension = _.compact(section.extension); // remove all null entries
    return section;
}

function createSections(textList, contained) {
    if (nullchecker.isNullish(textList)) {
        return undefined;
    }
    var sections = [];
    _.forEach(textList, function(text, index) {
        sections.push(createSection(text, index, contained));
    });
    return sections;
}

function createExtension(propertyName, valueX, x) {
    if (nullchecker.isNotNullish(valueX)) {
        return new fhirResource.Extension(
            constants.composition.COMPOSITION_EXTENSION_URL_PREFIX + propertyName,
            valueX, x);
    } else {
        return null;
    }
}

function createExtensions(jdsItem) {
    var extensions = [];
    extensions.push(createExtension('attending', jdsItem.attending, 'String'));
    extensions.push(createExtension('attendingDisplayName', jdsItem.attendingDisplayName, 'String'));
    extensions.push(createExtension('attendingDisplayUid', jdsItem.attendingUid, 'String'));
    extensions.push(createExtension('author', jdsItem.author, 'String'));
    extensions.push(createExtension('authorDisplayName', jdsItem.authorDisplayName, 'String'));
    extensions.push(createExtension('cosigner', jdsItem.cosigner, 'String'));
    extensions.push(createExtension('cosignerDateTime', jdsItem.cosignerDateTime, 'String'));
    extensions.push(createExtension('cosignerDisplayName', jdsItem.cosignerDisplayName, 'String'));
    extensions.push(createExtension('cosignerUid', jdsItem.cosignerUid, 'String'));
    extensions.push(createExtension('documentDefUid', jdsItem.documentDefUid, 'String'));
    extensions.push(createExtension('documentDefUidVuid', jdsItem.documentDefUidVuid, 'String'));
    extensions.push(createExtension('documentTypeCode', jdsItem.documentTypeCode, 'String'));
    extensions.push(createExtension('documentTypeName', jdsItem.documentTypeName, 'String'));
    extensions.push(createExtension('dodComplexNoteUri', jdsItem.dodComplexNoteUri, 'String'));
    extensions.push(createExtension('entered', jdsItem.entered, 'String'));
    extensions.push(createExtension('isInterdisciplinary', jdsItem.isInterdisciplinary, 'Boolean'));
    extensions.push(createExtension('interdisciplinaryType', jdsItem.interdisciplinaryType, 'String'));
    extensions.push(createExtension('kind', jdsItem.kind, 'String'));
    if (nullchecker.isNotNullish(jdsItem.nationalTitle)) {
        extensions.push(createExtension('nationalTitle.name', jdsItem.nationalTitle.name, 'String'));
        extensions.push(createExtension('nationalTitle.vuid', jdsItem.nationalTitle.vuid, 'String'));
    }
    extensions.push(createExtension('parentUid', jdsItem.parentUid, 'String'));
    extensions.push(createExtension('referenceDateTime', jdsItem.referenceDateTime, 'String'));
    extensions.push(createExtension('signedDateTime', jdsItem.signedDateTime, 'String'));
    extensions.push(createExtension('signerUid', jdsItem.signerUid, 'String'));
    extensions.push(createExtension('statusDisplayName', jdsItem.statusDisplayName, 'String'));
    extensions.push(createExtension('subject', jdsItem.subject, 'String'));
    extensions.push(createExtension('summary', jdsItem.summary, 'String'));
    extensions.push(createExtension('uidHref', jdsItem.uidHref, 'String'));
    extensions.push(createExtension('urgency', jdsItem.urgency, 'String'));
    return _.compact(extensions); // get rid of all null entries
}

function convertToComposition(jdsItem, req) {
    var pid = req.query['subject.identifier'];

    var fhirItem = new fhirResource.Composition(helpers.generateUUID());
    fhirItem.contained = [];
    fhirItem.identifier = new fhirResource.Identifier(jdsItem.uid, constants.composition.COMPOSITION_UID_IDENTIFIER_SYSTEM);
    fhirItem.date = fhirUtils.convertToFhirDateTime(jdsItem.lastUpdateTime); // REQUIRED
    fhirItem.type = // REQUIRED
        new fhirResource.CodeableConcept(jdsItem.documentTypeName,
            new fhirResource.Coding(jdsItem.documentTypeCode, null, constants.composition.COMPOSITION_UID_IDENTIFIER_SYSTEM));

    if (nullchecker.isNotNullish(jdsItem.documentClass)) {
        fhirItem.class = new fhirResource.CodeableConcept(jdsItem.documentClass);
    }
    if (nullchecker.isNotNullish(jdsItem.localTitle)) {
        fhirItem.title = jdsItem.localTitle;
    }
    fhirItem.status = jdsToFHIRStatusMap.get(jdsItem.status); // REQUIRED
    fhirItem.confidentiality = jdsItem.sensitive ? 'R' : 'N';
    fhirItem.subject = new fhirResource.ReferenceResource('Patient/' + pid); // REQUIRED

    // Some JDS documents have no author, but FHIR DSTU2 requires the author field.
    // In those cases a reference of 'Provider/undefined' will be used (per direction by Jerry Goodnough).
    fhirItem.author = [new fhirResource.ReferenceResource('Provider/' + jdsItem.authorUid)]; // REQUIRED

    if (nullchecker.isNotNullish(jdsItem.clinicians) && jdsItem.clinicians.length > 0) {
        fhirItem.attester = buildAttester(jdsItem.clinicians);
    }
    setCustodian(fhirItem, jdsItem);
    if (nullchecker.isNotNullish(jdsItem.encounterUid)) {
        fhirItem.encounter = new fhirResource.ReferenceResource('Encounter/' + jdsItem.encounterUid, jdsItem.encounterName);
    }
    if (nullchecker.isNotNullish(jdsItem.text) && jdsItem.text.length > 0) {
        fhirItem.section = createSections(jdsItem.text, fhirItem.contained);
    }
    fhirItem.extension = createExtensions(jdsItem);

    return fhirItem;
}

module.exports.convertToFhir = convertToFhir;
module.exports.convertToComposition = convertToComposition;
