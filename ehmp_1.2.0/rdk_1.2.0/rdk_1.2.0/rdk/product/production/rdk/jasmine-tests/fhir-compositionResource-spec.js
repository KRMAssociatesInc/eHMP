'use strict';
var _ = require('underscore');
var documentResource = require('../fhir/composition/compositionResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');
var input = require('./input-data/compositionResource-in.js');
var statusNameMap = {
    'ACTIVE': 'PRELIMINARY',
    'COMPLETED': 'FINAL',
    'N/A': 'APPENDED',
    'AMENDED': 'AMENDED',
    'RETRACTED': 'RETRACTED'
};

describe('Document FHIR Resource', function() {
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
        }
    };
    var vprDocuments = input.inputValue.data.items;
    var fhirDocumentsBundle = documentResource.convertToFhir(input.inputValue, req);
    var fhirDocuments = [];
    _.each(fhirDocumentsBundle.entry, function(e) {
        fhirDocuments.push(e.content);
    });
    it('verifies that given a valid VPR Document Resource converts to a defined FHIR Document Resource object', function() {
        expect(fhirDocuments).toBeDefined();
    });
    _.each(vprDocuments, function(vprDoc) {
        it('verifies that each VPR Document Resource has a coresponding FHIR Document Resource in the collection with the same uid', function() {

            var fhirDoc = _.find(fhirDocuments, function(doc) {
                return doc.identifier.value === vprDoc.uid;
            });
            expect(fhirDoc).toBeDefined();
            describe('found FHIR Document coresponds to the original VPR Document Resource - ' + vprDoc.uid, function() {
                it('verifies that the reference date time from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.date).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.referenceDateTime));
                });
                it('verifies that the summary information from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.text.status).toEqual('generated');
                    expect(fhirUtils.removeDivFromText(fhirDoc.text.div)).toEqual(vprDoc.summary);
                });
                it('verifies that the document type from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.type.text).toEqual(vprDoc.documentTypeName);
                    expect(fhirDoc.type.coding[0].system).toEqual('http://loinc.org');
                    expect(fhirDoc.type.coding[0].code).toEqual('34765-8');
                    expect(fhirDoc.type.coding[0].display).toEqual('General medicine Note');
                });
                it('verifies that the document class from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.class.text).toEqual(vprDoc.documentClass);
                });

                it('verifies that the local title from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.title).toEqual(vprDoc.localTitle);
                });

                it('verifies that the status from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.status).toEqual(statusNameMap[vprDoc.status]);
                });

                it('verifies that the confidentiality field Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.confidentiality.system).toEqual('http://hl7.org/fhir/v3/vs/Confidentiality');
                    expect(fhirDoc.confidentiality.code).toEqual('N');
                    expect(fhirDoc.confidentiality.display).toEqual('normal');
                });
                it('verifies that the pid from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.subject.reference).toEqual('Patient/' + vprDoc.pid);
                });
                it('verifies that the clinicians from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    // var vprAuth = _.find(vprDoc.clinicians, function(att) {
                    //     return att.role === 'AU';
                    // });
                    //expect(fhirDoc.author.display).toEqual(vprAuth.name);
                    //expect(fhirDoc.author.reference).toEqual("Practitioner/" + vprAuth.uid);
                    //expect(fhirDoc.author.practitioner.role).toEqual(vprAuth.role);
                });
                it('verifies that the cosigner from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    if (vprDoc.cosignerUid !== undefined) {
                        var cos = _.find(fhirDoc.attester.party, function(c) {
                            return c.resourceType === 'Practitioner';
                        });
                        expect(cos.identifier).toEqual(vprDoc.cosignerUid);
                        var vprAtt = _.find(vprDoc.clinicians, function(att) {
                            return att.role === 'S';
                        });
                        expect(cos.name[0].humanName).toEqual(vprDoc.cosignerDisplayName);
                        expect(fhirDoc.attester.party.display).toEqual(vprAtt.name);
                        expect(fhirDoc.attester.time).toEqual(vprAtt.signedDateTime);
                        expect(fhirDoc.attester.mode).toEqual('professional');
                    }
                });
                it('verifies that the encounterName from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.encounter.display).toEqual(vprDoc.encounterName);
                });
                it('verifies that the local titleVPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.section.title).toEqual(vprDoc.localTitle);
                });
                it('verifies that the localId from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                    expect(fhirDoc.section.code.text).toEqual(vprDoc.localId);
                });
                describe('Contained Resources', function() {
                    it('verifies that the facility from the VPR Document Resource exists in the contained resources from the FHIR Document', function() {
                        var resLocation = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'Organization' && res.identifier[0].value === vprDoc.facilityCode;
                        });
                        expect(resLocation).toBeDefined();
                        expect(resLocation.name).toEqual(vprDoc.facilityName);
                    });
                    it('verifies that the encounter from the VPR Document Resource exists in the contained resources from the FHIR Document', function() {
                        var resEncounter = _.find(fhirDoc.contained, function(res) {
                            return res.resourceType === 'Encounter' && res.identifier[0].value === vprDoc.encounterUid;
                        });
                        expect(resEncounter).toBeDefined();
                        expect(fhirUtils.removeDivFromText(resEncounter.text.div)).toEqual(vprDoc.encounterName);
                        expect(resEncounter.priority.code.text).toEqual(vprDoc.urgency);
                        expect(fhirDoc.encounter.reference).toEqual('Encounter/' + resEncounter._id);
                    });
                    _.each(vprDoc.clinicians, function(clinician) {
                        it('verifies that each clinicians from the VPR Document Resource exists in the contained resources from the FHIR Document', function() {
                            var resPractitioner = _.find(fhirDoc.contained, function(res) {
                                return res.resourceType === 'Practitioner' && res.identifier[0].value === clinician.uid && res.role.code.text === clinician.role;
                            });
                            expect(resPractitioner).toBeDefined();
                            if (resPractitioner !== undefined) {
                                if (clinician.signature !== undefined) {
                                    var signature = _.find(resPractitioner.extension, function(ext) {
                                        return ext.url === 'http://vistacore.us/fhir/profiles#signature';
                                    });
                                    expect(signature.valueString).toEqual(clinician.signature);
                                }
                                if (clinician.signedDateTime !== undefined) {
                                    var signedDate = _.find(resPractitioner.extension, function(ext) {
                                        return ext.url === 'http://vistacore.us/fhir/profiles#signedDateTime';
                                    });
                                    expect(signedDate.valueDateTime).toEqual(fhirUtils.convertToFhirDateTime(clinician.signedDateTime));
                                }
                                if (clinician.summary !== undefined) {
                                    var summary = _.find(resPractitioner.extension, function(ext) {
                                        return ext.url === 'http://vistacore.us/fhir/profiles#summary';
                                    });
                                    expect(summary.valueString).toEqual(clinician.summary);
                                }
                                expect(resPractitioner.name.text).toEqual(clinician.displayName);
                            }
                        });
                    });
                    _.each(vprDoc.text, function(txt) {
                        var resObservation;
                        it('verifies that the content information from the VPR Document Resource exists in the contained resources from the FHIR Document', function() {
                            resObservation = _.find(fhirDoc.contained, function(res) {
                                return res.resourceType === 'Observation' && res.valueString === txt.content;
                            });
                            expect(resObservation).toBeDefined();
                            expect(resObservation._id).toBeDefined();
                            expect(resObservation.text.status).toEqual('generated');
                            expect(fhirUtils.removeDivFromText(resObservation.text.div)).toEqual(txt.content);
                            expect(resObservation.name.text).toEqual(vprDoc.documentTypeName);
                            expect(resObservation.status).toEqual('final');
                            expect(resObservation.reliability).toEqual('ok');
                        });
                        _.each(txt.clinicians, function(clinician) {
                            it('verifies that each clinicians from the VPR Document Resource exists in the contained resources from the FHIR Document', function() {
                                var resPractitioner = _.find(fhirDoc.contained, function(res) {
                                    var aut = _.find(fhirDoc.author, function(au) {
                                        return res.resourceType === 'Practitioner' && au.reference === 'Practitioner/' + res._id;
                                    });
                                    return res.resourceType === 'Practitioner' && aut !== undefined && res.role.code.text === clinician.role;
                                });
                                expect(resPractitioner).toBeDefined();
                                if (resPractitioner !== undefined) {
                                    if (clinician.signature !== undefined) {
                                        var signature = _.find(resPractitioner.extension, function(ext) {
                                            return ext.url === 'http://vistacore.us/fhir/extensions/notes#practitionerSignature';
                                        });
                                        expect(signature.valueString).toEqual(clinician.signature);
                                    }
                                    if (clinician.signedDateTime !== undefined) {
                                        var signedDate = _.find(resPractitioner.extension, function(ext) {
                                            return ext.url === 'http://vistacore.us/fhir/extensions/notes#practitionerSignedDateTime';
                                        });
                                        expect(signedDate.valueDateTime).toEqual(fhirUtils.convertToFhirDateTime(clinician.signedDateTime));
                                    }
                                    if (clinician.summary !== undefined) {
                                        var summary = _.find(resPractitioner.extension, function(ext) {
                                            return ext.url === 'http://vistacore.us/fhir/extensions/notes#documentClinicianSummary';
                                        });
                                        expect(summary.valueString).toEqual(clinician.summary);
                                    }
                                    if (txt.dateTime !== undefined) {
                                        var dateTime = _.find(resPractitioner.extension, function(ext) {
                                            return ext.url === 'http://vistacore.us/fhir/extensions/notes#documentTextDateTime';
                                        });
                                        expect(dateTime.valueDateTime).toEqual(fhirUtils.convertToFhirDateTime(txt.dateTime));
                                    }
                                    var res = _.find(resPractitioner.extension, function(ext) {
                                        return ext.url === 'http://vistacore.us/fhir/extensions/notes#practitionerContent';
                                    });
                                    expect(res.valueResource.reference).toEqual('Observation/' + resObservation._id);
                                    var status = _.find(resPractitioner.extension, function(ext) {
                                        return ext.url === 'http://vistacore.us/fhir/extensions/notes#practitionerStatus';
                                    });
                                    expect(status.valueString).toEqual(txt.status);
                                    var docSumm = _.find(resPractitioner.extension, function(ext) {
                                        return ext.url === 'http://vistacore.us/fhir/extensions/notes#documentTextSummary';
                                    });
                                    expect(docSumm.valueString).toEqual(txt.summary);
                                    expect(resPractitioner.name.text).toEqual(clinician.displayName);
                                }
                            });
                        });
                    });
                });
                describe('extensions', function() {
                    it('verifies that the entered date information from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var entered = _.find(fhirDoc.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/profiles/@main#entered';
                        });
                        expect(entered).toBeDefined();
                        expect(entered.valueDateTime).toEqual(fhirUtils.convertToFhirDateTime(vprDoc.entered));
                    });
                    it('verifies that the document type code from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var docType = _.find(fhirDoc.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/profiles/@main#document-type-code';
                        });
                        expect(docType).toBeDefined();
                        expect(docType.valueString).toEqual(vprDoc.documentTypeCode);
                    });
                    it('verifies that the document type name from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var docTypeName = _.find(fhirDoc.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/profiles/@main#document-type-name';
                        });
                        expect(docTypeName).toBeDefined();
                        expect(docTypeName.valueString).toEqual(vprDoc.documentTypeName);
                    });
                    it('verifies that the interdisciplinary from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var isInter = _.find(fhirDoc.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/profiles#isInterdisciplinary';
                        });
                        expect(isInter).toBeDefined();
                        expect('' + isInter.valueBoolean).toEqual(vprDoc.isInterdisciplinary);
                        if (vprDoc.isInterdisciplinary === true) {
                            var intType = _.find(fhirDoc.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/profiles#interdisciplinaryType';
                            });
                            expect(intType).toBeDefined();
                            expect(intType.valueString).toEqual(vprDoc.interdisciplinaryType);
                        }
                    });
                    it('verifies that the sensitive information from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var sensitive = _.find(fhirDoc.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/profiles#sensitive';
                        });
                        expect(sensitive).toBeDefined();
                        expect(sensitive.valueBoolean).toEqual(vprDoc.sensitive);
                    });
                    it('verifies that the dodComplexNoteUri information from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var dodComplexNoteUri = _.find(fhirDoc.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/notes#dodComplexNoteUri';
                        });
                        expect(dodComplexNoteUri).toBeDefined();
                        expect(dodComplexNoteUri.valueString).toEqual(vprDoc.dodComplexNoteUri);
                    });
                    it('verifies that the subject information from VPR Document Resource coresponds to the one from the FHIR Document Resource', function() {
                        var subject = _.find(fhirDoc.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/notes#subject';
                        });
                        expect(subject).toBeDefined();
                        expect(subject.valueString).toEqual(vprDoc.subject);
                    });
                });

            });
        });

    });

});
