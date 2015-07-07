'use strict';

require('../../../env-setup');

var error = require(global.VX_UTILS + 'error');

describe('error.js', function() {
    describe('createTransient()', function() {
        it('create only type', function() {
            expect(error.createTransient()).toEqual({
                type: error.transient
            });
        });

        it('create with message', function() {
            expect(error.createTransient('error')).toEqual({
                type: error.transient,
                message: 'error'
            });
        });

        it('create with message and data', function() {
            expect(error.createTransient('error', 500)).toEqual({
                type: error.transient,
                message: 'error',
                data: 500
            });
        });
    });

    describe('isTransient()', function() {
        it('verify undefined, null, and empty fails', function() {
            expect(error.isTransient()).toEqual(false);
            expect(error.isTransient(null)).toEqual(false);
            expect(error.isTransient({})).toEqual(false);
        });
        it('verify no type property fails', function() {
            expect(error.isTransient({
                data: 500
            })).toEqual(false);
        });
        it('verify fatal fails', function() {
            expect(error.isTransient(error.createFatal())).toEqual(false);
        });
        it('verify transient passes', function() {
            expect(error.isTransient(error.createTransient())).toEqual(true);
        });
        it('verify "' + error.transient + '" passes', function() {
            expect(error.isTransient(error.transient)).toEqual(true);
        });
    });

    describe('createFatal()', function() {
        it('create only type', function() {
            expect(error.createFatal()).toEqual({
                type: error.fatal
            });
        });

        it('create with message', function() {
            expect(error.createFatal('error')).toEqual({
                type: error.fatal,
                message: 'error'
            });
        });

        it('create only with message and data', function() {
            expect(error.createFatal('error', 500)).toEqual({
                type: error.fatal,
                message: 'error',
                data: 500
            });
        });
    });

    describe('isFatal()', function() {
        it('verify undefined, null, and empty fails', function() {
            expect(error.isFatal()).toEqual(false);
            expect(error.isFatal(null)).toEqual(false);
            expect(error.isFatal({})).toEqual(false);
        });
        it('verify no type property fails', function() {
            expect(error.isFatal({
                data: 500
            })).toEqual(false);
        });
        it('verify transient fails', function() {
            expect(error.isFatal(error.createTransient())).toEqual(false);
        });
        it('verify fatal passes', function() {
            expect(error.isFatal(error.createFatal())).toEqual(true);
        });
        it('verify "' + error.fatal + '" passes', function() {
            expect(error.isFatal(error.fatal)).toEqual(true);
        });
    });
});