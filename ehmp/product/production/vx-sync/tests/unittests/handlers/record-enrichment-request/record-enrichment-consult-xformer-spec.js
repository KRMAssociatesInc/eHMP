'use strict';
//------------------------------------------------------------------------------------
// This contains a set of integration tests for record-enrichment-appointment-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-consult-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-allergy-xformer-spec',
//     level: 'debug'
// });

var originalVaConsultRecord = {
    'activity': [{
        'dateTime': 20040401225707,
        'entered': 20040401225707,
        'enteredBy': 'PATHOLOGY,ONE',
        'name': 'CPRS RELEASED ORDER',
        'responsible': 'PATHOLOGY,ONE'
    }, {
        'dateTime': 20040401225801,
        'entered': 20040401225801,
        'enteredBy': 'PATHOLOGY,ONE',
        'name': 'COMPLETE/UPDATE',
        'responsible': 'PATHOLOGY,ONE',
        'resultUid': 'urn:va:document:9E7A:3:3112'
    }],
    'providers': [{
        'providerUid': 'urn:va:user:9E7A:111',
        'providerName': 'BHIE, USERONE'
    }],
    'modifiers': [{
        name: 'someName'
    }],
    'category': 'C',
    'consultProcedure': 'Consult',
    'dateTime': 20040401225707,
    'earliestDate': 20040401225707,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'fromService': 'GENERAL MEDICINE',
    'lastAction': 'COMPLETE/UPDATE',
    'lastUpdateTime': 20040401225801,
    'localId': 381,
    'orderName': 'AUDIOLOGY OUTPATIENT',
    'orderUid': 'urn:va:order:9E7A:3:15479',
    'patientClassCode': 'urn:va:patient-class:AMB',
    'patientClassName': 'Ambulatory',
    'pid': '9E7A;3',
    'place': 'Consultant\'s choice',
    'providerName': 'PATHOLOGY,ONE',
    'providerUid': 'urn:va:user:9E7A:11748',
    'reason': '86 year old MALE referred for suspected hearing loss.',
    'results': [{
        'localTitle': 'AUDIOLOGY - HEARING LOSS CONSULT',
        'uid': 'urn:va:document:9E7A:3:3112'
    }],
    'service': 'AUDIOLOGY OUTPATIENT',
    'stampTime': 20040401225801,
    'statusName': 'COMPLETE',
    'typeName': 'AUDIOLOGY OUTPATIENT Cons',
    'uid': 'urn:va:consult:9E7A:3:381',
    'urgency': 'Routine'
};

var originalVaConsultJob = {
    record: originalVaConsultRecord
};

