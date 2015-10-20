'use strict';

var _ = require('underscore');

require('../../../../env-setup');

var handle = require(global.VX_HANDLERS + 'operational-data-store-request/operational-data-store-request-handler');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');

var val = require(global.VX_UTILS + 'object-utils').getProperty;
var wConfig = require(global.VX_ROOT + 'worker-config');
var log = require(global.VX_UTILS + 'dummy-logger');
// log = require('bunyan').createLogger({
//     name: 'operational-sync-endpoint-handler-spec',
//     level: 'debug'
// });

describe('operational-data-store-request-handler.js', function() {

    describe('handle()', function() {

        var config = {
            jds: _.defaults(wConfig.jds, {
                protocol: 'http',
                host: '10.2.2.110',
                port: 9080
            })
        };

        var recordUid = 'urn:va:pt-select:EEEE:1:1';
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
            'record': ptSelectRecord,
            'jpid': '21EC2021-3AEA-4069-A2DD-08002B30309D',
            'type': 'operational-store-record'
        };

        it('handles an operational-store-record job', function() {
            var jdsClient = new JdsClient(log, log, config);
            var environment = {
                jds: jdsClient,
                publisherRouter: {
                    publish: function(job, callback) {
                        callback();
                    }
                },
                metrics: log,
                solr: {
                    add: function(record, callback) {
                        callback();
                    }
                }
            };

            var finished = false;
            runs(function() {
                handle(log, config, environment, storageJob, function(error, result) {
                    expect(error).toBeNull();
                    expect(result).toEqual('success');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });

            var finished2 = false;
            //Verify record was actually stored
            runs(function() {
                jdsClient.getOperationalDataByUid(recordUid, function(error, response) {
                    //console.log(JSON.stringify(response));
                    expect(error).toBeFalsy();
                    expect(response).toBeTruthy();
                    expect(val(response, 'statusCode')).toEqual(200);
                    finished2 = true;
                });
            });
            waitsFor(function() {
                return finished2;
            });

            var finished3 = false;
            //Clean up the record
            runs(function() {
                jdsClient.deleteOperationalDataByUid(recordUid, function(error, response) {
                    expect(error).toBeFalsy();
                    expect(response).toBeTruthy();
                    expect(val(response, 'statusCode')).toEqual(200);
                    finished3 = true;
                });
            });
            waitsFor(function() {
                return finished3;
            });
        });
    });

});