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

describe('solr-procedure-xform.js', function() {
    describe('Transformer', function() {
        it('Normal Path', function() {
            var vprRecord = {
                'category': 'CP',
                'dateTime': '198808051457',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'interpretation': 'BORDERLINE',
                'kind': 'Procedure',
                'lastUpdateTime': '19880805145700',
                'localId': '1;MCAR(691.6,',
                'name': 'HOLTER',
                'pid': '9E7A;8',
                'stampTime': '19880805145700',
                'statusName': 'COMPLETE',
                'summary': '',
                'uid': 'urn:va:procedure:9E7A:8:1;MCAR(691.6,'
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
            //expect(solrRecord.procedure_type).toBe(vprRecord.typeName);
            expect(solrRecord.name).toEqual([vprRecord.name]);
            expect(solrRecord.summary).toBe(vprRecord.summary);
        });
    });
});