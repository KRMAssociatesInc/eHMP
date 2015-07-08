/*jslint node: true*/
'use strict';

var request = require('request');
var errorResourceUrl = 'http://10.4.4.105:8888/writeback/allergy/error';

describe('Allergy Entered in Error Test', function() {
    it('tests the permission endpoint', function() {
        var errorPermissionResult;
        runs(function() {
            request(errorResourceUrl, function(error, response, body) {
                errorPermissionResult = {};
                if (error) {
                    errorPermissionResult.error = error;
                } else {
                    errorPermissionResult.error = error;
                    errorPermissionResult.response = response;
                    errorPermissionResult.body = body;
                }
            }).qs({'pid':'10108V420871'}).auth('9E7A;pu1234', 'pu1234!!');
        });

        waitsFor(function() {
            return errorPermissionResult;
        }, 'returns entered in error permission', 10000);

        runs(function() {
            expect(errorPermissionResult.error).toBeFalsy();
            expect(errorPermissionResult.response.statusCode).toBe(200);
            expect(errorPermissionResult.body).toBe('1');
        });
    });

    it('tests the entered in error save endpoint', function() {
        var saveErrorResult;
        runs(function() {
            request(errorResourceUrl+'/save', function(error, response, body) {
                saveErrorResult = {};
                if (error) {
                    saveErrorResult.error = error;
                } else {
                    saveErrorResult.error = error;
                    saveErrorResult.response = response;
                    saveErrorResult.body = body;
                }
            }).qs({'comments':'something clever','uid':'urn:va:allergy:9E7A:3:874','pid':'10108V420871'}).auth('9E7A;pu1234', 'pu1234!!');
        });

        waitsFor(function() {
            return saveErrorResult;
        }, 'returns entered in error RPC response', 10000);

        runs(function() {
            expect(saveErrorResult.error).toBeFalsy();
            expect(saveErrorResult.response.statusCode).toBe(200);
            expect(saveErrorResult.body.split('^')[0]).toBe('0');
        });
    });
});
