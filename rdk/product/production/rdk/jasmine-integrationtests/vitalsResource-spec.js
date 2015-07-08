/*jslint node: true*/
'use strict';

var request = require('request');
var resourceUrlClosest = 'http://10.4.4.105:8888/vitals/closest';
var resourceUrlAll = 'http://10.4.4.105:8888/vitals/all';
var resourceUrlQualifiers = 'http://10.4.4.105:8888/vitals/qualifiers';

describe('Vitals resource test', function() {
    it('tests the all vitals endpoint', function() {
        var result,
            requestPayload = {
                'dfn': '3',
                'start': '3010101',
                'end': '3141001',
                'pid': '10108V420871'
            };

        runs(function() {
            request(resourceUrlAll, function(error, response, body) {
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
        }, 'returns vitals', 15000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(200);
            expect(JSON.parse(result.body).meta.ssn4).toBe('0008');
        });
    });

    it('tests the closest reading endpoint', function() {
        var result,
            requestPayload = {
                'dfn': 3,
                'ts': '',
                'type': 'BP',
                'flag': '',
                'pid': '10108V420871'
            };

        runs(function() {
            request(resourceUrlClosest, function(error, response, body) {
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
        }, 'returns vital', 10000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(200);
            expect(JSON.parse(result.body).reading).toBe('80/30');
        });
    });

    it('tests the qualifier information', function() {
        var result,
            requestPayload = {
                'types': 'WT',
                'pid': '10108V420871'
            };

        runs(function() {
            request(resourceUrlQualifiers, function(error, response, body) {
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
        }, 'returns vital', 10000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(200);
            expect(result.body).toEqual('{"items":[{"type":"WEIGHT","fileIEN":"9","abbreviation":"WT","pceAbbreviation":"WT","categories":[{"fileIEN":"2","name":"METHOD","qualifiers":[{"fileIEN":"71","name":"CHAIR","synonym":"Ch"},{"fileIEN":"72","name":"BED","synonym":"B"},{"fileIEN":"91","name":"STANDING WEIGHT","synonym":"SW"},{"fileIEN":"92","name":"WITH CAST OR BRACE","synonym":"WCB"},{"fileIEN":"93","name":"WITH PROSTHESIS","synonym":"WP"},{"fileIEN":"94","name":"WITHOUT PROSTHESIS","synonym":"WOP"},{"fileIEN":"106","name":"LIFT SCALE","synonym":"LS"},{"fileIEN":"115","name":"WHEELCHAIR SCALE","synonym":"WcS"}]},{"fileIEN":"4","name":"QUALITY","qualifiers":[{"fileIEN":"42","name":"ACTUAL","synonym":"A"},{"fileIEN":"43","name":"ESTIMATED","synonym":"E"},{"fileIEN":"44","name":"DRY","synonym":"D"},{"fileIEN":"114","name":"STATED","synonym":"Sta"}]}]}]}');
        });
    });
});
