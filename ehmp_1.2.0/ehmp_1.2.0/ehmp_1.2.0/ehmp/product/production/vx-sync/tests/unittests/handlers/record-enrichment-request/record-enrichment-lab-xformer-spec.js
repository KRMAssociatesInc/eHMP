'use strict';


require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-lab-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');

var labTransformedRecord1 = {
                'facilityCode': '561',
                'facilityName': 'New Jersey HCS',
                'groupName': 'CH 0402 9',
                'groupUid': 'urn:va:accession:ABCD:15:CH;7089596.8377',
                'categoryCode': 'urn:va:lab-category:CH',
                'categoryName': 'Laboratory',
                'observed': '199104021623',
                'resulted': '199104021634',
                'specimen': 'SERUM',
                'comment': 'Ordering Provider: Sixteen Provider Report Released Date/Time: Apr 02, 1991@16:34\r\n ',
                'typeCode': 'urn:lnc:2344-0',
                'displayName': 'GLUCOSE',
                'result': '106',
                'units': 'mg/dL',
                'low': '60',
                'high': '110',
                'kind': 'Laboratory',
                'resultNumber': 106,
                'abnormal': false,
                'micro': false,
                'qualifiedName': 'GLUCOSE (SERUM)',
                'uid': 'urn:va:lab:ABCD:15:CH;7089596.8377;2',
                'summary': 'GLUCOSE (SERUM) 106 mg/dL',
                'pid': 'HDR;10108V420871',
                'localId': 'CH;7089596.8377;2',
                'typeName': 'GLUCOSE',
                'codes': [
                    {
                        'system': 'http://loinc.org',
                        'code': '2344-0',
                        'display': 'Glucose [Mass/volume] in Body fluid'
                    }
                ],
                'lnccodes': [
                    'urn:va:vuid:4665449',
                    'urn:lnc:2344-0',
                    'urn:src:V-LNC',
                    'urn:lnc:MTHU000001',
                    'urn:lnc:LP65098-3',
                    'urn:lnc:LP40271-6',
                    'urn:lnc:LP40317-7',
                    'urn:lnc:MTHU000049',
                    'urn:lnc:LP31388-9',
                    'urn:lnc:MTHU000998',
                    'urn:lnc:MTHU000999',
                    'urn:lnc:LP31399-6',
                    'urn:lnc:LP14635-4',
                    'urn:lnc:LP43631-8',
                    'urn:lnc:LP32744-2',
                    'urn:lnc:LP40474-6'
                ],
                'statusCode': 'urn:va:lab-status:completed',
                'statusName': 'completed',
                'displayOrder': 1,
                'typeId': 175,
                'vuid': 'urn:va:vuid:4665449',
                'stampTime': '20061102143219',
                'lastUpdateTime': '20061102143219',
                'sample': 'BLOOD  '
    };
var labRecord1 = {
                'facilityCode': 561,
                'facilityName': 'New Jersey HCS',
                'groupName': 'CH 0402 9',
                'groupUid': 'urn:va:accession:ABCD:15:CH;7089596.8377',
                'categoryCode': 'urn:va:lab-category:CH',
                'categoryName': 'Laboratory',
                'observed': 199104021623,
                'resulted': 199104021634,
                'specimen': 'SERUM',
                'comment': 'Ordering Provider: Sixteen Provider Report Released Date/Time: Apr 02, 1991@16:34\r\n ',
                'typeCode': 'urn:lnc:2344-0',
                'displayName': 'GLUCOSE',
                'result': 106,
                'units': 'mg/dL',
                'low': 60,
                'high': 110,
                'uid': 'urn:va:lab:ABCD:15:CH;7089596.8377;2',
                'pid': 'HDR;10108V420871',
                'localId': 'CH;7089596.8377;2',
                'typeName': 'GLUCOSE',
                'statusCode': 'urn:va:lab-status:completed',
                'statusName': 'completed',
                'displayOrder': 1,
                'typeId': 175,
                'vuid': 'urn:va:vuid:4665449',
                'stampTime': 20061102143219,
                'lastUpdateTime': 20061102143219,
                'sample': 'BLOOD  '
    };

