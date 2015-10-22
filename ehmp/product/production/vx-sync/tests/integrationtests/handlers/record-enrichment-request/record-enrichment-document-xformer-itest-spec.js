'use strict';
//------------------------------------------------------------------------------------
// This contains a set of integration tests for record-enrichment-allergy-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');
var config = require(global.VX_ROOT + 'worker-config');
config.terminology.host = vx_sync_ip;

var TerminologyUtil = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
var val = require(global.VX_UTILS + 'object-utils').getProperty;
var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-document-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-document-xformer-itest-spec',
//     level: 'debug'
// });


var originalVaDocumentRecord = {
    'documentClass': 'PROGRESS NOTES',
    'documentDefUid': 'urn:va:doc-def:9E7A:1632',
    'documentTypeCode': 'D',
    'documentTypeName': 'Advance Directive',
    'encounterName': '20 MINUTE May 16, 2007',
    'encounterUid': 'urn:va:visit:9E7A:3:5670',
    'entered': 20070516095030,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'lastUpdateTime': 20070516095030,
    'localId': 3853,
    'localTitle': 'ADVANCE DIRECTIVE COMPLETED',
    'nationalTitle': {
        'name': 'CONSULT NOTE',
        'vuid': 'urn:va:vuid:4706090'
    },
    'pid': '9E7A;3',
    'referenceDateTime': 200705160950,
    'stampTime': 20070516095030,
    'status': 'COMPLETED',
    'text': [{
        'clinicians': [{
            'name': 'LABTECH,FIFTYNINE',
            'role': 'AU',
            'uid': 'urn:va:user:9E7A:10000000049'
        }, {
            'name': 'LABTECH,FIFTYNINE',
            'role': 'S',
            'signature': 'FIFTYNINE LABTECH',
            'signedDateTime': 20070516095031,
            'uid': 'urn:va:user:9E7A:10000000049'
        }, {
            'name': 'LABTECH,SIXTY',
            'role': 'ATT',
            'uid': 'urn:va:user:9E7A:10000000060'
        }, {
            'name': 'LABTECH,SIXTYONE',
            'role': 'C',
            'signature': 'SIXTYONE LABTECH',
            'signedDateTime': 20070516095030,
            'uid': 'urn:va:user:9E7A:10000000061'
        }, {
            'name': 'LABTECH,FIFTYNINE',
            'role': 'ES',
            'uid': 'urn:va:user:9E7A:10000000049'
        }, {
            'name': 'MG',
            'role': 'E',
            'uid': 'urn:va:user:9E7A:10000000049'
        }],
        'content': '   VistA Imaging - Scanned Document\r\n',
        'enteredDateTime': 200705160949,
        'dateTime': 200705160950,
        'status': 'COMPLETED',
        'uid': 'urn:va:document:9E7A:3:3853'
    }],
    'uid': 'urn:va:document:9E7A:3:3853'
};
var originalVaDocumentJob = {
    record: originalVaDocumentRecord
};

var jdsCodedVaValue = {
    system: 'http://loinc.org',
    code: '11488-4',
    display: 'Consult note'
};

var originalDodDocumentRecord = {
    'author': 'DEMO USER',
    'authorDisplayName': 'DEMO USER',
    'codes': [{
        'code': '15149159',
        'display': '',
        'system': 'DOD_NCID'
    }, {
        'code': '28563-5',
        'display': '',
        'system': 'DOD_NOTES'
    }],
    'documentTypeName': 'Initial Evaluation Note',
    'dodComplexNoteUri': 'http://localhost:8082/documents?dir=444f443b30303030303030303033/3cc445968192d500d5a2ddbf23ab4952605f0b0c_20110502114150&file=52434099d66a4f3f609d0e931b762ec6538ddca9.html',
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'localTitle': 'Pulmonary Nursing Follow-Up',
    'pid': 'DOD;0000000003',
    'referenceDateTime': 1304358110000,
    'stampTime': '20150303124347',
    'status': 'completed',
    'statusName': 'completed',
    'text': [{
        'content': 'Personal Data Privacy Act of 1974 (PL 93 579)\nPatient: \nBOB BTEST \nSSN: \n000-00-1102\n\n1234 Cherry Blossom Lane\n, \nHP: \nBirthdate: \nJanuary 1, 1945\nSex: \nFemale\n' +
            'Consultant: \n\nCreated On: \nMay 2, 2011\n\nPulmonary Nursing Follow-Up\nPULMONARY NURSING FOLLOW-UP NOTE\n- POST OPERATIVE FOLLOW UP PHONE CALL -\nPhone number\n800-555-4444' +
            '\n\nDate\nTime\nResults\nInitials\n02May\n0600\nLeft message\nDEMO\n- ATTEMPTS TO CONTACT PATIENT -\n\nDate\nTime\nResults\nInitials\n\n#1\n02May\n0900\nReached patient and ' +
            'discussed.\nDEMO\n\nPATIENT RESPONSE\n* Additional Comments Required For All Yes Responses *\n\nNO\n[X]\nYES\n[ ]\nColor and amount of sputum produced with cough\n\nNO\n[X]\n' +
            'YES\n[ ]\nUnusual Pain\n\nNO\n[X]\nYES\n[ ]\nFever\n\nNO\n[ ]\nYES\n[X]\nOther Problems:\nA little tired today.\nPatient / Significant Other communicates knowledge of and ' +
            'understands follow-up instructions.\nPatient\'        s condition: \nGood\nAdditional information\n\nSignature of Nurse / Physician: See above electronic signature.\n\nSF 509 ' +
            '- E - Progress Notes\n\nAuthored by: \nDEMO USER on May 2,        2011\n\n9040 Fitzsimmons Ave\nTacoma,        WA 98431\nWP: (253) 968 - 1110\n\nHealthcare Providers\n\nSupport ' +
            'Providers\n\nInsurance Information\nFor Official Use Only(FOUO)\n ',
        'dateTime': 1304358110000,
        'status': 'completed',
        'uid': 'urn:va:document:DOD:0000000003:3cc445968192d500d5a2ddbf23ab4952605f0b0c_20110502114150'
    }],
    'uid': 'urn:va:document:DOD:0000000003:3cc445968192d500d5a2ddbf23ab4952605f0b0c_20110502114150'
};
var originalDodDocumentJob = {
    record: originalDodDocumentRecord
};
var jdsCodedDodValue = { system : 'http://loinc.org', code : '11488-4', display : null };

var terminologyUtil = new TerminologyUtil(log, log, config);
describe('record-enrichment-document-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Allergy', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaDocumentJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(record.codes)).toBe(true);
                    expect(val(record, 'codes', 'length')).toBeGreaterThan(0);
                    expect(val(record, 'codes')).toContain(jasmine.objectContaining(jdsCodedVaValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 10000);
        });
        it('Happy Path with Dod Allergy', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalDodDocumentJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(record.codes)).toBe(true);
                    expect(val(record, 'codes', 'length')).toBeGreaterThan(0);
                    expect(val(record, 'codes')).toContain(jasmine.objectContaining(jdsCodedDodValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 10000);
        });
    });
});