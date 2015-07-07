/*jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */
'use strict';

var handler = require('../../allergies-fetch-list');

var log = require('bunyan').createLogger({
    name: 'allergies-fetch-list',
    level: 'warn'
});

describe('allergies resource integration test', function() {
    it('can call the RPC', function () {
        var done = false;
        var data = null;

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
            handler.getAllergiesSymptoms(log, configuration, function(err, result) {data = result; done = true;});
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 180000);

        runs(function () {
            expect(data).not.toBe(null);
            expect(data).not.toBe(undefined);
        });
    });
});
