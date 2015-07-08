'use strict';

//-----------------------------------------------------------------
// This will test the solr-order-xform.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var xformer = require(global.VX_UTILS + 'solr-xform/solr-order-xform');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-order-xformer-spec',
//     level: 'debug'
// });

describe('solr-order-xform.js', function() {
    describe('Transformer', function() {
        it('Happy Path', function() {
            var vprRecord = {
                'content': 'GLUCOSE BLOOD   SERUM WC LB #1933\r\n',
                'displayGroup': 'CH',
                'entered': '200005200400',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'kind': 'Laboratory',
                'lastUpdateTime': '20000520040000',
                'localId': '12540',
                'locationName': 'ICU/CCU',
                'locationUid': 'urn:va:location:9E7A:8',
                'name': 'GLUCOSE',
                'oiCode': 'urn:va:oi:291',
                'oiName': 'GLUCOSE',
                'oiPackageRef': '175;99LRT',
                'pid': '9E7A;3',
                'providerDisplayName': 'Vehu,Eight',
                'providerName': 'VEHU,EIGHT',
                'providerUid': 'urn:va:user:9E7A:20010',
                'results': [{
                    'uid': 'urn:va:lab:9E7A:3:CH;6999478.96;2'
                }],
                'service': 'LR',
                'stampTime': '20000520040000',
                'start': '200005200400',
                'statusCode': 'urn:va:order-status:comp',
                'statusName': 'COMPLETE',
                'statusVuid': 'urn:va:vuid:4501088',
                'stop': '200005211010',
                'summary': 'GLUCOSE BLOOD   SERUM WC LB #1933\r\n',
                'uid': 'urn:va:order:9E7A:3:12540'
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
            expect(solrRecord.order_start_date_time).toBe(vprRecord.start);

            // Verify Order Specific Fields
            //-------------------------------
            expect(solrRecord.domain).toBe('order');
            expect(solrRecord.name).toBe(vprRecord.name);
            expect(solrRecord.order_name).toBe(vprRecord.name);
            expect(solrRecord.oi_code).toBe(vprRecord.oiCode);
            expect(solrRecord.oi_name).toEqual([vprRecord.oiName]);
            expect(solrRecord.oi_package_ref).toBe(vprRecord.oiPackageRef);
            expect(solrRecord.content).toBe(vprRecord.content);
            expect(solrRecord.start).toEqual([vprRecord.start]);
            expect(solrRecord.display_group).toEqual([vprRecord.displayGroup]);
            expect(solrRecord.order_group_va).toBe(vprRecord.displayGroup);
            expect(solrRecord.status_name).toBe(vprRecord.statusName);
            expect(solrRecord.order_status_va).toBe(vprRecord.statusName);
            expect(solrRecord.provider_display_name).toEqual([vprRecord.providerDisplayName]);
            expect(solrRecord.service).toBe(vprRecord.service);
            expect(solrRecord.location_uid).toBe(vprRecord.locationUid);
        });
    });
});