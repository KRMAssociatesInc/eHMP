'use strict';

//-----------------------------------------------------------------
// This will test the solr-pov-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-pov-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-pov-xformer-spec',
//     level: 'debug'
// });

describe('solr-pov-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord =  {
                'encounterName': 'PRIMARY CARE May 21, 2000',
                'encounterUid': 'urn:va:visit:9E7A:3:2462',
                'entered': '20000521115440',
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'icdCode': 'urn:icd:521.0',
                'lastUpdateTime': '20000521115440',
                'localId': '416',
                'locationName': 'PRIMARY CARE',
                'locationUid': 'urn:va:location:9E7A:32',
                'name': 'DENTAL CARIES',
                'pid': '9E7A;3',
                'stampTime': '20000521115440',
                'summary': 'PurposeOfVisit{uid=\'urn:va:pov:9E7A:3:416\'}',
                'type': 'P',
                'uid': 'urn:va:pov:9E7A:3:416'
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
            expect(solrRecord.entered).toBe(vprRecord.entered);

            // Verify pov Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('pov');

            expect(solrRecord.icd_code).toBe(vprRecord.icdCode);
            expect(solrRecord.type).toBe(vprRecord.type);
            expect(solrRecord.name).toEqual([vprRecord.name]);
            expect(solrRecord.local_id).toEqual([vprRecord.localId]);
            expect(solrRecord.encounter_uid).toEqual([vprRecord.encounterUid]);
            expect(solrRecord.encounter_name).toEqual([vprRecord.encounterName]);
            expect(solrRecord.location_name).toBe(vprRecord.locationName);
            expect(solrRecord.location_uid).toBe(vprRecord.locationUid);
        });
    });
});