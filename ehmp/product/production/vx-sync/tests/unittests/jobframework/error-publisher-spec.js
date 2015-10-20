'use strict';

require('../../../env-setup');

var ErrorPublisher = require(global.VX_JOBFRAMEWORK + 'error-publisher');
var jobUtil = require(global.VX_UTILS + 'job-utils');

var logger = require(global.VX_UTILS + 'dummy-logger');

var publisher = {
    logger: logger,
    publish: function() {}
};

describe('error-publisher.js', function() {
    describe('createErrorRecord()', function() {
        it('tests all fields created', function() {
            var record = ErrorPublisher._createErrorRecord('classification', {
                error: 'error'
            });

            expect(record).toEqual(jasmine.objectContaining({
                jpid: jasmine.any(String),
                type: jobUtil.errorRequestType(),
                classification: jasmine.any(String),
                timestamp: jasmine.any(String),
                error: jasmine.any(Object)
            }));
        });
    });

    describe('publishHandlerError()', function() {
        it('test publish creates ErrorRecord', function() {
            spyOn(publisher, 'publish');
            ErrorPublisher.prototype.publishHandlerError.call(publisher, {
                job: 'job'
            }, {
                error: 'error'
            }, 'fatal', function() {});
            expect(publisher.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                jpid: jasmine.any(String),
                type: jobUtil.errorRequestType(),
                classification: 'job',
                timestamp: jasmine.any(String),
                error: jasmine.any(Object),
                job: jasmine.any(Object),
                severity: jasmine.any(String)
            }), jasmine.any(Function));
        });
    });

    describe('publishPollerError()', function() {
        it('test publish creates ErrorRecord without chunk', function() {
            spyOn(publisher, 'publish');
            ErrorPublisher.prototype.publishPollerError.call(publisher, '9E7A', {
                error: 'error'
            }, function() {});
            expect(publisher.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                jpid: jasmine.any(String),
                type: jobUtil.errorRequestType(),
                classification: 'poller',
                timestamp: jasmine.any(String),
                error: jasmine.any(Object),
                system: '9E7A'
            }), jasmine.any(Function));
        });

        it('test publish creates ErrorRecord with chunk', function() {
            spyOn(publisher, 'publish');
            ErrorPublisher.prototype.publishPollerError.call(publisher, '9E7A', {
                chunk: {}
            }, {
                error: 'error'
            }, function() {});
            expect(publisher.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                jpid: jasmine.any(String),
                type: jobUtil.errorRequestType(),
                classification: 'poller',
                timestamp: jasmine.any(String),
                error: jasmine.any(Object),
                system: '9E7A',
                chunk: jasmine.any(Object)
            }), jasmine.any(Function));
        });
    });

    describe('publishSubsystemError()', function() {
        it('test publish creates ErrorRecord without patientIdentifier', function() {
            spyOn(publisher, 'publish');
            ErrorPublisher.prototype.publishSubsystemError.call(publisher, 'MVI', {
                error: 'error'
            }, function() {});
            expect(publisher.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                jpid: jasmine.any(String),
                type: jobUtil.errorRequestType(),
                classification: 'system',
                timestamp: jasmine.any(String),
                error: jasmine.any(Object),
                system: 'MVI'
            }), jasmine.any(Function));
        });

        it('test publish creates ErrorRecord with patientIdentifier', function() {
            spyOn(publisher, 'publish');
            ErrorPublisher.prototype.publishSubsystemError.call(publisher, 'MVI', {
                type: 'pid',
                value: '9E7A;3'
            }, {
                error: 'error'
            }, function() {});
            expect(publisher.publish).toHaveBeenCalledWith(jasmine.objectContaining({
                jpid: jasmine.any(String),
                type: jobUtil.errorRequestType(),
                classification: 'system',
                timestamp: jasmine.any(String),
                patientIdentifier: jasmine.any(Object),
                error: jasmine.any(Object),
                system: 'MVI'
            }), jasmine.any(Function));
        });
    });
});