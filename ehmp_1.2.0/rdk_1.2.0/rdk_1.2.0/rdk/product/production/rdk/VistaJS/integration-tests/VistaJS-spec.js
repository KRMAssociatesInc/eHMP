/*jslint node: true */
'use strict';

var _ = require('underscore');
var _str = require('underscore.string');
var VistaJS = require('../VistaJS');
var logger = require('bunyan').createLogger({
    name: 'RpcClient',
    level: 'warn'
});

var configuration = {
    context: 'HMP UI CONTEXT',
    host: '10.2.2.101',
    port: 9210,
    accessCode: 'pu1234',
    verifyCode: 'pu1234!!',
    localIP: '10.2.2.1',
    localAddress: 'localhost'
};

describe('Verify authentication', function() {
    it('verifies that valid authentication information successfully authenticates', function() {
        var response;
        var error;

        VistaJS.authenticate(logger, configuration, function(err, result) {
            response = result;
            error = err;
        });

        waitsFor(function() {
            return response || error;
        }, 'should return a status or error that is not undefined', 10000);

        runs(function() {
            expect(response).toEqual({
                accessCode: 'pu1234',
                verifyCode: 'pu1234!!',
                duz: '10000000225',
                greeting: 'Good evening USER,PANORAMA'
            });
        });
    });

    it('verifies that invalid authentication information does not authenticate', function() {
        var response;
        var error;
        var badConfig = _.clone(configuration);
        badConfig.accessCode = 'xpu1234';

        VistaJS.authenticate(logger, badConfig, function(err, result) {
            response = result;
            error = err;
        });

        waitsFor(function() {
            return response || error;
        }, 'should return a status or error that is not undefined', 10000);

        runs(function() {
            expect(error).not.toBeNull();
        });
    });
});

describe('Verify allergy match', function() {
    it('verifies that call to "ORWDAL32 ALLERGY MATCH" using string param returns allergy matches', function() {
        var response;
        var error;

        VistaJS.callRpc(logger, configuration, 'ORWDAL32 ALLERGY MATCH', 'AMP', function(err, result) {
            response = result;
            error = err;
        });

        waitsFor(function() {
            return response || error;
        }, 'should return a status or error that is not undefined', 10000);

        runs(function() {
            expect(_str.startsWith(response, '1^VA Allergies File^^^TOP^+')).toBe(true);
        });
    });

    it('verifies that call to "ORWDAL32 ALLERGY MATCH" RpcParameter returns allergy matches', function() {
        var response;
        var error;

        VistaJS.callRpc(logger, configuration, 'ORWDAL32 ALLERGY MATCH', VistaJS.RpcParameter.literal('AMP'), function(err, result) {
            response = result;
            error = err;
        });

        waitsFor(function() {
            return response || error;
        }, 'should return a status or error that is not undefined', 10000);

        runs(function() {
            expect(_str.startsWith(response, '1^VA Allergies File^^^TOP^+')).toBe(true);
        });
    });
});

describe('Verify get user info', function() {
    it('verifies that call to "ORWU USERINFO" returns results', function() {
        var response;
        var error;

        VistaJS.callRpc(logger, configuration, 'ORWU USERINFO', function(err, result) {
            response = result;
            error = err;
        });

        waitsFor(function() {
            return response || error;
        }, 'should return a status or error that is not undefined', 10000);

        runs(function() {
            expect(response).toEqual('10000000225^USER,PANORAMA^3^1^1^3^0^4000^20^1^1^20^PANORAMA.VISTACORE.US^0^180^^^^0^0^^1^0^500^^0');
        });
    });
});

describe('Fetch Symptoms integration test', function() {
    it('verifies that call to "ORWDAL32 SYMPTOMS" with parameter list with numeric value returns results', function() {
        var response;
        var error;

        VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', '', 1, function(err, result) {
            response = result;
            error = err;
        });

        waitsFor(function() {
            return response || error;
        }, 'should return a status or error that is not undefined', 10000);

        runs(function() {
            expect(_str.startsWith(response, '476^A FIB-FLUTTER')).toBe(true);
        });
    });

    it('verifies that call to "ORWDAL32 SYMPTOMS" with parameters as array returns results', function() {
        var response;
        var error;

        VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', ['', 1], function(err, result) {
            response = result;
            error = err;
        });

        waitsFor(function() {
            return response || error;
        }, 'should return a status or error that is not undefined', 10000);

        runs(function() {
            expect(_str.startsWith(response, '476^A FIB-FLUTTER')).toBe(true);
        });
    });
});
