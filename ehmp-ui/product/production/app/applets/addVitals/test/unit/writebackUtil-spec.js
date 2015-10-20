/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['jquery', 'backbone', 'marionette', 'jasminejquery', 'moment', 'testUtil', 'app/applets/addVitals/utils/writebackUtil'],
    function ($, Backbone, Marionette, Jasmine, Moment, testUtil, WritebackUtil) {
        function getModel(date, time){
            var model = new Backbone.Model();
            model.set('dateTakenInput', date);
            model.set('time-taken', time);
            return model;
        }

        function getUser(){
            var user = new Backbone.Model();
            user.set('site', '9E7A');
            user.set('duz', {'9E7A': '1234'});
            return user;
        }

        function getCurrentPatient(){
            var patient = new Backbone.Model();
            patient.set('pid', '9E7A;1234');
            patient.set('visit', {uid: 'urn:va:user:1234'});
            return patient;
        }

        function getIENMap(){
            return {
                'BLOOD PRESSURE': '1',
                'TEMPERATURE': '2',
                'RESPIRATION': '3',
                'PULSE': '5',
                'HEIGHT': '8',
                'WEIGHT': '9',
                'CIRCUMFERENCE/GIRTH': '20',
                'PULSE OXIMETRY': '21',
                'PAIN': '22'
            };
        }

        describe('Test writeback utility buildSaveVitalsModel function', function() {
            it('should validate date/time given, location and user', function() {
                var model = getModel('12/01/2013', '12:12');
                var vitalsModel = WritebackUtil.buildSaveVitalsModel(model, getIENMap(), getUser(), getCurrentPatient());
                expect(vitalsModel.get('dateTime')).toEqual('201312011212');
                expect(vitalsModel.get('dfn')).toEqual('1234');
                expect(vitalsModel.get('locIEN')).toEqual('urn:va:user:1234');
                expect(vitalsModel.get('enterdByIEN')).toEqual('1234');
                expect(vitalsModel.get('vitals').length).toEqual(0);
            });

            it('should validate patient pass', function(){
                var model = getModel('12/01/2014');
                model.set('facility-name-pass-po', true);
                var vitalsModel = WritebackUtil.buildSaveVitalsModel(model, getIENMap(), getUser(), getCurrentPatient());
                expect(vitalsModel.get('vitals').length).toEqual(9);
                expect(vitalsModel.get('vitals')[0].fileIEN).toEqual('1');
                expect(vitalsModel.get('vitals')[0].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[1].fileIEN).toEqual('5');
                expect(vitalsModel.get('vitals')[1].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[2].fileIEN).toEqual('3');
                expect(vitalsModel.get('vitals')[2].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[3].fileIEN).toEqual('2');
                expect(vitalsModel.get('vitals')[3].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[4].fileIEN).toEqual('21');
                expect(vitalsModel.get('vitals')[4].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[5].fileIEN).toEqual('8');
                expect(vitalsModel.get('vitals')[5].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[6].fileIEN).toEqual('9');
                expect(vitalsModel.get('vitals')[6].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[7].fileIEN).toEqual('22');
                expect(vitalsModel.get('vitals')[7].reading).toEqual('Pass');
                expect(vitalsModel.get('vitals')[8].fileIEN).toEqual('20');
                expect(vitalsModel.get('vitals')[8].reading).toEqual('Pass');
            });

            it('should validate patient refusing on all vitals', function(){
                var model = getModel('12/01/2014');
                model.set('bp-refused-po', true);
                model.set('pulse-refused-po', true);
                model.set('respiration-refused-po', true);
                model.set('temperature-refused-po', true);
                model.set('po-refused-po', true);
                model.set('height-refused-po', true);
                model.set('weight-refused-po', true);
                model.set('pain-refused-po', true);
                model.set('cg-refused-po', true);
                var vitalsModel = WritebackUtil.buildSaveVitalsModel(model, getIENMap(), getUser(), getCurrentPatient());
                expect(vitalsModel.get('vitals').length).toEqual(9);
                expect(vitalsModel.get('vitals')[0].fileIEN).toEqual('1');
                expect(vitalsModel.get('vitals')[0].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[1].fileIEN).toEqual('5');
                expect(vitalsModel.get('vitals')[1].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[2].fileIEN).toEqual('3');
                expect(vitalsModel.get('vitals')[2].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[3].fileIEN).toEqual('2');
                expect(vitalsModel.get('vitals')[3].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[4].fileIEN).toEqual('21');
                expect(vitalsModel.get('vitals')[4].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[5].fileIEN).toEqual('8');
                expect(vitalsModel.get('vitals')[5].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[6].fileIEN).toEqual('9');
                expect(vitalsModel.get('vitals')[6].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[7].fileIEN).toEqual('22');
                expect(vitalsModel.get('vitals')[7].reading).toEqual('Refused');
                expect(vitalsModel.get('vitals')[8].fileIEN).toEqual('20');
                expect(vitalsModel.get('vitals')[8].reading).toEqual('Refused');
            });

            it('should validate patient unavailable on all vitals', function(){
                var model = getModel('12/01/2014');
                model.set('bp-unavailable-po', true);
                model.set('pulse-unavailable-po', true);
                model.set('respiration-unavailable-po', true);
                model.set('temperature-unavailable-po', true);
                model.set('po-unavailable-po', true);
                model.set('height-unavailable-po', true);
                model.set('weight-unavailable-po', true);
                model.set('pain-unavailable-po', true);
                model.set('cg-unavailable-po', true);
                var vitalsModel = WritebackUtil.buildSaveVitalsModel(model, getIENMap(), getUser(), getCurrentPatient());
                expect(vitalsModel.get('vitals').length).toEqual(9);
                expect(vitalsModel.get('vitals')[0].fileIEN).toEqual('1');
                expect(vitalsModel.get('vitals')[0].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[1].fileIEN).toEqual('5');
                expect(vitalsModel.get('vitals')[1].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[2].fileIEN).toEqual('3');
                expect(vitalsModel.get('vitals')[2].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[3].fileIEN).toEqual('2');
                expect(vitalsModel.get('vitals')[3].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[4].fileIEN).toEqual('21');
                expect(vitalsModel.get('vitals')[4].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[5].fileIEN).toEqual('8');
                expect(vitalsModel.get('vitals')[5].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[6].fileIEN).toEqual('9');
                expect(vitalsModel.get('vitals')[6].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[7].fileIEN).toEqual('22');
                expect(vitalsModel.get('vitals')[7].reading).toEqual('Unavailable');
                expect(vitalsModel.get('vitals')[8].fileIEN).toEqual('20');
                expect(vitalsModel.get('vitals')[8].reading).toEqual('Unavailable');
            });
        });

    describe('Test writeback utility buildVital', function(){
        it('Should test building individual vital with no units', function(){
            var model = getModel('07/01/2015');
            model.set('someInputValue', '30');
            model.set('qualifier1', '22');
            model.set('qualifier2', '33');
            model.set('qualifier3', '44');
            var vital = WritebackUtil.buildVital(model, 'someInputValue', getIENMap(), 'RESPIRATION', [], ['qualifier1', 'qualifier2', 'qualifier3'], 'refused', 'unavailable');
            expect(vital.reading).toEqual('30');
            expect(vital.unit).toEqual(undefined);
            expect(vital.qualifiers.length).toEqual(3);
            expect(vital.fileIEN).toEqual('3');
        });

        it('Should test building individual vital with units', function(){
            var model = getModel('07/01/2015');
            model.set('someInputValue', '30lb');
            var vital = WritebackUtil.buildVital(model, 'someInputValue', getIENMap(), 'RESPIRATION', ['lb', 'kg'], [], 'refused', 'unavailable');
            expect(vital.reading).toEqual('30');
            expect(vital.unit).toEqual('lb');
            expect(vital.qualifiers.length).toEqual(0);
            expect(vital.fileIEN).toEqual('3');
        });

        it('Should test building individual vital with pass', function(){
            var model = getModel('07/01/2015');
            model.set('someInputValue', '30');
            model.set('facility-name-pass-po', true);
            var vital = WritebackUtil.buildVital(model, 'someInputValue', getIENMap(), 'RESPIRATION', [], [], 'refused', 'unavailable');
            expect(vital.reading).toEqual('Pass');
            expect(vital.unit).toEqual(undefined);
            expect(vital.qualifiers).toEqual(undefined);
            expect(vital.fileIEN).toEqual('3');
        });

        it('Should test building individual vital with refusal', function(){
            var model = getModel('07/01/2015');
            model.set('someInputValue', '30');
            model.set('refused', true);
            var vital = WritebackUtil.buildVital(model, 'someInputValue', getIENMap(), 'RESPIRATION', [], [], 'refused', 'unavailable');
            expect(vital.reading).toEqual('Refused');
            expect(vital.unit).toEqual(undefined);
            expect(vital.qualifiers).toEqual(undefined);
            expect(vital.fileIEN).toEqual('3');
        });

        it('Should test building individual vital being unavailable', function(){
            var model = getModel('07/01/2015');
            model.set('someInputValue', '30');
            model.set('unavailable', true);
            var vital = WritebackUtil.buildVital(model, 'someInputValue', getIENMap(), 'RESPIRATION', [], [], 'refused', 'unavailable');
            expect(vital.reading).toEqual('Unavailable');
            expect(vital.unit).toEqual(undefined);
            expect(vital.qualifiers).toEqual(undefined);
            expect(vital.fileIEN).toEqual('3');
        });

        it('Should test building individual vital with pulse oximetry special case', function(){
            var model = getModel('07/01/2015');
            model.set('O2InputValue', '99');
            model.set('suppO2InputValue', '31');
            var vital = WritebackUtil.buildVital(model, 'O2InputValue', getIENMap(), 'RESPIRATION', [], [], 'refused', 'unavailable');
            expect(vital.reading).toEqual('99');
            expect(vital.flowRate).toEqual('31');
            expect(vital.unit).toEqual(undefined);
            expect(vital.qualifiers.length).toEqual(0);
            expect(vital.fileIEN).toEqual('3');
        });

        it('Should write pain value as 99 when unable to respond is checked', function(){
            var model = getModel('07/16/2015');
            model.set('pain-checkbox-po', true);
            var vital = WritebackUtil.buildVital(model, 'pain-value-po', getIENMap(), 'PAIN', [], [], 'refused', 'unavailable');
            expect(vital.reading).toEqual('99 - Unable to Respond');
            expect(vital.unit).toEqual(undefined);
            expect(vital.qualifiers.length).toEqual(0);
            expect(vital.fileIEN).toEqual('22');
        });
    });
});
