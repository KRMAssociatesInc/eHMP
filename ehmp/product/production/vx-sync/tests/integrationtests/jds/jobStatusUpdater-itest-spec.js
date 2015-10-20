'use strict';

require('../../../env-setup');

var _ = require('underscore');

var logger = require(global.VX_UTILS + 'dummy-logger');

// logger = require('bunyan').createLogger({
//     name: 'jds-client',
//     level: 'debug'
// });

var config = require(global.VX_ROOT + 'worker-config');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var jdsClient = new JdsClient(logger, logger, config);

var JobStatusUpdater = require(global.VX_JOBFRAMEWORK + 'JobStatusUpdater');
var jsu = new JobStatusUpdater(logger, config, jdsClient);

var identifiers = ['9E7A;33333'];
var identifiers2 = ['888V123887', 'ASDF;123'];
var patientIdentifier = {
    'type': 'pid',
    'value': '9E7A;33333'
};
var jpid;

var unknownIdentifier = {
    'type': 'pid',
    'value': '9E7B;3'
};

var jobData = {
    'type': 'enterprise-sync-request',
    'patientIdentifier': unknownIdentifier,
    'rootJobId': '1',
    'jpid': 'X'
};

function deletePatientIdentifiers(callback) {
    var deleteFinished = 0;
    runs(function() {
        jdsClient.deletePatientByPid(patientIdentifier.value, function(error) {
            expect(error).toBeNull();
            //expect(val(response, 'statusCode')).toBe(200); Can be 200 or 404
            deleteFinished++;
        });
        jdsClient.deletePatientByPid(identifiers2[1], function(error) {
            expect(error).toBeNull();
            //expect(val(response, 'statusCode')).toBe(200); Can be 200 or 404
            deleteFinished++;
        });
        jdsClient.deletePatientByPid(unknownIdentifier.value, function(error) {
            expect(error).toBeNull();
            //expect(val(response, 'statusCode')).toBe(200); Can be 200 or 404
            deleteFinished++;
        });
    });
    waitsFor(function() {
        return deleteFinished === 3;
    });
    runs(function() {
        callback();
    });
}

function resetPatientIdentifiers() {
    var deleteFinished = false;

    runs(function() {
        deletePatientIdentifiers(function() {
            deleteFinished = true;
        });
    });

    waitsFor(function() {
        return deleteFinished;
    });

    var finished = 0;
    runs(function() {
        jdsClient.storePatientIdentifier({
            'patientIdentifiers': identifiers
        }, function(error, response) {
            finished++;
            expect(error).toBeNull();
            expect(val(response, 'statusCode')).toBe(201);
            jdsClient.getPatientIdentifier({
                'patientIdentifier': patientIdentifier
            }, function(error, response, results) {
                jpid = results.jpid;
                finished++;
            });
        });
        jdsClient.storePatientIdentifier({
            'patientIdentifiers': identifiers2
        }, function(error, response) {
            finished++;
            expect(error).toBeNull();
            expect(val(response, 'statusCode')).toBe(201);
        });
    });

    waitsFor(function() {
        return finished === 3;
    });
}

describe('jobStatusUpdater-itest-spec.js', function() {
    beforeEach(function() {
        resetPatientIdentifiers();
    });

    it('stores a job state', function() {
        //
        var done = false;
        runs(function() {
            jsu.createJobStatus(jobData, function(error, response) {
                done = true;
                expect(error).toBeNull();
                expect(response).not.toBeNull();
                // deletePatientIdentifiers(function() { done = true; });
            });
        });

        waitsFor(function() {
            return done;
        });
    });

    it('stores an error state', function() {
        //
        var done = false;
        runs(function() {
            jsu.errorJobStatus(jobData, 'error test', function(error, response) {
                done = true;
                expect(error).toBeNull();
                expect(response).not.toBeNull();
                // deletePatientIdentifiers(function() { done = true; });
            });
        });

        waitsFor(function() {
            return done;
        });
    });

    afterEach(function() {
        var done = false;
        runs(function() {
            deletePatientIdentifiers(function() { done = true; });
        });

        waitsFor(function() {
            return done;
        });
    });
});