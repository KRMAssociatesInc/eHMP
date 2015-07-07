/*jslint node: true*/
'use strict';

var request = require('request');
var rdkConfig = require('../config/integrationtest-config');

//Note: IP addresses are hardcoded in  ../config/integrationtest-config
var rdk = 'http://' + rdkConfig.appServer.ip + ':' + rdkConfig.appServer.port;
var clearResourceUrl = rdk + '/sync/clear';

describe('Sync tests: ', function() {

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

    // it('testing calling sync/load normally', function() {
    //     var result,
    //         requestPayload = {
    //             'pid': '10108V420871',
    //         };

    //     runs(function() {
    //         request(loadResourceUrl, function(error, response, body) {
    //             result = {};
    //             if (error) {
    //                 result.error = error;
    //             } else {
    //                 result.error = error;
    //                 result.response = response;
    //                 result.body = body;
    //             }
    //         }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return result;
    //     }, 'returns sync status', 500000);

    //     runs(function() {
    //         expect(result.error).toBeFalsy();
    //         expect(result.response.statusCode).toBe(201);
    //         expect(JSON.parse(result.body).data.data.items).toBeTruthy();
    //     });
    // });

    // it('testing calling sync/loadPrioritized', function() {
    //     var result,
    //         requestPayload = {
    //             'pid': '10108V420871',
    //             'prioritySelect': 'userSelect',
    //             'prioritySite': ['C877', '9E7A']
    //         };

    //     runs(function() {
    //         request(loadPrioritizedResourceUrl, function(error, response, body) {
    //             result = {};
    //             if (error) {
    //                 result.error = error;
    //             } else {
    //                 result.error = error;
    //                 result.response = response;
    //                 result.body = body;
    //             }
    //         }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return result;
    //     }, 'returns sync status', 500000);

    //     runs(function() {
    //         expect(result.error).toBeFalsy();
    //         expect(result.response.statusCode).toBe(201);
    //         expect(JSON.parse(result.body).data.data.items).toBeTruthy();
    //     });
    // });

    // it('testing sync/load set to return immediately after calling eHMP sync', function() {
    //     var result,
    //         requestPayload = {
    //             'pid': '10108V420871',
    //             'immediate': 'true'
    //         };

    //     runs(function() {
    //         request(loadResourceUrl, function(error, response, body) {
    //             result = {};
    //             if (error) {
    //                 result.error = error;
    //             } else {
    //                 result.error = error;
    //                 result.response = response;
    //                 result.body = body;
    //             }
    //         }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return result;
    //     }, 'returns sync status', 500000);

    //     runs(function() {
    //         expect(result.error).toBeFalsy();
    //         expect(result.response.statusCode).toBe(201);
    //         expect(JSON.parse(result.body).data.data.items).toBeTruthy();
    //     });
    // });
});

describe('Other tests: ', function() {
    // it('testing sync/load on bad pid', function() {
    //     var result,
    //         requestPayload = {
    //             'pid': 'bad_pid'
    //         };

    //     runs(function() {
    //         request(loadResourceUrl, function(error, response, body) {
    //             result = {};
    //             if (error) {
    //                 result.error = error;
    //             } else {
    //                 result.error = error;
    //                 result.response = response;
    //                 result.body = body;
    //             }
    //         }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return result;
    //     }, 'returns sync status', 500000);

    //     runs(function() {
    //         expect(result.error).toBeFalsy();
    //         expect(result.response.statusCode).toBe(404);
    //     });
    // });

    // it('testing calling sync/status', function() {
    //     var result,
    //         requestPayload = {
    //             'pid': '10108V420871'
    //         };
    //     runs(function() {
    //         request(statusResourceUrl, function(error, response, body) {
    //             result = {};
    //             if (error) {
    //                 result.error = error;
    //             } else {
    //                 result.error = error;
    //                 result.response = response;
    //                 result.body = body;
    //             }
    //         }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return result;
    //     }, 'returns sync status', 500000);

    //     runs(function() {
    //         expect(result.error).toBeFalsy();
    //         expect(result.response.statusCode).toBe(200);
    //         expect(JSON.parse(result.body).data.items).toBeTruthy();
    //     });
    // });

    // it('testing calling sync/datastatus', function() {
    //     var result,
    //         requestPayload = {
    //             'pid': '10108V420871'
    //         };
    //     runs(function() {
    //         request(datastatusResourceUrl, function(error, response, body) {
    //             result = {};
    //             if (error) {
    //                 result.error = error;
    //             } else {
    //                 result.error = error;
    //                 result.response = response;
    //                 result.body = body;
    //             }
    //         }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return result;
    //     }, 'returns sync status', 500000);

    //     runs(function() {
    //         expect(result.error).toBeFalsy();
    //         expect(result.response.statusCode).toBe(200);
    //         expect(JSON.parse(result.body).data.items).toBeTruthy();
    //         expect(JSON.parse(result.body).dataStored).toBe(true);
    //     });
    // });

    //  it('testing calling sync/clear', function() {
    //     var result,
    //         requestPayload = {
    //             'pid': '10108V420871',
    //         };

    //     runs(function() {
    //         request(clearResourceUrl, function(error, response, body) {
    //             result = {};
    //             if (error) {
    //                 result.error = error;
    //             } else {
    //                 result.error = error;
    //                 result.response = response;
    //                 result.body = body;
    //             }
    //         }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
    //     });

    //     waitsFor(function() {
    //         return result;
    //     }, 'returns 200', 500000);

    //     runs(function() {
    //         expect(result.error).toBeFalsy();
    //         expect(result.response.statusCode).toBe(200);
    //     });
    // });
});
