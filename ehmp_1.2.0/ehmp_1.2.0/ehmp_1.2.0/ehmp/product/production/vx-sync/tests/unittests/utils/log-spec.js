'use strict';

require('../../../env-setup');

var bunyan = require('bunyan');
var logUtil = require(global.VX_UTILS + 'log');
var dummyLog = require(global.VX_UTILS + 'dummy-logger');

var testLog = bunyan.createLogger({
    name: 'test-logger',
    streams: [{
        level: 'debug',
        stream: process.stdout
    }]
});

var loggerConfigs = [{
    name: 'root',
    streams: [{
        stream: 'process.stdout',
        level: 'trace'
    }, {
        stream: 'process.stderr',
        level: 'error'
    }]
}];


describe('log.js', function() {
    describe('getLogName()', function() {
        it('verify "root" returned when undefined, null, or empty is passed', function() {
            expect(logUtil._getLogName()).toEqual('root');
            expect(logUtil._getLogName(null)).toEqual('root');
            expect(logUtil._getLogName('')).toEqual('root');
            expect(logUtil._getLogName({})).toEqual('root');
        });

        it('verify "root" returned when object missing properties is passed', function() {
            expect(logUtil._getLogName({
                test: 'test'
            })).toEqual('root');
            expect(logUtil._getLogName({
                fields: {
                    test: 'test'
                }
            })).toEqual('root');
        });

        it('verify name returned when string is passed', function() {
            expect(logUtil._getLogName('logName')).toEqual('logName');
        });

        it('verify name returned when log is passed', function() {
            expect(logUtil._getLogName(testLog)).toEqual('test-logger');
        });
    });

    describe('createLogger()', function() {
        it('test logger created correctly from configuration', function() {
            var newLogger = logUtil._createLogger({
                name: 'new-logger',
                streams: [{
                    stream: 'process.stdout',
                    level: 'trace'
                }, {
                    stream: 'process.stderr',
                    level: 'error'
                }]
            });

            expect(newLogger.fields.name).toEqual('new-logger');
            expect(logUtil._getLoggers()['new-logger']).not.toBeUndefined();
        });
    });

    describe('initialize()', function() {
        it('test loggers initialized correctly from configuration list', function() {
            logUtil.initialize(loggerConfigs);
            expect(logUtil._getLoggers()['root']).not.toBeUndefined();
        });
    });

    describe('get()', function() {
        var newLogger2 = logUtil._createLogger({
            name: 'new-logger2',
            streams: [{
                stream: 'process.stdout',
                level: 'trace'
            }, {
                stream: 'process.stderr',
                level: 'error'
            }]
        });

        it('verify existing log is returned from name', function() {
            var log = logUtil.get('new-logger2');
            expect(log).toBe(newLogger2);
        });

        it('verify existing log is returned from reference', function() {
            var log = logUtil.get(newLogger2);
            expect(log).toBe(newLogger2);
        });

        it('verify log is created from prototype name', function() {
            var log = logUtil.get('new-logger3', 'new-logger2');
            expect(log).not.toBe(newLogger2);
            expect(log.fields.name).toEqual('new-logger3');
        });

        it('verify log is created from prototype reference', function() {
            var log = logUtil.get('new-logger4', newLogger2);
            expect(log).not.toBe(newLogger2);
            expect(log.fields.name).toEqual('new-logger4');
        });

        it('verify it works with the dummy-logger', function() {
            var log = logUtil.get('new-logger5', dummyLog);
            expect(log).toBe(dummyLog);
            expect(log.fields.name).toEqual(dummyLog.fields.name);
        });
    });

    describe('getAsChild()', function() {
        var parentLog = logUtil._createLogger({
            name: 'parent-log',
            streams: [{
                stream: 'process.stdout',
                level: 'trace'
            }, {
                stream: 'process.stderr',
                level: 'error'
            }]
        });

        it('verify child created', function() {
            var childLog = logUtil.getAsChild('child', 'parent-log');
            expect(childLog).not.toBe(parentLog);
            expect(childLog.fields.name).toEqual('parent-log.child');
        });

        it('verify child created from dummy log', function() {
            var childLog = logUtil.getAsChild('child', dummyLog);
            expect(childLog).not.toBe(parentLog);
            expect(childLog.fields.name).toEqual(dummyLog.fields.name);
        });
    });
});