'use strict';


require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-factor-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
var factorTransformedRecord1 = {
            'categoryName': 'DIABETES',
            'categoryUid': 'urn:va:factor-category:500002',
            'display': true,
            'encounterName': '20 MINUTE Nov 02, 2006',
            'encounterUid': 'urn:va:visit:9E7A:3:5537',
            'entered': '20061102143219',
            'facilityCode': '888',
            'facilityName': 'FT. LOGAN',
            'kind': 'Health Factor',
            'localId': '56',
            'lastUpdateTime': '20061102143219',
            'locationName': '20 MINUTE',
            'locationUid': 'urn:va:location:9E7A:240',
            'locationDisplayName': '20 Minute',
            'name': 'DIABETES DX ERROR',
            'stampTime': '20061102143219',
            'pid': '9E7A;3',
            'summary': 'DIABETES DX ERROR',
            'uid': 'urn:va:factor:9E7A:3:56'
        };
var factorRecord1 = {
            'categoryName': 'DIABETES',
            'categoryUid': 'urn:va:factor-category:500002',
            'display': true,
            'encounterName': '20 MINUTE Nov 02, 2006',
            'encounterUid': 'urn:va:visit:9E7A:3:5537',
            'entered': 20061102143219,
            'facilityCode': 888,
            'facilityName': 'FT. LOGAN',
            'kind': 'Health Factor',
            'localId': 56,
            'lastUpdateTime': 20061102143219,
            'locationName': '20 MINUTE',
            'locationUid': 'urn:va:location:9E7A:240',
            'name': 'DIABETES DX ERROR',
            'stampTime': 20061102143219,
            'pid': '9E7A;3',
            'summary': 'DIABETES DX ERROR',
            'uid': 'urn:va:factor:9E7A:3:56'
      };
var factorTransformedRecord2 = {
            'categoryName': 'DIABETES',
            'categoryUid': 'urn:va:factor-category:500002',
            'display': true,
            'encounterName': '20 MINUTE Nov 02, 2006',
            'encounterUid': 'urn:va:visit:9E7A:3:5537',
            'entered': '20061102143219',
            'facilityCode': '888',
            'facilityName': 'FT. LOGAN',
            'kind': 'Health Factor',
            'localId': '56',
            'lastUpdateTime': '20061102143219',
            'locationUid': 'urn:va:location:9E7A:240',
            'name': 'DIABETES DX ERROR',
            'stampTime': '20061102143219',
            'pid': '9E7A;3',
            'summary': 'DIABETES DX ERROR',
            'uid': 'urn:va:factor:9E7A:3:56'
        };
var factorRecord2 = {
            'categoryName': 'DIABETES',
            'categoryUid': 'urn:va:factor-category:500002',
            'display': true,
            'encounterName': '20 MINUTE Nov 02, 2006',
            'encounterUid': 'urn:va:visit:9E7A:3:5537',
            'entered': 20061102143219,
            'facilityCode': 888,
            'facilityName': 'FT. LOGAN',
            'kind': 'Health Factor',
            'localId': 56,
            'lastUpdateTime': 20061102143219,
            'locationUid': 'urn:va:location:9E7A:240',
            'name': 'DIABETES DX ERROR',
            'stampTime': 20061102143219,
            'pid': '9E7A;3',
            'summary': 'DIABETES DX ERROR',
            'uid': 'urn:va:factor:9E7A:3:56'
      };

var removedRecord = {
    'pid': '9E7A;3',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:factor:9E7A:3:56'
};

var removedJob = {
    record: removedRecord
};

describe('record-enrichment-factor-xformer.js', function(){
    it('transform factor record',function(){
        xformer(log, null, null, {record: factorRecord1}, function(error, record){
            expect(error).toBeFalsy();
            expect(record).toBeTruthy();
            expect(record.categoryName).toBe(factorTransformedRecord1.categoryName);
            expect(record.categoryUid).toBe(factorTransformedRecord1.categoryUid);
            expect(record.display).toBe(factorTransformedRecord1.display);
            expect(record.encounterName).toBe(factorTransformedRecord1.encounterName);
            expect(record.encounterUid).toBe(factorTransformedRecord1.encounterUid);
            expect(record.entered).toBe(factorTransformedRecord1.entered);
            expect(record.facilityCode).toBe(factorTransformedRecord1.facilityCode);
            expect(record.facilityName).toBe(factorTransformedRecord1.facilityName);
            expect(record.kind).toBe(factorTransformedRecord1.kind);
            expect(record.localId).toBe(factorTransformedRecord1.localId);
            expect(record.lastUpdateTime).toBe(factorTransformedRecord1.lastUpdateTime);
            expect(record.locationName).toBe(factorTransformedRecord1.locationName);
            expect(record.locationDisplayName).toBe(factorTransformedRecord1.locationDisplayName);
            expect(record.locationUid).toBe(factorTransformedRecord1.locationUid);
            expect(record.name).toBe(factorTransformedRecord1.name);
            expect(record.stampTime).toBe(factorTransformedRecord1.stampTime);
            expect(record.pid).toBe(factorTransformedRecord1.pid);
            expect(record.summary).toBe(factorTransformedRecord1.summary);
            expect(record.uid).toBe(factorTransformedRecord1.uid);
        });
    });
    it('transform factor record null location',function(){
        xformer(log, null, null, {record: factorRecord2}, function(error, record){
            expect(error).toBeFalsy();
            expect(record).toBeTruthy();
            expect(record.categoryName).toBe(factorTransformedRecord2.categoryName);
            expect(record.categoryUid).toBe(factorTransformedRecord2.categoryUid);
            expect(record.display).toBe(factorTransformedRecord2.display);
            expect(record.encounterName).toBe(factorTransformedRecord2.encounterName);
            expect(record.encounterUid).toBe(factorTransformedRecord2.encounterUid);
            expect(record.entered).toBe(factorTransformedRecord2.entered);
            expect(record.facilityCode).toBe(factorTransformedRecord2.facilityCode);
            expect(record.facilityName).toBe(factorTransformedRecord2.facilityName);
            expect(record.kind).toBe(factorTransformedRecord2.kind);
            expect(record.localId).toBe(factorTransformedRecord2.localId);
            expect(record.lastUpdateTime).toBe(factorTransformedRecord2.lastUpdateTime);
            expect(record.locationName).toBeUndefined();
            expect(record.locationDisplayName).toBeUndefined();
            expect(record.locationUid).toBe(factorTransformedRecord2.locationUid);
            expect(record.name).toBe(factorTransformedRecord2.name);
            expect(record.stampTime).toBe(factorTransformedRecord2.stampTime);
            expect(record.pid).toBe(factorTransformedRecord2.pid);
            expect(record.summary).toBe(factorTransformedRecord2.summary);
            expect(record.uid).toBe(factorTransformedRecord2.uid);
        });
    });
  it('Job was removed', function() {
      var finished = false;
      var environment = {};

      runs(function() {
          xformer(log, null, null, removedJob, function(error, record) {
              expect(error).toBeNull();
              expect(record).toBeTruthy();
              expect(record.uid).toEqual('urn:va:factor:9E7A:3:56');
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