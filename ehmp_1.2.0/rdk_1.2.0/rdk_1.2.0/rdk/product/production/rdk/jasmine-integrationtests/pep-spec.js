/*jslint node: true */
'use strict';

var httpMocks = require('node-mocks-http');

var config = require('../config/config');
var pep = require('../interceptors/pep');
var rdk = require('../rdk/rdk');

var sensitivePatient = '9E7A;167';
var nonSensitivePatient = 'C877;100022';


function buildRequest(pid, disabled) {

    var request = httpMocks.createRequest({
        method: 'GET',
        url: '/pep',
        headers: {
            'Authorization': 'Basic OUU3QTtwdTEyMzQ6cHUxMjM0ISE='
        }
    });

    request.param = function(key) {
        return request.params[key];
    };

    request.audit = {
        patientId: pid
    };

    request.session = {};

    request.session.user = {
        username: '9E7A;pu1234',
        password: 'pu1234!!',
        firstname: 'PANORAMA',
        lastname: 'USER',
        title: 'Clinician',
        facility: 'PANORAMA',
        section: 'Medicine',
        disabled: false,
        dgRecordAccess: 'false',
        dgSensitiveAccess: 'false',
        dgSecurityOfficer: 'false',
        ssn: '666884833',
        corsTabs: 'true',
        rptTabs: 'false'

    };

    request.logger = {
        trace: function() {},
        debug: function() {},
        info: function() {},
        warn: function() {},
        error: function() {}
    };

    request.app = {
        config: config
    };

    if (disabled !== undefined) {
        request.app.config = {
            interceptors: {
                pep: {
                    disabled: disabled
                }
            }
        };
    }

    return request;

}

describe('PEP Tests', function() {

    it('Sending a user (Authorization header) with no rptTabs or corTabs access gets 403 forbidden', function() {

        var sendRan = false;
        var nextRan = false;

        var req = buildRequest(nonSensitivePatient);

        req.headers = {
            'Authorization': 'Basic bHUxMjM0Omx1MTIzNCEh'
        };

        var res = httpMocks.createResponse();
        res.send = function() {
            sendRan = true;
        };

        var next = function() {
            nextRan = true;
        };

        pep(req, res, next);

        waitsFor(function() {
            return (sendRan || nextRan);
        }, 15000);

        runs(function() {
            expect(res.statusCode).toEqual(rdk.httpstatus.forbidden);
        });

    });

    it('Sending a sensitive patient with a btg should return a 200 ok', function() {

        var sendRan = false;
        var nextRan = false;

        var req = buildRequest(sensitivePatient);
        req.query.pid = sensitivePatient;
        req.query._ack = true;

        var res = httpMocks.createResponse();
        res.send = function() {
            sendRan = true;
        };

        var next = function() {
            nextRan = true;
        };

        pep(req, res, next);

        waitsFor(function() {
            return (sendRan || nextRan);
        }, 15000);

        runs(function() {
            expect(res.statusCode).toEqual(rdk.httpstatus.ok);
        });

    });

    it('Sending a sensitive patient without a btg should return a 307 redirect', function() {

        var sendRan = false;
        var nextRan = false;

        var req = buildRequest(sensitivePatient);
        req.query.pid = sensitivePatient;
        req.query._ack = false;

        var res = httpMocks.createResponse();
        res.send = function() {
            sendRan = true;
        };

        var next = function() {
            nextRan = true;
        };

        pep(req, res, next);

        waitsFor(function() {
            return (sendRan || nextRan);
        }, 15000);

        runs(function() {
            expect(res.statusCode).toEqual(rdk.httpstatus.permanent_redirect);
        });

    });

    it('Sending a nonsensitive patient should return 200 ok', function() {

        var sendRan = false;
        var nextRan = false;

        var req = buildRequest(nonSensitivePatient);
        req.query.pid = nonSensitivePatient;
        req.query._ack = false;


        var res = httpMocks.createResponse();
        res.send = function() {
            sendRan = true;
        };

        var next = function() {
            nextRan = true;
        };

        pep(req, res, next);

        waitsFor(function() {
            return (sendRan || nextRan);
        }, 15000);

        runs(function() {
            expect(res.statusCode).toEqual(rdk.httpstatus.ok);
        });

    });

});
