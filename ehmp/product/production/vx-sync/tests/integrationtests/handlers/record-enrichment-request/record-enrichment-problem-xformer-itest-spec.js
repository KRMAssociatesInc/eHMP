'use strict';
require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-problem-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-problem-xformer-spec',
//     level: 'debug'
// });

var _ = require('underscore');

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

var TerminologyUtil = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
var val = require(global.VX_UTILS + 'object-utils').getProperty;
var config = require(global.VX_ROOT + 'worker-config');
config.terminology.host = vx_sync_ip;

var originalVaProblem = {
    'acuityCode': 'urn:va:prob-acuity:c',
    'acuityName': 'chronic',
    'entered': 20070410,
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'icdCode': 'urn:icd:401.9',
    'icdName': 'HYPERTENSION NOS',
    'lastUpdateTime': 20070410000000,
    'localId': 627,
    'onset': 20050407,
    'pid': '9E7A;3',
    'problemText': 'Hypertension (ICD-9-CM 401.9)',
    'providerName': 'VEHU,ONEHUNDRED',
    'providerUid': 'urn:va:user:9E7A:10000000031',
    'service': 'MEDICAL',
    'serviceConnected': false,
    'stampTime': 20070410000000,
    'statusCode': 'urn:sct:55561003',
    'statusName': 'ACTIVE',
    'uid': 'urn:va:problem:9E7A:3:627',
    'updated': 20070410
};

var jdsCodedVaValue = {
    'code': '59621000',
    'display': 'Essential hypertension (disorder)',
    'system': 'http://snomed.info/sct'
};

var originalDodProblem = {
    'acuityName': 'Chronic',
    'codes': [{
        'code': '38675',
        'display': '',
        'system': 'DOD_MEDCIN'
    }],
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

var jdsCodedDodValue = {
    system: 'http://snomed.info/sct',
    code: '414027002',
    display: 'Disorder of hematopoietic structure (disorder)'
};

var terminologyUtil = new TerminologyUtil(log, log, config);
describe('record-enrichment-problem-xformer', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Normal path: VA data', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalVaProblem,
                function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(val(record, 'codes'))).toBe(true);
                    expect(val(record, 'codes', 'length')).toBeGreaterThan(0);
                    expect(val(record, 'codes')).toContain(jasmine.objectContaining(jdsCodedVaValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 10000);
        });
        it('Normal path: DOD data', function() {
            var finished = false;
            var environment = {
                terminologyUtils: terminologyUtil
            };
            var config = {};

            runs(function() {
                xformer(log, config, environment, originalDodProblem,
                function(error, record) {
                    expect(error).toBeNull();
                    expect(_.isObject(record)).toBe(true);
                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(_.isArray(val(record, 'codes'))).toBe(true);
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