'use strict';
require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-problem-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-allergy-xformer-spec',
//     level: 'debug'
// });

var originalVaProblem = {
    'acuityCode': 'urn:va:prob-acuity:c',
    'acuityName': 'chronic',
    'entered': 20000508,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'icdCode': 'urn:icd:250.00',
    'icdName': 'DIABETES MELLI W/O COMP TYP II',
    'lastUpdateTime': 20040330000000,
    'localId': 183,
    'locationName': 'PRIMARY CARE',
    'locationUid': 'urn:va:location:9E7A:32',
    'onset': 19980502,
    'pid': '9E7A;3',
    'problemText': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
    'providerName': 'VEHU,EIGHT',
    'providerUid': 'urn:va:user:9E7A:20010',
    'removed': false,
    'serviceConnected': false,
    'stampTime': 20040330000000,
    'statusCode': 'urn:sct:55561003',
    'statusName': 'ACTIVE',
    'uid': 'urn:va:problem:9E7A:3:183',
    'unverified': false,
    'updated': 20040330
};

var originalDodProblem = {
    'acuityName': 'Chronic',
    'codes': [
        {
            'code': '115286',
            'display': '',
            'system': 'DOD_MEDCIN'
        }
    ],
    'entered': '20140402195701',
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'icdCode': '',
    'kind': 'Problem',
    'locationDisplayName': '4th Medical Group',
    'locationName': '4th Medical Group',
    'onset': '18991230050000',
    'pid': 'DOD;0000000003',
    'problemText': 'visit for: daycare exam',
    'providerDisplayName': 'BHIE, USERONE',
    'providerName': 'BHIE, USERONE',
    'serviceConnected': false,
    'stampTime': '20150316100549',
    'statusDisplayName': 'Active',
    'statusName': 'Active',
    'summary': 'visit for: daycare exam',
    'uid': 'urn:va:problem:DOD:0000000003:1000000523',
    'updated': '20140402195701'
};

var originalNonVaDodProblem = {
    'acuityCode': 'urn:va:prob-acuity:a',
    'acuityName': 'acute',
    'comments': [
        {
            'comment': 'SHERIDAN PROBLEM',
            'entered': 19960514,
            'enteredByCode': 'urn:va:user:ABCD:755',
            'enteredByName': 'PROGRAMMER,TWENTY'
        }
    ],
    'entered': 19960514,
    'facilityCode': 561,
    'facilityName': 'New Jersey HCS',
    'icdCode': 'urn:icd:411.1',
    'icdName': 'INTERMED CORONARY SYND',
    'localId': 58,
    'onset': 19960315,
    'pid': 'HDR;10108V420871',
    'problemText': 'Occasional, uncontrolled chest pain (ICD-9-CM 411.1)',
    'providerName': 'PROGRAMMER,TWENTY',
    'providerUid': 'urn:va:user:ABCD:755',
    'removed': false,
    'service': 'MEDICINE',
    'serviceConnected': false,
    'stampTime': '20150316100549',
    'statusCode': 'urn:sct:55561003',
    'statusName': 'ACTIVE',
    'uid': 'urn:va:problem:ABCD:17:58',
    'unverified': false,
    'updated': 19960514
};

var removedRecord = {
    'pid': '9E7A;3',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:problem:9E7A:3:183'
};

var removedJob = {
    record: removedRecord
};

var config = {};

var CODE_SYSTEMS = {
    CODE_SYSTEM_SNOMEDCT: 'http://snomed.info/sct',
    SYSTEM_DOD_MEDCIN: 'DOD_MEDCIN'
};

var jlvMappedCodeValue = {
    code: 'SomeCode',
    codeSystem: CODE_SYSTEMS.CODE_SYSTEM_SNOMEDCT,
    displayText: 'SomeText'
};
var jdsCodedValue = {
    code: jlvMappedCodeValue.code,
    system: jlvMappedCodeValue.codeSystem,
    display: jlvMappedCodeValue.displayText
};

