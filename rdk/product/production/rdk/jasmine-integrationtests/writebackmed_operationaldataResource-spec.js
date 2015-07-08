'use strict';

var request = require('request');
var querystring = require('querystring');
var util = require('util');

var RDK_IP = process.env.RDK_IP || '10.4.4.105';
var RDK_PORT = process.env.RDK_PORT || '8888';

// describe('getDayToQuantity Resource', function() {
//     it('tests that getResourceConfig() is setup correctly', function() {
//         var resources = writebackmedoperationaldata._getResourceConfig();

//         expect(resources[8].name).toEqual('daytoquantity');
//         expect(resources[8].path).toEqual('/daytoquantity');
//         expect(resources[8].interceptors).toEqual(['metrics', 'audit', 'operationalDataCheck', 'authentication']);
//         expect(resources[8].healthcheck).toBeDefined();
//     });
// });

describe('call function getDayToQuantity', function() {
    it('calls VistaJS correctly', function() {
        var error;
        var response;
        var body;
        runs(function() {
            // TODO: get the resource URL from the resource directory like acceptance tests.
            var resourcePath = '/resource/writeback/med/daytoquantity';
            var resource = util.format('http://%s:%s%s', RDK_IP, RDK_PORT, resourcePath);
            var parameters = {
                supply: '30',
                dose: '1',
                schedule: 'QDAY',
                duration: '~',
                patientIEN: '3',
                drugIEN: '461'
            };

            parameters.accessCode = 'pu1234';
            parameters.verifyCode = 'pu1234!!';
            parameters.site = '9E7A';
            var url = resource + '?' + querystring.stringify(parameters);
            console.log(url);
            request.get(url, function(myError, myResponse, myBody) {
                error = myError;
                response = myResponse;
                body = myBody;
            });
        });

        waitsFor(function() {
            return error + response + body;
        }, 5000);

        runs(function() {
            expect(error).toBeFalsy();
            expect(response.statusCode).toBe(200);
            expect(body).toBe('30');
        });
    });
});
