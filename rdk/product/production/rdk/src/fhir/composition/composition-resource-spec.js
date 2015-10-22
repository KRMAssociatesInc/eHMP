'use strict';
var _ = require('underscore');
var compositionResource = require('./composition-resource');
var composition = require('./composition');
var fhirUtils = require('../common/utils/fhir-converter');
var constants = require('../common/utils/constants');
var input = require('./composition-resource-spec-data').inputValue;
var singleRecord = input.data.items[0];

var req = {
    '_pid': '9E7A;253',
    query: {
        'subject.identifier': '9E7A;253'
    },
    headers: {
        host: 'localhost:8888'
    },
    protocol: 'http',
    param: function() {
        return '9E7A;253';
    },
    originalUrl: '/fhir/composition?subject.identifier=9E7A;253'
};

function getClinicianExtension(extensions, uid, prop) {
    var uidRegexp = new RegExp('clinicians\\[(\\d+)\\]\\.uid');
    var uidEntry = _.find(extensions, function(ext) {
        return uidRegexp.test(ext.url);
    });
    // exec returns an array with the whole match string, and matches for what's on the parenthesis. We want the index.
    var idx = uidRegexp.exec(uidEntry.url)[1];

    // now that we have the index we can build a regex for the corresponding clinicians entry for the desired property.
    var regexp = new RegExp('clinicians\\[' + idx + '\\]\\.' + prop);
    return _.find(extensions, function(ext) {
        return regexp.test(ext.url);
    });
}

function testClinicianExtension(extensions, uid, prop, value) {
    var ext = getClinicianExtension(extensions, uid, prop);
    expect(ext).to.not.be.undefined();
    expect(ext.valueString).to.equal(value);
}

function statusToFhirStatus(status) {
    var jdsRecord = _.clone(singleRecord);
    jdsRecord.status = status;
    return composition.convertToComposition(jdsRecord, req).status;
}

function sensitiveToConfidentiality(sensitive) {
    var jdsRecord = _.clone(singleRecord);
    jdsRecord.sensitive = sensitive;
    return composition.convertToComposition(jdsRecord, req).confidentiality;
}

describe('Composition FHIR Resource', function() {
    it('Verifies that resource is configured correctly', function() {
        var config = compositionResource.getResourceConfig()[0];
        var params = config.parameters;
        expect(params.get).to.not.be.undefined();
        expect(params.get['subject.identifier']).to.not.be.undefined();
        expect(params.get['subject.identifier'].required).to.be.truthy();
        expect(params.get.type).to.not.be.undefined();
        expect(params.get.type.required).to.be.falsy();
        expect(params.get.start).to.not.be.undefined();
        expect(params.get.start.required).to.be.falsy();
        expect(params.get.limit).to.not.be.undefined();
        expect(params.get.limit.required).to.be.falsy();
    });
});

