'use strict';

require('../../../../env-setup');

var _ = require('underscore');

var handle = require(global.VX_HANDLERS + 'enterprise-sync-request/enterprise-sync-request-handler');

var jobUtil = require(global.VX_UTILS + 'job-utils');
var DummyRequest = require(global.VX_ROOT + 'tests/frames/dummy-request');
var JdsClientDummy = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var PtDemographicsUtil = require(global.VX_UTILS + '/ptdemographics-utils');

var log = require(global.VX_UTILS + 'dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({name: 'enterprise-sync-request-handler-spec', level: 'debug'});
// var inspect = require(global.VX_UTILS + 'inspect');

var patientIdList = [{
    type: 'icn',
    value: '10110V004877'
}, {
    type: 'edipi',
    value: '10110'
}, {
    type: 'pid',
    value: 'C877;8'
}, {
    type: 'pid',
    value: '9E7A;8'
}];

var patient = {
    name: 'Eight,Patient',
    ids: patientIdList
};

var patientIdentifiers = [{
    type: 'icn',
    value: '10110V004877'
}, {
    type: 'pid',
    value: 'C877;8'
}, {
    type: 'pid',
    value: '9E7A;8'
}, {
    type: 'pid',
    value: 'DOD;10110'
}, {
    type: 'pid',
    value: 'HDR;10110V004877'
}, {
    type: 'pid',
    value: 'VLER;10110V004877'
}, {
    type: 'pid',
    value: 'DAS;10110V004877'
}];

var vistaSites = {
    '9E7A': {
        panorama: 'panorama',
        host: '127.0.0.1',
        port: 10001
    },
    'C877': {
        name: 'kodak',
        host: '127.0.0.1',
        port: 10002
    }
};

function mviLookup(patientIdentifier, callback) {
    callback(null, patient);
}

function mviErrorLookup(patientIdentifier, callback) {
    callback('mvi error');
}

function publish(jobsToPublish, handlerCallback) {
    handlerCallback(null, jobsToPublish);
}

function errorPublish(jobsToPublish, handlerCallback) {
    handlerCallback('router error');
}

function storePatientIdentifier(jdsIdentifiers, callback) {
    callback(null, patientIdentifiers);
}

function storeJdsIdentifiers(job, callback) {
    callback(null, {
        'statusCode': 200
    }, job);
}

var environment = {
    mvi: {
        lookup: function(identifiers, callback) {
            callback(404);
        }
    },
    publisherRouter: {
        publish: publish
    },
    jds: {
        storePatientIdentifier: storeJdsIdentifiers
    },
    jobStatusUpdater: {
        startJobStatus: function(job, callback) {
            job.status = 'started';
            this.writeStatus(job, callback);
        },
        createJobStatus: function(job, callback) {
            job.status = 'created';
            this.writeStatus(job, callback);
        },
        completeJobStatus: function(job, callback) {
            job.status = 'completed';
            this.writeStatus(job, callback);
        },
        writeStatus: jasmine.createSpy().andCallFake(function(job, callback) {
            callback(null, {
                'statusCode': 200
            }, job);
        })
    }
};

var config = {
    'vistaSites': vistaSites
};


function has(jobs, jobType) {
    return _.some(jobs, function(job) {
        return job.type === jobType;
    });
}

describe('enterprise-sync-request-handler.js', function() {
    var options;
    var called;
    var expectedError;
    var expectedResult;

    beforeEach(function() {
        called = false;
        expectedError = undefined;
        expectedResult = undefined;

        var requestJob = new DummyRequest({
            'pid': '9E7A;3'
        });

        requestJob.jpid = '00000000-0000-0000-0000-000000000000';
        requestJob.patientIdentifier = {
            'type': 'pid',
            'value': '9E7A;3'
        };

        var env = _.clone(environment);
        env.mvi.lookup = jasmine.createSpy().andCallFake(mviLookup);
        env.jds.storePatientIdentifier = jasmine.createSpy().andCallFake(storeJdsIdentifiers);

        var job = jobUtil.createEnterpriseSyncRequest(requestJob.patientIdentifier, requestJob.jpid, requestJob.force);
        job.jobId = 1;

        options = {
            'log': log,
            'config': config,
            'environment': env,
            'job': job,
            'jobStatusUpdater': env.jobStatusUpdater,
            'sourceSyncJobFactory': {},
            'handlerCallback': function(error) {
                console.log('TEST ERROR:', error);
            }
        };
    });

    it('verify has()', function() {
        var job2 = jobUtil.createVistaSubscribeRequest('C877', {
            type: 'pid',
            value: 'C877;8'
        });
        var job3 = jobUtil.createVistaSubscribeRequest('9E7A', {
            type: 'pid',
            value: '9E7A;8'
        });

        expect(has([options.job], jobUtil.enterpriseSyncRequestType())).toBe(true);
        expect(has([job2], jobUtil.vistaSubscribeRequestType('C877'))).toBe(true);
        expect(has([options.job], jobUtil.hdrXformVprType())).toBe(false);
        expect(has([job2, job3], jobUtil.vistaSubscribeRequestType('00A0'))).toBe(false);
    });

    describe('_validateJob()', function() {
        it('Errors on an invalid job', function() {
            var opts = _.clone(options);
            opts.job.patientIdentifier = {};
            opts.handlerCallback = function(error, result) {
                called = true;
                expectedError = error;
                expectedResult = result;
            };

            var called = false;
            var expectedError;
            var expectedResult;
            runs(function() {
                handle(log, config, environment, opts.job, function(error, result) {
                    called = true;
                    expectedError = error;
                    expectedResult = result;
                });
            });

            waitsFor(function() {
                return called;
            }, 'should be called', 100);

            runs(function() {
                expect(expectedError).not.toBeUndefined();
                expect(expectedResult).toBeUndefined();
            });
        });
    });

    describe('_mviSteps', function() {
        describe('_queryMVI()', function() {
            it('Queries MVI against the job\'s PID', function() {
                runs(function() {
                    handle._steps._mviSteps._queryMVI.call(options, function() {
                        called = true;
                    });
                });

                waitsFor(function() {
                    return called;
                }, 'should be called', 100);

                runs(function() {
                    expect(options.environment.mvi.lookup).toHaveBeenCalled();
                });
            });

            it('Throws an error when MVI throws a weird error', function() {
                var opts = _.clone(options);
                var env = _.clone(environment);
                env.mvi = { lookup: mviErrorLookup };
                opts.environment = env;

                runs(function() {
                    handle._steps._mviSteps._queryMVI.call(opts, function(error) {
                        called = true;
                        expectedError = error;
                    });
                });

                waitsFor(function() {
                    return called;
                }, 'should be called', 100);

                runs(function() {
                    expect(expectedError).not.toBeUndefined();
                });
            });

            it('Gets the MVI response and saves it to JDS when it is available', function() {
                var opts = _.clone(options);
                var env = _.clone(environment);
                env.mvi = { lookup: mviLookup };
                env.jds.storePatientIdentifier = jasmine.createSpy().andCallFake(storePatientIdentifier);
                opts.environment = env;

                runs(function() {
                    handle._steps._mviSteps._queryMVI.call(opts, function(error, result) {
                        called = true;
                        expectedError = error;
                        expectedResult = result;
                    });
                });

                waitsFor(function() {
                    return called;
                }, 'should be called', 100);

                runs(function() {
//                    expect(expectedResult.length).toBe(7);
                    expect(expectedResult.length).toBe(6);
                    expect(expectedResult).toContain(jasmine.objectContaining({ type: 'icn', value: '10110V004877'}));
                    expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: '9E7A;8'}));
                    expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'C877;8'}));
                    expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'DOD;10110'}));
                    expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'HDR;10110V004877'}));
                    // expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'VLER;10110V004877'}));
                    // expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'DAS;10110V004877'}));
                    expect(opts.environment.jds.storePatientIdentifier).toHaveBeenCalled();
                });
            });
        });

        describe('_saveMviResults()', function() {
            it('Saves MVI results to JDS when asked', function() {
                runs(function() {
                    handle._steps._mviSteps._saveMviResults.call(options, {
                        'ids': patientIdList
                    }, function(error, result) {
                        called = true;
                        expectedError = error;
                        expectedResult = result;
                    });
                });

                waitsFor(function() {
                    return called;
                }, 'should be called', 100);

                runs(function() {
                    expect(expectedError).toBeNull();
                    expect(expectedResult).not.toBeUndefined();
                });
            });
        });

        describe('_createValidIdentifiers()', function() {
            it('Create identfiers based on the results from MVI', function() {
                var expectedResult = handle._steps._mviSteps._createValidIdentifiers.call(options, {
                    'ids': patientIdList
                });

                expect(expectedResult.length).toBe(6);
                // expect(expectedResult.length).toBe(7);
                expect(expectedResult).toContain(jasmine.objectContaining({ type: 'icn', value: '10110V004877'}));
                expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: '9E7A;8'}));
                expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'C877;8'}));
                expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'DOD;10110'}));
                expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'HDR;10110V004877'}));
                // expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'VLER;10110V004877'}));
                // expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'DAS;10110V004877'}));
            });
        });

        describe('_removeNonPrimaryVistaSites()', function() {
            it('Create identfiers based on the results from MVI', function() {
                var newPatientIdList = patientIdList.concat([{type: 'pid', value: 'AAAA;111'}, {type: 'pid', value: 'DOD;111'}]);
                var expectedResult = handle._steps._mviSteps._removeNonPrimaryVistaSites.call(options, newPatientIdList);


                expect(expectedResult.length).toBe(2);
                expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: '9E7A;8'}));
                expect(expectedResult).toContain(jasmine.objectContaining({ type: 'pid', value: 'C877;8'}));
            });
        });
    });

    describe('_publishJobs()', function() {
        it('Successfully publishes subscribe and sync jobs', function() {
            var completed;
            var job2 = jobUtil.createVistaSubscribeRequest('C877', {
                type: 'pid',
                value: 'C877;8'
            });
            var job3 = jobUtil.createVistaSubscribeRequest('9E7A', {
                type: 'pid',
                value: '9E7A;8'
            });

            runs(function() {
                handle._steps._publishJobs.call(options, [job2, job3], function(error, result) {
                    completed = true;
                    expectedError = error;
                    expectedResult = result;
                });
            });

            waitsFor(function() {
                return completed;
            }, 'should be called', 100);

            runs(function() {
                expect(expectedError).toBeNull();
                expect(expectedResult.length).toBe(2);
            });
        });
    });

    describe('_createDemographics()', function() {
        it('Successfully publishes subscribe and sync jobs', function() {
            // We have to have deeper control over JDS for this test...   So we need our own instance of options and env.
            //-----------------------------------------------------------------------------------------------------------
            var localOptions = _.clone(options);
            var localEnv = _.clone(options.environment);
            localEnv.jds = new JdsClientDummy(localOptions.log, localOptions.config);
            localOptions.environment = localEnv;
            localOptions.ptDemographicsUtil = new PtDemographicsUtil(localOptions.log, localOptions.config, localOptions.environment);

            spyOn(localEnv.jds, 'getPtDemographicsByPid').andCallThrough();

            var demographicsFromVista = {
                'pid': '9E7A;3',
                'birthDate': '19350407',
                'last4': '0008',
                'last5': 'E0008',
                'icn': '10108V420871',
                'familyName': 'EIGHT',
                'givenNames': 'PATIENT',
                'fullName': 'EIGHT,PATIENT',
                'displayName': 'Eight,Patient',
                'genderCode': 'urn:va:pat-gender:M',
                'genderName': 'Male',
                'sensitive': false,
                'uid': 'urn:va:patient:9E7A:3:3',
                'summary': 'Eight,Patient',
                'ssn': '666000008',
                'localId': 3
            };
            var pidDod = 'DOD;10108V420871';
            var uidDod = 'urn:va:patient:DOD:10108V420871:10108V420871';

            var demographicsDod = _.clone(demographicsFromVista);
            demographicsDod.pid = pidDod;
            demographicsDod.uid = uidDod;


            var expectedJdsError = [null, null];
            var expectedJdsResponse = [{
                statusCode: 200
            }, {
                statusCode: 200
            }];
            var expectedJdsResult = [{
                data: {
                    items: [demographicsFromVista]
                }
            },{
                data: {
                    items: [demographicsDod]
                }
            }];
            localEnv.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

            var completed;
            var job2 = jobUtil.createJmeadowsSyncRequest({
                type: 'pid',
                value: pidDod
            });

            runs(function() {
                handle._steps._createDemographics.call(localOptions, [job2], function(error, result) {
                    completed = true;
                    expectedError = error;
                    expectedResult = result;
                });
            });

            waitsFor(function() {
                return completed;
            }, 'should be called', 100);

            runs(function() {
                expect(expectedError).toBeNull();
                expect(expectedResult.length).toBe(1);
                expect(localEnv.jds.getPtDemographicsByPid.calls.length).toEqual(2);
                expect(localEnv.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
                expect(localEnv.jds.getPtDemographicsByPid).toHaveBeenCalledWith(pidDod, jasmine.any(Function));
            });
        });
        it('When initial syncJobs array is empty.', function() {
            // We have to have deeper control over JDS for this test...   So we need our own instance of options and env.
            //-----------------------------------------------------------------------------------------------------------
            var localOptions = _.clone(options);
            var localEnv = _.clone(options.environment);
            localEnv.jds = new JdsClientDummy(localOptions.log, localOptions.config);
            localOptions.environment = localEnv;
            localOptions.ptDemographicsUtil = new PtDemographicsUtil(localOptions.log, localOptions.config, localOptions.environment);

            spyOn(localEnv.jds, 'getPtDemographicsByPid').andCallThrough();

            var demographicsFromVista = {
                'pid': '9E7A;3',
                'birthDate': '19350407',
                'last4': '0008',
                'last5': 'E0008',
                'icn': '10108V420871',
                'familyName': 'EIGHT',
                'givenNames': 'PATIENT',
                'fullName': 'EIGHT,PATIENT',
                'displayName': 'Eight,Patient',
                'genderCode': 'urn:va:pat-gender:M',
                'genderName': 'Male',
                'sensitive': false,
                'uid': 'urn:va:patient:9E7A:3:3',
                'summary': 'Eight,Patient',
                'ssn': '666000008',
                'localId': 3
            };
            var pidDod = 'DOD;10108V420871';
            var uidDod = 'urn:va:patient:DOD:10108V420871:10108V420871';

            var demographicsDod = _.clone(demographicsFromVista);
            demographicsDod.pid = pidDod;
            demographicsDod.uid = uidDod;


            var expectedJdsError = [null, null];
            var expectedJdsResponse = [{
                statusCode: 200
            }, {
                statusCode: 200
            }];
            var expectedJdsResult = [{
                data: {
                    items: [demographicsFromVista]
                }
            },{
                data: {
                    items: [demographicsDod]
                }
            }];
            localEnv.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

            var completed;
            runs(function() {
                handle._steps._createDemographics.call(localOptions, [], function(error, result) {
                    completed = true;
                    expectedError = error;
                    expectedResult = result;
                });
            });

            waitsFor(function() {
                return completed;
            }, 'should be called', 100);

            runs(function() {
                expect(expectedError).toBeNull();
                expect(expectedResult.length).toBe(0);
                expect(localEnv.jds.getPtDemographicsByPid.calls.length).toEqual(0);
            });
        });
    });

    describe('handle()', function() {
        it('verify mvi error', function() {
            options.environment.jds.getJobStatus = function(job, callback) {
                callback(200, []);
            };

            options.environment.mvi.lookup = mviErrorLookup;

            runs(function() {
                handle(options.log, options.config, options.environment, options.job, function(error, result) {
                    called = true;
                    expectedError = error;
                    expectedResult = result;
                });
            });

            waitsFor(function() {
                return called;
            }, 'should return an error that is ', 1000);

            runs(function() {
                expect(expectedError).toEqual('mvi error');
            });
        });

        xit('verify publish error', function() {
            options.environment.jds.getJobStatus = function(job, callback) {
                callback(null, {
                    'statusCode': 200
                }, []);
            };

            options.environment.publisherRouter.publish = errorPublish;

            runs(function() {
                handle(options.log, options.config, options.environment, options.job, function(error, result) {
                    called = true;
                    expectedError = error;
                    expectedResult = result;
                });
            });

            waitsFor(function() {
                return called;
            }, 'should return an error that is defined and not null', 1000);

            runs(function() {
                expect(expectedError).toEqual('router error');
            });
        });

        xit('verify success', function() {
            options.environment.mvi.lookup = function(identifier, callback) {
                callback(null, {
                    'ids': patientIdList
                });
            };
            options.environment.publisherRouter.publish = publish;

            handle(options.log, options.config, options.environment, options.job, function(error, result) {
                called = true;
                expectedResult = result;
            });

            waitsFor(function() {
                return called;
            }, 'should return an error or result that is not undefined', 1000);

            runs(function() {
                expect(expectedResult.length).not.toBeUndefined();
            });
        });
    });
});
