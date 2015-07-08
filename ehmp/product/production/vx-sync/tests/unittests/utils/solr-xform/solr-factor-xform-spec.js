'use strict';

//-----------------------------------------------------------------
// This will test the solr-factor-xform.js functions.
//
// Author: J.Vega
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-factor-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-factor-xformer-spec',
//     level: 'debug'
// });

describe('solr-factor-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord = {
                'categoryName': 'DEPRESSION SCREENING',
                'categoryUid': 'urn:va:factor-category:500077',
                'display': true,
                'encounterName': 'AUDIOLOGY Feb 26, 2002',
                'encounterUid': 'urn:va:visit:ABCD:777:2895',
                'entered': '20020226160307',
                'facilityCode': '561',
                'facilityName': 'New Jersey HCS',
                'kind': 'Health Factor',
                'localId': '32',
                'locationName': 'AUDIOLOGY',
                'locationDisplayName': 'AUDIOLOGY',
                'locationUid': 'urn:va:location:ABCD:64',
                'name': 'REFUSAL TO COMPLETE SCREENING TOOL',
                'summary': 'REFUSAL TO COMPLETE SCREENING TOOL',
                'uid': 'urn:va:factor:ABCD:777:32'
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

            // Verify factor Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('factor');
            expect(solrRecord.health_factor_name).toBe(vprRecord.name);
            expect(solrRecord.health_factor_date_time).toBe(vprRecord.entered);
            expect(solrRecord.encounter_name).toEqual([vprRecord.encounterName]);
            //expect(solrRecord.display).toEqual([vprRecord.display]);
            expect(solrRecord.location_name).toBe(vprRecord.locationName);
            expect(solrRecord.location_display_name).toBe(vprRecord.locationDisplayName);
            expect(solrRecord.category_name).toBe(vprRecord.categoryName);
            expect(solrRecord.display).toEqual([(String)(vprRecord.display)]);
        });
    });
});