/*jslint node: true*/
'use strict';

var request = require('request');
var rdkConfig = require('../config/integrationtest-config');

//Note: IP addresses are hardcoded in  ../config/integrationtest-config
var rdk = 'http://' + rdkConfig.appServer.ip + ':' + rdkConfig.appServer.port;
var expireResourceUrl = rdk + '/sync/expire';
var loadResourceUrl = rdk + '/sync/load';
var clearResourceUrl = rdk + '/sync/clear';

beforeEach(function() {
    var result,
        requestPayload = {
            'pid': '10108V420871',
        };
    //Unsync patient before each test
    runs(function() {
        request(clearResourceUrl, function(error, response, body) {
            result = {};
            if (error) {
                result.error = error;
            } else {
                result.error = error;
                result.response = response;
                result.body = body;
            }
        }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    });

    waitsFor(function() {
        return result;
    }, 'returns 200', 500000);
});

describe('Expire Patient data tests: ', function() {

    it('testing expire patient data before sync', function() {
        var result,
            requestPayload = {
                'pid': '10108V420871',
                'vistaId':'ABCD'
            };

        runs(function() {
            request.post(expireResourceUrl, function(error, response, body) {
                result = {};
                if (error) {
                    result.error = error;
                } else {
                    result.error = error;
                    result.response = response;
                    result.body = body;
                }
            }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
        });

        waitsFor(function() {
            return result;
        }, 'returns 404', 500000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(404);
        });
    });

    it('sync patient', function() {
        var result,
            requestPayload = {
                'pid': '10108V420871'
            };

        runs(function() {
            request(loadResourceUrl, function(error, response, body) {
                result = {};
                if (error) {
                    result.error = error;
                } else {
                    result.error = error;
                    result.response = response;
                    result.body = body;
                }
            }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
        });

        waitsFor(function() {
            return result;
        }, 'returns sync status', 500000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(201);
            expect(JSON.parse(result.body).data.data.items).toBeTruthy();
        });
    });

    it('testing expire patient data after sync', function() {
        var result,
            requestPayload = {
                'pid': '10108V420871',
                'vistaId':'ABCD'
            };

        runs(function() {
            request.post(expireResourceUrl, function(error, response, body) {
                result = {};
                if (error) {
                    result.error = error;
                } else {
                    result.error = error;
                    result.response = response;
                    result.body = body;
                }
            }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
        });

        waitsFor(function() {
            return result;
        }, 'returns 200', 500000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(200);
        });
    });
});
