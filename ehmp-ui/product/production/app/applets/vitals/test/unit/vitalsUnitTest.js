/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['jquery', 'backbone', 'marionette', 'jasminejquery', 'testUtil', 'app/applets/vitals/utilParse'],
    function($, Backbone, Marionette, jasminejquery, testUtil, Util) {

        describe('Parse functions suite', function() {
            var response = null;
            beforeEach(function() {

                response = initializeResponse();

            });

            it('Test getFacilityColor sets DOD color ', function() {
                response.facilityCode = 'DOD';
                response = Util.getFacilityColor(response);

                expect(response.facilityColor).toEqual('DOD');
            });

            it('Test getFacilityColor sets non-DOD color ', function() {
                response = Util.getFacilityColor(response);

                expect(response.facilityColor).toEqual('nonDOD');
            });


            it('Test getDisplayName ', function() {
                response = Util.getDisplayName(response);

                expect(response.displayName).toEqual('HT');
            });

            it("Test formattedHeight over 0.5", function() {
                response.typeName = 'height';
                response.units = 'cm';
                response.result = 174;
                response = Util.getFormattedHeight(response);

                expect(response.result).toEqual(69);
                expect(response.units).toEqual('in');
            });

            it("Test formattedHeight under 0.5", function() {
                response.typeName = 'height';
                response.units = 'cm';
                response.result = 173;
                response = Util.getFormattedHeight(response);

                expect(response.result).toEqual(68);
                expect(response.units).toEqual('in');
            });

            it("Test formattedHeight non-numeric value", function() {
                response.typeName = 'height';
                response.result = 'aaa';
                response = Util.getFormattedHeight(response);
                //Called method only converts numeric values
                expect(response.result).toEqual('aaa');
            });

            it("Test noVitlasNoRecord", function() {
                response.result = '';
                response = Util.noVitlasNoRecord(response);
                expect(response.result).toEqual("No record");
            });
        });

        describe("util.js suite", function() {
            var response = null;
            var Util;

            beforeEach(function(done) {
                Util = null;
                response = initializeResponse();

                testUtil.reset();

                testUtil.stub('app/applets/vitals/utilParse', {});
                testUtil.loadWithCurrentStubs('app/applets/vitals/util', function(loadedModule) {
                    Util = loadedModule;
                    done();
                });

            });

            it("Test setNoRecords", function() {
                var resultColl = ['notEmpty', , 'notEmpty', , 'notEmpty'];
                var recordTypes = ['EMPTY1', 'EMPTY3'];
                var knownTypes = ['0', 'EMPTY1', '2', 'EMPTY3', '4'];

                resultColl = Util.setNoRecords(resultColl, recordTypes, knownTypes);

                expect(resultColl[0]).toEqual("notEmpty");
                expect(resultColl[1].summary).toEqual("No Record");
                expect(resultColl[2]).toEqual("notEmpty");
                expect(resultColl[3].summary).toEqual("No Record");
                expect(resultColl[4]).toEqual("notEmpty");
            });

        });

        function initializeResponse() {
            var response = {
                'facilityCode': 'PGD',
                'facilityName': 'Patient Generated Data',
                'observed': '20131114120000',
                'resulted': '20131114120000',
                'locationCode': 'PGD',
                'locationName': 'Patient Generated Data',
                'kind': 'Vital Sign',
                'result': '174',
                'units': 'cm',
                'patientGeneratedDataFlag': true,
                'qualifiedName': 'Height',
                'uid': 'urn:va:vital:DAS:3:10108-1',
                'summary': 'Height 174 cm',
                'pid': 'C877;3',
                'typeName': 'Height',
                'codes': [{
                    'code': '8302-2',
                    'system': 'LOINC',
                    'display': 'Height'
                }],
                'uidHref': 'http://10.4.4.105:8888/patientrecord/uid?pid=C877%3B3&uid=urn%3Ava%3Avital%3ADAS%3A3%3A10108-1',
                'observedFormatted': '2013-11-14',
                'observedTimeFormatted': '12:00',
                'facilityColor': 'nonDOD',
                'resultedFormatted': '2013-11-14',
                'resultedTimeFormatted': '12:00',
                'displayName': 'HT'
            };

            return response;
        }

    });