//-----------------------------------------------------------------------------
// Mock JLV function that simulates the return of a valuid JLV terminology
// mapping.
//
// parameters are ignored for this mock...
//-----------------------------------------------------------------------------
function getJlvMappedCode_ReturnValidCode(mappingType, sourceCode, callback) {
    return callback(null, jlvMappedCodeValue);
}

describe('record-enrichment-problem-xformer', function(){
    describe('transformAndEnrichRecord', function(){
         var environment = {
            terminologyUtils: {
                CODE_SYSTEMS: CODE_SYSTEMS,
                getJlvMappedCode: getJlvMappedCode_ReturnValidCode
            }
        };
        it('Normal path (VA data)', function(){
            var finished = false;

            runs(function(){
                xformer(log, config, environment, originalVaProblem, function(error, record){
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toEqual('Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)');
                    expect(record.providerDisplayName).toEqual('Vehu,Eight');
                    expect(record.locationDisplayName).toEqual('Primary Care');
                    expect(record.icdGroup).toEqual('250');
                    expect(record.kind).toEqual('Problem');
                    expect(record.statusDisplayName).toEqual('Active');
                    // expect(record.comments).toBeTruthy();
                    // expect(record.comments[0].summary).toEqual('ProblemComment{uid=\'\'}');

                    expect(typeof record.facilityCode).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.entered).toEqual('string');
                    expect(typeof record.onset).toEqual('string');
                    expect(typeof record.updated).toEqual('string');
                    //expect(typeof record.resolved).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.stampTime).toEqual('string');

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });
            waitsFor(function(){
                return finished;
            });
        });
        it('Normal path (DOD data)', function(){
            var finished = false;

            runs(function(){
                xformer(log, config, environment, originalDodProblem, function(error, record){
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toEqual('visit for: daycare exam');
                    expect(record.providerDisplayName).toEqual('Bhie, Userone');
                    expect(record.locationDisplayName).toEqual('4TH Medical Group');
                    expect(record.icdGroup).toBeUndefined();
                    expect(record.kind).toEqual('Problem');
                    expect(record.statusDisplayName).toEqual('Active');
                    // expect(record.comments).toBeTruthy();
                    // expect(record.comments[0].summary).toEqual('ProblemComment{uid=\'\'}');

                    expect(typeof record.facilityCode).toEqual('string');
                    //expect(typeof record.localId).toEqual('string');
                    expect(typeof record.entered).toEqual('string');
                    expect(typeof record.onset).toEqual('string');
                    expect(typeof record.updated).toEqual('string');
                    //expect(typeof record.resolved).toEqual('string');
                    expect(typeof record.stampTime).toEqual('string');

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });
            waitsFor(function(){
                return finished;
            });
        });
        it('Normal path (Other site data)', function(){
            var finished = false;

            runs(function(){
                xformer(log, config, environment, originalNonVaDodProblem, function(error, record){
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toEqual('Occasional, uncontrolled chest pain (ICD-9-CM 411.1)');
                    expect(record.providerDisplayName).toEqual('Programmer,Twenty');
                    //expect(record.locationDisplayName).toEqual('4th Medical Group');
                    expect(record.icdGroup).toEqual('411');
                    expect(record.kind).toEqual('Problem');
                    expect(record.statusDisplayName).toEqual('Active');
                    expect(record.comments).toBeTruthy();
                    expect(record.comments[0].summary).toEqual('ProblemComment{uid=\'\'}');

                    expect(typeof record.facilityCode).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.entered).toEqual('string');
                    expect(typeof record.onset).toEqual('string');
                    expect(typeof record.updated).toEqual('string');
                    //expect(typeof record.resolved).toEqual('string');
                    expect(typeof record.stampTime).toEqual('string');

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });
            waitsFor(function(){
                return finished;
            });
        });
        it('Error path: no job', function(){
            var finished = false;

            runs(function(){
                xformer(log, config, environment, null, function(error, record){
                    expect(error).toBeNull();
                    expect(record).toBeNull();
                    finished = true;
                });
            });
            waitsFor(function(){
                return finished;
            });
        });
        it('Job was removed', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, removedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:problem:9E7A:3:183');
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
});