'use strict';

var _ = require('underscore');
var expect = require('must');
var sinon = require('sinon');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var constructRpcArgs = require('./immunizations-vista-writer')._constructRpcArgs;
var immunizationFromModel = require('./immunizations-vista-writer')._immunizationFromModel


describe('Immunizations write-back', function () {
    var logger;
    beforeEach(function() {
        logger = sinon.stub(require('bunyan').createLogger({name: 'immunization-vista-writer'}));
    });

    describe ('immunizationFromModel', function () {
        it ('minimum model equality test', function() {

            var immunization = {
                contraindicated: 0,
                cptCodes: 0,
                dfn: 3,
                encounterLocation: '',
                encounterServiceCategory: 'E',
                encounterTime: '',
                immunizationIEN: '44',
                inpatientEncounter: 0,
                reaction: 0,
                visitDate: '3150101',
                series: '',
                action: 'add',
                comment: '@'
            };

            var model = {
                encounterServiceCategory: 'E',
                visitDate: '20150101',
                immunizationIEN: '44',
                dfn: 3
            };



            var result = immunizationFromModel(model);
            expect(result.contraindicated).not.to.be.undefined();
            expect(result.contraindicated).to.equal(0);
            expect(result.cptCodes).not.to.be.undefined();
            expect(result.cptCodes).to.equal(0);
            expect(result.encounterLocation).not.to.be.undefined();
            expect(result.encounterLocation).to.equal('');
            expect(result.encounterTime).not.to.be.undefined();
            expect(result.encounterTime).to.equal('');
            expect(result.inpatientEncounter).not.to.be.undefined();
            expect(result.inpatientEncounter).to.equal(0);
            expect(result.reaction).not.to.be.undefined();
            expect(result.reaction).to.equal(0);
            expect(result.action).not.to.be.undefined();
            expect(result.action).to.equal('add');
            expect(result).to.eql(immunization); // deep compare
        });



        it ('complete model equality test', function() {

            var immunization = {
                contraindicated: 1,
                cptCodes: 2,
                dfn: 3,
                encounterLocation: 'location',
                encounterServiceCategory: 'E',
                encounterTime: '3150101',
                immunizationIEN: '44',
                inpatientEncounter: 32,
                reaction: 88,
                series: '',
                visitDate: '3150101',
                action: 'add',
                comment: '@'
            };

            var model = {
                encounterServiceCategory: 'E',
                visitDate: '20150101',
                immunizationIEN: '44',
                dfn: 3,
                contraindicated: 1,
                cptCodes: 2,
                encounterLocation: 'location',
                encounterTime: '20150101',
                inpatientEncounter: 32,
                reaction: 88,
                series: ''
            };

            var result = immunizationFromModel(model);
            expect(result.contraindicated).not.to.be.undefined();
            expect(result.contraindicated).to.equal(1);
            expect(result.cptCodes).not.to.be.undefined();
            expect(result.cptCodes).to.equal(1);
            expect(result.encounterLocation).not.to.be.undefined();
            expect(result.encounterLocation).to.equal('location');
            expect(result.encounterTime).not.to.be.undefined();
            expect(result.encounterTime).to.equal('3150101');
            expect(result.inpatientEncounter).not.to.be.undefined();
            expect(result.inpatientEncounter).to.equal(1);
            expect(result.reaction).not.to.be.undefined();
            expect(result.reaction).to.equal(1);
            expect(result.action).not.to.be.undefined();
            expect(result.action).to.equal('add');
            expect(result.action).not.to.be.undefined();
            expect(result.action).to.equal('add');
            expect(result).not.to.equal(immunization); // deep compare
        });

        it ('comment is present', function() {

            var immunization = {
                contraindicated: 0,
                cptCodes: 0,
                dfn: 3,
                encounterLocation: '',
                encounterServiceCategory: 'E',
                encounterTime: '',
                immunizationIEN: '44',
                inpatientEncounter: 0,
                reaction: 0,
                series: '',
                visitDate: '3150101',
                action: 'add',
                comment: 'This is comment'

            };

            var model = {
                encounterServiceCategory: 'E',
                visitDate: '20150101',
                immunizationIEN: '44',
                dfn: 3,
                comment: 'This is comment'

            };



            var result = immunizationFromModel(model);
            expect(result.contraindicated).not.to.be.undefined();
            expect(result.contraindicated).to.equal(0);
            expect(result.cptCodes).not.to.be.undefined();
            expect(result.cptCodes).to.equal(0);
            expect(result.encounterLocation).not.to.be.undefined();
            expect(result.encounterLocation).to.equal('');
            expect(result.encounterTime).not.to.be.undefined();
            expect(result.encounterTime).to.equal('');
            expect(result.inpatientEncounter).not.to.be.undefined();
            expect(result.inpatientEncounter).to.equal(0);
            expect(result.reaction).not.to.be.undefined();
            expect(result.reaction).to.equal(0);
            expect(result.comment).not.to.be.undefined();
            expect(result.comment).to.equal('This is comment');
            expect(result).to.eql(immunization); // deep compare
        });


    });

    describe ('constructRpcArgs', function () {
        it ('end to end add no comment ', function() {

            var rpcArgs = {
                1: 'HDR^0^0^;3;E',
                2: 'VST^DT^3150101',
                3: 'VST^PT^3',
                4: 'VST^VC^E',
                5: 'IMM+^44^^^^^0^0^^1',
                6: 'COM^1^@'
            };

            var model = {
                encounterServiceCategory: 'E',
                visitDate: '20150101',
                immunizationIEN: '44',
                dfn: 3
            };

            var result = constructRpcArgs(immunizationFromModel(model));
            expect(result).to.eql(rpcArgs); // deep compare
        });

        it ('end to end add some comment ', function() {

            var rpcArgs = {
                1: 'HDR^0^0^;3;E',
                2: 'VST^DT^3150101',
                3: 'VST^PT^3',
                4: 'VST^VC^E',
                5: 'IMM-^44^^^^^0^0^^1',
                6: 'COM^1^this is a comment'
            };

            var model = {
                encounterServiceCategory: 'E',
                visitDate: '20150101',
                immunizationIEN: '44',
                dfn: 3,
                action: 'delete',
                comment: 'this is a comment'
            };

            var result = constructRpcArgs(immunizationFromModel(model));
            expect(result).to.eql(rpcArgs); // deep compare
        });

        it ('end to end delete no comment ', function() {

            var rpcArgs = {
                1: 'HDR^0^0^;3;E',
                2: 'VST^DT^3150101',
                3: 'VST^PT^3',
                4: 'VST^VC^E',
                5: 'IMM-^44^^^^^0^0^^1',
                6: 'COM^1^@'
            };

            var model = {
                encounterServiceCategory: 'E',
                visitDate: '20150101',
                immunizationIEN: '44',
                dfn: 3,
                action: 'delete'
            };

            var result = constructRpcArgs(immunizationFromModel(model));
            expect(result).to.eql(rpcArgs); // deep compare
        });


    });
});
