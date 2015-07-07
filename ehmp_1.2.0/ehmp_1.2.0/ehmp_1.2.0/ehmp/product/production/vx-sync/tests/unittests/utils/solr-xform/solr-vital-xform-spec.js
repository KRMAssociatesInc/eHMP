'use strict';

//-----------------------------------------------------------------
// This will test the solr-vital-xform.js functions.
//
// Author: Khurram Lone
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-vital-xform');
var log = require(global.VX_UTILS + '/dummy-logger');

describe('solr-vital-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'codes': [
                {
                'code': '8310-5',
                'display': 'Body temperature',
                'system': 'http://loinc.org'
                }
                ],
                'displayName': 'T',
                'enteredByName': 'LABTECH,SPECIAL',
                'enteredByUid': 'urn:va:user:9E7A:11745',
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'high': '102',
                'kind': 'Vital Sign',
                'lastUpdateTime': '20040330215452',
                'localId': '12447',
                'locationName': 'NUR NEW LOCATION',
                'locationUid': 'urn:va:location:9E7A:278',
                'low': '95',
                'metricResult': '37.0',
                'metricUnits': 'C',
                'observed': '200403302131',
                'patientGeneratedDataFlag': false,
                'pid': '9E7A;3',
                'qualifiedName': 'TEMPERATURE',
                'qualifiers': [
                {
                'name': 'AXILLARY',
                'vuid': 4688640
                }
                ],
                'result': '98.6',
                'resulted': '20040330215452',
                'stampTime': '20040330215452',
                'summary': 'TEMPERATURE 98.6 F',
                'typeCode': 'urn:va:vuid:4500638',
                'typeName': 'TEMPERATURE',
                'uid': 'urn:va:vital:9E7A:3:12447',
                'units': 'F',
                'bodySite':'testBodySite',
                'document':'testDocument',
                'method':'testMethod',
                'interpretationCode':'testInterpretationCode',
                'interpretationName':'testInterpretationName',
                'resultStatusCode':'testResultStatusCode',
                'resultStatusName':'testResultStatusName'
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
            expect(solrRecord.codes_code).toEqual([vprRecord.codes[0].code]);
            expect(solrRecord.codes_system).toEqual([vprRecord.codes[0].system]);
            expect(solrRecord.codes_display).toEqual([vprRecord.codes[0].display]);
            expect(solrRecord.entered).toBe(vprRecord.entered);
            expect(solrRecord.verified).toBe(vprRecord.verified);
            //expect(solrRecord.datetime_all).toEqual([vprRecord.entered]);

            // Verify vital Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('vital');
            expect(solrRecord.body_site).toBe(vprRecord.bodySite);
            expect(solrRecord.document).toBe(vprRecord.document);
            expect(solrRecord.display_name).toBe(vprRecord.displayName);
            expect(solrRecord.entered_by_name).toEqual([vprRecord.enteredByName]);
            expect(solrRecord.entered_by_uid).toEqual([vprRecord.enteredByUid]);
            expect(solrRecord.high).toBe(vprRecord.high);
            expect(solrRecord.location_name).toBe(vprRecord.locationName);
            expect(solrRecord.location_uid).toBe(vprRecord.locationUid);
            expect(solrRecord.low).toBe(vprRecord.low);
            expect(solrRecord.method).toBe(vprRecord.method);
            expect(solrRecord.metric_result).toBe(vprRecord.metricResult);
            expect(solrRecord.metric_unit).toBe(vprRecord.metricUnit);
            expect(solrRecord.interpretation_code).toBe(vprRecord.interpretationCode);
            expect(solrRecord.interpretation_name).toBe(vprRecord.interpretationName);
            expect(solrRecord.patient_generated_data_flag).toEqual([JSON.stringify(vprRecord.patientGeneratedDataFlag)]);
            expect(solrRecord.qualified_name).toBe(vprRecord.qualifiedName);
            expect(solrRecord.result).toBe(vprRecord.result);
            expect(solrRecord.result_status_code).toBe(vprRecord.resultStatusCode);
            expect(solrRecord.result_status_name).toBe(vprRecord.resultStatusName);
            expect(solrRecord.vital_sign_type).toBe(vprRecord.typeName);
            expect(solrRecord.units).toBe(vprRecord.units);


        });
    });
});