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
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var TerminologyUtil = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
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
        'vuid': 'urn:va:vuid:4019880'
    }],
    'reactions': [{
        'name': 'ITCHING,WATERING EYES',
        'vuid': 'urn:va:vuid:'
    }],
    'reference': '125;GMRD(120.82,',
    'stampTime': 20050317200936,
    'summary': 'PENICILLIN',
    'typeName': 'DRUG',
    'uid': 'urn:va:allergy:9E7A:3:751',
    'verified': 20050317200936,
    'verifierName': '<auto-verified>'
};
var originalVaAllergyJob = {
    record: originalVaAllergyRecord
};

// What it should be when the terminology translations are real...
//-----------------------------------------------------------------
// var jdsCodedVaValue = {
// 	code: 'C0220892',
// 	system: terminologyUtil.CODE_SYSTEMS.CODE_SYSTEM_UMLS_CUI,
// 	display: 'Penicillin'
// };
// What it is with the mock terminology translations.
//-----------------------------------------------------------------
var jdsCodedVaValue = {
    system: 'urn:oid:2.16.840.1.113883.6.86',
    code: 'C0220892',
    display: 'Penicillin'
};
var originalDodAllergyRecord = {
    'codes': [{
        'code': '1000',
        'display': '',
        'system': 'DOD_ALLERGY_IEN'
    }],
    'comments': [{
        'comment': 'Vomiting'
    }],
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'kind': 'Allergy/Adverse Reaction',
    'pid': 'DOD;0000000003',
    'products': [{
        'name': 'Penicillins',
    }],
    'stampTime': '20150226124943',
    'summary': 'Penicillins',
    'uid': 'urn:va:allergy:DOD:0000000003:1000010340'
};
var originalDodAllergyJob = {
    record: originalDodAllergyRecord
};

var terminologyUtil = new TerminologyUtil(log, log, config);

// What it should be when the terminology translations are real...
//-----------------------------------------------------------------
// var jdsCodedDodValue = {
// 	code: 'C0220892',
// 	system: terminologyUtil.CODE_SYSTEMS.CODE_SYSTEM_UMLS_CUI,
// 	display: 'Penicillin'
// };
// What it is with the mock terminology translations.
//-----------------------------------------------------------------
var jdsCodedDodValue = { system : 'urn:oid:2.16.840.1.113883.6.86', code : 'C0030842', display : 'Penicillins' };

describe('record-enrichment-allergy-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Allergy', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaAllergyJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(_.isArray(val(record, 'products'))).toBe(true);
                    expect(val(record, 'products', 'length')).toEqual(1);
                    expect(val(record, 'products', 0, 'summary')).toEqual('AllergyProduct{uid=\'\'}');
                    expect(_.isArray(val(record, 'reactions'))).toBe(true);
                    expect(val(record, 'reactions', 'length')).toEqual(1);
                    expect(val(record, 'reactions', 0, 'summary')).toEqual('AllergyReaction{uid=\'\'}');
                    expect(_.isArray(val(record, 'drugClasses'))).toBe(true);
                    expect(val(record, 'drugClasses', 'length')).toEqual(1);
                    expect(val(record, 'drugClasses', 0, 'summary')).toEqual('AllergyDrugClass{uid=\'\'}');
                    expect(_.isString(val(record, 'entered'))).toBe(true);
                    expect(_.isString(val(record, 'verified'))).toBe(true);
                    expect(_.isString(val(record, 'localId'))).toBe(true);
                    expect(_.isString(val(record, 'facilityCode'))).toBe(true);

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(record.codes)).toBe(true);
                    expect(val(record, 'codes', 'length')).toBeGreaterThan(0);
                    if (val(record, 'codes')) {
                        expect(val(record, 'codes')).toContain(jasmine.objectContaining(jdsCodedVaValue));
                    }
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
                xformer(log, config, environment, originalDodAllergyJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    expect(_.isArray(val(record, 'products'))).toBe(true);
                    expect(val(record, 'products', 'length')).toEqual(1);
                    expect(val(record, 'products', 0, 'summary')).toEqual('AllergyProduct{uid=\'\'}');
                    expect(_.isString(val(record, 'facilityCode'))).toBe(true);

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(val(record, 'codes'))).toBe(true);
                    expect(val(record, 'codes', 'length')).toBeGreaterThan(0);
                    if (val(record, 'codes')) {
                        expect(val(record, 'codes')).toContain(jasmine.objectContaining(jdsCodedDodValue));
                    }
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 10000);
        });
    });
});