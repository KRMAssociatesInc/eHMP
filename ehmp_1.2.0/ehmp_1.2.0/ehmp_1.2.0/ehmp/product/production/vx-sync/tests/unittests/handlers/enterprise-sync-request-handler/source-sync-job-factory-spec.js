'use strict';

require('../../../../env-setup');

var _ = require('underscore');

var jobUtil = require(global.VX_UTILS + 'job-utils');

var log = require(global.VX_UTILS + 'dummy-logger');
var timeUtil = require(global.VX_UTILS + 'time-utils');

// log = require('bunyan').createLogger({
//     name: 'source-sync-job-factory-spec',
//     level: 'debug'
// });

var mvi = require(global.VX_ROOT + 'mocks/mvi/mvi-mock');
var jobStates = require(global.VX_ROOT + 'mocks/jds/jds-mock-job-data');
var JobMiddleware = require(global.VX_UTILS + 'middleware/job-middleware');

var SourceSyncJobFactory = require(global.VX_HANDLERS + 'enterprise-sync-request/source-sync-job-factory');

var dodIdentifier = {
    type: 'pid',
    value: 'DOD;1234567'
};

var hdrIdentifier = {
    type: 'pid',
    value: 'HDR;111111'
};

var vlerIdentifier = {
    type: 'pid',
    value: 'VLER;222222'
};

var pgdIdentifier = {
    type: 'pid',
    value: 'DAS;333333'
};

var icnIdentifier = {
    'type': 'icn',
    'value': '10101V420870'
};

var pidIdentifier = {
    'type': 'pid',
    'value': '9E7A;42',
};

var otherPidIdentifier = {
    'type': 'pid',
    'value': 'C877;12',
};

var dummyPatientIdentifiers = [icnIdentifier, pidIdentifier, otherPidIdentifier, dodIdentifier, hdrIdentifier, vlerIdentifier, pgdIdentifier];

var dummyMviResponse = {
    name: 'Eight,Patient',
    ids: [{
        type: 'icn',
        value: '10108V420871'
    }, {
        type: 'edipi',
        value: '000000003'
    }, {
        type: 'pid',
        value: '9E7A;3'
    }]
};

var jpidValue = '21EC2020-3AEA-4069-A2DD-CCCCCCCCCCCC';
var rootJobIdValue = '5';

function dummyJob(pid, jpid) {
    return {
        'type': 'enterprise-sync-request',
        'patientIdentifier': {
            'type': 'pid',
            'value': pid
        },
        'jpid': jpid || 'jpid',
        'jobId': '5',
        'rootJobId': rootJobIdValue,
        'force': true,
        'timestamp': Date.now()
    };
}

// function dummyMviResponse(pid) {
//     return _.find(mvi.patients, function(patient) {
//         return _.some(patient.ids, function(id) {
//             return id.type === 'pid' && id.value === pid;
//         });
//     });
// }

var options = {
    'log': log,
    'config': {
        'vistaSites': ['9E7A', 'C877'],
        'synchronizationRules': ['accept-all-rule']
    }
};

