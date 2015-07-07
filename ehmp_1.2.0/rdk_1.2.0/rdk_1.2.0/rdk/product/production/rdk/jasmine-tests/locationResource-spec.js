'use strict';

var _ = require('underscore');
var rdk = require('../rdk/rdk');
var querystring = require('querystring');
var locationsResource = require('../resources/supportdata/locationsResource');
var jdsFilterInterceptor = require('../interceptors/jdsFilterInterceptor');

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

        expect(req.param('test')).not.toBeDefined();
        expect(req.param('test', 'default')).toEqual('default');
    });

    it('test createReqWithParam', function() {
        var req = createReqWithParam({
            name: 'value'
        });

        expect(req.param('name')).toEqual('value');
    });

    it('test createReqWithParam', function() {
        var req = createReqWithParam({
            name: 'test',
            start: 0,
            limit: 10,
            bogus: null
        });

        expect(req.param('name')).toEqual('test');
        expect(req.param('start')).toEqual('0');
        expect(req.param('limit')).toEqual('10');
        expect(req.param('bogus')).toEqual(null);
        expect(req.param('undefined')).not.toBeDefined();
    });
});

describe('locationsResource tester', function() {
    it('tests that handleError() correctly handles and logs an error', function() {
        var res = {
            send: function() {}
        };

        var error = {
            value: 'error string'
        };

        spyOn(res, 'send').andCallThrough();
        spyOn(logger, 'error').andCallThrough();
        locationsResource._handleError(logger, res, error, 'wards', 'filterValue');

        expect(logger.error).toHaveBeenCalled();

        expect(res.send).toHaveBeenCalledWith(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
    });

    it('tests that getResourceConfig() is setup for wards properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).toBe(4);

        expect(resources[0].name).toEqual('wards');
        expect(resources[0].path).toEqual('wards');
        expect(resources[0].interceptors).toEqual({
            pep: false,
            jdsFilter: true
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
    });

    it('tests that getResourceConfig() is setup for clinics properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).toBe(4);

        expect(resources[1].name).toEqual('clinics');
        expect(resources[1].path).toEqual('clinics');
        expect(resources[1].interceptors).toEqual({
            pep: false,
            jdsFilter: true
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].parameters).toBeDefined();
    });

    it('tests that getResourceConfig() is setup for clinics properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).toBe(4);

        expect(resources[2].name).toEqual('wards-search');
        expect(resources[2].path).toEqual('wards/patients');
        expect(resources[2].interceptors).toEqual({
            pep: false,
            jdsFilter: true
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].parameters).toBeDefined();
    });

    it('tests that getResourceConfig() is setup for clinics properly', function() {
        var resources = locationsResource.getResourceConfig();
        expect(resources.length).toBe(4);

        expect(resources[3].name).toEqual('clinics-search');
        expect(resources[3].path).toEqual('clinics/patients');
        expect(resources[3].interceptors).toEqual({
            pep: false,
            jdsFilter: true
        });
        expect(resources[3].healthcheck).toBeDefined();
        expect(resources[3].parameters).toBeDefined();
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
                    jdsServer: {
                        host: '10.2.2.110',
                        port: 9080
                    }
                }
            },
            interceptorResults: {jdsFilter: {filter: []}}
        };

        var res = {
            send: function() {}
        };

        spyOn(res, 'send').andCallThrough();
        spyOn(logger, 'error').andCallThrough();

        rdk.utils.http.fetch = function(dummy, callback) {
            callback('TestError');
        };

        locationsResource._getLocationData(locationType, req, res);

        expect(logger.error).toHaveBeenCalled();

        expect(res.send).toHaveBeenCalledWith(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
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
            send: function() {}
        };

        spyOn(res, 'send').andCallThrough();
        spyOn(logger, 'error').andCallThrough();

        rdk.utils.http.fetch = function(dummy, callback) {
            callback(null, 'non-parsable');
        };

        locationsResource._getLocationData(locationType, req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalled();
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
            send: function() {}
        };

        spyOn(res, 'send').andCallThrough();
        spyOn(logger, 'error').andCallThrough();

        var jsonErrorResult = {
            error: 'test error'
        };

        rdk.utils.http.fetch = function(dummy, callback) {
            callback(null, JSON.stringify(jsonErrorResult));
        };

        locationsResource._getLocationData(locationType, req, res);

        expect(logger.error).toHaveBeenCalled();

        expect(res.send).toHaveBeenCalled();
    });

    it('tests that buildUrlPath() works correctly', function() {
        var req;

        req = createReqWithParam({});
        expect(locationsResource._buildUrlPath('wards', req)).toEqual('/data/index/locations-wards?filter=eq(%22oos%22%2C%22false%22)%2Cnot(exists(%22inactive%22))');

        req = createReqWithParam({
            name: 'test'
        });
        expect(locationsResource._buildUrlPath('clinics', req)).toEqual('/data/index/locations-clinics?range=test*&filter=eq(%22oos%22%2C%22false%22)%2Cnot(exists(%22inactive%22))');

        req = createReqWithParam({
            name: 'test',
            start: 0,
            limit: 10
        });
        expect(locationsResource._buildUrlPath('clinics', req)).toEqual('/data/index/locations-clinics?start=0&limit=10&range=test*&filter=eq(%22oos%22%2C%22false%22)%2Cnot(exists(%22inactive%22))');

        req = createReqWithParam({
            'facility.code': '500'
        });
        expect(querystring.unescape(locationsResource._buildUrlPath('clinics', req))).toEqual('/data/index/locations-clinics?filter=eq("facilityCode","500"),eq("oos","false"),not(exists("inactive"))');

        req = createReqWithParam({
            'site.code': '9E7A'
        });
        expect(querystring.unescape(locationsResource._buildUrlPath('clinics', req))).toEqual('/data/index/locations-clinics?filter=ilike("uid","%:9E7A:%"),eq("oos","false"),not(exists("inactive"))');

        req = createReqWithParam({
            'facility.code': '500',
            'site.code': '9E7A'
        });
        expect(querystring.unescape(locationsResource._buildUrlPath('clinics', req))).toEqual('/data/index/locations-clinics?filter=eq("facilityCode","500"),ilike("uid","%:9E7A:%"),eq("oos","false"),not(exists("inactive"))');
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
            send: function() {}
        };

        spyOn(res, 'send').andCallThrough();
        spyOn(logger, 'error').andCallThrough();

        var jsonResult = {
            data: 'good result'
        };

        rdk.utils.http.fetch = function(dummy, callback) {
            callback(null, JSON.stringify(jsonResult));
        };

        locationsResource._getLocationData(locationType, req, res);

        expect(logger.error).not.toHaveBeenCalled();

        expect(res.send).toHaveBeenCalledWith(jsonResult);
    });
});

