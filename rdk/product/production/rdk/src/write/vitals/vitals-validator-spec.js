/*jslint node: true */
'use strict';

var vitalsValidator = require('./vitals-validator');
var expect = require('must');
var sinon = require('sinon');
var _ = require('underscore');

var logger = sinon.stub(require('bunyan').createLogger({
    name: 'vitals-vista-writer-validator'
}));

var sampleVital = {
    //'dfn': '3',
    'locIEN': '67',
    'vitals': [{
        'fileIEN': '1',
        'reading': '80/30',
        'qualifiers': ['23', '59', '100']
    }, {
        'fileIEN': '3',
        'reading': '57',
        'qualifiers': ['47', '50']
    }]
};

describe('vitals write-back validator', function() {

    describe('call verifyInput', function() {
        it('tests not array', function() {
            var errors = '';
            var errorFree = vitalsValidator._validateInput(logger, sampleVital, errors);

            expect(errorFree).to.equal(false);
        });

        it('tests missing model', function() {
            var errors = [];
            var errorFree = vitalsValidator._validateInput(logger, undefined, errors);

            expect(errorFree).to.equal(false);
        });


        it('tests missing dateTime', function() {
            var errors = [];
            vitalsValidator._validateInput(logger, sampleVital, errors);

            expect(errors).not.be.empty();
        });



        it('tests missing enteredByIEN input', function() {
            var errors = [];
            sampleVital.dateTime = '20141029080000';

            vitalsValidator._validateInput(logger, sampleVital, errors);
            expect(errors).not.be.empty();
        });
    });

    describe('time formatter tests', function() {
        it ('valid time format', function() {

            var date = '20150511';
            expect(vitalsValidator._timeFormatter(date) > 0).to.be(true);

        });

        it ('invalid time format', function() {

            var date = '201501213';
            expect(vitalsValidator._timeFormatter(date) > 0).to.be(false);
        });
    });
});