var dodLabRecord1 = {
                'facilityCode': 'DOD',
                'facilityName': '4th Medical Group/0090',
                'categoryCode': 'urn:va:lab-category:MI',
                'categoryName': 'Laboratory',
                'observed': 20070621102500,
                'resulted': 20070621142601,
                'specimen': 'PLASMA',
                'orderId': 23564646,
                'comment': '',
                'displayName': 'Ammonia, Plasma Quantitative',
                'result': 5,
                'units': 'mcg/dL',
                'interpretationCode': 'urn:hl7:observation-interpretation:L',
                'low': 19,
                'high': 60,
                'resultNumber': 5,
                'uid': 'urn:va:lab:DOD:0000000003:20070621102500_070621-LC-326-CH_44829',
                'pid': 'DOD;0000000003',
                'localId': '070621 LC 326^CH',
                'typeName': 'Ammonia, Plasma Quantitative',
                'interpretationName': 'Low',
                'codes': [
                    {
                        'code': '44829',
                        'system': 'DOD_NCID'
                    }
                ],
                'statusCode': 'urn:va:lab-status:completed',
                'organizerType': 'organizerType',
                'statusName': 'completed',
                'stampTime': 20061102143219,
                'lastUpdateTime': 20061102143219
    };
var dodLabRecordTransformed1 = {
                'facilityCode': 'DOD',
                'facilityName': '4th Medical Group/0090',
                'categoryCode': 'urn:va:lab-category:MI',
                'categoryName': 'Laboratory',
                'observed': '20070621102500',
                'resulted': '20070621142601',
                'specimen': 'PLASMA',
                'orderId': '23564646',
                'comment': '',
                'displayName': 'Ammonia, Plasma Quantitative',
                'result': '5',
                'units': 'mcg/dL',
                'interpretationCode': 'urn:hl7:observation-interpretation:L',
                'low': '19',
                'high': '60',
                'kind': 'Laboratory',
                'resultNumber': 5,
                'abnormal': true,
                'micro': true,
                'qualifiedName': 'Ammonia, Plasma Quantitative (PLASMA)',
                'uid': 'urn:va:lab:DOD:0000000003:20070621102500_070621-LC-326-CH_44829',
                'summary': 'Ammonia, Plasma Quantitative (PLASMA) 5<em>L</em> mcg/dL',
                'pid': 'DOD;0000000003',
                'localId': '070621 LC 326^CH',
                'typeName': 'Ammonia, Plasma Quantitative',
                'interpretationName': 'Low',
                'codes': [
                    {
                        'code': '44829',
                        'system': 'DOD_NCID'
                    },
                    {
                        'code': '22763-7',
                        'system': 'http://loinc.org',
                        'display': 'Ammonia [Mass/volume] in Plasma'
                    }
                ],
                'lnccodes': [],
                'statusCode': 'urn:va:lab-status:completed',
                'organizerType': 'organizerType',
                'statusName': 'completed',
                'stampTime': '20061102143219',
                'lastUpdateTime': '20061102143219'
    };

var fakeRecordTransformed1 = { facilityCode: '561',
              facilityName: 'New Jersey HCS',
              groupName: 'CH 0402 9',
              groupUid: 'urn:va:accession:ABCD:15:CH;7089596.8377',
              categoryCode: 'urn:va:lab-category:CH',
              observed: '199104021623',
              resulted: '199104021634',
              comment: 'Ordering Provider: Sixteen Provider Report Released Date/Time: Apr 02, 1991@16:34\r\n ',
              displayName: 'GLUCOSE',
              low: '60',
              codes:
               [ { system: 'http://loinc.org',
                   code: '2344-0',
                   display: 'Glucose [Mass/volume] in Body fluid' } ],
              high: '110',
              uid: 'urn:va:lab:ABCD:15:CH;7089596.8377;2',
              pid: 'HDR;10108V420871',
              localId: 'CH;7089596.8377;2',
              typeName: 'GLUCOSE',
              statusCode: 'urn:va:lab-status:completed',
              statusName: 'completed',
              displayOrder: 1,
              typeId: 175,
              stampTime: '20061102143219',
              lastUpdateTime: '20061102143219',
              sample: 'BLOOD  ',
              kind: 'Unknown',
              abnormal: false,
              micro: false,
              qualifiedName: 'GLUCOSE',
              summary: 'GLUCOSE',
              lnccodes: []
    };