var originalDodConsultRecord = {
    'content': 'This is a test for clinical note.',
    'documentTypeName': 'Consultation Note (Provider) Document',
    'dodComplexNoteUri': 'http://localhost:8082/documents?dir=444f443b30303030303030303033/1000000649&file=7e5050a76ad637c9bc268983cbd757a9861171f5.html',
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'localTitle': 'Consultation Note (Provider) Document',
    'pid': 'DOD;0000000003',
    'referenceDateTime': '20140110151524',
    'sensitive': false,
    'stampTime': '20150303061147',
    'status': 'COMPLETED',
    'statusDisplayName': 'Completed',
    'text': null,
    'uid': 'urn:va:consult:DOD:0000000003:1000000649'
};
var originalDodConsultJob = {
    record: originalDodConsultRecord
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:consult:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

describe('record-enrichment-consult-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA consult', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaConsultJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Providers
                    //----------
                    expect(record.providers).toBeTruthy();
                    expect(record.providers.length).toEqual(1);
                    expect(record.providers[0].uid).toEqual(originalVaConsultRecord.providers[0].providerUid);
                    expect(record.providers[0].providerDisplayName).toEqual('Bhie, Userone');
                    expect(record.providers[0].summary).toEqual('ProcedureProvider{uid=\'' + originalVaConsultRecord.providers[0].providerUid + '\'}');
                    expect(record.providerUid).toEqual(originalVaConsultRecord.providerUid);
                    expect(record.providerName).toEqual(originalVaConsultRecord.providerName);
                    expect(record.providerDisplayName).toEqual('Pathology,One');

                    // Results
                    //-----------
                    expect(record.results).toBeTruthy();
                    expect(record.results.length).toEqual(1);
                    expect(record.results[0].summary).toEqual('ProcedureResult{uid=\'' + originalVaConsultRecord.results[0].uid + '\'}');

                    // Modifiers
                    //--------
                    expect(record.modifiers).toBeTruthy();
                    expect(record.modifiers.length).toEqual(1);
                    expect(record.modifiers[0].summary).toEqual('Modifier{uid=\'\'}');

                    expect(record.kind).toEqual('Consult');
                    expect(record.summary).toEqual(originalVaConsultRecord.typeName);

                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.earliestDate).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with Dod Consult', function() {
            var finished = false;
            var environment = {};
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalDodConsultJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Checking some \'else\' logic conditions', function() {
            var finished = false;
            var environment = {};
            var config = {};

            var consultRecord = {
                'activity': [{
                    'dateTime': 20040401225707,
                    'entered': 20040401225707,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'CPRS RELEASED ORDER',
                    'responsible': 'PATHOLOGY,ONE'
                }, {
                    'dateTime': 20040401225801,
                    'entered': 20040401225801,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'COMPLETE/UPDATE',
                    'responsible': 'PATHOLOGY,ONE',
                    'resultUid': 'urn:va:document:9E7A:3:3112'
                }],
                'providers': [{
                    'providerUid': 'urn:va:user:9E7A:111',
                    'providerName': 'BHIE, USERONE'
                }],
                'modifiers': [{
                    name: 'someName'
                }],
                'category': 'RA',                               // Change Kind to Imaging
                'consultProcedure': 'Consult',
                'dateTime': 20040401225707,
                'earliestDate': 20040401225707,
                'facilityCode': 500,
                'facilityName': 'CAMP MASTER',
                'fromService': 'GENERAL MEDICINE',
                'lastAction': 'COMPLETE/UPDATE',
                'lastUpdateTime': 20040401225801,
                'localId': 381,
                'orderName': 'AUDIOLOGY OUTPATIENT',
                'orderUid': 'urn:va:order:9E7A:3:15479',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'pid': '9E7A;3',
                'place': 'Consultant\'s choice',
                // 'providerName': 'PATHOLOGY,ONE',             // force to get these from the provider array
                // 'providerUid': 'urn:va:user:9E7A:11748',
                'reason': '86 year old MALE referred for suspected hearing loss.',
                'results': [{
                    'localTitle': 'AUDIOLOGY - HEARING LOSS CONSULT',
                    'uid': 'urn:va:document:9E7A:3:3112'
                }],
                'service': 'AUDIOLOGY OUTPATIENT',
                'stampTime': 20040401225801,
                'statusName': 'COMPLETE',
                //'typeName': 'AUDIOLOGY OUTPATIENT Cons',      // Will cause summary to be empty
                'uid': 'urn:va:consult:9E7A:3:381',
                'urgency': 'Routine'
            };

            var consultJob = {
                record: consultRecord
            };

            runs(function() {
                xformer(log, config, environment, consultJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Providers
                    //----------
                    expect(record.providers).toBeTruthy();
                    expect(record.providers.length).toEqual(1);
                    expect(record.providers[0].uid).toEqual(originalVaConsultRecord.providers[0].providerUid);
                    expect(record.providers[0].providerDisplayName).toEqual('Bhie, Userone');
                    expect(record.providers[0].summary).toEqual('ProcedureProvider{uid=\'' + originalVaConsultRecord.providers[0].providerUid + '\'}');
                    expect(record.providerUid).toEqual(originalVaConsultRecord.providers[0].providerUid);
                    expect(record.providerName).toEqual(originalVaConsultRecord.providers[0].providerName);
                    expect(record.providerDisplayName).toEqual('Bhie, Userone');

                    // Results
                    //-----------
                    expect(record.results).toBeTruthy();
                    expect(record.results.length).toEqual(1);
                    expect(record.results[0].summary).toEqual('ProcedureResult{uid=\'' + originalVaConsultRecord.results[0].uid + '\'}');

                    // Modifiers
                    //--------
                    expect(record.modifiers).toBeTruthy();
                    expect(record.modifiers.length).toEqual(1);
                    expect(record.modifiers[0].summary).toEqual('Modifier{uid=\'\'}');

                    expect(record.kind).toEqual('Imaging');
                    expect(record.summary).toEqual('');

                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.earliestDate).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Checking one more kind logic conditions', function() {
            var finished = false;
            var environment = {};
            var config = {};

            var consultRecord = {
                'activity': [{
                    'dateTime': 20040401225707,
                    'entered': 20040401225707,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'CPRS RELEASED ORDER',
                    'responsible': 'PATHOLOGY,ONE'
                }, {
                    'dateTime': 20040401225801,
                    'entered': 20040401225801,
                    'enteredBy': 'PATHOLOGY,ONE',
                    'name': 'COMPLETE/UPDATE',
                    'responsible': 'PATHOLOGY,ONE',
                    'resultUid': 'urn:va:document:9E7A:3:3112'
                }],
                'providers': [{
                    'providerUid': 'urn:va:user:9E7A:111',
                    'providerName': 'BHIE, USERONE'
                }],
                'modifiers': [{
                    name: 'someName'
                }],
                'category': 'SOMETHING',                               // Changes Kind to Procedure
                'consultProcedure': 'Consult',
                'dateTime': 20040401225707,
                'earliestDate': 20040401225707,
                'facilityCode': 500,
                'facilityName': 'CAMP MASTER',
                'fromService': 'GENERAL MEDICINE',
                'lastAction': 'COMPLETE/UPDATE',
                'lastUpdateTime': 20040401225801,
                'localId': 381,
                'orderName': 'AUDIOLOGY OUTPATIENT',
                'orderUid': 'urn:va:order:9E7A:3:15479',
                'patientClassCode': 'urn:va:patient-class:AMB',
                'patientClassName': 'Ambulatory',
                'pid': '9E7A;3',
                'place': 'Consultant\'s choice',
                // 'providerName': 'PATHOLOGY,ONE',             // force to get these from the provider array
                // 'providerUid': 'urn:va:user:9E7A:11748',
                'reason': '86 year old MALE referred for suspected hearing loss.',
                'results': [{
                    'localTitle': 'AUDIOLOGY - HEARING LOSS CONSULT',
                    'uid': 'urn:va:document:9E7A:3:3112'
                }],
                'service': 'AUDIOLOGY OUTPATIENT',
                'stampTime': 20040401225801,
                'statusName': 'COMPLETE',
                //'typeName': 'AUDIOLOGY OUTPATIENT Cons',      // Will cause summary to be empty
                'uid': 'urn:va:consult:9E7A:3:381',
                'urgency': 'Routine'
            };

            var consultJob = {
                record: consultRecord
            };

            runs(function() {
                xformer(log, config, environment, consultJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Providers
                    //----------
                    expect(record.providers).toBeTruthy();
                    expect(record.providers.length).toEqual(1);
                    expect(record.providers[0].uid).toEqual(originalVaConsultRecord.providers[0].providerUid);
                    expect(record.providers[0].providerDisplayName).toEqual('Bhie, Userone');
                    expect(record.providers[0].summary).toEqual('ProcedureProvider{uid=\'' + originalVaConsultRecord.providers[0].providerUid + '\'}');
                    expect(record.providerUid).toEqual(originalVaConsultRecord.providers[0].providerUid);
                    expect(record.providerName).toEqual(originalVaConsultRecord.providers[0].providerName);
                    expect(record.providerDisplayName).toEqual('Bhie, Userone');

                    // Results
                    //-----------
                    expect(record.results).toBeTruthy();
                    expect(record.results.length).toEqual(1);
                    expect(record.results[0].summary).toEqual('ProcedureResult{uid=\'' + originalVaConsultRecord.results[0].uid + '\'}');

                    // Modifiers
                    //--------
                    expect(record.modifiers).toBeTruthy();
                    expect(record.modifiers.length).toEqual(1);
                    expect(record.modifiers[0].summary).toEqual('Modifier{uid=\'\'}');

                    expect(record.kind).toEqual('Procedure');
                    expect(record.summary).toEqual('');

                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.earliestDate).toEqual('string');
                    expect(typeof record.dateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job was null', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, null, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeNull();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job.record was null', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, {}, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeNull();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job was removed', function() {
            var finished = false;
            var environment = {};
            runs(function() {
                xformer(log, config, environment, removedJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:consult:DOD:0000000003:1000010340');
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
});