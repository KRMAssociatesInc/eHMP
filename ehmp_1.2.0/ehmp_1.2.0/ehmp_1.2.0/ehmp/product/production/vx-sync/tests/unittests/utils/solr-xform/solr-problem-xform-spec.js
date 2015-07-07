'use strict';

//-----------------------------------------------------------------
// This will test the solr-problem-xform.js functions.
//
// Author: J.Vega
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-problem-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-procedure-xformer-spec',
//     level: 'debug'
// });

describe('solr-problem-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord = {
                'acuityCode': 'urn:va:prob-acuity:c',
                'acuityName': 'chronic',
                'comments': [
                    {
                        'comment': 'will need cardiology consult',
                        'entered': 20131025,
                        'enteredByCode': 'urn:va:user:9E7A:1',
                        'enteredByName': 'PROGRAMMER,ONE',
                        'summary': 'ProblemComment{uid=\'\'}'
                    }
                ],
                'encounters': [{
                    'dateTime': 201403250956,
                    'facilityCode': 500,
                    'facilityName': 'CAMP MASTER',
                    'stopCodeName': 'PRIMARY CARE/MEDICINE',
                    'stopCodeUid': 'urn:va:stop-code:323',
                    'visitUid': 'urn:va:visit:9E7A:8:10063'
                }],
                'entered': '20000508',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'icdCode': 'urn:icd:250.00',
                'icdGroup': '250',
                'icdName': 'DIABETES MELLI W/O COMP TYP II',
                'kind': 'Problem',
                'lastUpdateTime': '20040331000000',
                'localId': '185',
                'locationDisplayName': 'Primary Care',
                'locationName': 'PRIMARY CARE',
                'locationUid': 'urn:va:location:9E7A:32',
                'onset': '20000221',
                'pid': '9E7A;8',
                'problemText': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                'providerDisplayName': 'Vehu,Ten',
                'providerName': 'VEHU,TEN',
                'providerUid': 'urn:va:user:9E7A:20012',
                'removed': false,
                'serviceConnected': false,
                'service': 'MEDICAL',
                'stampTime': '20040331000000',
                'statusCode': 'urn:sct:55561003',
                'statusDisplayName': 'Active',
                'statusName': 'ACTIVE',
                'summary': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                'uid': 'urn:va:problem:9E7A:8:185',
                'unverified': false,
                'updated': '20040331'
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
            expect(solrRecord.domain).toBe('problem');
            expect(solrRecord.location_name).toBe(vprRecord.locationName);
            expect(solrRecord.service).toBe(vprRecord.service);
            expect(solrRecord.problem_text).toBe(vprRecord.problemText);
            expect(solrRecord.problem_status).toBe(vprRecord.statusDisplayName);
            expect(solrRecord.acuity_name).toBe(vprRecord.acuityName);
            expect(solrRecord.removed).toBe((String)(vprRecord.removed));
            expect(solrRecord.comment).toEqual([vprRecord.comments[0].comment]);
            expect(solrRecord.icd_code).toBe(vprRecord.icdCode);
            expect(solrRecord.icd_name).toBe(vprRecord.icdName);
            expect(solrRecord.icd_group).toBe(vprRecord.icdGroup);
            expect(solrRecord.provider_name).toBe(vprRecord.providerName);
            expect(solrRecord.provider_uid).toBe(vprRecord.providerUid);
        });
    });
});