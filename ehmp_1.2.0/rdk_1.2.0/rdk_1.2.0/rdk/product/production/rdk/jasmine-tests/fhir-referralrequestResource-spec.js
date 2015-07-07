/*jslint node: true */
'use strict';

var _ = require('underscore');
var ConsultResource = require('../fhir/referralrequest/referralrequestResource.js');
var fhirUtils = require('../fhir/common/utils/fhirUtils');

var statusMap = {
    'SCHEDULED': 'planned',
    'DISCONTINUED': 'cancelled',
    'COMPLETE': 'finished',
    'HOLD': 'onleave',
    'EXPIRED': 'cancelled'
};

describe('Consult FHIR Resource', function() {

    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20141030083435,
            'totalItems': 6,
            'currentItemCount': 6,
            'items': [{
                'kind': 'Consult',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'fromService': 'GENERAL MEDICINE',
                'orderName': 'AUDIOLOGY OUTPATIENT',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'place': 'Consultant\'s choice',
                'statusName': 'COMPLETE',
                'urgency': 'Routine',
                'activity': [{
                    'dateTime': 20040401225417,
                    'entered': 20040401225417,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'CPRS RELEASED ORDER',
                    'responsible': 'PATHOLOGY,ONE'
                }, {
                    'dateTime': 20040401225520,
                    'entered': 20040401225520,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'COMPLETE/UPDATE',
                    'responsible': 'PATHOLOGY,ONE',
                    'resultUid': 'urn:va:document:9E7A:253:3111'
                }],
                'uid': 'urn:va:consult:9E7A:253:379',
                'summary': 'AUDIOLOGY OUTPATIENT Cons',
                'pid': '9E7A;253',
                'localId': '379',
                'typeName': 'AUDIOLOGY OUTPATIENT Cons',
                'dateTime': '20040401225417',
                'category': 'C',
                'reason': '90 year old MALE referred for suspected hearing loss.',
                'consultProcedure': 'Consult',
                'service': 'AUDIOLOGY OUTPATIENT',
                'orderUid': 'urn:va:order:9E7A:253:15477',
                'providerUid': 'urn:va:user:9E7A:11748',
                'providerName': 'PATHOLOGY,ONE',
                'providerDisplayName': 'Pathology,One',
                'results': [{
                    'localTitle': 'AUDIOLOGY - HEARING LOSS CONSULT',
                    'uid': 'urn:va:document:9E7A:253:3111',
                    'summary': 'ProcedureResult{uid="urn:va:document:9E7A:253:3111"}'
                }],
                'provisionalDx': 'chest pains',
                'lastAction': 'COMPLETE/UPDATE'
            }, {
                'kind': 'Consult',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'fromService': 'GENERAL MEDICINE',
                'orderName': 'HEMATOLOGY CONSULT',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'place': 'Consultant\'s choice',
                'statusName': 'DISCONTINUED',
                'urgency': 'Routine',
                'activity': [{
                    'dateTime': 20040401225417,
                    'entered': 20040401225417,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'CPRS RELEASED ORDER',
                    'responsible': 'PATHOLOGY,ONE'
                }, {
                    'comment': 'Per Policy, Consult was discontinued, patient failed to show.',
                    'dateTime': 20071231125747,
                    'entered': 20071231125747,
                    'enteredBy': 'LABTECH,FORTYEIGHT',
                    'name': 'DISCONTINUED',
                    'responsible': 'LABTECH,FORTYEIGHT'
                }],
                'uid': 'urn:va:consult:9E7A:253:380',
                'summary': 'HEMATOLOGY CONSULT Cons',
                'pid': '9E7A;253',
                'localId': '380',
                'typeName': 'HEMATOLOGY CONSULT Cons',
                'dateTime': '20040401225417',
                'category': 'C',
                'reason': 'Decreased WBC - less than 1.0 for a period of 8 weeks.',
                'consultProcedure': 'Consult',
                'service': 'HEMATOLOGY CONSULT',
                'orderUid': 'urn:va:order:9E7A:253:15478',
                'providerUid': 'urn:va:user:9E7A:11748',
                'providerName': 'PATHOLOGY,ONE',
                'providerDisplayName': 'Pathology,One',
                'provisionalDx': 'chest pains',
                'lastAction': 'DISCONTINUED'
            }, {
                'kind': 'Consult',
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'fromService': 'GENERAL MEDICINE',
                'orderName': 'AUDIOLOGY OUTPATIENT',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'place': 'Consultant\'s choice',
                'statusName': 'COMPLETE',
                'urgency': 'Routine',
                'activity': [{
                    'dateTime': 20040401225417,
                    'entered': 20040401225417,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'CPRS RELEASED ORDER',
                    'responsible': 'PATHOLOGY,ONE'
                }, {
                    'dateTime': 20040401225520,
                    'entered': 20040401225520,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'COMPLETE/UPDATE',
                    'responsible': 'PATHOLOGY,ONE',
                    'resultUid': 'urn:va:document:C877:253:3111'
                }],
                'uid': 'urn:va:consult:C877:253:379',
                'summary': 'AUDIOLOGY OUTPATIENT Cons',
                'pid': '9E7A;253',
                'localId': '379',
                'typeName': 'AUDIOLOGY OUTPATIENT Cons',
                'dateTime': '20040401225417',
                'category': 'C',
                'reason': '90 year old MALE referred for suspected hearing loss.',
                'consultProcedure': 'Consult',
                'service': 'AUDIOLOGY OUTPATIENT',
                'orderUid': 'urn:va:order:C877:253:15477',
                'providerUid': 'urn:va:user:C877:11748',
                'providerName': 'PATHOLOGY,ONE',
                'providerDisplayName': 'Pathology,One',
                'results': [{
                    'localTitle': 'AUDIOLOGY - HEARING LOSS CONSULT',
                    'uid': 'urn:va:document:C877:253:3111',
                    'summary': 'ProcedureResult{uid="urn:va:document:C877:253:3111"}'
                }],
                'provisionalDx': 'chest pains',
                'lastAction': 'COMPLETE/UPDATE'
            }, {
                'kind': 'Consult',
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'fromService': 'GENERAL MEDICINE',
                'orderName': 'HEMATOLOGY CONSULT',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'place': 'Consultant\'s choice',
                'statusName': 'DISCONTINUED',
                'urgency': 'Routine',
                'activity': [{
                    'dateTime': 20040401225417,
                    'entered': 20040401225417,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'CPRS RELEASED ORDER',
                    'responsible': 'PATHOLOGY,ONE'
                }, {
                    'comment': 'Per Policy, Consult was discontinued, patient failed to show.',
                    'dateTime': 20071231125747,
                    'entered': 20071231125747,
                    'enteredBy': 'LABTECH,FORTYEIGHT',
                    'name': 'DISCONTINUED',
                    'responsible': 'LABTECH,FORTYEIGHT'
                }],
                'uid': 'urn:va:consult:C877:253:380',
                'summary': 'HEMATOLOGY CONSULT Cons',
                'pid': '9E7A;253',
                'localId': '380',
                'typeName': 'HEMATOLOGY CONSULT Cons',
                'dateTime': '20040401225417',
                'category': 'C',
                'reason': 'Decreased WBC - less than 1.0 for a period of 8 weeks.',
                'consultProcedure': 'Consult',
                'service': 'HEMATOLOGY CONSULT',
                'orderUid': 'urn:va:order:C877:253:15478',
                'providerUid': 'urn:va:user:C877:11748',
                'providerName': 'PATHOLOGY,ONE',
                'providerDisplayName': 'Pathology,One',
                'provisionalDx': 'chest pains',
                'lastAction': 'DISCONTINUED'
            }, {
                'kind': 'Consult',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'fromService': 'CARDIOLOGY',
                'orderName': 'CARDIOLOGY',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'place': 'Consultant\'s choice',
                'statusName': 'COMPLETE',
                'urgency': 'Routine',
                'activity': [{
                    'dateTime': 20000521095317,
                    'entered': 20000521095317,
                    'enteredBy': 'VEHU,SIXTYONE',
                    'name': 'ENTERED IN CPRS',
                    'responsible': 'VEHU,SIXTYONE'
                }, {
                    'comment': 'Consult Completed.  No sign of further detriation in condition.  ',
                    'dateTime': 20071231125255,
                    'entered': 20071231125255,
                    'enteredBy': 'LABTECH,FORTYEIGHT',
                    'name': 'COMPLETE/UPDATE',
                    'responsible': 'LABTECH,FORTYEIGHT'
                }],
                'uid': 'urn:va:consult:9E7A:253:305',
                'summary': 'CARDIOLOGY Cons',
                'pid': '9E7A;253',
                'localId': '305',
                'typeName': 'CARDIOLOGY Cons',
                'dateTime': '20000521095317',
                'category': 'C',
                'reason': 'heart palpitations',
                'consultProcedure': 'Consult',
                'service': 'CARDIOLOGY',
                'orderUid': 'urn:va:order:9E7A:253:12334',
                'providerUid': 'urn:va:user:9E7A:20069',
                'providerName': 'VEHU,SIXTYONE',
                'providerDisplayName': 'Vehu,Sixtyone',
                'provisionalDx': 'chest pains',
                'lastAction': 'COMPLETE/UPDATE'
            }, {
                'kind': 'Consult',
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'fromService': 'CARDIOLOGY',
                'orderName': 'CARDIOLOGY',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'place': 'Consultant\'s choice',
                'statusName': 'COMPLETE',
                'urgency': 'Routine',
                'activity': [{
                    'dateTime': 20000521095317,
                    'entered': 20000521095317,
                    'enteredBy': 'VEHU,SIXTYONE',
                    'name': 'ENTERED IN CPRS',
                    'responsible': 'VEHU,SIXTYONE'
                }, {
                    'comment': 'Consult Completed.  No sign of further detriation in condition.  ',
                    'dateTime': 20071231125255,
                    'entered': 20071231125255,
                    'enteredBy': 'LABTECH,FORTYEIGHT',
                    'name': 'COMPLETE/UPDATE',
                    'responsible': 'LABTECH,FORTYEIGHT'
                }],
                'uid': 'urn:va:consult:C877:253:305',
                'summary': 'CARDIOLOGY Cons',
                'pid': '9E7A;253',
                'localId': '305',
                'typeName': 'CARDIOLOGY Cons',
                'dateTime': '20000521095317',
                'category': 'C',
                'reason': 'heart palpitations',
                'consultProcedure': 'Consult',
                'service': 'CARDIOLOGY',
                'orderUid': 'urn:va:order:C877:253:12334',
                'providerUid': 'urn:va:user:C877:20069',
                'providerName': 'VEHU,SIXTYONE',
                'providerDisplayName': 'Vehu,Sixtyone',
                'provisionalDx': 'chest pains',
                'lastAction': 'COMPLETE/UPDATE'
            }]
        }
    };

    var req = {
        '_pid': '9E7A;253',
        query: '/fhir/diagnosticreport?subject.identifier=9E7A;253&domain=rad',
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };

    var vprConsult = inputValue.data.items;
    var fhirConsult = ConsultResource.convertToFhir(inputValue, req);

    it('verifies that given a valid VPR Consult Resource converts to a defined FHIR Consult Resource object', function() {
        expect(fhirConsult).toBeDefined();
    });

    _.each(vprConsult, function(vprCS) {
        it('verifies that each VPR Consult Resource has a coresponding FHIR Consult Resource in the collection with the same uid', function() {

            var fhirCs = _.find(fhirConsult, function(im) {
                return im.identifier.value === vprCS.uid;
            });
            expect(fhirCs).toBeDefined();

            if (fhirCs !== undefined) {
                describe('found FHIR Consult that coresponds to the original VPR Consult Resource', function() {

                    it('verifies that the provider fields information from VPR Immunization Resource coresponds to the one from the FHIR Immunization Resource', function() {
                        var fcode = _.find(fhirCs.contained, function(c) {
                            return c.resourceType === 'Practitioner';
                        });
                        expect(fcode.name).toEqual(vprCS.providerName);
                        expect(fcode.identifier.value).toEqual(vprCS.providerUid);
                        expect(fcode.identifier.system).toEqual('urn:oid:2.16.840.1.113883.6.233');
                    });

                    it('verifies that the pid from VPR Consult Resource coresponds to the one from the FHIR Consult Resource', function() {
                        expect(fhirCs.subject.reference).toEqual('Patient/' + vprCS.pid);
                        expect(fhirCs.requester.reference).toEqual('Patient/' + vprCS.pid);
                    });

                    it('verifies that the dateTime from VPR Consult Resource coresponds to the one from the FHIR Consult Resource', function() {
                        expect(fhirCs.dateSent).toEqual(fhirUtils.convertToFhirDateTime(vprCS.dateTime));
                    });

                    it('verifies that the statusName from VPR Consult Resource coresponds to the one from the FHIR Consult Resource', function() {
                        var fcode = _.find(fhirCs.contained, function(c) {
                            return c.resourceType === 'Encounter';
                        });
                        var fcode2 = _.find(fhirCs.contained, function(c) {
                            return c.resourceType === 'Location';
                        });
                        expect(fcode2.Name).toEqual(vprCS.facilityName);
                        expect(fcode2.identifier.value).toEqual(vprCS.facilityCode);
                        expect(fcode.status).toEqual(statusMap[vprCS.statusName]);
                        if (vprCS.patientClassCode === 'urn:va:patient-class:AMB') {
                            expect(fcode.class).toEqual('ambulatory');
                        } else {
                            expect(fcode.class).toEqual('inpatient');
                        }
                    });

                    it('verifies that the consultProcedure from VPR Consult Resource coresponds to the one from the FHIR Consult Resource', function() {
                        expect(fhirCs.type.text).toEqual(vprCS.consultProcedure);
                    });

                    it('verifies that the service from VPR Consult Resource coresponds to the one from the FHIR Consult Resource', function() {
                        expect(fhirCs.speciality.text).toEqual(vprCS.service);
                        expect(fhirCs.serviceRequested.text).toEqual(vprCS.service);
                    });

                    it('verifies that the reason from VPR Consult Resource coresponds to the one from the FHIR Consult Resource', function() {
                        expect(fhirCs.reason.text).toEqual(vprCS.reason);
                    });

                    it('verifies that the urgency from VPR Consult Resource coresponds to the one from the FHIR Consult Resource', function() {
                        expect(fhirCs.priority.text).toEqual(vprCS.urgency);
                    });
                });

                describe('extensions', function() {

                    it('verifies that the localId from VPR consult Resource coresponds to the one from the FHIR consult Resource', function() {
                        var localId = _.find(fhirCs.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/consult#localId';
                        });
                        expect(localId.valueString).toEqual(vprCS.localId);
                    });

                    it('verifies that the results from VPR consult Resource coresponds to the one from the FHIR consult Resource', function() {
                        if(vprCS.results !== undefined){
                            var results = _.find(fhirCs.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/consult#results_localTitle';
                            });
                            expect(results.valueString).toEqual(vprCS.results[0].localTitle);

                            var results2 = _.find(fhirCs.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/consult#results_summary';
                            });
                            expect(results2.valueString).toEqual(vprCS.results[0].summary);

                            var results3 = _.find(fhirCs.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/extensions/consult#results_uid';
                            });
                            expect(results3.valueString).toEqual(vprCS.results[0].uid);
                        }
                    });

                    it('verifies that the orderUid from VPR consult Resource coresponds to the one from the FHIR consult Resource', function() {
                        var orderUid = _.find(fhirCs.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/consult#orderUid';
                        });
                        expect(orderUid.valueString).toEqual(vprCS.orderUid);
                    });

                    it('verifies that the orderName from VPR consult Resource coresponds to the one from the FHIR consult Resource', function() {
                        var orderName = _.find(fhirCs.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/consult#orderName';
                        });
                        expect(orderName.valueString).toEqual(vprCS.orderName);
                    });

                    it('verifies that the patient class name from VPR consult Resource coresponds to the one from the FHIR consult Resource', function() {
                        var patientName = _.find(fhirCs.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/consult#patientClassName';
                        });
                        expect(patientName.valueString).toEqual(vprCS.patientClassName);
                    });

                    it('verifies that the provisional Dx from VPR consult Resource coresponds to the one from the FHIR consult Resource', function() {
                        var provisional = _.find(fhirCs.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/consult#provisionalDx';
                        });
                        expect(provisional.valueString).toEqual(vprCS.provisionalDx);
                    });
                });
            }
        });

    });
});
