'use strict';

//-----------------------------------------------------------------
// This will test the solr-cpt-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-cpt-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-cpt-xformer-spec',
//     level: 'debug'
// });

describe('solr-cpt-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord =  {
                'cptCode': 'urn:cpt:82950',
                'encounterName': 'LAB DIV 500 OOS ID 108 May 21, 2000',
                'encounterUid': 'urn:va:visit:9E7A:3:2306',
                'entered': '20000521100717',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'lastUpdateTime': '20000521100717',
                'localId': '1646',
                'locationName': 'LAB DIV 500 OOS ID 108',
                'locationUid': 'urn:va:location:9E7A:252',
                'name': 'GLUCOSE TEST',
                'pid': '9E7A;3',
                'quantity': 1,
                'stampTime': '20000521100717',
                'summary': 'VisitCPTCode{pid=\'9E7A;3\',uid=\'urn:va:cpt:9E7A:3:1646\'}',
                'type': 'U',
                'uid': 'urn:va:cpt:9E7A:3:1646'
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

            // Verify cpt Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('cpt');

            expect(solrRecord.cpt_code).toBe(vprRecord.cptCode);
            expect(solrRecord.quantity).toEqual([(String)(vprRecord.quantity)]);
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