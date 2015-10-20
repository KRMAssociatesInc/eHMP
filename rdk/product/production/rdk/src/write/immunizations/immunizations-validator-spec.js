'use strict';

var _ = require('underscore');
var expect = require('must');
var sinon = require('sinon');
var ImmunizationValidator = require('./immunizations-validator')._ImmunizationValidator;




describe('Immunizations input validator', function () {
    var logger;
    beforeEach(function() {
        logger = sinon.stub(require('bunyan').createLogger({name: 'immunization-validator'}));
    });

    describe ('Immunizations valid input', function () {

        it ('minimum valid input', function () {
            var model = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150101',
                'immunizationIEN' : '44',
                'dfn' : '3'
            };
            var validator = new ImmunizationValidator(model, logger);
            expect(validator.isValid()).to.equal(true);
            expect(logger.debug.called).to.be.true();
            expect(logger.error.called).to.be.false();
        });

        it ('minimum valid input with add action', function () {
            var model = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150101',
                'immunizationIEN' : '44',
                'dfn' : '3',
                'action' : 'add'
            };
            var validator = new ImmunizationValidator(model, logger);
            expect(validator.isValid()).to.equal(true);
            expect(logger.debug.called).to.be.true();
            expect(logger.error.called).to.be.false();
        });

        it ('minimum valid input with delete action', function () {
            var model = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150101',
                'immunizationIEN' : '44',
                'dfn' : '3',
                'action' : 'delete'
            };
            var validator = new ImmunizationValidator(model, logger);
            expect(validator.isValid()).to.equal(true);
            expect(logger.debug.called).to.be.true();
            expect(logger.error.called).to.be.false();
        });

     });

    describe ('Immunizations invalid input', function () {

        it('missing model', function () {

            var validator = new ImmunizationValidator(undefined, logger);
            expect(validator.isValid()).to.be.false();
            expect(logger.debug.called).to.be.false();
            expect(logger.error.called).to.be.true();
            expect(_.contains(validator.getErrors(), 'Missing model')).to.be.true();
        });

        it('missing dfn', function () {

            var model = {
                'encounterServiceCategory': 'E',
                'visitDate': '20150101',
                'immunizationIEN': '44'
            };

            var validator = new ImmunizationValidator(model, logger);
            expect(validator.isValid()).to.be.false();
            expect(logger.debug.called).to.be.false();
            expect(logger.error.called).to.be.true();
            expect(_.contains(validator.getErrors(), 'Missing dfn')).to.be.true();
        });

        it('missing immunization', function () {

            var model = {
                'encounterServiceCategory': 'E',
                'visitDate': '20150101',
                'dfn': '3'
            };

            var validator = new ImmunizationValidator(model, logger);
            expect(validator.isValid()).to.be.false();
            expect(logger.debug.called).to.be.false();
            expect(logger.error.called).to.be.true();
            expect(_.contains(validator.getErrors(), 'Missing immunizationIEN')).to.be.true();
        });

        it('missing immunization and visit date and encounter', function () {

            var model = {
                'dfn': '3'
            };

            var validator = new ImmunizationValidator(model, logger);
            expect(validator.isValid()).to.be.false();
            expect(logger.debug.called).to.be.false();
            expect(logger.error.called).to.be.true();
            expect(_.contains(validator.getErrors(), 'Missing immunizationIEN')).to.be.true();
            expect(_.contains(validator.getErrors(), 'Missing visit date')).to.be.true();
            expect(_.contains(validator.getErrors(), 'Missing encounter service category')).to.be.true();
        });

        it ('bad action', function () {
            var model = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150101',
                'immunizationIEN' : '44',
                'dfn' : '3',
                'action' : 'something'
            };
            var validator = new ImmunizationValidator(model, logger);
            expect(validator.isValid()).to.be.false();
            expect(logger.debug.called).to.be.false();
            expect(logger.error.called).to.be.true();
            expect(_.contains(validator.getErrors(), 'Bad action')).to.be.true();
        });

    });

});