var fakeRecord1 = {
                'facilityCode': 561,
                'facilityName': 'New Jersey HCS',
                'groupName': 'CH 0402 9',
                'groupUid': 'urn:va:accession:ABCD:15:CH;7089596.8377',
                'categoryCode': 'urn:va:lab-category:CH',
                'observed': 199104021623,
                'resulted': 199104021634,
                'comment': 'Ordering Provider: Sixteen Provider Report Released Date/Time: Apr 02, 1991@16:34\r\n ',
                'displayName': 'GLUCOSE',
                'low': 60,
                'codes': [
                    {
                        'system': 'http://loinc.org',
                        'code': '2344-0',
                        'display': 'Glucose [Mass/volume] in Body fluid'
                    }
                ],
                'high': 110,
                'uid': 'urn:va:lab:ABCD:15:CH;7089596.8377;2',
                'pid': 'HDR;10108V420871',
                'localId': 'CH;7089596.8377;2',
                'typeName': 'GLUCOSE',
                'statusCode': 'urn:va:lab-status:completed',
                'statusName': 'completed',
                'displayOrder': 1,
                'typeId': 175,
                'stampTime': 20061102143219,
                'lastUpdateTime': 20061102143219,
                'sample': 'BLOOD  '
    };

var environment = {
    terminologyUtils: {
        getVALoincConcept: function(code, callback) {
            callback(null, {
                ancestors: [
                    'urn:va:vuid:4665449',
                    'urn:src:V-LNC',
                    'urn:lnc:MTHU000001',
                    'urn:lnc:LP65098-3',
                    'urn:lnc:LP40271-6',
                    'urn:lnc:LP40317-7',
                    'urn:lnc:MTHU000049',
                    'urn:lnc:LP31388-9',
                    'urn:lnc:MTHU000998',
                    'urn:lnc:MTHU000999',
                    'urn:lnc:LP31399-6',
                    'urn:lnc:LP14635-4',
                    'urn:lnc:LP43631-8',
                    'urn:lnc:LP32744-2',
                    'urn:lnc:LP40474-6'
                    ]
            });
        }
    }
};

var removedRecord = {
    'pid': 'CDS;10108V420871',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:lab:ABCD:15:CH;7089596.8377;2'
};

var removedJob = {
    record: removedRecord
};

