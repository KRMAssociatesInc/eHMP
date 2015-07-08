'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-allergy-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-allergy-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-allergy-xformer-spec',
//     level: 'debug'
// });

var originalVaAllergyRecord = {
    'drugClasses': [{
        'code': 'AM114',
        'name': 'PENICILLINS AND BETA-LACTAM ANTIMICROBIALS'
    }],
    'entered': 200503172009,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'historical': true,
    'kind': 'Allergy / Adverse Reaction',
    'lastUpdateTime': 20050317200936,
    'localId': 751,
    'mechanism': 'PHARMACOLOGIC',
    'originatorName': 'VEHU,EIGHT',
    'products': [{
        'name': 'PENICILLIN',
        'vuid': 'urn:va:vuid:1234'
    }],
    'reactions': [{
        'name': 'ITCHING,WATERING EYES',
        'vuid': 'urn:va:vuid:4019880'
    }],
    'reference': '125;GMRD(120.82,',
    'stampTime': 20050317200936,
    'summary': 'PENICILLIN',
    'typeName': 'DRUG',
    'uid': 'urn:va:allergy:9E7A:3:751',
    'verified': 20050317200936,
    'verifierName': '<auto-verified>',
    'comments': [{
        'entered': 200503172009,
        'comment': 'The allergy comment.'
    }],
    'observations': [{
        'date': 200503172009,
        'severity': 'bad'
    }]
};
var originalVaAllergyJob = {
    record: originalVaAllergyRecord
};

var originalDodAllergyRecord = {
    'codes': [
        {
            'code': '1000',
            'display': '',
            'system': 'DOD_ALLERGY_IEN'
        }
    ],
    'comments': [
        {
            'comment': 'Vomiting'
        }
    ],
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'kind': 'Allergy/Adverse Reaction',
    'pid': 'DOD;0000000003',
    'products': [
        {
            'name': 'Penicillins',
        }
    ],
    'stampTime': '20150226124943',
    'summary': 'Penicillins',
    'uid': 'urn:va:allergy:DOD:0000000003:1000010340'
};
var originalDodAllergyJob = {
    record: originalDodAllergyRecord
};

var originalNonVaNonDodAllergyRecord = {
    'comments': [
        {
            'comment': 'Vomiting'
        }
    ],
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'kind': 'Allergy/Adverse Reaction',
    'pid': 'DOD;0000000003',
    'products': [
        {
            'name': 'Penicillins',
        }
    ],
    'stampTime': '20150226124943',
    'summary': 'Penicillins',
    'uid': 'urn:va:allergy:DOD:0000000003:1000010340'
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:allergy:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var originalNonVaNonDodAllergyJob = {
    record: originalNonVaNonDodAllergyRecord
};

var config = {};

var CODE_SYSTEMS = {
    CODE_SYSTEM_UMLS_CUI: 'urn:oid:2.16.840.1.113883.6.86',
    SYSTEM_DOD_ALLERGY_IEN: 'DOD_ALLERGY_IEN'
};

var jlvMappedCodeValue = {
    code: 'SomeCode',
    codeSystem: CODE_SYSTEMS.CODE_SYSTEM_UMLS_CUI,
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

describe('record-enrichment-allergy-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Allergy', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode
                }
            };

            runs(function() {
                xformer(log, config, environment, originalVaAllergyJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.products).toBeTruthy();
                    expect(record.products.length).toEqual(1);
                    expect(record.products[0].summary).toEqual('AllergyProduct{uid=\'\'}');
                    expect(record.reactions).toBeTruthy();
                    expect(record.reactions.length).toEqual(1);
                    expect(record.reactions[0].summary).toEqual('AllergyReaction{uid=\'\'}');
                    expect(record.drugClasses).toBeTruthy();
                    expect(record.drugClasses.length).toEqual(1);
                    expect(record.drugClasses[0].summary).toEqual('AllergyDrugClass{uid=\'\'}');
                    expect(_.isArray(record.comments)).toBe(true);
                    expect(record.comments.length).toEqual(1);
                    expect(record.comments[0].summary).toEqual('AllergyComment{uid=\'\'}');
                    expect(_.isArray(record.observations)).toBe(true);
                    expect(record.observations.length).toEqual(1);
                    expect(record.observations[0].summary).toEqual('AllergyObservation{uid=\'\'}');
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.entered).toEqual('string');
                    expect(typeof record.verified).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    expect(typeof record.comments[0].entered).toEqual('string');
                    expect(typeof record.observations[0].date).toEqual('string');

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
        it('Happy Path with Dod Allergy', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode
                }
            };

            runs(function() {
                xformer(log, config, environment, originalDodAllergyJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.products).toBeTruthy();
                    expect(record.products.length).toEqual(1);
                    expect(record.products[0].summary).toEqual('AllergyProduct{uid=\'\'}');
                    expect(typeof record.facilityCode).toEqual('string');

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
        it('Happy Path with Non VA and Non Dod Allergy', function() {
            var finished = false;
            var environment = {
                terminologyUtils: {
                    CODE_SYSTEMS: CODE_SYSTEMS,
                    getJlvMappedCode: getJlvMappedCode_ReturnValidCode
                }
            };

            runs(function() {
                xformer(log, config, environment, originalNonVaNonDodAllergyJob, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.products).toBeTruthy();
                    expect(record.products.length).toEqual(1);
                    expect(record.products[0].summary).toEqual('AllergyProduct{uid=\'\'}');
                    expect(typeof record.facilityCode).toEqual('string');

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeFalsy();
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
                    expect(record.uid).toEqual('urn:va:allergy:DOD:0000000003:1000010340');
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