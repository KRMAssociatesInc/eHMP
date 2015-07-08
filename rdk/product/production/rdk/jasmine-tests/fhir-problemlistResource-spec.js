'use strict';
var _ = require('underscore');
var problemlistResource = require('../fhir/condition/conditionlistResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');

describe('Problem FHIR Resource', function() {
    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20141013091907,
            'totalItems': 10,
            'currentItemCount': 10,
            'items': [{
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'locationName': 'PRIMARY CARE',
                'providerName': 'VEHU,SEVEN',
                'problemText': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                'icdCode': 'urn:icd:250.00',
                'icdName': 'DIABETES MELLI W/O COMP TYP II',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'removed': false,
                'resolved': '20000508',
                'entered': '20000508',
                'updated': '20040331',
                'onset': '20000404',
                'kind': 'Problem',
                'icdGroup': '250',
                'uid': 'urn:va:problem:9E7A:253:182',
                'summary': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                'pid': '9E7A;253',
                'localId': '182',
                'locationDisplayName': 'Primary Care',
                'providerDisplayName': 'Vehu,Seven',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'unverified': false,
                'serviceConnected': false,
                'providerUid': 'urn:va:user:9E7A:20008',
                'locationUid': 'urn:va:location:9E7A:32'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'locationName': 'GENERAL MEDICINE',
                'providerName': 'LABTECH,SPECIAL',
                'problemText': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                'icdCode': 'urn:icd:428.22',
                'icdName': 'CHRONIC SYSTOLIC HEART FAILURE',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'removed': false,
                'entered': '20040309',
                'updated': '20040309',
                'onset': '20040309',
                'kind': 'Problem',
                'icdGroup': '428',
                'uid': 'urn:va:problem:9E7A:253:322',
                'summary': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                'pid': '9E7A;253',
                'localId': '322',
                'locationDisplayName': 'General Medicine',
                'providerDisplayName': 'Labtech,Special',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'unverified': false,
                'serviceConnected': false,
                'codes': [{
                    'code': '441481004',
                    'system': 'http://snomed.info/sct',
                    'display': 'Chronic systolic heart failure (disorder)'
                }],
                'comments': [{
                    'entered': '19960514',
                    'enteredByName': 'PROGRAMMER,TWENTY',
                    'enteredByCode': 'urn:va:user:ABCD:755',
                    'comment': 'SHERIDAN PROBLEM',
                    'summary': 'ProblemComment{uid="null"}'
                }],
                'providerUid': 'urn:va:user:9E7A:11745',
                'locationUid': 'urn:va:location:9E7A:23'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'locationName': 'GENERAL MEDICINE',
                'providerName': 'VEHU,SEVEN',
                'problemText': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                'icdCode': 'urn:icd:410.90',
                'icdName': 'AMI NOS, UNSPECIFIED',
                'removed': false,
                'entered': '20050317',
                'updated': '20050317',
                'onset': '20050317',
                'kind': 'Problem',
                'icdGroup': '410',
                'uid': 'urn:va:problem:9E7A:253:498',
                'summary': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                'pid': '9E7A;253',
                'localId': '498',
                'locationDisplayName': 'General Medicine',
                'providerDisplayName': 'Vehu,Seven',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'unverified': false,
                'serviceConnected': false,
                'providerUid': 'urn:va:user:9E7A:20008',
                'locationUid': 'urn:va:location:9E7A:23'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'service': 'MEDICAL',
                'providerName': 'VEHU,ONEHUNDRED',
                'problemText': 'Hypertension (ICD-9-CM 401.9)',
                'icdCode': 'urn:icd:401.9',
                'icdName': 'HYPERTENSION NOS',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'entered': '20070410',
                'updated': '20070410',
                'onset': '20050407',
                'kind': 'Problem',
                'icdGroup': '401',
                'uid': 'urn:va:problem:9E7A:253:663',
                'summary': 'Hypertension (ICD-9-CM 401.9)',
                'pid': '9E7A;253',
                'localId': '663',
                'providerDisplayName': 'Vehu,Onehundred',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'serviceConnected': false,
                'codes': [{
                    'code': '59621000',
                    'system': 'http://snomed.info/sct',
                    'display': 'Essential hypertension (disorder)'
                }],
                'comments': [{
                    'entered': '19960514',
                    'enteredByName': 'PROGRAMMER,TWENTY',
                    'enteredByCode': 'urn:va:user:ABCD:755',
                    'comment': 'SHERIDAN PROBLEM',
                    'summary': 'ProblemComment{uid="null"}'
                }],
                'providerUid': 'urn:va:user:9E7A:10000000031'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'service': 'MEDICAL',
                'providerName': 'VEHU,ONEHUNDRED',
                'problemText': 'Hyperlipidemia (ICD-9-CM 272.4)',
                'icdCode': 'urn:icd:272.4',
                'icdName': 'HYPERLIPIDEMIA NEC/NOS',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'entered': '20070410',
                'updated': '20070410',
                'onset': '20050407',
                'kind': 'Problem',
                'icdGroup': '272',
                'uid': 'urn:va:problem:9E7A:253:783',
                'summary': 'Hyperlipidemia (ICD-9-CM 272.4)',
                'pid': '9E7A;253',
                'localId': '783',
                'providerDisplayName': 'Vehu,Onehundred',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'serviceConnected': false,
                'providerUid': 'urn:va:user:9E7A:10000000031'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'locationName': 'PRIMARY CARE',
                'providerName': 'VEHU,SEVEN',
                'problemText': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                'icdCode': 'urn:icd:250.00',
                'icdName': 'DIABETES MELLI W/O COMP TYP II',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'removed': false,
                'entered': '20000508',
                'updated': '20040331',
                'onset': '20000404',
                'kind': 'Problem',
                'icdGroup': '250',
                'uid': 'urn:va:problem:C877:253:182',
                'summary': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                'pid': '9E7A;253',
                'localId': '182',
                'locationDisplayName': 'Primary Care',
                'providerDisplayName': 'Vehu,Seven',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'unverified': false,
                'serviceConnected': false,
                'providerUid': 'urn:va:user:C877:20008',
                'locationUid': 'urn:va:location:C877:32'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'locationName': 'GENERAL MEDICINE',
                'providerName': 'LABTECH,SPECIAL',
                'problemText': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                'icdCode': 'urn:icd:428.22',
                'icdName': 'CHRONIC SYSTOLIC HEART FAILURE',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'removed': false,
                'entered': '20040309',
                'updated': '20040309',
                'onset': '20040309',
                'kind': 'Problem',
                'icdGroup': '428',
                'uid': 'urn:va:problem:C877:253:322',
                'summary': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                'pid': '9E7A;253',
                'localId': '322',
                'locationDisplayName': 'General Medicine',
                'providerDisplayName': 'Labtech,Special',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'unverified': false,
                'serviceConnected': false,
                'codes': [{
                    'code': '441481004',
                    'system': 'http://snomed.info/sct',
                    'display': 'Chronic systolic heart failure (disorder)'
                }],
                'comments': [{
                    'entered': '19960514',
                    'enteredByName': 'PROGRAMMER,TWENTY',
                    'enteredByCode': 'urn:va:user:ABCD:755',
                    'comment': 'SHERIDAN PROBLEM',
                    'summary': 'ProblemComment{uid="null"}'
                }],
                'providerUid': 'urn:va:user:C877:11745',
                'locationUid': 'urn:va:location:C877:23'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'locationName': 'GENERAL MEDICINE',
                'providerName': 'VEHU,SEVEN',
                'problemText': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                'icdCode': 'urn:icd:410.90',
                'icdName': 'AMI NOS, UNSPECIFIED',
                'removed': false,
                'entered': '20050317',
                'updated': '20050317',
                'onset': '20050317',
                'kind': 'Problem',
                'icdGroup': '410',
                'uid': 'urn:va:problem:C877:253:498',
                'summary': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                'pid': '9E7A;253',
                'localId': '498',
                'locationDisplayName': 'General Medicine',
                'providerDisplayName': 'Vehu,Seven',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'unverified': false,
                'serviceConnected': false,
                'providerUid': 'urn:va:user:C877:20008',
                'locationUid': 'urn:va:location:C877:23'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'service': 'MEDICAL',
                'providerName': 'VEHU,ONEHUNDRED',
                'problemText': 'Hypertension (ICD-9-CM 401.9)',
                'icdCode': 'urn:icd:401.9',
                'icdName': 'HYPERTENSION NOS',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'entered': '20070410',
                'updated': '20070410',
                'onset': '20050407',
                'kind': 'Problem',
                'icdGroup': '401',
                'uid': 'urn:va:problem:C877:253:663',
                'summary': 'Hypertension (ICD-9-CM 401.9)',
                'pid': '9E7A;253',
                'localId': '663',
                'providerDisplayName': 'Vehu,Onehundred',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'serviceConnected': false,
                'codes': [{
                    'code': '59621000',
                    'system': 'http://snomed.info/sct',
                    'display': 'Essential hypertension (disorder)'
                }],
                'comments': [{
                    'entered': '19960514',
                    'enteredByName': 'PROGRAMMER,TWENTY',
                    'enteredByCode': 'urn:va:user:ABCD:755',
                    'comment': 'SHERIDAN PROBLEM',
                    'summary': 'ProblemComment{uid="null"}'
                }],
                'providerUid': 'urn:va:user:C877:10000000031'
            }, {
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'service': 'MEDICAL',
                'providerName': 'VEHU,ONEHUNDRED',
                'problemText': 'Hyperlipidemia (ICD-9-CM 272.4)',
                'icdCode': 'urn:icd:272.4',
                'icdName': 'HYPERLIPIDEMIA NEC/NOS',
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'entered': '20070410',
                'updated': '20070410',
                'onset': '20050407',
                'kind': 'Problem',
                'icdGroup': '272',
                'uid': 'urn:va:problem:C877:253:783',
                'summary': 'Hyperlipidemia (ICD-9-CM 272.4)',
                'pid': '9E7A;253',
                'localId': '783',
                'providerDisplayName': 'Vehu,Onehundred',
                'statusCode': 'urn:sct:55561003',
                'statusName': 'ACTIVE',
                'statusDisplayName': 'Active',
                'serviceConnected': false,
                'providerUid': 'urn:va:user:C877:10000000031'
            }]
        }
    };
    var req = {
        query: {
            'subject.identifier': '9E7A;253'
        },
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var vprProblemList = inputValue.data.items;
    var fhirProblemList = problemlistResource.convertToFhir(inputValue, req);
    //console.log(JSON.stringify(fhirProblemList));
    it('verifies that given a valid VPR ProblemList Resource converts to a defined FHIR ProblemList Resource object', function() {
        expect(fhirProblemList).toBeDefined();
    });
    _.each(vprProblemList, function(vprP) {
        it('verifies that each VPR Problem Resource has a coresponding FHIR Problem Resource in the collection with the same uid', function() {
            var fhirP = _.filter(fhirProblemList, function(p) {
                return p._id === vprP.uid;
            })[0];
            expect(fhirP).toBeDefined();
            expect(fhirP.status).toEqual('confirmed');
            if (fhirP !== undefined) {
                describe('found FHIR Problem coresponds to the original VPR Problem Resource - uid: ' + vprP.uid, function() {
                    it('verifies that the kind information from VPR Problem Resource coresponds to the category code from the FHIR Problem Resource', function() {
                        expect(fhirP.category.coding[0].code).toEqual('diagnosis');
                        expect(fhirP.category.coding[0].system).toEqual('2.16.840.1.113883.4.642.2.224');
                    });
                    it('verifies that the summary information from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.stage.summary).toEqual(vprP.summary);
                    });
                    it('verifies that the patient id from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.subject.reference).toEqual(vprP.pid);
                    });
                    describe('Contained Resources', function() {
                        it('verifies that the facility from the VPR Problem Resource exists in the contained resources from the FHIR Problem', function() {
                            var resEncounter = _.find(fhirP.contained, function(res) {
                                return res.resourceType === 'Encounter';
                            });
                            expect(resEncounter).toBeDefined();
                            if (resEncounter !== undefined && vprP.facilityName !== undefined || vprP.facilityCode !== undefined) {
                                expect(resEncounter.text.status).toEqual('generated');
                                expect(resEncounter.text.div).toEqual('<div>Encounter with patient 9E7A;253</div>');
                                expect(resEncounter.location[0].resourceType).toEqual('Location');
                                expect(resEncounter.location[0].identifier.value).toEqual(vprP.facilityCode);
                                expect(resEncounter.location[0].Name).toEqual(vprP.facilityName);
                                expect(resEncounter.location[0].identifier.system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                            }
                        });
                        if (vprP.providerUid !== undefined || vprP.providerName !== undefined) {
                            it('verifies that the practitioner from the VPR Problem Resource exists in the contained resources from the FHIR Problem', function() {
                                var resPractitioner = _.find(fhirP.contained, function(res) {
                                    return res.resourceType === 'Practitioner';
                                });
                                expect(resPractitioner).toBeDefined();
                                if (resPractitioner !== undefined) {
                                    expect(resPractitioner.resourceType).toEqual('Practitioner');
                                    expect(resPractitioner.identifier.system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                                    expect(resPractitioner.identifier.value).toEqual(vprP.providerUid);
                                    expect(resPractitioner.name).toEqual(vprP.providerName);
                                }
                                expect(fhirP.asserter.reference).toEqual('#' + resPractitioner._id);
                                expect(fhirP.asserter.display).toEqual(vprP.providerName);
                            });
                        }
                    });
                    it('verifies that the icd code and name information from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.code.coding[0].code).toEqual(vprP.icdCode);
                        expect(fhirP.code.coding[0].display).toEqual(vprP.icdName);
                    });
                    describe('extensions', function() {
                        if (vprP.statusCode !== undefined) {
                            it('verifies that the status code from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var statusCode = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#statusCode';
                                });
                                expect(statusCode.valueString).toEqual(vprP.statusCode);
                            });
                        }
                        if (vprP.statusName !== undefined) {
                            it('verifies that the status name from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var statusName = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#statusName';
                                });
                                expect(statusName.valueString).toEqual(vprP.statusName);
                            });
                        }
                        if (vprP.statusName !== undefined) {
                            it('verifies that the status display name from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var statusDisplayName = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#statusDisplayName';
                                });
                                expect(statusDisplayName.valueString).toEqual(vprP.statusDisplayName);
                            });
                        }
                        if (vprP.serviceConnected !== undefined) {
                            it('verifies that the service conected flag from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var serviceConnected = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#serviceConnected';
                                });
                                expect(serviceConnected.valueBoolean).toEqual(vprP.serviceConnected);
                            });
                        }
                        if (vprP.service !== undefined) {
                            it('verifies that the service field from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var service = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#service';
                                });
                                expect(service.valueString).toEqual(vprP.service);
                            });
                        }
                        if (vprP.updated !== undefined) {
                            it('verifies that the updated field from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var updated = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#updated';
                                });
                                expect(updated.valueDateTime).toEqual(fhirUtils.convertToFhirDateTime(vprP.updated));
                            });
                        }
                        if (vprP.comments !== undefined) {
                            it('verifies that the summary from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var comments = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#comments';
                                });
                                var txt1 = '<li>' + 'entered:' + vprP.comments[0].entered + '</li>';
                                var txt2 = txt1 + '<li>' + 'enteredByName:' + vprP.comments[0].enteredByName + '</li>';
                                var txt3 = txt2 + '<li>' + 'enteredByCode:' + vprP.comments[0].enteredByCode + '</li>';
                                var txt4 = txt3 + '<li>' + 'comment:' + vprP.comments[0].comment + '</li>';
                                var txt = txt4 + '<li>' + 'summary:' + vprP.comments[0].summary + '</li></ul></div>';
                                expect(comments.valueString).toEqual('<div><ul>' + txt);
                            });
                        }
                    });
                    it('verifies that the entered date from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.dateAsserted).toEqual(fhirUtils.convertToFhirDateTime(vprP.entered));
                    });
                    it('verifies that the onset date from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.onsetDate).toEqual(fhirUtils.convertToFhirDateTime(vprP.onset));
                    });
                    if (vprP.resolved !== undefined) {
                        it('verifies that the resolved from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                            expect(fhirP.abatementDate).toEqual(fhirUtils.convertToFhirDateTime(vprP.resolved));
                        });
                    }
                    if (vprP.locationUid !== undefined) {
                        it('verifies that the locationUid from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                            expect(fhirP.provider.reference).toEqual('#' + vprP.locationUid);
                        });
                    }
                });
            }
        });
    });
});
