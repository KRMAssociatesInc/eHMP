'use strict';

var expect = require('must');
var sinon = require('sinon');
var _ = require('underscore');
var vitalsWriter = require('./vitals-vista-writer');
var getVitals = vitalsWriter._getVitals;
var currentTimeRpc = vitalsWriter._currentTimeRpc;
var convertVitalToRpcString = vitalsWriter._convertVitalToRpcString;
var adjustContextForSuccess = vitalsWriter._adjustContextForSuccess;
var adjustContextForFailure = vitalsWriter._adjustContextForFailure;
var adjustContextForPartialSuccess = vitalsWriter._adjustContextForPartialSuccess;

var logger = sinon.stub(require('bunyan').createLogger({
    name: 'vitals-vista-writer'
}));

var completeVital = {
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

describe('vitals write-back writer', function() {

    describe('convert vital to RPC string', function () {

        it ('valid vitals', function() {
            var vital1 = ['3150620.000000', '3', '1;80/20;','67', '87*23:59:100'];
            var vital2 = ['3150621.000000', '3', '3;57;','67', '87*47:50'];

            expect(convertVitalToRpcString(vital1), '3150620.000000^3^1;80/20;^67^87*23:59:100');
            expect(convertVitalToRpcString(vital2), '3150621.000000^3^3;57;^67^87*47:50');
        });
    });

    describe('Time conversion', function(){
        it('valid time 1', function () {
            expect(currentTimeRpc('20150511')).to.equal('3150511.000000');
        });

        it('valid time 2', function() {
            expect(currentTimeRpc('20150122')).to.equal('3150122.000000');
        });

        it('invalid time', function() {
            expect(currentTimeRpc('20150133')).to.equal('-1.Invalid date');
        });
    });

    describe('writeback context routines', function () {

        it('Success context', function () {
            var expectedWritebackContext = {
                vprResponse : { items: 'results'},
                vprModel : 'results'
            };

            var context = {};
            adjustContextForSuccess(context, 'results');

            expect(JSON.stringify(expectedWritebackContext) == JSON.stringify(context)).to.equal(true);
        });

        it('adjustContextForFailure', function () {
            var expectedWritebackContext = {
                vprModel : null
            };

            var context = {};
            adjustContextForFailure(context, 'results');
            expect(context.vprModel).to.equal(null);

        });

        it('adjustContextForPartialSuccess', function () {
            var expectedWritebackContext = {
                vprResponseStatus : 202
            };

            var context = {};
            adjustContextForPartialSuccess(context, 'results');
            expect(context.vprResponseStatus).to.equal(expectedWritebackContext.vprResponseStatus);

        });


    });

    describe('getVitals', function() {
        it('vital RPC array one item', function() {
            var model = {
                'dateTime': '20150511',
                'dfn': '3',
                'locIEN': '67',
                'enterdByIEN' : '87',
                'vitals': [
                    {
                        'fileIEN': '1',
                        'reading': '80/20',
                        'qualifiers': [
                            '23',
                            '59',
                            '100'
                        ]
                    }
                ]
            };

            var vital = ['3150511.000000', '3', '1;80/20;','67', '87*23:59:100'];
            var expectedVitals = [];
            expectedVitals.push(vital);

            var vitals = getVitals(model);
            expect(vitals.length).to.equal(1);
            expect(_.isEqual(vitals, expectedVitals)).to.equal(true);
        });

        it ('vital RPC array 2 items', function () {
            var model = {
                "dateTime": "20150620",
                'dfn': '3',
                'locIEN': '67',
                'enterdByIEN' : '87',
                'vitals': [
                    {
                        'fileIEN': '1',
                        'reading': '80/20',
                        'qualifiers': [
                            '23',
                            '59',
                            '100'
                        ]
                    },
                    {
                        'fileIEN': '3',
                        'reading': '57',
                        'qualifiers': [
                            '47',
                            '50'
                        ]
                    }
                ]
            };
            var vital1 = ['3150620.000000', '3', '1;80/20;','67', '87*23:59:100'];
            var vital2 = ['3150620.000000', '3', '3;57;','67', '87*47:50'];
            var expectedVitals = [];
            expectedVitals.push(vital1);
            expectedVitals.push(vital2);

            var vitals = getVitals(model);
            expect(vitals.length).to.equal(2);
            expect(_.isEqual(vitals, expectedVitals)).to.equal(true);
        });

    });
});

