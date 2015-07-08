'use strict';
var _ = require('underscore');
var LabResultsResource = require('../fhir/diagnosticReport/labresultResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');
var input = require('./input-data/labresultResource-in.js');

describe('Lab Results FHIR Resource', function() {
    var req = {
        '_pid': '9E7A;253',
        originalUrl: '/fhir/diagnosticreport?subject.identifier=9E7A;253&domain=lab',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };

    var vprLabResults = input.inputValue.data.items;
    var fhirLabResults = LabResultsResource.convertToFhir(input.inputValue, req);

    it('verifies that given a valid VPR Lab Results Resource converts to a defined FHIR Lab Results Resource object', function() {
        expect(fhirLabResults).toBeDefined();
    });

    _.each(vprLabResults, function(vprLR) {
        it('verifies that each VPR Lab Results Resource has a coresponding FHIR Lab Results Resource in the collection with the same uid', function() {
            var sep = ':';
            var status = {
                'completed': 'final'
            };
            var cat = vprLR.categoryCode.split(sep)[3];
            var fhirLR = _.find(fhirLabResults, function(rr) {
                return rr.identifier.value === vprLR.uid;
            });

            expect(fhirLR).toBeDefined();
            if (fhirLR !== undefined) {
                describe('found FHIR Lab Result (' + vprLR.uid + ') coresponds to the original VPR Lab Result Resource', function() {
                    var specimen, observation;

                    describe('extensions', function() {
                        if (vprLR.groupName !== undefined) {
                            it('verifies that the group name information from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                                var groupName = _.find(fhirLR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/lab#groupName';
                                });
                                expect(groupName.valueString).toEqual(vprLR.groupName);
                            });
                        }

                        if (vprLR.groupUid !== undefined) {
                            it('verifies that the group uid from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                                var groupUid = _.find(fhirLR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/lab#groupUid';
                                });
                                expect(groupUid.valueString).toEqual(vprLR.groupUid);
                            });
                        }

                        it('verifies that the local Id from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                            var localId = _.find(fhirLR.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/lab#localId';
                            });
                            expect(localId.valueString).toEqual(vprLR.localId);
                        });
                    });

                    describe('Contained Resources', function() {
                        it('verifies that the Organization from the VPR LabResults Resource exists in the contained resources from the FHIR LabResults', function() {
                            var resOrganization = _.find(fhirLR.contained, function(res) {
                                return res.resourceType === 'Organization';
                            });
                            expect(resOrganization).toBeDefined();
                            //expect(resOrganization).toEqual({});
                            if (resOrganization !== undefined && vprLR.facilityName !== undefined || vprLR.facilityCode !== undefined) {
                                expect(resOrganization._id).toBeDefined();
                                expect(resOrganization.identifier[0].label).toEqual('facility-code');
                                expect(resOrganization.identifier[0].value).toEqual(vprLR.facilityCode);
                                if (vprLR.comment !== undefined) {
                                    var comments = vprLR.comment.split('\r\n');
                                    //var ordDate = comments[0].split('Report Released Date/Time:');
                                    if (comments[1] !== undefined) {
                                        expect(resOrganization.name).toEqual(comments[1].split('Performing Lab: ')[1]);
                                        expect(resOrganization.address[0].text.trim()).toEqual(comments[2].trim());
                                    } else {
                                        expect(resOrganization.name).toEqual(vprLR.facilityName);
                                    }
                                }
                            }
                        });

                        it('verifies that the Specimen from the VPR LabResults Resource exists in the contained resources from the FHIR LabResults', function() {

                            var resSpecimen = _.find(fhirLR.contained, function(res) {
                                return res.resourceType === 'Specimen';
                            });
                            expect(resSpecimen).toBeDefined();
                            specimen = resSpecimen;
                            if (resSpecimen !== undefined) {
                                expect(resSpecimen._id).toBeDefined();
                                expect(resSpecimen.type.text).toEqual(vprLR.specimen);
                                expect(resSpecimen.subject.reference).toBeDefined();
                                expect(resSpecimen.collection.collectedDateTime).toEqual(fhirUtils.convertToFhirDateTime(vprLR.observed));
                            }
                        });

                        it('verifies that the Observation from the VPR LabResults Resource exists in the contained resources from the FHIR LabResults', function() {

                            var resObservation = _.find(fhirLR.contained, function(res) {
                                return res.resourceType === 'Observation';
                            });
                            observation = resObservation;

                            var intCodes = {
                                'urn:hl7:observation-interpretation:LL': 'LL',
                                'urn:hl7:observation-interpretation:L': 'L',
                                'urn:hl7:observation-interpretation:HH': 'HH',
                                'urn:hl7:observation-interpretation:H': 'H',
                                undefined: 'N'
                            };
                            //expect(resObservation).toBeDefined();

                            var obsCode = vprLR.typeCode;
                            var obsDisplay = vprLR.typeName;
                            var obsSystem = 'urn:oid:2.16.840.1.113883.4.642.2.58';

                            if (cat === 'MI') {
                                obsSystem = resObservation.name.coding[0].system;
                                if (obsSystem === 'http://snomed.org/sct') {
                                    obsCode = '252390002';
                                    obsDisplay = 'Culture and Susceptibility';
                                    _.each(vprLR.organisms, function(organ) {
                                        _.each(organ.drugs, function(vprDrug) {
                                            var fhirObs = _.find(fhirLR.contained, function(obs) {
                                                return obs.resourceType === 'Observation' && obs.name.text.indexOf(organ.name) > -1 && obs.name.text.indexOf(vprDrug.name) > -1;
                                            });
                                            var txt = organ.name + ' (' + organ.qty + ') DRUG=' + vprDrug.name;
                                            txt += ' INTERP=' + vprDrug.interp + ' RESULT=' + vprDrug.result;
                                            expect(fhirObs.name.text).toEqual(txt);
                                            expect(fhirObs.name.coding[0].system).toEqual(obsSystem);
                                            expect(fhirObs.name.coding[0].code).toEqual(obsCode);
                                            expect(fhirObs.name.coding[0].display).toEqual(obsDisplay);
                                        });
                                    });
                                } else if (obsSystem === 'http://loinc.org') {
                                    obsCode = '664-3';
                                    obsDisplay = 'Microscopic observation [Identifier] in Unspecified specimen by Gram stain';
                                    _.each(vprLR.gramStain, function(gram) {
                                        var fhirObs = _.find(fhirLR.contained, function(obs) {
                                            return obs.resourceType === 'Observation' && obs.valueString === gram.result;
                                        });
                                        expect(fhirObs.valueString).toEqual(gram.result);
                                        expect(fhirObs.name.coding[0].system).toEqual(obsSystem);
                                        expect(fhirObs.name.coding[0].code).toEqual(obsCode);
                                        expect(fhirObs.name.coding[0].display).toEqual(obsDisplay);
                                    });
                                }
                                expect(resObservation.name.coding[0].system).toEqual(obsSystem);
                                expect(resObservation.name.coding[0].code).toEqual(obsCode);
                                expect(resObservation.name.coding[0].display).toEqual(obsDisplay);
                            } else {
                                if (cat === 'CH') {
                                    expect(resObservation.valueQuantity.value + '').toEqual(vprLR.result);
                                    expect(resObservation.valueQuantity.units).toEqual(vprLR.units);
                                    expect(resObservation.interpretation.coding[0].system).toEqual('http://hl7.org/fhir/vs/observation-interpretation');
                                    expect(resObservation.interpretation.coding[0].code).toEqual(intCodes[vprLR.interpretationCode]);
                                    expect(resObservation.status).toEqual(status[vprLR.statusName]);
                                    expect(resObservation.reliability).toEqual('ok');
                                    expect(resObservation.specimen.reference).toEqual('#' + specimen._id);
                                    if (vprLR.low !== undefined) {
                                        expect(resObservation.referenceRange[0].low.value + '').toEqual(vprLR.low);
                                        expect(resObservation.referenceRange[0].low.units).toEqual(vprLR.units);
                                    }
                                    if (vprLR.high !== undefined) {
                                        expect(resObservation.referenceRange[0].high.value + '').toEqual(vprLR.high);
                                        expect(resObservation.referenceRange[0].high.units).toEqual(vprLR.units);
                                    }
                                } else if (cat === 'AP') {
                                    expect(resObservation.valueString).toEqual(vprLR.result);
                                    expect(resObservation.status).toEqual(status[vprLR.statusName]);
                                    expect(resObservation.reliability).toEqual('ok');
                                    expect(resObservation.specimen.reference).toEqual('#' + specimen._id);
                                    expect(resObservation.specimen.display).toEqual(vprLR.specimen);
                                }
                                var index = 0;
                                if (vprLR.vuid !== undefined) {
                                    expect(resObservation.name.coding[index].system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                                    expect(resObservation.name.coding[index].code).toEqual(vprLR.vuid);
                                    expect(resObservation.name.coding[index].display).toEqual(obsDisplay);
                                    index = 1;
                                }
                                if (obsSystem && obsCode && obsDisplay !== undefined) {
                                    expect(resObservation.name.coding[index].system).toEqual(obsSystem);
                                    expect(resObservation.name.coding[index].code).toEqual(obsCode);
                                    expect(resObservation.name.coding[index].display).toEqual(obsDisplay);
                                }
                            }
                        });
                    });

                    it('verifies that the typeName from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                        if (cat === 'CH' || cat === 'MI') {
                            expect(fhirLR.name.text).toEqual(vprLR.typeName);
                        } else if (cat === 'CY' || cat === 'EM' || cat === 'SP') {
                            if (vprLR.results !== undefined && vprLR.results[0] !== undefined) {
                                expect(fhirLR.name.text).toEqual(vprLR.results[0].localTitle);
                            } else {
                                expect(fhirLR.name.text).toEqual(vprLR.typeName);
                            }
                        } else if (cat === 'AP') {
                            expect(fhirLR.name.text).toEqual('LR ANATOMIC PATHOLOGY REPORT');
                        }
                    });

                    it('verifies that the vuid field from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                        var ind = 0;
                        if (vprLR.vuid !== undefined) {
                            expect(fhirLR.name.coding[ind].system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                            expect(fhirLR.name.coding[ind].code).toEqual(vprLR.vuid);
                            expect(fhirLR.name.coding[ind].display).toEqual(vprLR.typeName);
                            ind = 1;
                        }
                        if (vprLR.typeCode && vprLR.typeName !== undefined) {
                            expect(fhirLR.name.coding[ind].system).toEqual('urn:oid:2.16.840.1.113883.4.642.2.58');
                            expect(fhirLR.name.coding[ind].code).toEqual(vprLR.typeCode);
                            expect(fhirLR.name.coding[ind].display).toEqual(vprLR.typeName);
                        }
                    });

                    it('verifies that the status from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                        expect(fhirLR.status).toEqual(status[vprLR.statusName]);
                    });

                    it('verifies that the summary from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                        if (vprLR.summary !== undefined && cat !== 'CH' && cat !== 'MI') {
                            expect(fhirLR.text.div).toEqual('<div>' + vprLR.summary + '</div>');
                        }
                    });

                    it('verifies that the identifier from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                        expect(fhirLR.identifier.system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                        expect(fhirLR.identifier.value).toEqual(vprLR.uid);
                    });

                    var categories = {
                        'CH': ['CH', 'Chemistry'],
                        'CY': ['CP', 'Cytopathology'],
                        'EM': ['OTH', 'Other'],
                        'MI': ['MB', 'Microbiology'],
                        'SP': ['SP', 'Surgical Pathology'],
                        'AP': ['OTH', 'Other']
                    };

                    it('verifies that the serviceCategory from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                        expect(fhirLR.serviceCategory.coding[0].system).toEqual('http://hl7.org/fhir/v2/0074');
                        expect(fhirLR.serviceCategory.coding[0].code).toEqual(categories[vprLR.categoryCode.split(sep)[3]][0]);
                        expect(fhirLR.serviceCategory.coding[0].display).toEqual(categories[vprLR.categoryCode.split(sep)[3]][1]);
                    });

                    it('verifies that the issued/diagnostic date from VPR LabResults Resource coresponds to the one from the FHIR LabResults Resource', function() {
                        var rDate = vprLR.resulted === undefined ? vprLR.observed : vprLR.resulted;
                        var oDate = vprLR.observed === undefined ? vprLR.resulted : vprLR.observed;
                        expect(fhirLR.issued).toEqual(fhirUtils.convertToFhirDateTime(rDate));
                        expect(fhirLR.diagnosticDateTime).toEqual(fhirUtils.convertToFhirDateTime(oDate));
                    });

                    it('verifies that the observation/specimen references exists', function() {
                        _.each(fhirLR.contained, function(obs) {
                            if (obs.resourceType === 'Observation') {
                                var resultObservation = _.find(fhirLR.result, function(res) {
                                    return res.reference === '#' + obs._id;
                                });
                                expect(resultObservation).toBeDefined();
                            } else if (obs.resourceType === 'Specimen') {
                                var resultSpecimen = _.find(fhirLR.specimen, function(res) {
                                    return res.reference === '#' + obs._id;
                                });
                                expect(resultSpecimen).toBeDefined();
                            }
                        });
                    });
                });
            }
        });
    });
});
