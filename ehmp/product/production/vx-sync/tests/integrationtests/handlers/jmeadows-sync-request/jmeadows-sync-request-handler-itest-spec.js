'use strict';

require('../../../../env-setup');

var uuid = require('node-uuid');
var logger = require(global.VX_UTILS + 'dummy-logger');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var testHandler = require(global.VX_INTTESTS + 'framework/handler-test-framework').testHandler;
var patientIdUtil = require(global.VX_UTILS + 'patient-identifier-utils');

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');
var handler = require(global.VX_HANDLERS + 'jmeadows-sync-request/jmeadows-sync-request-handler');

describe('jmeadows-sync-request-handler.js', function() {
    var rootJob = jobUtil.createEnterpriseSyncRequest(patientIdentifier, uuid.v4(), false);
    var patientIdentifier = patientIdUtil.create('icn', '10110V004877');
    var job = jobUtil.createJmeadowsSyncRequest(patientIdentifier, rootJob);

    var config = {
        jmeadows: {
            domains: ['allergy']
        }
    };

    var environment = {
        metrics: logger
    };

    var host = vx_sync_ip;
    var port = 5000;
    var tubename = 'vx-sync-test';

    var matchingJobTypes = [jobUtil.jmeadowsDomainSyncRequestType('allergy')];

    testHandler(handler, logger, config, environment, host, port, tubename, job, matchingJobTypes);
});