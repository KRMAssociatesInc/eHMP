/*jslint node: true */
'use strict';

var audit = require('../interceptors/audit/audit');
var httpMocks = require('node-mocks-http');

var patient = '9E7A;167';

function buildRequest(pid) {
    var request = httpMocks.createRequest({
        method: 'GET',
        url: '/audit'

    });

    request.param = function(key) {
        return request.params[key];
    };

    request.get = function(header) {
        return this.headers[header];
    };

    request.audit = {
        patientId: pid
    };

    request.logger = {
        trace: function() {},
        debug: function() {},
        info: function() {},
        warn: function() {},
        error: function() {}
    };

    request.query.pid = patient;

    return request;
}

describe('Audit logs the request', function() {
    it('tests that the audit log is created on a request', function() {

        var req = buildRequest(patient);

        var testNext = {
            next: function() {}
        };

        var testSave = {
            save: function() {
            }
        };

        spyOn(testNext, 'next');
        spyOn(testSave, 'save');

        req.app = {};
        req.app.auditer = {};
        req.app.auditer.save = testSave.save;



        var res = httpMocks.createResponse();
        res.statusCode = '-';

        res.on = function(name, callback) {
            callback();
        };

        audit(req, res, testNext.next);

        expect(testNext.next).toHaveBeenCalled();
        expect(testSave.save).toHaveBeenCalled();

    });
});
