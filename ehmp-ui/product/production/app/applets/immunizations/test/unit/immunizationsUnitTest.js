/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn, afterEach */

'use strict';

var dependencies = [
    'jquery',
    'backbone',
    'marionette',
    'jasminejquery',
    'app/applets/immunizations/utilParse'
];

// Jasmine Unit Testing Suite
define(dependencies,
    function($, Backbone, Marionette, jasminejquery, Util) {

        describe("Test parse functions suite", function() {
            var response = null;

            beforeEach(function() {
                response = {
                    uid: "urn:va:immunization:DOD:0000000013:1000001116",
                    summary: "Anthrax",
                    pid: "9E7A;71",
                    contraindicated: false,
                    reactionName: "NONE",
                    reactionCode: "urn:va:reaction:9E7A:8:0",
                    facilityCode: "DOD",
                    facilityName: "DOD",
                    name: "Anthrax",
                    administeredDateTime: "20121115",
                    seriesName: "1",
                    performer: {
                        summary: "Clinician{uid='null'}"
                    },
                    kind: "Immunization",
                    codes: [{
                        code: "24",
                        system: "urn:oid:2.16.840.1.113883.12.292",
                        display: "anthrax vaccine"
                    }]
                };
            });

            afterEach(function() {
                response = null;
            });

            it("Test getContraindicated is false", function() {
                response = Util.getContraindicated(response);

                expect(response.contraindicatedDisplay).toEqual("No");
            });

            it("Test getContraindicated is true", function() {
                response.contraindicated = true;
                response = Util.getContraindicated(response);

                expect(response.contraindicatedDisplay).toEqual("Yes");
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

            it("Test getStandardizedName ", function() {
                response = Util.getStandardizedName(response);

                expect(response.standardizedName).toBe('anthrax vaccine');
            });


            it("Test getStandardizedName when null ", function() {
                response.codes = null;
                delete response.codes;
                response = Util.getStandardizedName(response);

                expect(response.standardizedName).toBe('');
            });

            it("Test getStandardizedName when not exists ", function() {
                response.codes = [{
                    code: "24",
                    system: "somethingElse",
                    display: "anthrax vaccine"
                }];
                response = Util.getStandardizedName(response);

                expect(response.standardizedName).toBe('');
            });
            
            it("Test getCommentBubble when there is a comment", function() {
                response.comment = 'This is a test comment';
                response = Util.getCommentBubble(response);

                expect(response.commentBubble).toBeDefined();
            });
            
        });

    });