describe('extractDfnsFromRpc', function() {
    var callback;
    beforeEach(function() {
        callback = jasmine.createSpy('callback');
    });
    it('should handle expected server errors', function() {
        locationsResource._extractDfnsFromRpc(null, 'clinic', '^Server Error', callback);
        expect(callback).toHaveBeenCalledWith(new Error('Server Error'));
    });
    it('should handle unexpected server errors', function() {
        locationsResource._extractDfnsFromRpc(null, 'clinic', '^Unknown Error', callback);
        expect(callback).toHaveBeenCalledWith('Unknown Error');
    });
    it('should handle no patients found', function() {
        locationsResource._extractDfnsFromRpc(null, 'clinic', '^No patients found.\r\n', callback);
        expect(callback).toHaveBeenCalledWith('No patients found.');
    });
    it('should return a list of patients when given a patient', function() {
        var rpcResponse = '100708^ONE,INPATIENT^722-\r\n100710^TWO,INPATIENT^722-\r\n100711^THREE,INPATIENT^724-\r\n100712^FOUR,INPATIENT^724-\r\n100713^FIVE,INPATIENT^724-\r\n';
        var expectedDfns = [ {dfn: '100708'}, {dfn: '100710'}, {dfn: '100711'}, {dfn: '100712'}, {dfn: '100713'} ];
        locationsResource._extractDfnsFromRpc(null, 'clinic', rpcResponse, callback);
        expect(callback).toHaveBeenCalledWith(null, expectedDfns);
    });
    it('should consolidate dfns', function() {
        var rpcResponse = '100708^ONE,INPATIENT^722-\r\n100708^ONE,INPATIENT^723-\r\n';
        var expectedDfns = [ {dfn: '100708'} ];
        locationsResource._extractDfnsFromRpc(null, 'clinic', rpcResponse, callback);
        expect(callback).toHaveBeenCalledWith(null, expectedDfns);
    });
});
