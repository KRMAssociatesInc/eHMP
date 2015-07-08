'use strict';

require('../../../../env-setup');

var _ = require('underscore');

var handle = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-request-handler');
var jobUtil = require(global.VX_UTILS + 'job-utils');

var log = require(global.VX_UTILS + 'dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-request-handler-spec',
//     level: 'debug'
// });
var inspect = require(global.VX_UTILS + 'inspect');


var config = {
    // 'vistaSites': {
    //     '9E7A': {
    //         panorama: 'panorama',
    //         host: '127.0.0.1',
    //         port: 10001
    //     },
    //     'C877': {
    //         name: 'kodak',
    //         host: '127.0.0.1',
    //         port: 10002
    //     }
    // },
    'recordEnrichment': {
        'domains': [
            'allergy',
            'appointment',
            'consult',
            'cpt',
            'diagnosis',
            'document',
            'factor',
            'immunization',
            'lab',
            'med',
            'order',
            'patient',
            'pov',
            'procedure',
            'problem',
            'surgery',
            'visit',
            'vital'
        ]
    }
};

var jpid = '00000000-0000-0000-0000-000000000000';
var rootJobId = 1;
var rootJob = {
    jpid: jpid,
    jobId: rootJobId,
    rootJobId: rootJobId
};


var patientIdentifier = {
    type: 'pid',
    value: '9E7A;3'
};

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
var allergyJob = jobUtil.createRecordEnrichment(patientIdentifier, 'allergy', allergyRecord, rootJob);

var unknownDomainRecord = {
    'uid': 'urn:va:allergy:9E7A:3:751',
    'pid': '9E7A;3'
};
var unknownDomainJob = jobUtil.createRecordEnrichment(patientIdentifier, 'unknownDomain', unknownDomainRecord, rootJob);

//------------------------------------------------------------------
// Dummy publish method
//------------------------------------------------------------------
function publish(jobsToPublish, handlerCallback) {
    handlerCallback(null, jobsToPublish);
}

//-------------------------------------------------------------------
// This is a transformation that returns an error.
//
// Parameters match what each transform will take - but we are
// ignoring them.
//--------------------------------------------------------------------
function tranformReturnsError(log, config, environment, job, callback) {
    callback('SomeError', null);
}

//-------------------------------------------------------------------
// This is a transformation that returns no record.
//
// Parameters match what each transform will take - but we are
// ignoring them.
//--------------------------------------------------------------------
function tranformReturnsNoRecord(log, config, environment, job, callback) {
    callback(null, null);
}

//------------------------------------------------------------------
// Create an instance of the environment.
//------------------------------------------------------------------
function createEnvironment() {
    var environment = {
        publisherRouter: {
            publish: publish
        },
    };
    return environment;
}

describe('record-enrichment-request-handler.js', function() {
    beforeEach(function() {

    });

    it('Happy Path', function() {
        var environment = createEnvironment();
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var finished = false;
        runs(function() {
            handle(log, config, environment, allergyJob, function(error, job) {
                expect(error).toBeNull();
                expect(job).toBeTruthy();
                expect(job).toEqual(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }));
                expect(environment.publisherRouter.publish.calls.length).toEqual(1);
                expect(environment.publisherRouter.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }), jasmine.any(Function));
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('Invalid Job', function() {
        var environment = createEnvironment();
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var invalidJob = {
            type: 'record-enrichment'
        };
        var finished = false;
        runs(function() {
            handle(log, config, environment, invalidJob, function(error, job) {
                expect(error).toBeTruthy();
                expect(job).toBeFalsy();
                expect(environment.publisherRouter.publish.calls.length).toEqual(0);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('No Config', function() {
        var environment = createEnvironment();
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var finished = false;
        runs(function() {
            handle(log, null, environment, allergyJob, function(error, job) {
                expect(error).toBeNull();
                expect(job).toBeTruthy();
                expect(job).toEqual(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }));
                expect(environment.publisherRouter.publish.calls.length).toEqual(1);
                expect(environment.publisherRouter.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }), jasmine.any(Function));
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('No Config.recordEnrichment', function() {
        var environment = createEnvironment();
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var finished = false;
        runs(function() {
            handle(log, {}, environment, allergyJob, function(error, job) {
                expect(error).toBeNull();
                expect(job).toBeTruthy();
                expect(job).toEqual(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }));
                expect(environment.publisherRouter.publish.calls.length).toEqual(1);
                expect(environment.publisherRouter.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }), jasmine.any(Function));
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('No Config.recordEnrichment.domains', function() {
        var environment = createEnvironment();
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var finished = false;
        runs(function() {
            handle(log, {
                recordEnrichment: {}
            }, environment, allergyJob, function(error, job) {
                expect(error).toBeNull();
                expect(job).toBeTruthy();
                expect(job).toEqual(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }));
                expect(environment.publisherRouter.publish.calls.length).toEqual(1);
                expect(environment.publisherRouter.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'allergy',
                    rootJobId: rootJobId,
                    record: allergyRecord
                }), jasmine.any(Function));
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('Domain not configured.', function() {
        var environment = createEnvironment();
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var finished = false;
        runs(function() {
            handle(log, config, environment, unknownDomainJob, function(error, job) {
                expect(error).toBeNull();
                expect(job).toBeTruthy();
                expect(job).toEqual(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'unknownDomain',
                    rootJobId: rootJobId,
                    record: unknownDomainRecord
                }));
                expect(environment.publisherRouter.publish.calls.length).toEqual(1);
                expect(environment.publisherRouter.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                    type: jobUtil.storeRecordType(),
                    jpid: jpid,
                    patientIdentifier: patientIdentifier,
                    dataDomain: 'unknownDomain',
                    rootJobId: rootJobId,
                    record: unknownDomainRecord
                }), jasmine.any(Function));
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('Failed to find domain xformer.', function() {
        var environment = createEnvironment();
        spyOn(environment.publisherRouter, 'publish').andCallThrough();
        var localConfig = {
            recordEnrichment: {
                domains: ['unknownDomain']
            }
        };

        var finished = false;
        runs(function() {
            handle(log, localConfig, environment, unknownDomainJob, function(error, job) {
                expect(error).toBeTruthy();
                expect(job).toBeFalsy();
                expect(environment.publisherRouter.publish.calls.length).toEqual(0);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('XFormer returns an error.', function() {
        var environment = createEnvironment();
        environment.XformerOverride = tranformReturnsError;
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var finished = false;
        runs(function() {
            handle(log, config, environment, allergyJob, function(error, job) {
                expect(error).toBeTruthy();
                expect(job).toBeFalsy();
                expect(environment.publisherRouter.publish.calls.length).toEqual(0);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

    it('XFormer returns no record.', function() {
        var environment = createEnvironment();
        environment.XformerOverride = tranformReturnsNoRecord;
        spyOn(environment.publisherRouter, 'publish').andCallThrough();

        var finished = false;
        runs(function() {
            handle(log, config, environment, allergyJob, function(error, job) {
                expect(error).toBeTruthy();
                expect(job).toBeFalsy();
                expect(environment.publisherRouter.publish.calls.length).toEqual(0);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 'should be called', 100);
    });

});