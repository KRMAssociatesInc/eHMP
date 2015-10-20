'use strict';

require('../../../../env-setup');

var _ = require('underscore');

require('../../../../env-setup');
var endpoint = require(global.VX_ENDPOINTS + 'error-handling/error-endpoint');

var logger = require(global.VX_UTILS + 'dummy-logger');
var config = {};

function returnError(value, callback) {
    setTimeout(callback, 0, 'ERROR', value);
}

function returnResult(value, callback) {
    setTimeout(callback, 0, null, value);
}

var response = {
    status: function(code) {
        return this;
    },
    send: function(value) {}
};

describe('error-endpoint.js', function() {
    describe('_buildJdsFilter()', function() {
        //buildJdsFilter(logger, query)
        it('test simple parameters', function() {
            var query = {
                type: 'error-request',
                classification: 'job'
            };

            var filter = endpoint._buildJdsFilter(logger, query);

            expect(filter).toEqual('eq(type,"error-request"),eq(classification,"job")');
        });

        it('test multi-parameters', function() {
            var query = {
                patientIdentifierValue: ['9E7A;3', 'C877']
            };

            var filter = endpoint._buildJdsFilter(logger, query);

            expect(filter).toEqual('in(patientIdentifierValue,["9E7A;3","C877"])');
        });
    });

    describe('_fetchErrors()', function() {
        var environment = {
            jds: {}
        };

        var request = {
            query: {
                patientIdentifierValue: ['9E7A;3', 'C877']
            }
        };

        it('test error', function() {
            environment.jds.findErrorRecordsByFilter = returnError;

            endpoint._fetchErrors(logger, config, environment, request, response);
        });
    });

    describe('_submitById()', function() {
        it('', function() {

        });
    });
});