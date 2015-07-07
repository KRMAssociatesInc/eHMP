'use strict';
var _ = require('underscore');
var radiologyreportsResource = require('../fhir/diagnosticReport/radiologyreportResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');

describe('Vitals FHIR Resource', function() {
    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20140930041021,
            'totalItems': 1,
            'currentItemCount': 1,
            'items': [{
                'kind': 'Imaging',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'statusName': 'COMPLETE',
                'imagingTypeUid': 'urn:va:imaging-Type:GENERAL RADIOLOGY',
                'locationUid': 'urn:va:location:9E7A:40',
                'hasImages': false,
                'imageLocation': 'RADIOLOGY MAIN FLOOR',
                'uid': 'urn:va:image:9E7A:253:7059382.8387-1',
                'summary': 'RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS',
                'pid': '9E7A;253',
                'localId': '7059382.8387-1',
                'typeName': 'RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS',
                'dateTime': '199406171612',
                'category': 'RA',
                'reason': '',
                'providers': [{
                    'providerName': 'PROVIDER,FIFTY',
                    'providerDisplayName': 'Provider,Fifty',
                    'summary': 'ProcedureProvider{uid=\'null\'}',
                    'providerUid': 'urn:va:user:9E7A:1595'
                }],
                'providerName': 'PROVIDER,FIFTY',
                'providerDisplayName': 'Provider,Fifty',
                'results': [{
                    'localTitle': 'ANKLE 2 VIEWS',
                    'uid': 'urn:va:document:9E7A:253:7059382.8387-1',
                    'summary': 'ProcedureResult{uid=\'urn:va:document:9E7A:253:7059382.8387-1\'}'
                }],
                'verified': true,
                'name': 'ANKLE 2 VIEWS',
                'diagnosis': [{
                    'code': 'NORMAL',
                    'primary': true
                }],
                'locationName': 'RADIOLOGY MAIN FLOOR',
                'case': 101
            }]
        }
    };
    var req = {
        '_pid': '9E7A;253',
        originalUrl: '/fhir/diagnosticreport?subject.identifier=9E7A;253&domain=rad',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var vprRadilogyReports = inputValue.data.items;
    var fhirRadilogyReports = radiologyreportsResource.convertToFhir(inputValue, req);
    it('verifies that given a valid VPR Radiology Reports Resource converts to a defined FHIR Radiology Reports Resource object', function() {
        expect(fhirRadilogyReports).toBeDefined();
    });
    _.each(vprRadilogyReports, function(vprRR) {
        it('verifies that each VPR Radiology Reports Resource has a coresponding FHIR Radiology Reports Resource in the collection with the same uid', function() {
            //var sep = ':';
            var fhirRR = _.find(fhirRadilogyReports, function(rr) {
                return rr.identifier.value === vprRR.uid;
            });
            expect(fhirRR).toBeDefined();
            if (fhirRR !== undefined) {
                describe('found FHIR Radiology Report coresponds to the original VPR Radiology Report Resource', function() {
                    describe('extensions', function() {
                        if (vprRR.statusName !== undefined) {
                            it('verifies that the exam status information from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var statusName = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#statusName';
                                });
                                expect(statusName.valueString).toEqual(vprRR.statusName);
                            });
                        }
                        if (vprRR.locationUid !== undefined) {
                            it('verifies that the location uid from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var locationUid = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#locationUid';
                                });
                                expect(locationUid.valueString).toEqual(vprRR.locationUid);
                            });
                        }
                        if (vprRR.hasImages !== undefined) {
                            it('verifies that the has image flag from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var hasImages = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#hasImages';
                                });
                                expect(hasImages.valueString > 0).toEqual(vprRR.hasImages);
                            });
                        }
                        if (vprRR.imagingType !== undefined) {
                            it('verifies that the image type from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var imagingType = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#imagingTypeUid';
                                });
                                expect(imagingType.valueString).toEqual(vprRR.imagingTypeUid);
                            });
                        }
                        if (vprRR.locationName !== undefined) {
                            it('verifies that the location name from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var locationName = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#locationName';
                                });
                                expect(locationName.valueString).toEqual(vprRR.locationName);
                            });
                        }
                        if (vprRR.imageLocation !== undefined) {
                            it('verifies that the image location from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var imageLocation = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#imageLocation';
                                });
                                expect(imageLocation.valueString).toEqual(vprRR.imageLocation);
                            });
                        }
                        if (vprRR.localId !== undefined) {
                            it('verifies that the local id from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var localId = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#localId';
                                });
                                expect(localId.valueString).toEqual(vprRR.localId);
                            });
                        }
                        if (vprRR.caseId !== undefined) {
                            it('verifies that the case id from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var caseId = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#case';
                                });
                                expect(caseId.valueString).toEqual(vprRR.case+'');
                            });
                        }
                        if (vprRR.valueString !== undefined) {
                            it('verifies that the verified field from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var verified = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#verified';
                                });
                                expect(verified.valueString).toEqual(vprRR.verified + '');
                            });
                        }
                        if (vprRR.providerUid !== undefined) {
                            it('verifies that the provider uid from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var providerUid = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#providerName';
                                });
                                expect(providerUid.valueString).toEqual(vprRR.providers[0].providerUid);
                            });
                        }
                        if (vprRR.providerName !== undefined) {
                            it('verifies that the provider name from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var providerName = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#providerName';
                                });
                                expect(providerName.valueString).toEqual(vprRR.providerName);
                            });
                        }
                        if (vprRR.primary !== undefined) {
                            it('verifies that the primary field from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                                var primary = _.find(fhirRR.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/rad#primary';
                                });
                                expect(primary.valueString).toEqual(vprRR.diagnosis[0].primary + '');
                            });
                        }
                    });
                    describe('Contained Resources', function() {
                        it('verifies that the Organization from the VPR RadiologyReports Resource exists in the contained resources from the FHIR RadiologyReports', function() {
                            var resOrganization = _.find(fhirRR.contained, function(res) {
                                return res.resourceType === 'Organization';
                            });
                            expect(resOrganization).toBeDefined();
                            if (resOrganization !== undefined && vprRR.facilityName !== undefined || vprRR.facilityCode !== undefined) {
                                expect(resOrganization.identifier).toBeDefined();
                                expect(resOrganization.identifier[0].system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                                expect(resOrganization.identifier[0].value).toEqual(vprRR.facilityCode);
                                expect(resOrganization.name).toEqual(vprRR.facilityName);
                            }
                        });
                        it('verifies that the DiagnosticOrder from the VPR RadiologyReports Resource exists in the contained resources from the FHIR RadiologyReports', function() {
                            var resObservation = _.find(fhirRR.contained, function(res) {
                                return res.resourceType === 'Observation';
                            });
                            expect(resObservation).toBeDefined();
                            expect(resObservation.name.coding[0].system).toEqual('CPT OID: 2.16.840.1.113883.6.12');
                            expect(resObservation.name.coding[0].display).toEqual(vprRR.typeName);
                            expect(resObservation.name.text).toEqual(vprRR.name);
                        });
                    });
                    it('verifies that the name from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.name.text).toEqual(vprRR.name);
                    });
                    it('verifies that the status from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        var statusMap = {
                            'COMPLETE': 'final',
                            'TRANSCRIBED': 'partial',
                            'WAITING FOR EXAM': 'registered',
                            'CANCELLED': 'cancelled',
                            'EXAMINED': 'partial'
                        };
                        expect(fhirRR.status).toEqual(statusMap[vprRR.statusName]);
                    });
                    it('verifies that the issued date from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.issued).toEqual(fhirUtils.convertToFhirDateTime(vprRR.dateTime));
                    });
                    it('verifies that the patient uid from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.subject.display).toEqual(vprRR.pid);
                    });
                    it('verifies that the patient uid from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.subject.display).toEqual(vprRR.pid);
                    });
                    it('verifies that the document uid from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.identifier.system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                        expect(fhirRR.identifier.value).toEqual(vprRR.uid);
                    });
                    it('verifies that the category from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.serviceCategory.coding[0].system).toEqual('http://hl7.org/fhir/v2/0074');
                        expect(fhirRR.serviceCategory.coding[0].code).toEqual('RAD');
                        expect(fhirRR.serviceCategory.coding[0].display).toEqual('Radiology');
                    });
                    it('verifies that the diagnostic dateTime from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.diagnosticDateTime).toEqual(fhirUtils.convertToFhirDateTime(vprRR.dateTime));
                    });
                    it('verifies that the diagnosis code from VPR RadiologyReports Resource coresponds to the one from the FHIR RadiologyReports Resource', function() {
                        expect(fhirRR.codedDiagnosis[0].text).toEqual(vprRR.diagnosis[0].code);
                    });
                });
            }
        });
    });
});
