'use strict';

require('../../../../env-setup');
var endpoint = require(global.VX_ENDPOINTS + 'operational/operational-sync-endpoint-handler.js').doLoad;
var log = require(global.VX_UTILS + 'dummy-logger');

var stubRouter = {
    publish: function(job, options, cb) {
        return cb(null, 'result');
    }
};
var stubEnvironment = {
    publisherRouter: stubRouter
};

var errorRouter = {
    publish: function(job, options, cb) {
        return cb('it broke');
    }
};
var errorEnvironment = {
    publisherRouter: errorRouter
};

var request = {
    body: null,
    param: function(param) {
        if (!param) {
            return undefined;
        }
        if (this.body) {
            return this.body[param];
        } else {
            return undefined;
        }
    }
};
var response = {
    statusCode: 200,
    message: null,
    expectedCode: 200,
    expectedMessage: null,
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    send: function(message) {
        this.message = message;
        expect(this.message).toEqual(this.expectedMessage);
        expect(this.statusCode).toEqual(this.expectedCode);
    }
};

describe('operational-sync-request-endpoint.js', function() {
    describe('respond to posts', function() {

        it('No payload', function() {
            request.body = undefined;
            response.expectedCode = 400;
            response.expectedMessage = 'No list of valid VistA sites were found';
            endpoint(log, stubEnvironment, request, response);
        });
        it('No sites', function() {
            request.body = {
                stuff: 'invalid'
            };
            response.expectedCode = 400;
            response.expectedMessage = 'No list of valid VistA sites were found';
            endpoint(log, stubEnvironment, request, response);
        });
        it('Unknown sites', function() {
            request.body = {
                sites: 'invalid'
            };
            response.expectedCode = 400;
            response.expectedMessage = 'Unknown VistA site invalid';
            endpoint(log, stubEnvironment, request, response);
        });
        it('Sites as array', function() {
            spyOn(stubRouter, 'publish').andCallThrough();
            request.body = {
                sites: ['9E7A']
            };
            response.expectedCode = 201;
            response.expectedMessage = undefined;
            endpoint(log, stubEnvironment, request, response);
            expect(stubRouter.publish.calls.length).toEqual(1);
        });
        it('Sites as string', function() {
            spyOn(stubRouter, 'publish').andCallThrough();
            request.body = {
                sites: '9E7A'
            };
            response.expectedCode = 201;
            response.expectedMessage = undefined;
            endpoint(log, stubEnvironment, request, response);
            expect(stubRouter.publish.calls.length).toEqual(1);
        });
        it('Some valid some invalid sites', function() {
            request.body = {
                sites: '9E7A,9999'
            };
            response.expectedCode = 400;
            response.expectedMessage = 'Unknown VistA site 9999';
            endpoint(log, stubEnvironment, request, response);
        });
        it('Multiple valid sites', function() {
            spyOn(stubRouter, 'publish').andCallThrough();
            request.body = {
                sites: '9E7A,C877'
            };
            response.expectedCode = 201;
            response.expectedMessage = undefined;
            endpoint(log, stubEnvironment, request, response);
            expect(stubRouter.publish.calls.length).toEqual(2);
        });
        it('Duplicate valid sites', function() {
            spyOn(stubRouter, 'publish').andCallThrough();
            request.body = {
                sites: 'C877,C877'
            };
            response.expectedCode = 201;
            response.expectedMessage = undefined;
            endpoint(log, stubEnvironment, request, response);
            expect(stubRouter.publish.calls.length).toEqual(2);
        });
        it('Error while publishing', function() {
            spyOn(errorRouter, 'publish').andCallThrough();
            request.body = {
                sites: '9E7A'
            };
            response.expectedCode = 400;
            response.expectedMessage = 'Unable to send operational sync to all sites';
            endpoint(log, errorEnvironment, request, response);
            expect(errorRouter.publish.calls.length).toEqual(1);
        });
    });
});