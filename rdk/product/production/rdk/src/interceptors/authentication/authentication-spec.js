'use strict';

var httpMocks = require('node-mocks-http');
var auth = require('./authentication');

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
        expect(req.get('Authorization')).not.to.be.undefined();

        req = buildRequest();
        expect(req.get('Authorization')).to.be.undefined();
    });

    it('tests that undefined disabled does not create interceptors.authentication.disabled property', function() {
        var req = buildRequest(validUid, validPwd);
        expect(req.app.config.interceptors).to.be.undefined();
    });

    it('tests that true disabled creates interceptors.authentication.disabled property', function() {
        var req = buildRequest(validUid, validPwd, true);
        expect(req.app.config.interceptors.authentication.disabled).to.be.true();
    });
});

describe('BasicAuth', function() {
    it('tests that an invalid login when authentication is disabled calls next()', function() {
        var next = sinon.spy();
        var req = buildRequest(invalidUid, invalidPwd, true);
        var res = httpMocks.createResponse();

        auth(req, res, next);
        expect(next.called).to.be.true();
    });
});
