'use strict';

//-----------------------------------------------------------------
// This will test the solr-procedure-xform.js functions.
//
// Author: J.Vega
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-procedure-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-procedure-xformer-spec',
//     level: 'debug'
// });

describe('solr-consult-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord = {
                'activity': [
                    {
                        'dateTime': 199905041505,
                        'entered': 199905041505,
                        'enteredBy': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                        'name': 'ENTERED IN CPRS',
                        'responsible': 'PROVIDER,TWOHUNDREDNINETYSEVEN'
                    },
                    {
                        'dateTime': 199905041505,
                        'device': '',
                        'entered': 199905041505,
                        'enteredBy': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                        'name': 'PRINTED TO'
                    },
                    {
                        'dateTime': 19990504151350,
                        'entered': 19990504151350,
                        'enteredBy': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                        'name': 'COMPLETE/UPDATE',
                        'responsible': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                        'resultUid': 'urn:va:document:9E7A:8:1079'
                    }
                ],
                'category': 'C',
                'consultProcedure': 'Consult',
                'dateTime': '199905041505',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'fromService': '5 WEST PSYCH',
                'kind': 'Consult',
                'lastAction': 'COMPLETE/UPDATE',
                'lastUpdateTime': '19990504151350',
                'localId': '209',
                'orderName': 'HEMATOLOGY NEW NAME',
                'orderUid': 'urn:va:order:9E7A:8:9869',
                'patientClassCode': 'urn:va:patient-class:IMP',
                'patientClassName': 'Inpatient',
                'pid': '9E7A;8',
                'place': 'Bedside',
                'providerDisplayName': 'Provider,Twohundredninetyseven',
                'providerName': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                'providerUid': 'urn:va:user:9E7A:11712',
                'reason': 'this is for patient ant,test',
                'results': [
                    {
                        'localTitle': 'BLEEDING DISORDER',
                        'summary': 'ProcedureResult{uid=\'urn:va:document:9E7A:8:1079\'}',
                        'uid': 'urn:va:document:9E7A:8:1079'
                    }
                ],
                'service': 'HEMATOLOGY NEW NAME',
                'stampTime': '19990504151350',
                'statusName': 'COMPLETE',
                'summary': 'HEMATOLOGY HEMATOLOGY NEW NAME Cons',
                'typeName': 'HEMATOLOGY HEMATOLOGY NEW NAME Cons',
                'uid': 'urn:va:consult:9E7A:8:209',
                'urgency': 'Routine'
            };
            var solrRecord = xformer(vprRecord, log);
            //console.log(solrRecord);

            // Verify Common Fields
            //---------------------
            expect(solrRecord.uid).toBe(vprRecord.uid);
            expect(solrRecord.pid).toBe(vprRecord.pid);
            expect(solrRecord.facility_code).toBe(vprRecord.facilityCode);
            expect(solrRecord.facility_name).toBe(vprRecord.facilityName);
            expect(solrRecord.kind).toBe(vprRecord.kind);
            expect(solrRecord.summary).toBe(vprRecord.summary);
            //expect(solrRecord.datetime_all).toEqual([vprRecord.entered]);

            // Verify procedure Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('procedure');
            expect(solrRecord.procedure_date_time).toBe(vprRecord.dateTime);
            expect(solrRecord.procedure_type).toEqual([vprRecord.typeName]);
            //expect(solrRecord.result_type).toEqual(vprRecord.typeName);
            expect(solrRecord.place).toEqual([vprRecord.place]);
            expect(solrRecord.urgency).toEqual([vprRecord.urgency]);
            expect(solrRecord.order_name).toBe(vprRecord.orderName);
            expect(solrRecord.from_service).toEqual([vprRecord.fromService]);
            expect(solrRecord.patient_class_code).toEqual([vprRecord.patientClassCode]);
            expect(solrRecord.patient_class_name).toBe(vprRecord.patientClassName);
            expect(solrRecord.last_action).toEqual([vprRecord.lastAction]);
            expect(solrRecord.summary).toBe(vprRecord.summary);
            expect(solrRecord.status_name).toBe(vprRecord.statusName);
        });
    });
});