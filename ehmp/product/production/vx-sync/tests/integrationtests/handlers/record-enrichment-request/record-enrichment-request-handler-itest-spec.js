'use strict';

//-----------------------------------------------------------------------------------
// This is an integration test for the Record Enrichment.  It verifies that it can
// process a job and create the correct outgoing jobs based on it.
//-----------------------------------------------------------------------------------
require('../../../../env-setup');

var logger = require(global.VX_UTILS + 'dummy-logger');
// logger = require('bunyan').createLogger({
//     name: 'record-enrichment-request-handler-itest-spec',
//     level: 'debug'
// });

var jobUtil = require(global.VX_UTILS + 'job-utils');
var testHandler = require(global.VX_INTTESTS + 'framework/handler-test-framework').testHandler;
var patientIdUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var handler = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-request-handler');

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

describe('record-enrichment-request-handler.js', function() {
    var jpid = '00000000-0000-0000-0000-000000000000';
    var rootJobId = 1;
    var rootJob = {
        jpid: jpid,
        jobId: rootJobId,
        rootJobId: rootJobId
    };
    var patientIdentifier = patientIdUtil.create('pid', '9E7A;3');
    var allergyRecord = {
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
        'pid': '9E7A;3',
        'products': [{
            'name': 'PENICILLIN',
            'vuid': 'urn:va:vuid:'
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
    var job = jobUtil.createRecordEnrichment(patientIdentifier, 'allergy', allergyRecord, rootJob);

    var config = {
    };

    var environment = {
        metrics: logger
    };
    // environment.jobStatusUpdater = new JobStatusUpdater(logger, config, environment.jds);
    // environment.publisherRouter = new PublisherRouter(logger, config, environment.jobStatusUpdater);

    var host = vx_sync_ip;
    var port = 5000;
    var tubename = 'vx-sync-test';

    var matchingJobTypes = [
        jobUtil.storeRecordType()
    ];

    testHandler(handler, logger, config, environment, host, port, tubename, job, matchingJobTypes);

});