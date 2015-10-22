'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var querystring = require('querystring');
var locationsResource = require('./locations-resource');
var jdsFilterInterceptor = require('../interceptors/jds-filter-interceptor');

var logger = {
    trace: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {},
    fatal: function() {}
};


function createReqWithParam(map) {
    map = map || {};
    var req = {
        param: (function param(map, name, defaultValue) {
            if (_.has(map, name)) {
                return map[name] !== null ? String(map[name]) : null;
            }

            if (defaultValue !== undefined && defaultValue !== null) {
                String(defaultValue);
            }

            return defaultValue;
        }).bind(null, map),

        query: map,
        interceptorResults: {jdsFilter: {filter: []}},
        logger: logger
    };
    var res = {};
    var next = (function() {});
    jdsFilterInterceptor(req, res, next);
    return req;
}


describe('createReqWithParam() tester', function() {
    it('test createReqWithParam', function() {
        var req = createReqWithParam();

        expect(req.param('test')).to.be.undefined();
        expect(req.param('test', 'default')).to.equal('default');
    });

    it('test createReqWithParam', function() {
        var req = createReqWithParam({
            name: 'value'
        });

        expect(req.param('name')).to.equal('value');
    });

    it('test createReqWithParam', function() {
        var req = createReqWithParam({
            name: 'test',
            start: 0,
            limit: 10,
            bogus: null
        });

        expect(req.param('name')).to.equal('test');
        expect(req.param('start')).to.equal('0');
        expect(req.param('limit')).to.equal('10');
        expect(req.param('bogus')).to.be.null();
        expect(req.param('undefined')).to.be.undefined();
    });
});

