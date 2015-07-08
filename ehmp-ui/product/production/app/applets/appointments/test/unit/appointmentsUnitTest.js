/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn, afterEach */

'use strict';

define(['jquery', 'backbone', 'marionette', 'jasminejquery', 'testUtil', 'app/applets/appointments/utilParse'],
    function($, Backbone, Marionette, jasminejquery, testUtil, Util) {


        describe('Parse functions suite', function() {
            var response = null;

            beforeEach(function(done) {

                response = initializeResponse();
                done();

            });

            afterEach(function(done){
                response = null;
                done();
            });

            it("Test getFacilityColor sets DOD color ", function() {
                response.facilityCode = 'DOD';
                response = Util.getFacilityColor(response);

                expect(response.facilityColor).toEqual('DOD');
            });

            it("Test getFacilityColor sets non-DOD color ", function() {
                response.facilityCode = 'nonDoD';
                response = Util.getFacilityColor(response);

                expect(response.facilityColor).toEqual('nonDOD');
            });

            it("Test getProviderDisplayName ", function() {
                response = Util.getProviderDisplayName(response);

                expect(response.providerDisplayName).toEqual('Tdnurse,One');
            });

            it("Test typeName sets Other", function() {
                response.typeDisplayName = 'Event (Historical)';
                response = Util.getFormattedDisplayTypeName(response);

                expect(response.formattedTypeName).toEqual('Other');
            });

        });


        function initializeResponse() {
            var response = {
                "current": false,
                "facilityCode": "500",
                "facilityName": "CAMP MASTER",
                "patientClassName": "Ambulatory",
                "dateTime": "200612080730",
                "service": "SURGERY",
                "stopCodeName": "SURGICAL PROCEDURE UNIT",
                "locationUid": "urn:va:location:9E7A:424",
                "locationName": "OR4",
                "shortLocationName": "OR4",
                "locationDisplayName": "Or4",
                "locationOos": false,
                "kind": "Visit",
                "uid": "urn:va:visit:9E7A:3:5552",
                "summary": "SURGICAL PROCEDURE UNIT",
                "pid": "9E7A;3",
                "localId": "5552",
                "typeName": "OR4 VISIT",
                "typeDisplayName": "Or4 Visit",
                "patientClassCode": "urn:va:patient-class:AMB",
                "categoryCode": "urn:va:encounter-category:OV",
                "categoryName": "Outpatient Visit",
                "providers": [{
                    "primary": true,
                    "role": "P",
                    "providerUid": "urn:va:user:9E7A:10000000016",
                    "providerName": "TDNURSE,ONE",
                    "providerDisplayName": "Tdnurse,One",
                    "summary": "EncounterProvider{uid='null'}"
                }],
                "primaryProvider": {
                    "primary": true,
                    "role": "P",
                    "providerUid": "urn:va:user:9E7A:10000000016",
                    "providerName": "TDNURSE,ONE",
                    "providerDisplayName": "Tdnurse,One",
                    "summary": "EncounterProvider{uid='null'}"
                },
                "stopCodeUid": "urn:va:stop-code:435",
                "encounterType": "P",
                "uidHref": "http://10.4.4.105:8888/patientrecord/uid?pid=9E7A%3B3&uid=urn%3Ava%3Avisit%3A9E7A%3A3%3A5552"
            };

            return response;
        }

    });
