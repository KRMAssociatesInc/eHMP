'use strict';

require('../../../../env-setup');

var handle = require(global.VX_HANDLERS + 'operational-data-store-request/operational-data-store-request-handler');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');


var log = require(global.VX_UTILS + 'dummy-logger');
// log = require('bunyan').createLogger({
//     name: 'operational-sync-endpoint-handler-spec',
//     level: 'debug'
// });

describe('operational-data-store-request-handler.js', function() {

    describe('handle()', function() {


        it('error path: missing record', function() {
            var config = {};
            var environment = {
            };

            var storageJob = {
                'jpid': '21EC2021-3AEA-4069-A2DD-08002B30309D',
                'type': 'operational-store-record'
            };

            var finished = false;
            runs(function() {
                handle(log, config, environment, storageJob, function(error) {
                    expect(error).toBeTruthy();
                    expect(error.message).toEqual('Missing record');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        });

        it('error path: missing uid', function() {
            var config = {};
            var environment = {};

            var ptSelectRecord = {
                'stampTime': 20150311140030,
                'birthDate': 19350407,
                'familyName': 'INT-TEST',
                'fullName': 'INT-TEST,PATIENT',
                'genderCode': 'urn:va:pat-gender:M',
                'genderName': 'Male',
                'givenNames': 'PATIENT',
                'localId': 1,
                'pid': 'EEEE;1',
                'sensitive': true,
                'ssn': 666223456,
                //'uid': 'urn:va:pt-select:EEEE:1:1'
            };
            var storageJob = {
                'jpid': '21EC2021-3AEA-4069-A2DD-08002B30309D',
                'type': 'operational-store-record',
                'record': ptSelectRecord
            };

            var finished = false;
            runs(function() {
                handle(log, config, environment, storageJob, function(error) {
                    expect(error).toBeTruthy();
                    expect(error.message).toEqual('Missing UID');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        });

        it('error path: missing stampTime', function() {
            var config = {};
            var environment = {};

            var ptSelectRecord = {
                //'stampTime': 20150311140030,
                'birthDate': 19350407,
                'familyName': 'INT-TEST',
                'fullName': 'INT-TEST,PATIENT',
                'genderCode': 'urn:va:pat-gender:M',
                'genderName': 'Male',
                'givenNames': 'PATIENT',
                'localId': 1,
                'pid': 'EEEE;1',
                'sensitive': true,
                'ssn': 666223456,
                'uid': 'urn:va:pt-select:EEEE:1:1'
            };
            var storageJob = {
                'jpid': '21EC2021-3AEA-4069-A2DD-08002B30309D',
                'type': 'operational-store-record',
                'record': ptSelectRecord
            };

            var finished = false;
            runs(function() {
                handle(log, config, environment, storageJob, function(error) {
                    expect(error).toBeTruthy();
                    expect(error.message).toEqual('Missing stampTime');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        });

        it('Happy path: rec enrichment transform', function() {
            function storeOperationalDataStub (record, callback) {
                // Just need to check one of the record enrichment fields to be sure it did call it.
                //----------------------------------------------------------------------------------
                expect(record.displayName).toBe(ncUtil.namecase(record.fullName));
                return callback(null, { statusCode: 201 }, null);
            }

            var config = {};
            var environment = {
                jds: {
                    storeOperationalData: storeOperationalDataStub
                }
            };

            var ptSelectRecord = {
                'stampTime': 20150311140030,
                'birthDate': 19350407,
                'familyName': 'INT-TEST',
                'fullName': 'INT-TEST,PATIENT',
                'genderCode': 'urn:va:pat-gender:M',
                'genderName': 'Male',
                'givenNames': 'PATIENT',
                'localId': 1,
                'pid': 'EEEE;1',
                'sensitive': true,
                'ssn': 666223456,
                'uid': 'urn:va:pt-select:EEEE:1:1'
            };
            var storageJob = {
                'jpid': '21EC2021-3AEA-4069-A2DD-08002B30309D',
                'type': 'operational-store-record',
                'record': ptSelectRecord
            };

            var finished = false;
            runs(function() {
                handle(log, config, environment, storageJob, function(error) {
                    expect(error).toBeFalsy();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        });
    });
});