describe('locationsResource tester', function() {
    beforeEach(function() {
        sinon.stub(logger);
    });
    it('tests that handleError() correctly handles and logs an error', function() {
        var res = {
            status: sinon.spy(function() {return res;}),
            rdkSend: sinon.spy()
        };
        var error = {
            value: 'error string'
        };

        locationsResource._handleError(logger, res, error, 'wards', 'filterValue');

        expect(logger.error.called).to.be.true();

        expect(res.status.calledWith(rdk.httpstatus.internal_server_error)).to.be.true();
        expect(res.rdkSend.calledWith('There was an error processing your request. The error has been logged.')).to.be.true();
    });

    it('tests that getResourceConfig() is setup for wards properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[0].name).to.equal('wards');
        expect(resources[0].path).to.equal('wards');
        expect(resources[0].interceptors).to.eql({
            pep: false,
            jdsFilter: true,
            synchronize: false
        });
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].parameters).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup for clinics properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[1].name).to.equal('clinics');
        expect(resources[1].path).to.equal('clinics');
        expect(resources[1].interceptors).to.eql({
            pep: false,
            jdsFilter: true,
            synchronize: false
        });
        expect(resources[1].healthcheck).not.to.be.undefined();
        expect(resources[1].parameters).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup for clinics properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[2].name).to.equal('wards-search');
        expect(resources[2].path).to.equal('wards/patients');
        expect(resources[2].interceptors).to.eql({
            pep: false,
            jdsFilter: true,
            synchronize: false
        });
        expect(resources[2].healthcheck).not.to.be.undefined();
        expect(resources[2].parameters).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup for clinics properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[3].name).to.equal('clinics-search');
        expect(resources[3].path).to.equal('clinics/patients');
        expect(resources[3].interceptors).to.eql({
            pep: false,
            jdsFilter: true,
            synchronize: false
        });
        expect(resources[3].healthcheck).not.to.be.undefined();
        expect(resources[3].parameters).not.to.be.undefined();
    });

    it('tests that getLocationData() handles error from fetch() callback correctly', function() {
        var locationType = 'wards';
        var name;

        var req = {
            audit: {
                dataDomain: locationType,
                logCategory: 'SUPPORT'
            },

            param: function(param) {
                return param === 'name' ? name : undefined;
            },

            query: {},

            logger: logger,

            app: {
                config: {
                    timeoutMillis: 120000,
                    jdsServer: {
                        host: '10.2.2.110',
                        port: 9080
                    }
                }
            },
            interceptorResults: {jdsFilter: {filter: []}}
        };

        var res = {
            status: sinon.spy(function() {return res;}),
            rdkSend: sinon.spy()
        };

        sinon.stub(rdk.utils.http, 'fetch', function(dummyAppConfig, dummyResourceConfig, callback) {
            callback('TestError');
        });
        locationsResource._getLocationData(locationType, req, res);

        expect(logger.error.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.internal_server_error)).to.be.true();
        expect(res.rdkSend.calledWith('There was an error processing your request. The error has been logged.')).to.be.true();
    });

    it('tests that getLocationData() handles error from non-json callback result correctly', function() {
        var locationType = 'wards';
        var name;

        var req = {
            audit: {
                dataDomain: locationType,
                logCategory: 'SUPPORT'
            },

            param: function(param) {
                return param === 'name' ? name : undefined;
            },

            query: {},

            logger: logger,

            app: {
                config: {
                    jdsServer: {
                        host: '10.2.2.110',
                        port: 9080
                    }
                }
            },
            interceptorResults: {jdsFilter: {filter: []}}
        };

        var res = {
            status: sinon.spy(function() {return this;}),
            rdkSend: sinon.spy()
        };

        sinon.stub(rdk.utils.http, 'fetch', function(dummyAppConfig, dummyResourceConfig, callback) {
            callback(null, 'non-parsable');
        });
        locationsResource._getLocationData(locationType, req, res);

        expect(logger.error.called).to.be.true();
        expect(res.rdkSend.called).to.be.true();
    });

    it('tests that getLocationData() handles error code in json callback result correctly', function() {
        var locationType = 'wards';
        var name;

        var req = {
            audit: {
                dataDomain: locationType,
                logCategory: 'SUPPORT'
            },

            param: function(param) {
                return param === 'name' ? name : undefined;
            },

            query: {},

            logger: logger,

            app: {
                config: {
                    jdsServer: {
                        host: '10.2.2.110',
                        port: 9080
                    }
                }
            },
            interceptorResults: {jdsFilter: {filter: []}}
        };

        var res = {
            status: sinon.spy(function() {return res;}),
            rdkSend: sinon.spy()
        };

        var jsonErrorResult = {
            error: 'test error'
        };

        sinon.stub(rdk.utils.http, 'fetch', function(dummyAppConfig, dummyResourceConfig, callback) {
            callback(null, JSON.stringify(jsonErrorResult));
        });
        locationsResource._getLocationData(locationType, req, res);
        expect(logger.error.called).to.be.true();
        expect(res.rdkSend.called).to.be.true();
    });

    it('tests that buildUrlPath() works correctly', function() {
        var req;

        req = createReqWithParam({});
        expect(locationsResource._buildUrlPath('wards', req)).to.equal('/data/index/locations-wards?filter=eq(%22oos%22%2C%22false%22)%2Cnot(exists(%22inactive%22))');

        req = createReqWithParam({
            name: 'test'
        });
        expect(locationsResource._buildUrlPath('clinics', req)).to.equal('/data/index/locations-clinics?range=test*&filter=eq(%22oos%22%2C%22false%22)%2Cnot(exists(%22inactive%22))');

        req = createReqWithParam({
            name: 'test',
            start: 0,
            limit: 10
        });
        expect(locationsResource._buildUrlPath('clinics', req)).to.equal('/data/index/locations-clinics?start=0&limit=10&range=test*&filter=eq(%22oos%22%2C%22false%22)%2Cnot(exists(%22inactive%22))');

        req = createReqWithParam({
            'facility.code': '500'
        });
        expect(querystring.unescape(locationsResource._buildUrlPath('clinics', req))).to.equal('/data/index/locations-clinics?filter=eq("facilityCode","500"),eq("oos","false"),not(exists("inactive"))');

        req = createReqWithParam({
            'site.code': '9E7A'
        });
        expect(querystring.unescape(locationsResource._buildUrlPath('clinics', req))).to.equal('/data/index/locations-clinics?filter=ilike("uid","%:9E7A:%"),eq("oos","false"),not(exists("inactive"))');

        req = createReqWithParam({
            'facility.code': '500',
            'site.code': '9E7A'
        });
        expect(querystring.unescape(locationsResource._buildUrlPath('clinics', req))).to.equal('/data/index/locations-clinics?filter=eq("facilityCode","500"),ilike("uid","%:9E7A:%"),eq("oos","false"),not(exists("inactive"))');
    });

    it('tests that getLocationData() handles a success correctly', function() {
        var locationType = 'wards';
        var filter;

        var req = {
            audit: {
                dataDomain: locationType,
                logCategory: 'SUPPORT'
            },

            param: function(param) {
                return param === 'filter' ? filter : undefined;
            },

            query: {},

            logger: logger,

            app: {
                config: {
                    jdsServer: {
                        host: '10.2.2.110',
                        port: 9080
                    }
                }
            },
            interceptorResults: {jdsFilter: {filter: []}}
        };

        var res = {
            status: sinon.spy(function() {return res;}),
            rdkSend: sinon.spy()
        };
        var jsonResult = {
            data: 'good result'
        };

        sinon.stub(rdk.utils.http, 'fetch', function(dummyAppConfig, dummyResourceConfig, callback) {
            callback(null, JSON.stringify(jsonResult));
        });
        locationsResource._getLocationData(locationType, req, res);
        expect(logger.error.called).to.be.false();
        expect(res.rdkSend.calledWith(jsonResult)).to.be.true();
    });
});

