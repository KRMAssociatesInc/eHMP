/*jslint node: true */
'use strict';

var immunizationResource = require('./immunization-resource');
var Immunization = immunizationResource.Immunization;
var _validateInput = require('./immunization-resource')._validateInput;
var _constructRpcArgs = require('./immunization-resource')._constructRpcArgs;
var _ = require('underscore');

describe('immunizationWritebackResource', function() {

    /*describe('Immunization Object', function() {

        it('Unintialized immunization', function() {
            var immunization = new Immunization();
            expect(immunization.hasErrors()).to.be.true();
            expect(immunization.getErrors().length).to.equal(1);
        });

        it('empty immunization', function() {
            var immunization = new Immunization();
            immunization.initialize('');
            expect(immunization.hasErrors()).to.be.true();
            expect(immunization.getErrors().length).to.equal(1);
        });

        it('missing dfn immunization', function() {
            var immunization = new Immunization();
            immunization.initialize('');
            expect(immunization.hasErrors()).to.be.true();
            expect(immunization.getErrors().length).to.equal(1);
        });

        it('error free partial', function() {

            var partialInput = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150122',
                'immunizationIEN' : '44'
            };

            var immunization = new Immunization();
            immunization.initialize(partialInput, '3');
            expect(immunization.hasErrors()).to.be.false();
            expect(immunization.getErrors().length).to.equal(0);
            expect(immunization.visitDate).to.equal('3150122');
            expect(immunization.inpatientEncounter).to.equal(0);
            expect(immunization.reaction).to.equal(0);
            expect(immunization.contraindicated).to.equal(0);
        });

        it('error free full', function() {

            var completeInput = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150122',
                'immunizationIEN' : '44',
                'inpatientEncounter' : '0',
                'cptCodes' : '1',
                'encounterLocation' : 'should become 1',
                'encounterTime' : '20150121',
                'reaction' : 'should become 1',
                'contraindicated' : 'should become 1'
            };

            var immunization = new Immunization();
            immunization.initialize(completeInput, '3');
            expect(immunization.hasErrors()).to.be.false();
            expect(immunization.getErrors().length).to.equal(0);
            expect(immunization.inpatientEncounter).to.equal(1);
            expect(immunization.encounterTime).to.equal('3150121');
            expect(immunization.reaction).to.equal(1);
            expect(immunization.contraindicated).to.equal(1);
        });

        it('no error messages', function() {
            var completeInput = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150122',
                'immunizationIEN' : '44',
                'inpatientEncounter' : '0',
                'cptCodes' : '1',
                'encounterLocation' : 'should become 1',
                'encounterTime' : '20150121',
                'reaction' : 'should become 1',
                'contraindicated' : 'should become 1'
            };

            var immunization = new Immunization();
            immunization.initialize(completeInput, '3');
            expect(immunization.hasErrors()).to.be.false();
            expect(immunization.getErrors().length).to.equal(0);
        });

    });

    describe('Input validation', function() {

        it('with no error', function() {

            var input = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150122',
                'immunizationIEN' : '44'
            };

            var validInput = _validateInput(input, '3', new Immunization());
            expect(validInput).to.be.true();
        });

        it('with error', function() {

            var input = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150122'
            };

            var validInput = _validateInput(input, '3', new Immunization());
            expect(validInput).to.be.false();
        });
    });


    describe('RPC parameters generation', function() {

        it('with no error', function() {

            var input = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150122',
                'immunizationIEN' : '41'
            };

            var immunization = new Immunization();
            immunization.initialize(input, '3');
            var rpcArgs = _constructRpcArgs(immunization);
            expect(_.isEmpty(rpcArgs[1])).to.be.false();
            expect(_.isEmpty(rpcArgs[2])).to.be.false();
            expect(rpcArgs[2]).to.equal('VST^DT^3150122');
            expect(rpcArgs[3]).to.equal('VST^PT^3');
            expect(rpcArgs[4]).to.equal('VST^VC^E');
            expect(rpcArgs[5]).to.equal('IMM+^41^^^^0^0');
            expect(_.isUndefined(rpcArgs[6])).to.be.true();
        });

        it('with error', function() {

            var input = {
                'encounterServiceCategory': 'E',
                'visitDate' : '20150122'
            };

            var validInput = _validateInput(input, '3', new Immunization());
            expect(validInput).to.be.false();
        });
    });*/
});

