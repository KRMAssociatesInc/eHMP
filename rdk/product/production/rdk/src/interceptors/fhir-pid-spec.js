'use strict';

var fhirPid = require('./fhir-pid');

function createRequest(url) {
    return {
        logger: {
            debug: function() {}
        },
        param: function() {
            return this.query.pid;
        },
        originalUrl: url,
        query: {
            pid: ''
        }
    };
}

function testUrl(url, pid) {
    var next = function() {};
    var res = {};
    var req = createRequest(url);

    fhirPid(req, res, next);
    expect(req.query.pid).to.equal(pid);
}

describe('fhirPid Interceptor', function() {
    it('sets req.query.pid with the patient id of a valid fhir resource url', function() {
        testUrl('', '');
        testUrl('resource/cdsAdvice/list?pid=foo', '');
        testUrl('/fhir/resource/foo', '');
        testUrl('/fhir/bah/patient/foo', '');
        testUrl('/fhir/patient/foo', 'foo');
        testUrl('/fhir/Patient/foo', 'foo');
        testUrl('/fhir/patient/foo:bar', 'foo;bar');
        testUrl('/fhir/patient/foo/observation', 'foo');
    });
});