describe('source-sync-job-factory.js', function() {
    var forcedJob;
    var opts = _.clone(options);

    beforeEach(function() {
        forcedJob = dummyJob('9E7A;42', jpidValue);
        opts.job = forcedJob;
        opts.jobStatus = jobStates;
    });

    describe('_createJobs', function() {
        var module = SourceSyncJobFactory._test._createJobs;

        it('Creates a Jmeadows job from a DOD identifier', function() {
            var job = module._createJmeadowsJob(opts, dodIdentifier);

            expect(jobUtil.isValid(jobUtil.jmeadowsSyncRequestType(), job)).toBe(true);

            expect(job.rootJobId).toEqual(forcedJob.jobId);
            expect(job.jpid).toEqual(forcedJob.jpid);

            expect(job.patientIdentifier.type).toEqual(dodIdentifier.type);
            expect(job.patientIdentifier.value).toEqual(dodIdentifier.value);
        });

        it('Creates a HDR job from a HDR identifier', function() {
            var job = module._createHdrJob(opts, hdrIdentifier);

            expect(jobUtil.isValid(jobUtil.jmeadowsSyncRequestType(), job)).toBe(true);

            expect(job.rootJobId).toEqual(forcedJob.jobId);
            expect(job.jpid).toEqual(forcedJob.jpid);

            expect(job.patientIdentifier.type).toEqual(hdrIdentifier.type);
            expect(job.patientIdentifier.value).toEqual(hdrIdentifier.value);
        });

        it('Creates a VLER job from a VLER identifier', function() {
            var job = module._createVlerJob(opts, vlerIdentifier);

            expect(jobUtil.isValid(jobUtil.jmeadowsSyncRequestType(), job)).toBe(true);

            expect(job.rootJobId).toEqual(forcedJob.jobId);
            expect(job.jpid).toEqual(forcedJob.jpid);

            expect(job.patientIdentifier.type).toEqual(vlerIdentifier.type);
            expect(job.patientIdentifier.value).toEqual(vlerIdentifier.value);
        });

        it('Creates a PGD job from a PGD identifier', function() {
            var job = module._createPgdJob(opts, pgdIdentifier);

            expect(jobUtil.isValid(jobUtil.jmeadowsSyncRequestType(), job)).toBe(true);

            expect(job.rootJobId).toEqual(forcedJob.jobId);
            expect(job.jpid).toEqual(forcedJob.jpid);

            expect(job.patientIdentifier.type).toEqual(pgdIdentifier.type);
            expect(job.patientIdentifier.value).toEqual(pgdIdentifier.value);
        });

        it('Removes PIDs for unknown primary sources', function() {
            var pidList = [pidIdentifier];

            pidList.push({
                'type': 'pid',
                'value': 'ABCD;1'
            });
            pidList.push({
                'type': 'pid',
                'value': 'ABCE;1'
            });
            pidList.push({
                'type': 'pid',
                'value': 'ABCF;1'
            });
            pidList.push({
                'type': 'pid',
                'value': 'ABCG;1'
            });

            var filteredList = module._removeNonPrimaryVistaSites(opts, pidList);

            expect(filteredList.length).toBe(1);

            expect(filteredList[0].value).toEqual(pidIdentifier.value);

            pidList.push(otherPidIdentifier);

            filteredList = module._removeNonPrimaryVistaSites(opts, pidList);

            expect(filteredList.length).toBe(2);

            expect(filteredList[1].value).toEqual(otherPidIdentifier.value);
        });

        it('Creates primary source jobs from a list of PIDs', function() {
            var pidList = [pidIdentifier, otherPidIdentifier];

            var jobs = module._createVistaJobs(opts, pidList);

            expect(jobs.length).toBe(2);

            // var type0 = jobUtil.vistaSubscribeRequestType(pidIdentifier._hash);
            // expect(jobUtil.isValid(type0, jobs[0], pidIdentifier._hash)).toBe(true);
            // var type1 = jobUtil.vistaSubscribeRequestType(otherPidIdentifier._hash);
            // expect(jobUtil.isValid(type1, jobs[1], otherPidIdentifier._hash)).toBe(true);

            expect(jobs[0].patientIdentifier.value).toEqual(pidIdentifier.value);
            expect(jobs[1].patientIdentifier.value).toEqual(otherPidIdentifier.value);

            _.each(jobs, function(job) {
                expect(job.rootJobId).toEqual(forcedJob.jobId);
                expect(job.jpid).toEqual(forcedJob.jpid);
                expect(job.patientIdentifier.type).toEqual('pid');
            });
        });
    });

    describe('_steps', function() {
        var module = SourceSyncJobFactory._test._steps;
        describe('_createJobsToPublish()', function() {
            it('Creates all jobs for a list of patient identifiers from MVI', function() {
                var jobs = module._createJobsToPublish(opts, dummyPatientIdentifiers);

                expect(jobs.length).toBe(5);
                expect(jobs).toContain(jasmine.objectContaining({
                    type: 'vista-9E7A-subscribe-request',
                    patientIdentifier: {
                        type: 'pid',
                        value: '9E7A;42'
                    },
                    jpid: jpidValue,
                    rootJobId: rootJobIdValue
                }));
                expect(jobs).toContain(jasmine.objectContaining({
                    type: 'vista-C877-subscribe-request',
                    patientIdentifier: {
                        type: 'pid',
                        value: 'C877;12'
                    },
                    jpid: jpidValue,
                    rootJobId: rootJobIdValue
                }));
                expect(jobs).toContain(jasmine.objectContaining({
                    type: 'jmeadows-sync-request',
                    patientIdentifier: {
                        type: 'pid',
                        value: 'DOD;1234567'
                    },
                    jpid: jpidValue,
                    rootJobId: rootJobIdValue
                }));
                expect(jobs).toContain(jasmine.objectContaining({
                     type: 'hdr-sync-request',
                     patientIdentifier: {
                         type: 'pid',
                         value: 'HDR;111111'
                     },
                     jpid: jpidValue,
                     rootJobId: rootJobIdValue
                 }));
                // expect(jobs).toContain(jasmine.objectContaining({
                //     type: 'pgd-sync-request',
                //     patientIdentifier: {
                //         type: 'pid',
                //         value: 'DAS;333333'
                //     },
                //     jpid: jpidValue,
                //     rootJobId: rootJobIdValue
                // }));
                // expect(jobs).toContain(jasmine.objectContaining({
                //     type: 'vler-sync-request',
                //     patientIdentifier: {
                //         type: 'pid',
                //         value: 'VLER;222222'
                //     },
                //     jpid: jpidValue,
                //     rootJobId: rootJobIdValue
                // }));
            });
        });
    });

    describe('_utilityFunctions', function() {
        var module = SourceSyncJobFactory._test._utilityFunctions;
        describe('_isSecondarySitePid()', function() {
            it('Verify DOD pid.', function() {
                var result = module._isSecondarySitePid({
                    type: 'pid',
                    value: 'DOD;123'
                });
                expect(result).toBe(true);
            });
            it('Verify HDR pid.', function() {
                var result = module._isSecondarySitePid({
                    type: 'pid',
                    value: 'HDR;123'
                });
                expect(result).toBe(true);
            });
            it('Verify VLER pid.', function() {
                var result = module._isSecondarySitePid({
                    type: 'pid',
                    value: 'VLER;123'
                });
                expect(result).toBe(true);
            });
            it('Verify DAS pid.', function() {
                var result = module._isSecondarySitePid({
                    type: 'pid',
                    value: 'DAS;123'
                });
                expect(result).toBe(true);
            });
            it('Verify Non Secondary pid.', function() {
                var result = module._isSecondarySitePid({
                    type: 'pid',
                    value: '9E7A;123'
                });
                expect(result).toBe(false);
            });
            it('Verify Non Secondary pid.', function() {
                var result = module._isSecondarySitePid({
                    type: 'icn',
                    value: '123V123'
                });
                expect(result).toBe(false);
            });
        });
        describe('_isVistaSitePid()', function() {
            it('Verify DOD pid.', function() {
                var result = module._isVistaSitePid({
                    type: 'pid',
                    value: 'DOD;123'
                });
                expect(result).toBe(false);
            });
            it('Verify HDR pid.', function() {
                var result = module._isVistaSitePid({
                    type: 'pid',
                    value: 'HDR;123'
                });
                expect(result).toBe(false);
            });
            it('Verify VLER pid.', function() {
                var result = module._isVistaSitePid({
                    type: 'pid',
                    value: 'VLER;123'
                });
                expect(result).toBe(false);
            });
            it('Verify DAS pid.', function() {
                var result = module._isVistaSitePid({
                    type: 'pid',
                    value: 'DAS;123'
                });
                expect(result).toBe(false);
            });
            it('Verify Non Secondary pid.', function() {
                var result = module._isVistaSitePid({
                    type: 'pid',
                    value: '9E7A;123'
                });
                expect(result).toBe(true);
            });
            it('Verify Non Secondary pid.', function() {
                var result = module._isVistaSitePid({
                    type: 'icn',
                    value: '123V123'
                });
                expect(result).toBe(false);
            });
        });
    });

    describe('SourceSyncJobFactory', function() {
        it('Creates all of the necessary jobs based on an MVI response', function() {
            log.debug('************ Start of my test *******************');
            var patientIdentifiers = dummyPatientIdentifiers;
            var filteredChildJobs;

            log.debug('************ Continued 1 of my test *******************');

            // var jobMiddleware = new JobMiddleware(log, options.config, {});
            // var myOpts = _.clone(options);
            // myOpts.primaryJobVerifier = jobMiddleware.jobVerification.bind(null, [], {});
            // myOpts.secondaryJobVerifier = jobMiddleware.jobVerification.bind(null, ['completed'], {});
            // myOpts.jobStatus = function(jobHistoryObj, callback) {
            //     jobHistoryObj.jobStates = [{
            //         type: 'vista-9E7A-subscribe-request',
            //         jobId: '100',
            //         rootJobId: rootJobIdValue,
            //         jpid: jpidValue,
            //         timestamp: timeUtil.createStampTime(),
            //         pid: pidIdentifier.value,
            //         status: 'completed'
            //     }];
            //     callback();
            // };

            var jobStatusFunctionValue = function(jobHistoryObj, callback) {
                jobHistoryObj.jobStates = [{
                    type: 'vista-9E7A-subscribe-request',
                    jobId: '100',
                    rootJobId: rootJobIdValue,
                    jpid: jpidValue,
                    timestamp: timeUtil.createStampTime(),
                    pid: pidIdentifier.value,
                    status: 'completed'
                }];
                callback();
            };
            var job = dummyJob(pidIdentifier.value, jpidValue);
            var environment = {
                jobStatusFunction: jobStatusFunctionValue
            };

            var sourceSyncJobFactory = new SourceSyncJobFactory(log, options.config, job, environment);
            //sourceSyncJobFactory.engine.rules = [require(global.VX_SYNCRULES + '/accept-all-rule')];
            log.debug('************ Continued 2 of my test *******************');

            runs(function() {
                sourceSyncJobFactory.createVerifiedJobs(patientIdentifiers, function(asyncError, jobs) {
                    filteredChildJobs = jobs;
                });
            });

            waitsFor(function() {
                return !_.isUndefined(filteredChildJobs);
            });

            runs(function() {
                expect(filteredChildJobs.length).toBe(5);
                log.debug('************ End of my test *******************');
            });


        });
    });
});
