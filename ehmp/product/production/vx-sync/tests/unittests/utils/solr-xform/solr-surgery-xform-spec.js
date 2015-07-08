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

describe('solr-surgery-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord = {
                'category': 'SR',
                'dateTime': '200612080730',
                'facilityCode': '561',
                'facilityName': 'New Jersey HCS',
                'kind': 'Surgery',
                'localId': '10016',
                'pid': 'CDS;5000000217V519385',
                'providerDisplayName': 'Provider,One',
                'providerName': 'PROVIDER,ONE',
                'providerUid': 'urn:va:user:ABCD:983',
                'providers': [
                    {
                        'providerDisplayName': 'Provider,One',
                        'providerName': 'PROVIDER,ONE',
                        'providerUid': 'urn:va:user:ABCD:983',
                        'summary': 'ProcedureProvider{uid=\'urn:va:user:ABCD:983\'}',
                        'uid': 'urn:va:user:ABCD:983'
                    }
                ],
                'results': [
                    {
                        'localTitle': 'OPERATION REPORT',
                        'summary': 'ProcedureResult{uid=\'urn:va:document:ABCD:8:3563\'}',
                        'uid': 'urn:va:document:ABCD:8:3563'
                    },
                    {
                        'localTitle': 'NURSE INTRAOPERATIVE REPORT',
                        'summary': 'ProcedureResult{uid=\'urn:va:document:ABCD:8:3532\'}',
                        'uid': 'urn:va:document:ABCD:8:3532'
                    },
                    {
                        'localTitle': 'ANESTHESIA REPORT',
                        'summary': 'ProcedureResult{uid=\'urn:va:document:ABCD:8:3531\'}',
                        'uid': 'urn:va:document:ABCD:8:3531'
                    }
                ],
                'stampTime': '20150414094137',
                'statusName': 'COMPLETED',
                'summary': 'LEFT INGUINAL HERNIA REPAIR WITH MESH',
                'typeName': 'LEFT INGUINAL HERNIA REPAIR WITH MESH',
                'uid': 'urn:va:surgery:ABCD:8:10016'
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
            //expect(solrRecord.name).toBe(vprRecord.name);
            expect(solrRecord.summary).toBe(vprRecord.summary);
            expect(solrRecord.status_name).toBe(vprRecord.statusName);
        });
    });
});