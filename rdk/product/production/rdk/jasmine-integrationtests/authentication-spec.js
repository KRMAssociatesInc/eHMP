/*jslint node: true */
'use strict';

var httpMocks = require('node-mocks-http');
var auth = require('../interceptors/authentication/authentication');

function buildRequest(username, password, disabled) {
    var headers = {

    };

    if (username && password) {
        var authHeader = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        headers.Authorization = authHeader;
    }

    var request = httpMocks.createRequest({
        method: 'GET',
        url: '/authenticate'
    });

    request.get = function(header) {
        return headers[header];
    };

    request.logger = {
        trace: function() {},
        debug: function() {},
        info: function() {},
        warn: function() {},
        error: function() {}
    };

    request.app = {
        config: {}
    };

    if (disabled !== undefined) {
        request.app.config = {
            interceptors: {
                authentication: {
                    disabled: true
                }
            }
        };
    }

    return request;
}


var validUid = 'C877;10VEHU';
var validPwd = 'VEHU10';
var invalidUid = 'zzz';
var invalidPwd = 'xxx';

describe('Authentication test mock request', function() {
    it('tests that Authorization header is created correctly', function() {
        var req = buildRequest(validUid, validPwd);
        expect(req.get('Authorization')).not.toBeUndefined();

        req = buildRequest();
        expect(req.get('Authorization')).toBeUndefined();
    });

    it('tests that undefined disabled does not create interceptors.authentication.disabled property', function() {
        var req = buildRequest(validUid, validPwd);
        expect(req.app.config.interceptors).toBeUndefined();
    });

    it('tests that true disabled creates interceptors.authentication.disabled property', function() {
        var req = buildRequest(validUid, validPwd, true);
        expect(req.app.config.interceptors.authentication.disabled).toBe(true);
    });
});

describe('BasicAuth', function() {
    // it('tests that a valid login calls next()', function() {
    //     var test = {
    //         next: function() {}
    //     };

    //     spyOn(test, 'next');
    //     var req = buildRequest(validUid, validPwd);
    //     var res = httpMocks.createResponse();

    //     auth(req, res, test.next);
    //     expect(test.next).toHaveBeenCalled();
    // });

    // it('tests that an incorrect password returns 401', function() {
    //     var test = {
    //         next: function() {}
    //     };

    //     var req = buildRequest(validUid, invalidPwd);
    //     var res = httpMocks.createResponse();

    //     auth(req, res, test.next);
    //     expect(res.statusCode).toEqual(rdk.httpstatus.unauthorized);
    // });

    // it('tests that an invalid login returns 401', function() {
    //     var test = {
    //         next: function() {}
    //     };

    //     var req = buildRequest(invalidUid, invalidPwd);
    //     var res = httpMocks.createResponse();

    //     auth(req, res, test.next);
    //     expect(res.statusCode).toEqual(rdk.httpstatus.unauthorized);
    // });

    it('tests that an invalid login when authentication is disabled calls next()', function() {
        var test = {
            next: function() {}
        };

        spyOn(test, 'next');
        var req = buildRequest(invalidUid, invalidPwd, true);
        var res = httpMocks.createResponse();

        auth(req, res, test.next);
        expect(test.next).toHaveBeenCalled();
    });
});
