'use strict';

require('../../../env-setup');
var healthcheck = require(global.VX_UTILS + 'healthcheck-utils');
var dummyLog = require(global.VX_UTILS + 'dummy-logger');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var moment = require('moment');

// dummyLog = require('bunyan').createLogger({
//     name: 'healthcheck-utils-spec',
//     level: 'debug'
// });

var dummyConfig = {
    healthcheck: {
        heartbeatEnabled: true,
        heartbeatIntervalMillis: 300000,
        heartbeatStaleAgeMillis: 600000
    },
    jds: {}
};

var dummyEnvironment = {
    jds: {
        storeOperationalDataMutable: function() {}
    }
};

describe('healthcheck-utils.js', function() {
    describe('startHeartbeat', function() {
        it('Normal Path', function() {
            var interval = healthcheck.startHeartbeat(dummyLog, dummyConfig, dummyEnvironment, 'dummy-process');
            expect(interval).toBeTruthy();
            clearInterval(interval);
        });
        it('Error Path: Returns null on missing healthcheck config', function() {
            var interval = healthcheck.startHeartbeat(dummyLog, {}, dummyEnvironment, 'dummy-process');
            expect(interval).toBeNull();
            clearInterval(interval);
        });
        it('Returns null when heartbeat is disabled', function() {
            var interval = healthcheck.startHeartbeat(dummyLog, {
                healthcheck: {
                    heartbeatEnabled: false
                }
            }, dummyEnvironment, 'dummy-process');
            expect(interval).toBeNull();
            clearInterval(interval);
        });
    });

    describe('sendHeartbeat', function() {
        it('Normal Path', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, 200);
            var env = {
                jds: jds
            };

            spyOn(dummyLog, 'error');

            healthcheck.sendHeartbeat(dummyLog, dummyConfig, env, 'dummy-process', 'dummy-profile', 1234, '20150715014231');

            expect(dummyLog.error).not.toHaveBeenCalled();
        });
        it('Error Path: No process name', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, 200);
            var env = {
                jds: jds
            };

            spyOn(dummyLog, 'error');

            healthcheck.sendHeartbeat(dummyLog, dummyConfig, env, null, 'dummy-profile', 1234, '20150715014231');

            expect(dummyLog.error).toHaveBeenCalled();
        });
        it('Error Path: Get error from JDS', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData('error!!!', null);
            var env = {
                jds: jds
            };

            spyOn(dummyLog, 'error');

            healthcheck.sendHeartbeat(dummyLog, dummyConfig, env, 'dummy-process', 'dummy-profile', 1234, '20150715014231');

            expect(dummyLog.error).toHaveBeenCalled();
        });
    });

    describe('retrieveHeartbeats', function() {
        var jdsResult = { items: [{
            _id: 'subscriberHost-primary',
            profile: 'primary',
            process: 4435,
            processStartTime: '20150717112412',
            heartbeatTime: '20150717112513'
        }]};
        it('Normal Path', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, {statusCode: 200}, [jdsResult]);
            var env = {
                jds: jds
            };
            var done = false;
            var error, result;
            healthcheck.retrieveHeartbeats(dummyLog, dummyConfig, env, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeFalsy();
                expect(result).toBeTruthy();
                expect(result).toEqual(jdsResult);
            });
        });
        it('Error Path: Get error from JDS', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData('Error!', null, null);
            var env = {
                jds: jds
            };
            var done = false;
            var error, result;
            healthcheck.retrieveHeartbeats(dummyLog, dummyConfig, env, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeTruthy();
                expect(result).toBeFalsy();
            });
        });
        it('Error Path: Empty response', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, null, null);
            var env = {
                jds: jds
            };
            var done = false;
            var error, result;
            healthcheck.retrieveHeartbeats(dummyLog, dummyConfig, env, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeTruthy();
                expect(result).toBeFalsy();
            });
        });
        it('Error Path: Unexpected statusCode', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, {statusCode: 500}, null);
            var env = {
                jds: jds
            };
            var done = false;
            var error, result;
            healthcheck.retrieveHeartbeats(dummyLog, dummyConfig, env, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeTruthy();
                expect(result).toBeFalsy();
            });
        });
        it('Error Path: Empty result', function() {
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, {statusCode: 200}, null);
            var env = {
                jds: jds
            };
            var done = false;
            var error, result;
            healthcheck.retrieveHeartbeats(dummyLog, dummyConfig, env, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeTruthy();
                expect(result).toBeFalsy();
            });
        });
    });

    describe('retrieveStaleHeartbeats', function(){
        var jdsResult = {items: [{
            _id: 'subscriberHost-primary',
            profile: 'primary',
            process: 4435,
            processStartTime: '20150717112412',
            heartbeatTime: '20150717112513'
        },
            {_id: 'subscriberHost-post',
            profile: 'post',
            process: 4436,
            processStartTime: '20150717112412',
            heartbeatTime: '20150717112513'
        }]};
        it('Normal Path: no stale heartbeats to return', function(){
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, {statusCode: 200}, [jdsResult]);
            var env = {
                jds: jds
            };
            var mockCurrentTime = moment('20150717112612', 'YYYYMMDDHHmmss');
            var done = false;
            var error, result;
            healthcheck.retrieveStaleHeartbeats(dummyLog, dummyConfig, env, mockCurrentTime, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeFalsy();
                expect(result).toBeTruthy();
                expect(result).toEqual([]);
            });
        });
        it('Normal Path: stale heartbeats returned', function(){
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, {statusCode: 200}, [jdsResult]);
            var env = {
                jds: jds
            };
            var mockCurrentTime = moment('20150717113514', 'YYYYMMDDHHmmss');
            var done = false;
            var error, result;
            healthcheck.retrieveStaleHeartbeats(dummyLog, dummyConfig, env, mockCurrentTime, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeFalsy();
                expect(result).toBeTruthy();
                expect(result).toEqual(jdsResult.items);
            });
        });
        it('Error Path: pass errors from retrieveHeartbeats', function(){
            var jds = new JdsClient(dummyLog, dummyConfig);
            jds._setResponseData(null, {statusCode: 500}, null);
            var env = {
                jds: jds
            };
            var mockCurrentTime = moment('20150717113514', 'YYYYMMDDHHmmss');
            var done = false;
            var error, result;
            healthcheck.retrieveStaleHeartbeats(dummyLog, dummyConfig, env, mockCurrentTime, function(err, res){
                error = err;
                result = res;
                done = true;
            });
            waitsFor(function(){
                return done;
            });
            runs(function(){
                expect(error).toBeTruthy();
                expect(result).toBeFalsy();
            });
        });
    });
});