describe('extractDfnsFromRpc', function() {
    var callback;
    beforeEach(function() {
        callback = sinon.spy();
    });
    it('should handle expected server errors', function() {
        locationsResource._extractDfnsFromRpc(null, 'clinic', '^Server Error', callback);
        expect(callback.calledWith(new Error('Server Error'))).to.be.true();
    });
    it('should handle unexpected server errors', function() {
        locationsResource._extractDfnsFromRpc(null, 'clinic', '^Unknown Error', callback);
        expect(callback.calledWith('Unknown Error')).to.be.true();
    });
    it('should handle no patients found', function() {
        locationsResource._extractDfnsFromRpc(null, 'clinic', '^No patients found.\r\n', callback);
        expect(callback.calledWith('No patients found.')).to.be.true();
    });
    it('should return a list of patients with room/bed numbers when given a patient for a ward', function() {
        var rpcResponse = '100708^ONE,INPATIENT^722-^3130830.1\r\n100710^TWO,INPATIENT^722-^3131002.13\r\n100711^THREE,INPATIENT^724-^3131003.13\r\n100712^FOUR,INPATIENT^724-^3131010.13\r\n100713^FIVE,INPATIENT^724-^3131202.13\r\n';
        var expectedDfns = [ { dfn : '100708', roomBed : '722-' }, { dfn : '100710', roomBed : '722-' }, { dfn : '100711', roomBed : '724-' }, { dfn : '100712', roomBed : '724-' }, { dfn : '100713', roomBed : '724-' }];
        locationsResource._extractDfnsFromRpc(null, 'ward', rpcResponse, callback);
        expect(callback.calledWith(null, expectedDfns)).to.be.true();
    });
    it('should consolidate dfns for a ward', function() {
        var rpcResponse = '100708^ONE,INPATIENT^722-^3130830.1\r\n100708^ONE,INPATIENT^723-^3130830.1\r\n';
        var expectedDfns = [ {dfn: '100708', roomBed : '722-' }];
        locationsResource._extractDfnsFromRpc(null, 'ward', rpcResponse, callback);
        expect(callback.calledWith(null, expectedDfns)).to.be.true();
    });
        it('should return a list of patients with appointment times when given a patient for a clinic', function() {
        var rpcResponse = '100708^ONE,INPATIENT^722-^3130830.1\r\n100710^TWO,INPATIENT^722-^3131002.13\r\n100711^THREE,INPATIENT^724-^3131003.13\r\n100712^FOUR,INPATIENT^724-^3131010.13\r\n100713^FIVE,INPATIENT^724-^3131202.13\r\n';
        var expectedDfns = [ { dfn : '100708', appointmentTime : '20130830100000' }, { dfn : '100710', appointmentTime : '20131002130000' }, { dfn : '100711', appointmentTime : '20131003130000' }, { dfn : '100712', appointmentTime : '20131010130000' }, { dfn : '100713', appointmentTime : '20131202130000' }];
        locationsResource._extractDfnsFromRpc(null, 'clinic', rpcResponse, callback);
        expect(callback.calledWith(null, expectedDfns)).to.be.true();
    });
    it('should not consolidate dfns for a clinic', function() {
        var rpcResponse = '100708^ONE,INPATIENT^722-^3130830.1\r\n100708^ONE,INPATIENT^723-^3130830.1\r\n';
        var expectedDfns = [ { dfn : '100708', appointmentTime : '20130830100000' }, { dfn : '100708', appointmentTime : '20130830100000' }];
        locationsResource._extractDfnsFromRpc(null, 'clinic', rpcResponse, callback);
        expect(callback.calledWith(null, expectedDfns)).to.be.true();
    });
});
