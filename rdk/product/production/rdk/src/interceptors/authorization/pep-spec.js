'use strict';

var httpMocks = require('node-mocks-http');
var pep = require('./pep');
var sensitivePatient = '9E7A;167';
var _ = require('underscore');

function buildRequest(pid, logger) {
    var request = httpMocks.createRequest({
        method: 'GET',
        url: '/pep'
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
        facility: 'PANORAMA',
        dgRecordAccess: 'false',
        dgSensitiveAccess: 'false',
        dgSecurityOfficer: 'false',
        ssn: '666884833',
        corsTabs: 'true',
        rptTabs: 'false',
        patientIdentifier: 'false'
    };

    request._resourceConfigItem = {
        interceptors: {
            pep: 'policy'
        },
        permissions: []
    };

    request.query = {
        pid: '9E7A;18'
    };

    request.logger = logger;

    request.app = {
        config: {
            interceptors: {
                pep: {
                    disabled: false
                }
            },
            jdsServer: {
                host: 'localhost',
                port: 1
            }
        }
    };

    return request;
}

// FIXME this looks like an integration test
xdescribe('PEP Timing', function() {
    var logger;
    //logger = jasmine.createSpyObj('logger', ['info', 'debug', 'warn', 'error']);
    logger = sinon.stub(require('bunyan').createLogger({name: 'pep-spec.js'}));

    it('PEP-METRICS for sensitive Patient ID', function(done) {
        this.timeout(15000);
        var req = buildRequest(sensitivePatient, logger);
        var res = httpMocks.createResponse();

        function tester() {
            expect(_.contains(logger.info, 'pep-metrics')).to.be.true();
            done();
        }
        res.send = tester;
        var next = tester;

        pep(req, res, next);

    });
});
