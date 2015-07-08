'use strict';


require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-order-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
var orderTransformedRecord = {
    'clinicians': [{
        'name': 'VEHU,SIXTYONE',
        'role': 'S',
        'signedDateTime': 200005210954,
        'uid': 'urn:va:user:9E7A:20069'
    }],
    'content': 'CARDIOLOGY Cons Consultant\'s Choice\r\n',
    'displayGroup': 'CSLT',
    'entered': '200005210954',
    'facilityCode': '998',
    'facilityName': 'ABILENE (CAA)',
    'kind': 'Consult',
    'lastUpdateTime': '20000521095400',
    'localId': '12360',
    'locationName': 'CARDIOLOGY',
    'locationUid': 'urn:va:location:9E7A:195',
    'name': 'CARDIOLOGY',
    'oiCode': 'urn:va:oi:85',
    'oiName': 'CARDIOLOGY',
    'oiPackageRef': '4;99CON',
    'pid': '9E7A;3',
    'providerDisplayName': 'Vehu,Sixtyone',
    'providerName': 'VEHU,SIXTYONE',
    'providerUid': 'urn:va:user:9E7A:20069',
    'results': [{
        'uid': 'urn:va:consult:9E7A:3:315'
    }],
    'service': 'GMRC',
    'stampTime': '20000521095400',
    'start': '200005210954',
    'statusCode': 'urn:va:order-status:comp',
    'statusName': 'COMPLETE',
    'statusVuid': 'urn:va:vuid:4501088',
    'stop': '200712311252',
    'summary': 'CARDIOLOGY Cons Consultant\'s Choice\r\n',
    'uid': 'urn:va:order:9E7A:3:12360'
};

var orderRecord = {
    'clinicians': [{
        'name': 'VEHU,SIXTYONE',
        'role': 'S',
        'signedDateTime': 200005210954,
        'uid': 'urn:va:user:9E7A:20069'
    }],
    'content': 'CARDIOLOGY Cons Consultant\'s Choice\r\n',
    'displayGroup': 'CSLT',
    'entered': '200005210954',
    'facilityCode': 998,
    'facilityName': 'ABILENE (CAA)',
    'lastUpdateTime': 20000521095400,
    'localId': '12360',
    'locationName': 'CARDIOLOGY',
    'locationUid': 'urn:va:location:9E7A:195',
    'name': 'CARDIOLOGY',
    'oiCode': 'urn:va:oi:85',
    'oiName': 'CARDIOLOGY',
    'oiPackageRef': '4;99CON',
    'pid': '9E7A;3',
    'providerName': 'VEHU,SIXTYONE',
    'providerUid': 'urn:va:user:9E7A:20069',
    'results': [{
        'uid': 'urn:va:consult:9E7A:3:315'
    }],
    'service': 'GMRC',
    'stampTime': 20000521095400,
    'start': 200005210954,
    'statusCode': 'urn:va:order-status:comp',
    'statusName': 'COMPLETE',
    'statusVuid': 'urn:va:vuid:4501088',
    'stop': 200712311252,
    'uid': 'urn:va:order:9E7A:3:12360'
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:order:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

describe('record-enrichment-order-xformer.js', function() {
    it('transform order record', function() {
        xformer(log, null, null, {
            record: orderRecord
        }, function(error, record) {
            expect(error).toBeFalsy();
            expect(record).toBeTruthy();
            expect(record.clinicians.length).toBe(1);
            expect(record.clinicians[0]).toEqual(orderTransformedRecord.clinicians[0]);
            expect(record.content).toBe(orderTransformedRecord.content);
            expect(record.displayGroup).toBe(orderTransformedRecord.displayGroup);
            expect(record.entered).toBe(orderTransformedRecord.entered);
            expect(record.facilityCode).toBe(orderTransformedRecord.facilityCode);
            expect(record.facilityName).toBe(orderTransformedRecord.facilityName);
            expect(record.kind).toBe(orderTransformedRecord.kind);
            expect(record.lastUpdateTime).toBe(orderTransformedRecord.lastUpdateTime);
            expect(record.localId).toBe(orderTransformedRecord.localId);
            expect(record.locationName).toBe(orderTransformedRecord.locationName);
            expect(record.locationUid).toBe(orderTransformedRecord.locationUid);
            expect(record.name).toBe(orderTransformedRecord.name);
            expect(record.oiCode).toBe(orderTransformedRecord.oiCode);
            expect(record.oiName).toBe(orderTransformedRecord.oiName);
            expect(record.oiPackageRef).toBe(orderTransformedRecord.oiPackageRef);
            expect(record.pid).toBe(orderTransformedRecord.pid);
            expect(record.providerDisplayName).toBe(orderTransformedRecord.providerDisplayName);
            expect(record.providerName).toBe(orderTransformedRecord.providerName);
            expect(record.providerUid).toBe(orderTransformedRecord.providerUid);
            expect(record.results.length).toBe(1);
            expect(record.results[0]).toEqual(orderTransformedRecord.results[0]);
            expect(record.service).toBe(orderTransformedRecord.service);
            expect(record.stampTime).toBe(orderTransformedRecord.stampTime);
            expect(record.start).toBe(orderTransformedRecord.start);
            expect(record.statusCode).toBe(orderTransformedRecord.statusCode);
            expect(record.statusName).toBe(orderTransformedRecord.statusName);
            expect(record.statusVuid).toBe(orderTransformedRecord.statusVuid);
            expect(record.stop).toBe(orderTransformedRecord.stop);
            expect(record.summary).toBe(orderTransformedRecord.summary);
            expect(record.uid).toBe(orderTransformedRecord.uid);
        });
    });
        it('Job was removed', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, null, environment, removedJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:order:DOD:0000000003:1000010340');
                    expect(record.pid).toEqual('DOD;0000000003');
                    expect(record.stampTime).toEqual('20150226124943');
                    expect(record.removed).toEqual(true);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
});