'use strict';

require('../../../../env-setup');

var _ = require('underscore');
var handle = require(global.VX_HANDLERS + 'store-record-request/store-record-request-handler');
var logger = require(global.VX_UTILS + 'dummy-logger');

var environment = {};
environment.publisherRouter = {
    'publish': jasmine.createSpy().andCallFake(function(job, callback) {
        callback(null, [1]);
    })
};
environment.jds = {
    'storePatientDataFromJob': jasmine.createSpy().andCallFake(function(job, callback) {
        callback(null, { 'statusCode': 201 });
    })
};
environment.solr = {
    'add': jasmine.createSpy().andCallFake(function(doc, callback) {
        callback(null);
    })
};

describe('store-record-request-handler.js', function() {
    describe('handle()', function() {
        var patientIdentifier = {
            'type': 'pid',
            'value': '9E7A;3'
        };
        var demographicsRecord = {
            'addresses':[
                {
                    'city': 'Any Town',
                    'postalCode': '99998-0071',
                    'stateProvince': 'WEST VIRGINIAN'
                }
            ],
            'aliases': [
                {
                'fullName': 'P8'
                }
            ],
            'briefId': 'U7777',
            'dateOfBirth': 19350408,
            'facilities': [
                {
                'code': 500,
                'latestDate': 20110613,
                'name': 'CAMP MASTER',
                'systemId': '93EF'
                }
            ],
            'familyName': 'UTESTPATIENT',
            'gender': 'M',
            'givenNames': 'EIGHT',
            'icn': '888V123887',
            'ssn': '88888887',
            'pid': 'ASDF;123',
            'uid': 'urn:va:patient:ASDF:123:123',
            'stampTime': '20141031094920'
        };
        var storageJob = {
            'patientIdentifier': patientIdentifier,
            'record': demographicsRecord,
            'jpid': '21EC2020-3AEA-4069-A2DD-08002B30309D',
            'type': 'store-record-request'
        };
        it('handles a store-record-request job', function() {
            var finished = false;
            runs(function() {
                handle(logger, {}, environment, storageJob, function(error, result) {
                    expect(error).toBeNull();
                    expect(result).toEqual('success');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        });

        it('throws an error for jobs with missing records or records missing data', function() {
            var finished = false;
            var brokenJob = _.clone(storageJob);
            delete brokenJob.record.uid;
            runs(function() {
                handle(logger, {}, environment, storageJob, function(error, result) {
                    expect(error).not.toBeNull();
                    expect(error.message).toEqual('Missing UID');
                    expect(result).toBeUndefined();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        });
    });
});