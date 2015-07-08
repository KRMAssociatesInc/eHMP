/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */
'use strict';

var handler = require('../../allergies-fetch-list');

var log = require('bunyan').createLogger({
    name: 'allergies-fetch-list',
    level: 'warn'
});

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

describe('allergies resource integration test', function() {
    beforeEach(function () {
        spyOn(mockHandlerCallback, 'callback');
    });

    it('can call the RPC', function () {
        var done = false;
        var data = null;
        var error = null;

        var configuration = {
            context: 'OR CPRS GUI CHART',
            host: '10.2.2.101',
            port: 9210,
            accessCode: 'pu1234',
            verifyCode: 'pu1234!!',
            localIP: '10.2.2.1',
            localAddress: 'localhost'
        };

        runs(function () {
            handler.getAllergiesMatch(log, configuration, 'CAR', function(err, result) {
                error = err;
                data = result;
                done = true;

                mockHandlerCallback.callback();
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 20000);

        runs(function () {
            expect(mockHandlerCallback.callback).toHaveBeenCalled();

            expect(error).toBe(null);
            expect(data).not.toBe(null);
            expect(data).not.toBe(undefined);
        });
    });
});
