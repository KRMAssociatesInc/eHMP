'use strict';

//-----------------------------------------------------------------
// This will test the solr-visit-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-visit-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-visit-xformer-spec',
//     level: 'debug'
// });

describe('solr-visit-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'categoryCode': 'urn:va:encounter-category:OV',
                'categoryName': 'Outpatient Visit',
                'current': false,
                'dateTime': '20140319195647',
                'encounterType': 'P',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'kind': 'Visit',
                'lastUpdateTime': '20140319195647',
                'localId': '10047',
                'locationDisplayName': 'Primary Care',
                'locationName': 'PRIMARY CARE',
                'locationOos': false,
                'locationUid': 'urn:va:location:9E7A:32',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'pid': '9E7A;8',
                'primaryProvider': {
                    'primary': true,
                    'providerDisplayName': 'Programmer,One',
                    'providerName': 'PROGRAMMER,ONE',
                    'providerUid': 'urn:va:user:9E7A:1',
                    'role': 'P',
                    'summary': 'EncounterProvider{uid=\'\'}'
                },
                'providers': [
                    {
                        'primary': true,
                        'providerDisplayName': 'Programmer,One',
                        'providerName': 'PROGRAMMER,ONE',
                        'providerUid': 'urn:va:user:9E7A:1',
                        'role': 'P',
                        'summary': 'EncounterProvider{uid=\'\'}'
                    },
                    {
                        'providerDisplayName': 'Yackuboskey,Veronica',
                        'providerName': 'YACKUBOSKEY,VERONICA',
                        'providerUid': 'urn:va:user:9E7A:5',
                        'role': 'S',
                        'summary': 'EncounterProvider{uid=\'\'}'
                    },
                    {
                        'providerDisplayName': 'Programmer,Five',
                        'providerName': 'PROGRAMMER,FIVE',
                        'providerUid': 'urn:va:user:9E7A:119',
                        'role': 'S',
                        'summary': 'EncounterProvider{uid=\'\'}'
                    }
                ],
                'reasonName': 'CARDIAC ARREST',
                'reasonUid': 'urn:icd:427.5',
                'service': 'MEDICINE',
                'shortLocationName': 'PCM',
                'stampTime': '20140319195647',
                'stopCodeName': 'PRIMARY CARE/MEDICINE',
                'stopCodeUid': 'urn:va:stop-code:323',
                'summary': 'PRIMARY CARE/MEDICINE',
                'typeDisplayName': 'Primary Care Visit',
                'typeName': 'PRIMARY CARE VISIT',
                'uid': 'urn:va:visit:9E7A:8:10047'
            };
            var solrRecord = xformer(vprRecord, log);

            // Verify Common Fields
            //---------------------
            expect(solrRecord.uid).toBe(vprRecord.uid);
            expect(solrRecord.pid).toBe(vprRecord.pid);
            expect(solrRecord.facility_code).toBe(vprRecord.facilityCode);
            expect(solrRecord.facility_name).toBe(vprRecord.facilityName);
            expect(solrRecord.kind).toBe(vprRecord.kind);
            expect(solrRecord.summary).toBe(vprRecord.summary);
            expect(solrRecord.datetime_all).toEqual([vprRecord.dateTime]);

            // Verify Visit Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('encounter');
            // expect(solrRecord.visit_date_time).toBe(vprRecord.dateTime);
            expect(solrRecord.current).toBe(vprRecord.current);
            expect(solrRecord.service).toBe(vprRecord.service);
            expect(solrRecord.stop_code_name).toBe(vprRecord.stopCodeName);
            expect(solrRecord.stop_code_uid).toBe(vprRecord.stopCodeUid);
            expect(solrRecord.location_uid).toBe(vprRecord.locationUid);
            expect(solrRecord.location_name).toBe(vprRecord.locationName);
            expect(solrRecord.short_location_name).toEqual([vprRecord.shortLocationName]);
            expect(solrRecord.location_display_name).toBe(vprRecord.locationDisplayName);
            expect(solrRecord.location_oos).toBe(vprRecord.locationOos);
            expect(solrRecord.patient_class_name).toBe(vprRecord.patientClassName);
            expect(solrRecord.patient_class).toBe(vprRecord.patientClassName);
            expect(solrRecord.encounter_type).toBe(vprRecord.typeDisplayName);
            expect(solrRecord.encounter_category).toBe(vprRecord.categoryName);
            expect(solrRecord.primary_provider_name).toBe(vprRecord.providers[0].providerName);
            expect(solrRecord.reason_name).toBe(vprRecord.reasonName);
        });
    });
});