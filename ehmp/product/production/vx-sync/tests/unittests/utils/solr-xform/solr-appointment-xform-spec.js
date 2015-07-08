'use strict';

//-----------------------------------------------------------------
// This will test the solr-appointment-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-appointment-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-appointment-xformer-spec',
//     level: 'debug'
// });

describe('solr-appointment-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'appointmentStatus': 'INPATIENT',
                'categoryCode': 'urn:va:encounter-category:OV',
                'categoryName': 'Outpatient Visit',
                'checkOut': '200203071334',
                'current': false,
                'dateTime': '200004061500',
                'dispositinCode': 'SomeDispositionCode',
                'dispositionName': 'SomeDispositionName',
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'kind': 'Visit',
                'lastUpdateTime': '20020307133400',
                'localId': 'A;3000406.15;32',
                'locationDisplayName': 'Primary Care',
                'locationName': 'PRIMARY CARE',
                'locationUid': 'urn:va:location:9E7A:32',
                'patientClassCode': 'urn:va:patient-class:IMP',
                'locationOos': false,
                'patientClassName': 'Inpatient',
                'pid': '9E7A;8',
                'providers': [{
                    'primary': false,
                    'providerDisplayName': 'Provider,Ten',
                    'providerName': 'PROVIDER,TEN',
                    'providerUid': 'urn:va:user:9E7A:10',
                    'summary': 'EncounterProvider{uid=\'\'}'
                }, {
                    'primary': true,
                    'providerDisplayName': 'Provider,Fifteen',
                    'providerName': 'PROVIDER,FIFTEEN',
                    'providerUid': 'urn:va:user:9E7A:998',
                    'summary': 'EncounterProvider{uid=\'\'}'
                }],
                'reason': 'TheReason',
                'reasonName': 'TheReasonName',
                'referrerName': 'PROVIDER,TEN',
                'roomBed': '9E-01',
                'service': 'MEDICINE',
                'shortLocationName': 'PCM',
                'stampTime': '20020307133400',
                'stopCode': 'stop',
                'stopCodeName': 'PRIMARY CARE/MEDICINE',
                'stopCodeUid': 'urn:va:stop-code:323',
                'summary': 'PRIMARY CARE/MEDICINE',
                'typeCode': '9',
                'typeDisplayName': 'Regular',
                'typeName': 'REGULAR',
                'uid': 'urn:va:appointment:9E7A:8:A;3000406.15;32'
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

            // Verify Appointment Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('encounter');
            // expect(solrRecord.datetime).toBe(vprRecord.dateTime);
            // expect(solrRecord.date_time).toBe(vprRecord.dateTime);
            expect(solrRecord.visit_date_time).toBe(vprRecord.dateTime);
            expect(solrRecord.current).toBe(vprRecord.current);
            expect(solrRecord.type_code).toBe(vprRecord.typeCode);
            expect(solrRecord.service).toBe(vprRecord.service);
            expect(solrRecord.stop_code).toBe(vprRecord.stopCode);
            expect(solrRecord.stop_code_name).toBe(vprRecord.stopCodeName);
            expect(solrRecord.stop_code_uid).toBe(vprRecord.stopCodeUid);
            expect(solrRecord.appointment_status).toEqual([vprRecord.appointmentStatus]);
            expect(solrRecord.location_uid).toBe(vprRecord.locationUid);
            expect(solrRecord.location_name).toBe(vprRecord.locationName);
            expect(solrRecord.short_location_name).toEqual([vprRecord.shortLocationName]);
            expect(solrRecord.location_display_name).toBe(vprRecord.locationDisplayName);
            expect(solrRecord.location_oos).toBe(vprRecord.locationOos);
            expect(solrRecord.room_bed).toBe(vprRecord.roomBed);
            expect(solrRecord.patient_class_name).toBe(vprRecord.patientClassName);
            expect(solrRecord.patient_class).toBe(vprRecord.patientClassName);
            expect(solrRecord.encounter_type).toBe(vprRecord.typeDisplayName);
            expect(solrRecord.encounter_category).toBe(vprRecord.categoryName);
            expect(solrRecord.check_out).toEqual([vprRecord.checkOut]);
            expect(solrRecord.primary_provider_name).toBe(vprRecord.providers[1].providerName);
            expect(solrRecord.reason).toBe(vprRecord.reason);
            expect(solrRecord.reason_name).toBe(vprRecord.reasonName);
            expect(solrRecord.disposition_code).toBe(vprRecord.dispositionCode);
            expect(solrRecord.disposition_name).toBe(vprRecord.dispositionName);
            expect(solrRecord.referrer_name).toBe(vprRecord.referrerName);
        });
    });
});