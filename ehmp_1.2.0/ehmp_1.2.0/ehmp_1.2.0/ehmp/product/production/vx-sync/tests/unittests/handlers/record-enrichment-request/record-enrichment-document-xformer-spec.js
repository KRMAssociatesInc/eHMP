'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-document-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-document-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
//NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-document-xformer-spec',
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
        'name': 'ADVANCE DIRECTIVE',
        'vuid': 'urn:va:vuid:4693421'
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

var originalDodDocumentRecord = {
    'author': 'DEMO USER',
    'authorDisplayName': 'DEMO USER',
    'codes': [{
        'code': '28636-9',
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

var removedRecord = {
    'pid': '9E7A;3',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:document:9E7A:3:3853'
};

var removedJob = {
    record: removedRecord
};

var config = {};

var CODE_SYSTEMS = {
    CODE_SYSTEM_LOINC: 'http://loinc.org',
    SYSTEM_DOD_NCID: 'DOD_NCID'
};

var jlvMappedCodeValue = {
    code: 'SomeCode',
    codeSystem: CODE_SYSTEMS.CODE_SYSTEM_LOINC,
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

//-----------------------------------------------------------------------------
// Mock JLV function that simulates the return of a valid JLV terminology
// mapping list.
//
// parameters are ignored for this mock...
//-----------------------------------------------------------------------------
function getJlvMappedCodeList_ReturnNoCode(mappingType, sourceCode, callback) {
    return callback(null, null);
}

//-----------------------------------------------------------------------------
// Mock JLV function that simulates the return of a valuid JLV terminology
// mapping.
//
// parameters are ignored for this mock...
//-----------------------------------------------------------------------------
function getJlvMappedCode_ReturnNoCode(mappingType, sourceCode, callback) {
    return callback(null, null);
}

//-----------------------------------------------------------------------------
// Mock JLV function that simulates the return of a valid JLV terminology
// mapping list.
//
// parameters are ignored for this mock...
//-----------------------------------------------------------------------------
function getJlvMappedCodeList_ReturnValidCode(mappingType, sourceCode, callback) {
    return callback(null, [jlvMappedCodeValue]);
}

describe('record-enrichment-document-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Document', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode,
                    getJlvMappedCodeList: getJlvMappedCodeList_ReturnValidCode
                }
            };


            runs(function() {
                xformer(log, config, environment, originalVaDocumentJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level record fields
                    //-------------------------
                    expect(record.isInterdisciplinary).toBe('false');
                    expect(record.summary).toEqual(record.localTitle);
                    expect(record.kind).toEqual(record.documentTypeName);
                    expect(record.statusDisplayName).toEqual(ncUtil.namecase(record.status));

                    // Root level author
                    //------------------
                    expect(record.authorUid).toEqual('urn:va:user:9E7A:10000000049');
                    expect(record.author).toEqual('LABTECH,FIFTYNINE');
                    expect(record.authorDisplayName).toEqual('Labtech,Fiftynine');

                    // Root Level Signer
                    //-------------------
                    expect(record.signerUid).toEqual('urn:va:user:9E7A:10000000049');
                    expect(record.signer).toEqual('LABTECH,FIFTYNINE');
                    expect(record.signerDisplayName).toEqual('Labtech,Fiftynine');
                    expect(record.signedDateTime).toBe('20070516095031');

                    // Root Level Cosigner
                    //---------------------
                    expect(record.cosignerUid).toEqual('urn:va:user:9E7A:10000000061');
                    expect(record.cosigner).toEqual('LABTECH,SIXTYONE');
                    expect(record.cosignerDisplayName).toEqual('Labtech,Sixtyone');
                    expect(record.cosignedDateTime).toBe('20070516095030');

                    // Root Level Attending
                    //----------------------
                    expect(record.attendingUid).toEqual('urn:va:user:9E7A:10000000060');
                    expect(record.attending).toEqual('LABTECH,SIXTY');
                    expect(record.attendingDisplayName).toEqual('Labtech,Sixty');

                    // Root Level Clinicians
                    //----------------------
                    expect(record.clinicians).toBeTruthy();
                    expect(record.clinicians.length).toEqual(6);
                    expect(record.clinicians).toContain(record.text[0].clinicians[0]);
                    expect(record.clinicians).toContain(record.text[0].clinicians[1]);
                    expect(record.clinicians).toContain(record.text[0].clinicians[2]);
                    expect(record.clinicians).toContain(record.text[0].clinicians[3]);
                    expect(record.clinicians).toContain(record.text[0].clinicians[4]);
                    expect(record.clinicians).toContain(record.text[0].clinicians[5]);

                    // Text Fields
                    //------------
                    expect(record.text).toBeTruthy();
                    expect(record.text.length).toEqual(1);
                    var text = record.text[0];
                    expect(text.summary).toEqual('DocumentText{uid=\'' + text.uid + '\'}');

                    // Text Clinicians
                    //----------------
                    expect(text.clinicians).toBeTruthy();
                    expect(text.clinicians.length).toEqual(6);
                    var clinicians = text.clinicians;
                    _.each(clinicians, function(clinician) {
                        expect(clinician.displayName).toEqual(ncUtil.namecase(clinician.name));
                        expect(clinician.summary).toEqual('DocumentClinician{uid=\'' + clinician.uid + '\'}');
                    });

                    // Text Author
                    //------------
                    expect(text.authorUid).toEqual('urn:va:user:9E7A:10000000049');
                    expect(text.author).toEqual('LABTECH,FIFTYNINE');
                    expect(text.authorDisplayName).toEqual('Labtech,Fiftynine');

                    // Text Cosigner
                    //---------------
                    expect(text.cosignerUid).toEqual('urn:va:user:9E7A:10000000061');
                    expect(text.cosigner).toEqual('LABTECH,SIXTYONE');
                    expect(text.cosignerDisplayName).toEqual('Labtech,Sixtyone');

                    // Text Signer
                    //---------------
                    expect(text.signerUid).toEqual('urn:va:user:9E7A:10000000049');
                    expect(text.signer).toEqual('LABTECH,FIFTYNINE');
                    expect(text.signerDisplayName).toEqual('Labtech,Fiftynine');

                    // Text Attending
                    //---------------
                    expect(text.attendingUid).toEqual('urn:va:user:9E7A:10000000060');
                    expect(text.attending).toEqual('LABTECH,SIXTY');
                    expect(text.attendingDisplayName).toEqual('Labtech,Sixty');

                    // Verify field data type changes
                    //-------------------------------
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.cosignedDateTime).toEqual('string');
                    expect(typeof record.signedDateTime).toEqual('string');
                    expect(typeof record.entered).toEqual('string');
                    expect(typeof record.referenceDateTime).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    _.each(record.text, function(textItem) {
                        expect(typeof textItem.dateTime).toEqual('string');
                        expect(typeof textItem.enteredDateTime).toEqual('string');
                        var iFound = 0;
                        _.each(textItem.clinicians, function(clinician) {
                            if (clinician.signedDateTime) {
                                expect(typeof clinician.signedDateTime).toEqual('string');
                                iFound++;
                            }
                        });
                        expect(iFound).toEqual(2);
                    });
                    var iFoundRootLevel = 0;
                    _.each(record.clinicians, function(clinician) {
                        if (clinician.signedDateTime) {
                            expect(typeof clinician.signedDateTime).toEqual('string');
                            iFoundRootLevel++;
                        }
                    });
                    expect(iFoundRootLevel).toEqual(2);

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with Dod Document', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode
                }
            };

            runs(function() {
                xformer(log, config, environment, originalDodDocumentJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level record fields
                    //-------------------------
                    expect(record.isInterdisciplinary).toBe('false');
                    expect(record.summary).toEqual(record.localTitle);
                    expect(record.kind).toEqual(record.documentTypeName);
                    expect(record.statusDisplayName).toEqual(ncUtil.namecase(record.status));

                    // Root level author
                    //------------------
                    expect(record.author).toEqual('DEMO USER');
                    expect(record.authorDisplayName).toEqual('DEMO USER');

                    // Text Fields
                    //------------
                    expect(record.text).toBeTruthy();
                    expect(record.text.length).toEqual(1);
                    var text = record.text[0];
                    expect(text.summary).toEqual('DocumentText{uid=\'' + text.uid + '\'}');

                    // Verify field data type changes
                    //-------------------------------
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.referenceDateTime).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    _.each(record.text, function(textItem) {
                        expect(typeof textItem.dateTime).toEqual('string');
                    });

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Checking some additional \'else\' logic.', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnNoCode,
                    getJlvMappedCodeList: getJlvMappedCodeList_ReturnNoCode
                }
            };

            var documentRecord = {
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
                'localTitle': 'ADVANCE DIRECTIVE Interdisciplinary COMPLETED',          // This will force isInterdisciplinary to be set to true and  interdisciplinaryType to be set to 'parent'
                'nationalTitle': {
                    'name': 'ADVANCE DIRECTIVE',
                    'vuid': 'urn:va:vuid:4693421'
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
                'statusDisplayName': 'IT IS COMPLETED',                     // This will force us to not do a conversion of the status to use for this field
                'uid': 'urn:va:document:9E7A:3:3853'
            };
            var documentJob = {
                record: documentRecord
            };

            runs(function() {
                xformer(log, config, environment, documentJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level record fields
                    //-------------------------
                    expect(record.isInterdisciplinary).toBe('true');
                    expect(record.interdisciplinaryType).toBe('parent');
                    expect(record.statusDisplayName).toBe('IT IS COMPLETED');
                    expect(record.codes).toBeTruthy();
                    expect(record.codes).toEqual([]);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Checking more \'else\' logic.', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode,
                    getJlvMappedCodeList: getJlvMappedCodeList_ReturnValidCode
                }
            };

            var documentRecord = {
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
                'localTitle': 'ADVANCE DIRECTIVE Interdisciplinary COMPLETED',          // This will force isInterdisciplinary to be set to true
                'parentUid': 'urn:va:document:9E7A:3:111',                              // This will force the interdisciplinaryType to be set to child.
                'nationalTitle': {
                    'name': 'ADVANCE DIRECTIVE',
                    'vuid': 'urn:va:vuid:4693421'
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
                    'statusDisplayName': 'IT IS COMPLETED',                     // This will force us to not do a conversion of the status to use for this field
                    'uid': 'urn:va:document:9E7A:3:3853'
                }],
                'uid': 'urn:va:document:9E7A:3:3853'
            };
            var documentJob = {
                record: documentRecord
            };



            runs(function() {
                xformer(log, config, environment, documentJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level record fields
                    //-------------------------
                    expect(record.isInterdisciplinary).toBe('true');
                    expect(record.interdisciplinaryType).toBe('child');
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
            var environment={};
            runs(function() {
                xformer(log, config, environment, removedJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:document:9E7A:3:3853');
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