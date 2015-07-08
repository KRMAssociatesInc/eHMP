'use strict';

require('../../../env-setup');

var util = require('util');
var _ = require('underscore');

var val = require(global.VX_UTILS + 'object-utils').getProperty;
var queueConfig = require(global.VX_JOBFRAMEWORK + 'queue-config');
var grabJobs = require('./job-grabber');
var PublisherRouter = require(global.VX_JOBFRAMEWORK + 'publisherRouter');

var counter = 1;
/*
Note that using this framework only tests that when called, the handler creates
the correct number and types of jobs and verifies that they are all pushed onto
the Beanstalk tube. You should ensure that the resultant jobs created contain
the correct values via unit tests for your handler.

handler: the handler function you are testing. This function should have the
signature: handler(logger, config, environment, job, callback)

logger: the bunyan logger to use. Note that the dummy-logger will also work.

config: a config object which should be pre-loaded with any properties necessary
for your handler. Note that you should NOT include the beanstalk publisher
properties.

host: the server where beanstalk is running. This will usually be '10.3.3.6' or '127.0.0.1'.

port: the port on which beanstalk is running. This will usually be 5000.

tubePrefix: the tubePrefix prepended to the type of the job parameter which is used
to generate the tubename.

job: the job instance to use when calling the handler.

jobTypes: the expected resulting jobTypes. This can be either an array or a single
string. The framework will verify that the handler creates one each of these types
of jobs.

waitTimeout: the tiemout in millis to wait for the response from the handler. Defaults
to 10000 (10 seconds).
*/
function testHandler(handler, logger, config, environment, host, port, tubePrefix, job, jobTypes, waitTimeout) {
    waitTimeout = _.isNumber(waitTimeout) ? waitTimeout : 10000;
    var tubename = tubePrefix + '-' + job.type + '-' + counter;
    counter++;
    logger.debug('handler-test-framework.testHandler() %s:%s/%s from %s -> %s', host, port, tubename, job.type, jobTypes);
    var describeText = util.format('tests handler for "%s" job on tube "%s"', job && job.type, tubename);
    var itText = util.format('verify the correct %s jobs are put on tube "%s" for jobType "%s", jobs: ', _.size(jobTypes), tubename, job && job.type);
    itText = _.reduce(jobTypes, function(memo, jobType) {
        return memo + '\n\t\t"' + jobType + '"';
    }, itText);

    jobTypes = _.isArray(jobTypes) ? jobTypes : [jobTypes];
    var beanstalkConfig = queueConfig.createFullBeanstalkConfig({
        repoUniversal: {
            priority: 10,
            delay: 0,
            ttr: 60,
            timeout: 10,
            initMillis: 1000,
            maxMillis: 15000,
            incMillis: 1000
        },
        repoDefaults: {
            host: host,
            port: port,
            tubename: tubename,
            tubePrefix: 'vxs-',
            jobTypeForTube: false
        },
        jobTypes: {
            'enterprise-sync-request': {},
            'vista-operational-subscribe-request': {},

            'vista-9E7A-subscribe-request': {},
            'vista-C877-subscribe-request': {},

            'vler-sync-request': {},
            'pgd-sync-request': {},
            'hdr-sync-request': {},
            'jmeadows-sync-request': {},

            'hdr-xform-vpr': {},
            'vler-xform-vpr': {},
            'pgd-xform-vpr': {},

            'jmeadows-sync-allergy-request': {},
            'jmeadows-sync-appointment-request': {},
            'jmeadows-sync-consult-request': {},
            'jmeadows-sync-demographics-request': {},
            'jmeadows-sync-dischargeSummary-request': {},
            'jmeadows-sync-encounter-request': {},
            'jmeadows-sync-immunization-request': {},
            'jmeadows-sync-lab-request': {},
            'jmeadows-sync-medication-request': {},
            'jmeadows-sync-note-request': {},
            'jmeadows-sync-order-request': {},
            'jmeadows-sync-problem-request': {},
            'jmeadows-sync-progressNote-request': {},
            'jmeadows-sync-radiology-request': {},
            'jmeadows-sync-vital-request': {},

            'hdr-sync-allergy-request': {},
            'hdr-sync-appointment-request': {},
            'hdr-sync-consult-request': {},
            'hdr-sync-cpt-request': {},
            'hdr-sync-document-request': {},
            'hdr-sync-education-request': {},
            'hdr-sync-exam-request': {},
            'hdr-sync-factor-request': {},
            'hdr-sync-image-request': {},
            'hdr-sync-immunization-request': {},
            'hdr-sync-lab-request': {},
            'hdr-sync-mh-request': {},
            'hdr-sync-order-request': {},
            'hdr-sync-pov-request': {},
            'hdr-sync-problem-request': {},
            'hdr-sync-procedure-request': {},
            'hdr-sync-skin-request': {},
            'hdr-sync-surgery-request': {},
            'hdr-sync-visit-request': {},
            'hdr-sync-vital-request': {},


            'jmeadows-xform-allergy-vpr': {},
            'jmeadows-xform-appointment-vpr': {},
            'jmeadows-xform-consult-vpr': {},
            'jmeadows-xform-demographics-vpr': {},
            'jmeadows-xform-dischargeSummary-vpr': {},
            'jmeadows-xform-encounter-vpr': {},
            'jmeadows-xform-immunization-vpr': {},
            'jmeadows-xform-lab-vpr': {},
            'jmeadows-xform-medication-vpr': {},
            'jmeadows-xform-note-vpr': {},
            'jmeadows-xform-order-vpr': {},
            'jmeadows-xform-problem-vpr': {},
            'jmeadows-xform-progressNote-vpr': {},
            'jmeadows-xform-radiology-vpr': {},
            'jmeadows-xform-vital-vpr': {},

            'hdr-xform-allergy-vpr': {},
            'hdr-xform-appointment-vpr': {},
            'hdr-xform-consult-vpr': {},
            'hdr-xform-cpt-vpr': {},
            'hdr-xform-document-vpr': {},
            'hdr-xform-education-vpr': {},
            'hdr-xform-exam-vpr': {},
            'hdr-xform-factor-vpr': {},
            'hdr-xform-image-vpr': {},
            'hdr-xform-immunization-vpr': {},
            'hdr-xform-lab-vpr': {},
            'hdr-xform-mh-vpr': {},
            'hdr-xform-order-vpr': {},
            'hdr-xform-pov-vpr': {},
            'hdr-xform-problem-vpr': {},
            'hdr-xform-procedure-vpr': {},
            'hdr-xform-skin-vpr': {},
            'hdr-xform-surgery-vpr': {},
            'hdr-xform-visit-vpr': {},
            'hdr-xform-vital-vpr': {},

            'jmeadows-rtf-document-transform': {},
            'jmeadows-cda-document-conversion': {},
            'jmeadows-document-retrieval': {},

            'record-enrichment': {},
            'store-record': {},
            'vista-prioritization-request': {},
            'operational-store-record': {},
            'publish-data-change-event': {},
            'patient-data-state-checker': {}
        }
    });

    logger.debug(beanstalkConfig);

    describe(describeText, function() {
        var callback;
        var jobStatusUpdater;
        var called;
        var calledError;
        var calledResult;

        beforeEach(function() {
            called = false;

            config.beanstalk = beanstalkConfig;

            jobStatusUpdater = {
                createJobStatus: function(job, callback) {
                    callback();
                },
                errorJobStatus: function(job, error, callback) {
                    callback();
                }
            };

            if (!environment) {
                environment = {
                    publisherRouter: new PublisherRouter(logger, config, jobStatusUpdater)
                };
            } else if (!environment.publisherRouter) {
                if (!environment.jobStatusUpdater) {
                    environment.jobStatusUpdater = jobStatusUpdater;
                }

                environment.publisherRouter = new PublisherRouter(logger, config, environment.jobStatusUpdater);
            // } else {
            //     var oldPublisherRouter = environment.publisherRouter;
            //     environment.publisherRouter = new PublisherRouter(oldPublisherRouter.logger, config, environment.jobStatusUpdater);
            }

            callback = function(error, result) {
                called = true;
                calledError = error;
                calledResult = result;
            };

            clearTube(logger, host, port, tubename);
        });

        it(itText, function() {
            handler(logger, config, environment, job, function(error) {
                if (error) {
                    calledError = error;
                    called = true;
                    return;
                }

                grabJobs(logger, host, port, tubename, 0, function(error, jobs) {
                    calledError = error;
                    calledResult = jobs;
                    called = true;
                });
            });

            waitsFor(function() {
                return called;
            }, 'beanstalk jobs returned', waitTimeout);

            runs(function() {
                expect(calledError).toBeNull();

                var resultJobTypes = _.pluck(calledResult, 'type');
                expect(val(resultJobTypes, 'length')).toBe(jobTypes.length);
                _.each(jobTypes, function(match) {
                    expect(resultJobTypes).toContain(match);
                });
            });
        });

        afterEach(function() {
            environment.publisherRouter.close();
        });
    });
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

module.exports.testHandler = testHandler;