describe('Composition FHIR conversion methods', function() {
    var vprDocuments = input.data.items;
    var fhirBundle = composition.convertToFhir(input, req);
    var fhirCompositions = fhirBundle.entry;

    it('bundle results correctly', function() {
        expect(fhirBundle.resourceType).to.equal('Bundle');
        expect(fhirBundle.type).to.equal('collection');
        expect(fhirBundle.id).to.not.be.undefined();
        expect(fhirBundle.link).to.not.be.undefined();
        expect(fhirBundle.link.length).to.equal(1);
        expect(fhirBundle.link[0].relation).to.equal('self');
        expect(fhirBundle.link[0].url).to.equal('http://localhost:8888/fhir/composition?subject.identifier=9E7A;253');
        expect(fhirBundle.total).to.equal(99);
        expect(fhirBundle.entry).to.not.be.undefined();
        expect(fhirBundle.entry.length).to.equal(2);
    });

    _.each(vprDocuments, function(vprDoc) {
        describe(':: Composition ::', function() {
            var entry = _.find(fhirCompositions, function(doc) {
                return doc.resource.identifier.value === vprDoc.uid;
            });
            expect(entry).not.to.be.undefined();
            var fhirItem = entry.resource;
            expect(fhirItem).not.to.be.undefined();

            it('sets the id and resourceType correctly', function() {
                expect(fhirItem.resourceType).to.equal('Composition');
                expect(fhirItem.id).to.not.be.undefined();
            });
            it('sets identifier correctly', function() {
                expect(fhirItem.identifier).to.not.be.undefined();
                expect(fhirItem.identifier.value).to.equal(vprDoc.uid);
                expect(fhirItem.identifier.system).to.equal('urn:oid:2.16.840.1.113883.6.233');
            });
            it('sets date correctly', function() {
                expect(fhirItem.date).to.equal(vprDoc.updated);
            });
            it('sets type correctly', function() {
                expect(fhirItem.type).to.not.be.undefined();
                expect(fhirItem.type.coding).to.not.be.undefined();
                expect(fhirItem.type.coding[0].code).to.equal(vprDoc.documentTypeCode);
                expect(fhirItem.type.coding[0].system).to.equal('urn:oid:2.16.840.1.113883.6.233');
                expect(fhirItem.type.text).to.equal(vprDoc.documentTypeName);
            });
            it('sets class correctly', function() {
                expect(fhirItem.class).to.not.be.undefined();
                expect(fhirItem.class.text).to.equal(vprDoc.documentClass);
            });
            it('sets title correctly', function() {
                expect(fhirItem.title).to.equal(vprDoc.localTitle);
            });
            it('maps status correctly', function() {
                expect(statusToFhirStatus('ACTIVE')).to.equal('preliminary');
                expect(statusToFhirStatus('COMPLETED')).to.equal('final');
                expect(statusToFhirStatus('N/A')).to.equal('appended');
                expect(statusToFhirStatus('AMENDED')).to.equal('amended');
                expect(statusToFhirStatus('RETRACTED')).to.equal('retracted');
            });
            it('maps confidentiality correctly', function() {
                expect(sensitiveToConfidentiality(true)).to.equal('R');
                expect(sensitiveToConfidentiality(false)).to.equal('N');
            });
            it('sets subject correctly', function() {
                expect(fhirItem.subject).to.not.be.undefined();
                expect(fhirItem.subject.reference).to.equal('Patient/' + req._pid);
            });
            it('sets author correctly', function() {
                expect(fhirItem.author).to.not.be.undefined();
                expect(fhirItem.author.length).to.equal(1);
                expect(fhirItem.author[0].reference).to.equal('Provider/' + vprDoc.authorUid);
            });
            it('sets attester correctly', function() {
                _.each(vprDoc.clinicians, function(clinician) {
                    var attester = _.find(fhirItem.attester, function(att) {
                        var sameId = att.party.reference === 'Provider/' + clinician.uid;
                        var sameRole = att.extension[0].valueString === clinician.role;
                        return sameId && sameRole;
                    });
                    // Attesters are clinicians in a signer or cosigner role (S and R respectively)
                    if (clinician.role === 'S' || clinician.role === 'C') {
                        expect(attester).to.not.be.undefined(); // expect(attester.party.reference).to.equal('Provider/' + clinician.uid)
                        expect(attester.mode).to.not.be.undefined();
                        expect(attester.mode.length).to.equal(1);
                        expect(attester.mode[0]).to.equal('professional');
                        if (clinician.signedDateTime) {
                            expect(attester.time).to.equal(fhirUtils.convertToFhirDateTime(clinician.signedDateTime));
                        } else {
                            expect(attester.time).to.be.undefined();
                        }
                    } else {
                        expect(attester).to.be.undefined();
                    }
                });
            });
            it('sets custodian correctly', function() {
                expect(fhirItem.custodian).to.not.be.undefined();
                var custodian = _.find(fhirItem.contained, function(resource) {
                    return '#' + resource.id === fhirItem.custodian.reference;
                });
                expect(custodian).to.not.be.undefined();
                expect(custodian.identifier).to.not.be.undefined();
                expect(custodian.identifier.system).to.equal('urn:oid:2.16.840.1.113883.6.233');
                expect(custodian.identifier.value).to.equal(vprDoc.facilityCode);
                expect(custodian.name).to.equal(vprDoc.facilityName);
            });
            it('sets encounter correctly', function() {
                expect(fhirItem.encounter).to.not.be.undefined();
                expect(fhirItem.encounter.reference).to.equal('Encounter/' + vprDoc.encounterUid);
                expect(fhirItem.encounter.display).to.equal(vprDoc.encounterName);
            });
            it('sets section correctly', function() {
                _.each(vprDoc.text, function(text) {
                    var section = _.find(fhirItem.section, function(s) {
                        return s.code.coding[0].code === text.uid;
                    });
                    expect(section).to.not.be.undefined(); // expect(section.code.coding[0].code).to.equal(text.uid)
                    expect(section.code.coding[0].system).to.equal('urn:oid:2.16.840.1.113883.6.233');
                    it('sets section content correctly', function() {
                        var list = _.find(fhirItem.contained, function(resource) {
                            return '#' + resource.id === fhirItem.content.reference;
                        });
                        expect(list).to.not.be.undefined();
                        expect(list.status).to.equal('current');
                        expect(list.mode).to.equal('working');
                        expect(list.text).to.equal('<div>' + _.escape(text.content) + '</div>');
                    });
                    it('sets section extensions correctly', function() {
                        var authorExt = _.find(section.extension, function(ext) {
                            return ext.url === constants.composition.COMPOSITION_EXTENSION_URL_PREFIX + 'author';
                        });
                        expect(authorExt).to.not.be.undefined();
                        expect(authorExt.valueString).to.equal(text.author);

                        it('sets section clinician extensions correctly', function() {
                            _.each(text.clinicians, function(clinician) {
                                testClinicianExtension(section.extension, clinician.uid, 'uid');
                                testClinicianExtension(section.extension, clinician.uid, 'role');
                                testClinicianExtension(section.extension, clinician.uid, 'name');
                            });
                        });
                    });
                });
            });
        });
    });
});
