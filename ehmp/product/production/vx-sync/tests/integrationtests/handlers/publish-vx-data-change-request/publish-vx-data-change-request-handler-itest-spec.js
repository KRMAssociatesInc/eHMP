'use strict';

require('../../../../env-setup');
var _ = require('underscore');

var logger = require(global.VX_UTILS + 'dummy-logger');
// logger = require('bunyan').createLogger({
//     name: 'publish-vx-data-change-request-handler-spec',
//     level: 'debug'
// });
var util = require('util');
var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');
var grabJobs = require('../../framework/job-grabber');
var PublisherRouter = require(global.VX_JOBFRAMEWORK + 'publisherRouter');
var handler = require(global.VX_HANDLERS + 'publish-vx-data-change-request/publish-vx-data-change-request-handler');
var wConfig = require(global.VX_ROOT + 'worker-config');

var job = {
    type: 'publish-data-change-event',
    patientIdentifier: { type: 'pid', value: 'DOD;4325678' },
    jpid: '39b4d293-90dc-442c-aa9c-4c58191340ea',
    rootJobId: '1',
    dataDomain: 'document',
    record: {
        referenceDateTime: '20100622112945',
        codes: [ {} ],
        localTitle: 'Progress Note',
        documentTypeName: 'Progress Note',
        status: 'completed',
        statusName: 'completed',
        facilityName: 'DOD',
        facilityCode: 'DOD',
        uid: 'urn:va:document:DOD:4325678:1000004203',
        pid: 'DOD;4325678',
        text: [ {} ],
        dodComplexNoteUri: 'http://127.0.0.1:8089/documents?dir=444f443b34333235363738/1000004203&file=da39a3ee5e6b4b0d3255bfef95601890afd80709.html',
        stampTime: '20150506125559',
        isInterdisciplinary: 'false',
        summary: 'Progress Note',
        kind: 'Progress Note',
        statusDisplayName: 'Completed',
        clinicians: []
    }
};

var jobStatusUpdater = {
                createJobStatus: function(job, callback) {
                    callback();
                },
                errorJobStatus: function(job, error, callback) {
                    callback();
                }
            };
var host = vx_sync_ip;
var port = wConfig.beanstalk.repoDefaults.port;

describe('publish-vx-data-change-request-handler.js', function() {

    it('no publish tubes', function() {
        testPublishTubes([]);
    });

    it('publish to single tube', function() {
        testPublishTubes(['published-change-event']);
    });

    it('publish multiple tubes', function() {
        testPublishTubes(['published-change-event-1', 'published-change-event-2', 'published-change-event-3']);
    });
});

var counter = 0;
/**
Custom logic needed to properly test the handler and it's ability to publish dynamic jobs to multiple tubes.
**/
function testPublishTubes(tubeNames) {
    var tubePrefix = 'test-';
    var tubeSuffix = '-' + (++counter);
    var handlerComplete = false;
    var beanstalkRetrieveComplete = false;
    var config = {
        beanstalk: _.clone(wConfig.beanstalk),
        publishTubes: []
    };
    config.beanstalk.repoDefaults.jobTypeForTube = true;
    config.beanstalk.repoDefaults.host = vx_sync_ip;
    logger.debug(util.inspect(config.beanstalk));

    var environment = {
        publisherRouter: new PublisherRouter(logger, config, logger, jobStatusUpdater),
        metrics: logger
    };
    spyOn(environment.publisherRouter, 'publish').andCallThrough();

    _.each(tubeNames, function(tubeName){
        var fulltubename = tubePrefix + tubeName + tubeSuffix;
        //normalize the beanstalk job configuration. This happens automatically as part of the worker-config.js
        config.beanstalk.jobTypes[fulltubename] = _.defaults({tubePrefix: ''}, config.beanstalk.repoDefaults);
        config.beanstalk.jobTypes[fulltubename] = _.defaults(config.beanstalk.jobTypes[fulltubename], config.beanstalk.repoUniversal);
        config.publishTubes.push(fulltubename);
        clearTube(logger, host, port, fulltubename);
    });

    runs(function(){
        handler(logger, config, environment, job, function(error){
            expect(error).toBeFalsy();
            //If no subscribers are configured, no jobs will be published.
            if(tubeNames.length === 0) {
                expect(environment.publisherRouter.publish.calls.length).toEqual(0);
            } else {
                expect(environment.publisherRouter.publish.calls.length).toEqual(1);
                expect(environment.publisherRouter.publish.calls[0].args[0].length).toEqual(tubeNames.length);
            }
            handlerComplete = true;
        });
    });
    waitsFor(function(){
        return handlerComplete;
    }, 'Handler to complete', 12000);
    runs(function(){
        _.each(config.publishTubes, function(tubeName){
            logger.debug(tubeName);
            //timeout needs to be > 0 as this was causing problems retrieving jobs from beanstalk
            grabJobs(logger, host, port, tubeName, 2000, function(error, jobs) {
                logger.debug('Job Grabber error %j', error);
                logger.debug('Job Grabber jobs %j', jobs);
                expect(error).toBeFalsy();
                expect(jobs).toBeDefined();
                if(jobs) {
                    expect(jobs.length > 0).toBeTruthy();
                    expect(_.contains(config.publishTubes, jobs[0].type)).toBeTruthy();
                }
            });
        });
        beanstalkRetrieveComplete = true;
    });
    waitsFor(function(){
        return beanstalkRetrieveComplete;
    }, 'Beanstalk jobs', 6000);
}

function clearTube(logger, host, port, tubename) {
    var called = false;
    var calledError;

    grabJobs(logger, host, port, tubename, 0, function(error) {
        called = true;
        calledError = error;
    });

    waitsFor(function() {
        return called;
    }, 'should be called', 2000);

    runs(function() {
        expect(calledError).toBeNull();
    });
}
