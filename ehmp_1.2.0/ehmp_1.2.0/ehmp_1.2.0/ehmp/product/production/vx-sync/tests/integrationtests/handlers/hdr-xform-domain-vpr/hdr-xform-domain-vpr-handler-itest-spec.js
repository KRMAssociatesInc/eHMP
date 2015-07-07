'use strict';

require('../../../../env-setup');

var _ = require('underscore');
var uuid = require('node-uuid');
var logger = require(global.VX_UTILS + 'dummy-logger');
// logger = require('bunyan').createLogger({
//     name: 'hdr-xform-domain-vpr-handler-itest-spec',
//     level: 'debug'
// });


var val = require(global.VX_UTILS + 'object-utils').getProperty;
var jobUtil = require(global.VX_UTILS + 'job-utils');
var testHandler = require(global.VX_INTTESTS + 'framework/handler-test-framework').testHandler;
var patientIdUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var handler = require(global.VX_HANDLERS + 'hdr-xform-domain-vpr/hdr-xform-domain-vpr-handler');
var JdsClientDummy = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var wConfig = require(global.VX_ROOT + 'worker-config');

var config = {
    jds: _.defaults(wConfig.jds, {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080
    })
};

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

var host = vx_sync_ip;
var port = 5000;
var tubename = 'vx-sync-test';

describe('hdr-xfom-domain-vpr-handler integration test', function() {
    var testPatientIdentifier = patientIdUtil.create('pid', 'HDR;' + 0xD0D);

    beforeEach(function() {
        // Underlying JDS calls to monitor and make sure that they are made.
        //---------------------------------------------------------------------------
        // spyOn(jdsClientDummy, 'saveSyncStatus').andCallThrough();
    });

    describe('record enrichment pathway', function() {
        var jdsClientDummy = new JdsClientDummy(logger, config);
        var environment = {
            jds: jdsClientDummy
        };
        var expectedJdsResponse = {
            statusCode: 200
        };
        jdsClientDummy._setResponseData(null, expectedJdsResponse, undefined);

        var hdrAllergyItems = require('../../../data/secondary/hdr/allergy');

        var job = {};
        job.type = 'hdr-xform-allergy-vpr';
        job.dataDomain = 'allergy';
        job.record = hdrAllergyItems;
        job.jpid = uuid.v4();
        job.icn = '10108V420871';
        job.patientIdentifier = patientIdUtil.create('pid', 'HDR;000000003');
        job.requestStampTime = '20140102120059';

        var localConfig = _.clone(config);
        localConfig.hdr = {
            domains: ['allergy']
        };

        var matchingJobTypes = [jobUtil.recordEnrichmentType()];
        testHandler(handler, logger, localConfig, environment, host, port, tubename, job, matchingJobTypes);
    });


    describe('test JDS communications', function() {
        var jdsClient = new JdsClient(logger, config);
        var environment = {
            jds: jdsClient,
            publisherRouter: {
                publish: function(job, callback) {
                    callback();
                }
            }
        };

        var hdrAllergyItems = require('../../../data/secondary/hdr/allergy');

        var job = {};
        job.type = 'hdr-xform-allergy-vpr';
        job.dataDomain = 'allergy';
        job.record = hdrAllergyItems;
        job.jpid = uuid.v4();
        job.icn = '10108V420871';
        job.patientIdentifier = testPatientIdentifier;
        job.requestStampTime = '20140102120059';

        var localConfig = _.clone(config);
        localConfig.hdr = {
            domains: ['allergy']
        };

        it('verify metastamp is stored in JDS', function() {
            var setUpDone = 0;
            runs(function() {

                environment.jds.deletePatientByPid(testPatientIdentifier.value, function() {
                    setUpDone++;
                });

                environment.jds.storePatientIdentifier({
                    'patientIdentifiers': [testPatientIdentifier.value]
                }, function() {
                    setUpDone++;
                });

            });

            waitsFor(function() {
                return setUpDone === 2;
            }, 'JDS setup', 10000);

            var handleDone = false;
            runs(function() {
                handler(logger, localConfig, environment, job, function() {
                    handleDone = true;
                });
            });

            waitsFor(function() {
                return handleDone;
            }, 'transform', 8000);

            var done = false;
            runs(function() {
                environment.jds.getSyncStatus(testPatientIdentifier, function(error, response) {
                    expect(error).toBeFalsy();
                    expect(val(response, 'statusCode')).toBe(200);
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            }, 'sync status', 7000);

            var cleanUpDone = false;
            runs(function() {
                environment.jds.deletePatientByPid(testPatientIdentifier.value, function() {
                    cleanUpDone = true;
                });
            });
            waitsFor(function() {
                return cleanUpDone;
            }, 'clean up', 10000);
        });

    });
});