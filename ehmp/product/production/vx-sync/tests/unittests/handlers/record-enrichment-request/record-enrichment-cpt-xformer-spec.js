'use strict';


require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-cpt-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
var cptTransformedRecord = {
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
var cptRecord = {
        'cptCode': 'urn:cpt:82950',
        'encounterName': 'LAB DIV 500 OOS ID 108 May 21, 2000',
        'encounterUid': 'urn:va:visit:9E7A:3:2306',
        'entered': 20000521100717,
        'facilityCode': 500,
        'facilityName': 'CAMP MASTER',
        'lastUpdateTime': 20000521100717,
        'localId': 1646,
        'locationName': 'LAB DIV 500 OOS ID 108',
        'locationUid': 'urn:va:location:9E7A:252',
        'name': 'GLUCOSE TEST',
        'pid': '9E7A;3',
        'quantity': 1,
        'stampTime': 20000521100717,
        'type': 'U',
        'uid': 'urn:va:cpt:9E7A:3:1646'
      };

var removedRecord = {
    'pid': '9E7A;3',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:cpt:9E7A:3:1646'
};

var removedJob = {
    record: removedRecord
};

describe('record-enrichment-cpt-xformer.js', function(){
    it('transform cpt record',function(){
        xformer(log, null, null, cptRecord, function(error, record){
            expect(error).toBeFalsy();
            expect(record).toBeTruthy();
            expect(record.cptCode).toBe(cptTransformedRecord.cptCode);
            expect(record.encounterName).toBe(cptTransformedRecord.encounterName);
            expect(record.encounterUid).toBe(cptTransformedRecord.encounterUid);
            expect(record.entered).toBe(cptTransformedRecord.entered);
            expect(record.facilityCode).toBe(cptTransformedRecord.facilityCode);
            expect(record.facilityName).toBe(cptTransformedRecord.facilityName);
            expect(record.lastUpdateTime).toBe(cptTransformedRecord.lastUpdateTime);
            expect(record.localId).toBe(cptTransformedRecord.localId);
            expect(record.locationName).toBe(cptTransformedRecord.locationName);
            expect(record.locationUid).toBe(cptTransformedRecord.locationUid);
            expect(record.name).toBe(cptTransformedRecord.name);
            expect(record.pid).toBe(cptTransformedRecord.pid);
            expect(record.quantity).toBe(cptTransformedRecord.quantity);
            expect(record.stampTime).toBe(cptTransformedRecord.stampTime);
            expect(record.summary).toBe(cptTransformedRecord.summary);
            expect(record.type).toBe(cptTransformedRecord.type);
            expect(record.uid).toBe(cptTransformedRecord.uid);
        });
    });

     it('Job was removed', function() {
            var finished = false;
            runs(function() {
                xformer(log, null, null, removedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:cpt:9E7A:3:1646');
                    expect(record.pid).toEqual('9E7A;3');
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