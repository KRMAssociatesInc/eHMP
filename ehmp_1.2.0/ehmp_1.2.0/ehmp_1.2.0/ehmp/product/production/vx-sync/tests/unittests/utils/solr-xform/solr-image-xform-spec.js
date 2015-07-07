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

describe('solr-image-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord =  {
                'case': 29,
                'category': 'RA',
                'dateTime': '199912161420',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'hasImages': false,
                'imageLocation': 'RADIOLOGY MAIN FLOOR',
                'imagingTypeUid': 'urn:va:imaging-Type:GENERAL RADIOLOGY',
                'kind': 'Imaging',
                'lastUpdateTime': '19991216142000',
                'localId': '7008783.8579-1',
                'locationName': 'RADIOLOGY MAIN FLOOR',
                'locationUid': 'urn:va:location:9E7A:40',
                'name': 'KNEE 2 VIEWS',
                'orderName': 'KNEE 2 VIEWS',
                'orderUid': 'urn:va:order:9E7A:8:11088',
                'pid': '9E7A;8',
                'reason': '',
                'stampTime': '19991216142000',
                'statusName': 'WAITING FOR EXAM',
                'summary': 'RADIOLOGIC EXAMINATION, KNEE; 1 OR 2 VIEWS',
                'typeName': 'RADIOLOGIC EXAMINATION, KNEE; 1 OR 2 VIEWS',
                'uid': 'urn:va:image:9E7A:8:7008783.8579-1'
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
            expect(solrRecord.order_name).toBe(vprRecord.orderName);
            expect(solrRecord.summary).toBe(vprRecord.summary);
            expect(solrRecord.status_name).toBe(vprRecord.statusName);
            expect(solrRecord.name).toEqual([vprRecord.name]);
            expect(solrRecord.image_location).toBe(vprRecord.imageLocation);
            expect(solrRecord.imaging_type_uid).toBe(vprRecord.imagingTypeUid);
            expect(solrRecord.location_uid).toBe(vprRecord.locationUid);
        });
    });
});