describe('record-enrichment-lab-xformer.js', function(){

    it('Job was removed', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, null, environment, removedJob, function(error, record) {
                    expect(error).toBeFalsy();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:lab:ABCD:15:CH;7089596.8377;2');
                    expect(record.pid).toEqual('CDS;10108V420871');
                    expect(record.stampTime).toEqual('20150226124943');
                    expect(record.removed).toEqual(true);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });


    it('Cover all conditional paths', function(){
        xformer(log, null, environment, {record: fakeRecord1}, function(error, record){
            expect(error).toBeFalsy();
            expect(record).toBeTruthy();
            expect(record.resultNumber).toBeUndefined();
            expect(record.facilityName).toBe(fakeRecordTransformed1.facilityName);
            expect(record.groupName).toBe(fakeRecordTransformed1.groupName);
            expect(record.groupUid).toBe(fakeRecordTransformed1.groupUid);
            expect(record.categoryCode).toBe(fakeRecordTransformed1.categoryCode);
            expect(record.observed).toBe(fakeRecordTransformed1.observed);
            expect(record.resulted).toBe(fakeRecordTransformed1.resulted);
            expect(record.comment).toBe(fakeRecordTransformed1.comment);
            expect(record.displayName).toBe(fakeRecordTransformed1.displayName);
            expect(record.low).toBe(fakeRecordTransformed1.low);
            expect(record.codes).toBeDefined();
            expect(record.codes.length).toBe(fakeRecordTransformed1.codes.length);
            expect(record.codes).toEqual(fakeRecordTransformed1.codes);
            expect(record.high).toBe(fakeRecordTransformed1.high);
            expect(record.uid).toBe(fakeRecordTransformed1.uid);
            expect(record.pid).toBe(fakeRecordTransformed1.pid);
            expect(record.localId).toBe(fakeRecordTransformed1.localId);
            expect(record.typeName).toBe(fakeRecordTransformed1.typeName);
            expect(record.statusCode).toBe(fakeRecordTransformed1.statusCode);
            expect(record.lastUpdateTime).toBe(fakeRecordTransformed1.lastUpdateTime);
            expect(record.sample).toBe(fakeRecordTransformed1.sample);
            expect(record.kind).toBe(fakeRecordTransformed1.kind);
            expect(record.abnormal).toBe(fakeRecordTransformed1.abnormal);
            expect(record.micro).toBe(fakeRecordTransformed1.micro);
            expect(record.qualifiedName).toBe(fakeRecordTransformed1.qualifiedName);
            expect(record.summary).toBe(fakeRecordTransformed1.summary);
            expect(record.lnccodes).toBeDefined();
            expect(record.lnccodes).toEqual(fakeRecordTransformed1.lnccodes);
        });
    });
    it('transform VA lab record',function(){
        environment.terminologyUtils.getJlvMappedCode = function(type, code, callback) {
            callback(null, {
                        'code': '2344-0',
                        'codeSystem': 'http://loinc.org',
                        'displayText': 'Glucose [Mass/volume] in Body fluid'
                    });
        };
        xformer(log, null, environment, {record: labRecord1}, function(error, record){
            expect(error).toBeFalsy();
            expect(record).toBeTruthy();
            expect(record.facilityCode).toBe(labTransformedRecord1.facilityCode);
            expect(record.facilityName).toBe(labTransformedRecord1.facilityName);
            expect(record.groupName).toBe(labTransformedRecord1.groupName);
            expect(record.groupUid).toBe(labTransformedRecord1.groupUid);
            expect(record.categoryCode).toBe(labTransformedRecord1.categoryCode);
            expect(record.categoryName).toBe(labTransformedRecord1.categoryName);
            expect(record.observed).toBe(labTransformedRecord1.observed);
            expect(record.resulted).toBe(labTransformedRecord1.resulted);
            expect(record.specimen).toBe(labTransformedRecord1.specimen);
            expect(record.comment).toBe(labTransformedRecord1.comment);
            expect(record.typeCode).toBe(labTransformedRecord1.typeCode);
            expect(record.displayName).toBe(labTransformedRecord1.displayName);
            expect(record.result).toBe(labTransformedRecord1.result);
            expect(record.units).toBe(labTransformedRecord1.units);
            expect(record.low).toBe(labTransformedRecord1.low);
            expect(record.high).toBe(labTransformedRecord1.high);
            expect(record.kind).toBe(labTransformedRecord1.kind);
            expect(record.resultNumber).toBe(labTransformedRecord1.resultNumber);
            expect(record.abnormal).toBe(labTransformedRecord1.abnormal);
            expect(record.micro).toBe(labTransformedRecord1.micro);
            expect(record.qualifiedName).toBe(labTransformedRecord1.qualifiedName);
            expect(record.uid).toBe(labTransformedRecord1.uid);
            expect(record.summary).toBe(labTransformedRecord1.summary);
            expect(record.pid).toBe(labTransformedRecord1.pid);
            expect(record.localId).toBe(labTransformedRecord1.localId);
            expect(record.typeName).toBe(labTransformedRecord1.typeName);
            expect(record.codes).toBeDefined();
            expect(record.codes.length).toBe(labTransformedRecord1.codes.length);
            expect(record.codes).toEqual(labTransformedRecord1.codes);
            expect(record.lnccodes).toBeDefined();
            expect(record.lnccodes.length).toBe(labTransformedRecord1.lnccodes.length);
            expect(record.lnccodes).toEqual(labTransformedRecord1.lnccodes);
            expect(record.statusCode).toBe(labTransformedRecord1.statusCode);
            expect(record.statusName).toBe(labTransformedRecord1.statusName);
            expect(record.displayOrder).toBe(labTransformedRecord1.displayOrder);
            expect(record.typeId).toBe(labTransformedRecord1.typeId);
            expect(record.vuid).toBe(labTransformedRecord1.vuid);
            expect(record.stampTime).toBe(labTransformedRecord1.stampTime);
            expect(record.lastUpdateTime).toBe(labTransformedRecord1.lastUpdateTime);
            expect(record.sample).toBe(labTransformedRecord1.sample);
        });
    });
    

    it('transform DOD lab record',function(){
        environment.terminologyUtils.getJlvMappedCode = function(type, code, callback) {
            callback(null, {
                        'code': '22763-7',
                        'codeSystem': 'http://loinc.org',
                        'displayText': 'Ammonia [Mass/volume] in Plasma'
                    });
        };
        xformer(log, null, environment, {record: dodLabRecord1}, function(error, record){
            expect(error).toBeFalsy();
            expect(record).toBeTruthy();
            expect(record.facilityCode).toBe(dodLabRecordTransformed1.facilityCode);
            expect(record.facilityName).toBe(dodLabRecordTransformed1.facilityName);
            expect(record.groupName).toBe(dodLabRecordTransformed1.groupName);
            expect(record.groupUid).toBe(dodLabRecordTransformed1.groupUid);
            expect(record.categoryCode).toBe(dodLabRecordTransformed1.categoryCode);
            expect(record.categoryName).toBe(dodLabRecordTransformed1.categoryName);
            expect(record.observed).toBe(dodLabRecordTransformed1.observed);
            expect(record.resulted).toBe(dodLabRecordTransformed1.resulted);
            expect(record.specimen).toBe(dodLabRecordTransformed1.specimen);
            expect(record.comment).toBe(dodLabRecordTransformed1.comment);
            expect(record.typeCode).toBe(dodLabRecordTransformed1.typeCode);
            expect(record.displayName).toBe(dodLabRecordTransformed1.displayName);
            expect(record.result).toBe(dodLabRecordTransformed1.result);
            expect(record.units).toBe(dodLabRecordTransformed1.units);
            expect(record.low).toBe(dodLabRecordTransformed1.low);
            expect(record.high).toBe(dodLabRecordTransformed1.high);
            expect(record.kind).toBe(dodLabRecordTransformed1.kind);
            expect(record.resultNumber).toBe(dodLabRecordTransformed1.resultNumber);
            expect(record.abnormal).toBe(dodLabRecordTransformed1.abnormal);
            expect(record.micro).toBe(dodLabRecordTransformed1.micro);
            expect(record.qualifiedName).toBe(dodLabRecordTransformed1.qualifiedName);
            expect(record.uid).toBe(dodLabRecordTransformed1.uid);
            expect(record.summary).toBe(dodLabRecordTransformed1.summary);
            expect(record.pid).toBe(dodLabRecordTransformed1.pid);
            expect(record.localId).toBe(dodLabRecordTransformed1.localId);
            expect(record.typeName).toBe(dodLabRecordTransformed1.typeName);
            expect(record.codes).toBeDefined();
            expect(record.codes.length).toBe(dodLabRecordTransformed1.codes.length);
            expect(record.codes).toEqual(dodLabRecordTransformed1.codes);
            expect(record.lnccodes).toBeDefined();
            expect(record.lnccodes.length).toBe(dodLabRecordTransformed1.lnccodes.length);
            expect(record.lnccodes).toEqual(dodLabRecordTransformed1.lnccodes);
            expect(record.statusCode).toBe(dodLabRecordTransformed1.statusCode);
            expect(record.statusName).toBe(dodLabRecordTransformed1.statusName);
            expect(record.displayOrder).toBe(dodLabRecordTransformed1.displayOrder);
            expect(record.typeId).toBe(dodLabRecordTransformed1.typeId);
            expect(record.vuid).toBe(dodLabRecordTransformed1.vuid);
            expect(record.stampTime).toBe(dodLabRecordTransformed1.stampTime);
            expect(record.lastUpdateTime).toBe(dodLabRecordTransformed1.lastUpdateTime);
            expect(record.sample).toBe(dodLabRecordTransformed1.sample);
        });
    });
});