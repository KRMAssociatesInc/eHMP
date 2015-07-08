/*jslint node: true */
/*jshint -W098 */
'use strict';

var request = require('request');
var async = require('async');
var resourceDirectoryUrl = 'http://localhost:9898/resourcedirectory';

xdescribe('Sample Test', function() {
    it('invoke resource directory using runs / waitsFor', function() {
        var resourceDirectoryResponseStatusCode;

        runs(function() {
            request(resourceDirectoryUrl, function(error, response) {
                if (error) {
                    console.log('failed because of ' + error);
                } else {
                    resourceDirectoryResponseStatusCode = response.statusCode;
                }
            });
        });

        waitsFor(function() {
            return (resourceDirectoryResponseStatusCode);
        }, 'http resource directory returns any result', 5000);

        runs(function() {
            expect(resourceDirectoryResponseStatusCode).toBe(200);
        });
    });


    it('invoke resource directory using runs / waitsFor using async', function() {
        var resourceDirectoryResponseStatusCode;
        var resourceDirectoryResponseError;

        runs(function() {
            async.waterfall([

                function(callback) {
                    request(resourceDirectoryUrl, function(err, response, body) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, response, body);
                        }
                    });
                },
                function(response, body, callback) {
                    resourceDirectoryResponseStatusCode = response.statusCode;
                    var resourceDirectoryInvokedSuccessfully = true;
                    callback(null);
                }
            ], function(err) {
                if (err) {
                    resourceDirectoryResponseError = err;
                }
            });
        });

        waitsFor(function() {
            return (resourceDirectoryResponseStatusCode || resourceDirectoryResponseError);
        }, 'http resource directory returns any result', 5000);

        runs(function() {
            expect(resourceDirectoryResponseError).toBeUndefined();
            expect(resourceDirectoryResponseStatusCode).toBe(200);
        });

    });
});
