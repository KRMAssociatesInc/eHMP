/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, jasmine */

'use strict';

define(["jquery", "backbone", "marionette", "jasminejquery", "app/applets/newsfeed/newsfeedUtils" ],
    function($, Backbone, Marionette, jasminejquery, newsfeedUtils) {

        describe("Verify convertTimelineDate returns the right date", function() {
            it("should return undefined when date === Present", function() {
                expect(newsfeedUtils.convertTimelineDate("Present")).toBe(undefined);
            });

            it("should return undefined when date is undefined", function() {
                expect(newsfeedUtils.convertTimelineDate(undefined)).toBe(undefined);
            });

            it("Should return 201401 when date is Jan-2014", function() {
                expect(newsfeedUtils.convertTimelineDate("03-Jan-2014")).toBe("20140103");
            });
        });

        describe("Verify templateSelector returns the right templates", function() {
            it("should return the immunizationTemplate", function() {
                var model = {kind: "iMMuNizatioN"};
                expect(newsfeedUtils.templateSelector(model)).toBe("immunizationTemplate");
            });

            it("Should return the emergency department template ", function() {
                var model = {kind: "visit", stopCodeName: "emerGency dePt"};
                expect(newsfeedUtils.templateSelector(model)).toBe("emergencyDeptTemplate");
            });

            it("Should return the dischargedPatient template ", function() {
                var model = {kind: "AdmIssion", stopCodeName: "Something", dateTime: "19990101", stay:{dischargeDateTime:"20140101"}, categoryCode:"urn:va:encounter-category:AD"};
                expect(newsfeedUtils.templateSelector(model)).toBe("dischargedPatientTemplate");
            });

            it("Should return the admittedPatient template ", function() {
                var model = {kind: "visit", stopCodeName: "Something", dateTime: "19990101", stay:{}, categoryCode:"urn:va:encounter-category:AD"};
                expect(newsfeedUtils.templateSelector(model)).toBe("admittedPatientTemplate");
            });

            it("Should return the stopCodeVisit template ", function() {
                var model = {kind: "visit", stopCodeName: "Something", dateTime: "19990101", stay:{dischargeDateTime:"20140101"} };
                expect(newsfeedUtils.templateSelector(model)).toBe("stopCodeVisitTemplate");
            });

            it("Should return the defaultVisit template ", function() {
                var model = {kind: "visit", dateTime: "19990101", stay:{dischargeDateTime:"20140101"}, summary:"hello" };
                expect(newsfeedUtils.templateSelector(model)).toBe("defaultVisitTemplate");
            });

            it("Should return the consult template ", function() {
                var model = {kind:"consult"};
                expect(newsfeedUtils.templateSelector(model)).toBe("consultTemplate");
            });

            it("Should return the procedure template ", function() {
                var model = {kind:"ProCedure"};
                expect(newsfeedUtils.templateSelector(model)).toBe("procedureTemplate");
            });
        });

        describe("Verify .isHospitalization returns correctly.", function() {
            it("should return false when category Code is not an encounter", function() {

                expect(newsfeedUtils.isHospitalization({categoryCode:"notAnEncounter"})).toBe(false);
            });

            it("should return true when categoryCode is an encounter", function() {
                expect(newsfeedUtils.isHospitalization({categoryCode:"urn:va:encounter-category:AD"})).toBe(true);
            });

            it("should return false when categoryCode is an empty string", function() {
                expect(newsfeedUtils.isHospitalization({categoryCode:""})).toBe(false);
            });

            it("should return false when categoryCode undefined", function() {
                expect(newsfeedUtils.isHospitalization({categoryCode:""})).toBe(false);
            });
        });

        describe("Verify isDischargedOrAdmitted returns true when discharged and false when admitted.", function() {
            it("should return true when stay.dischargedDateTime is not undefined", function() {

                expect(newsfeedUtils.isDischargedOrAdmitted({stay:{dischargeDateTime:"20140101"}})).toBe(true);
            });

            it("should return false when stay.dischargedDateTime is undefined", function() {
                expect(newsfeedUtils.isDischargedOrAdmitted({stay:{}})).toBe(false);
            });

            it("should throw an error when stay is undefined", function() {
                expect(function(){newsfeedUtils.isDischargedOrAdmitted({categoryCode:"urn:va:encounter-category:AD"});}).toThrow();
            });
        });

        describe("Verify getActivityDateTime returns the correct time.", function() {
            it("should return administeredDateTime if an immunization", function() {
               expect(newsfeedUtils.getActivityDateTime({kind:"Immunization", dateTime:"2014", administeredDateTime:"2013"})).toBe("2013");
            });
            it("should return dateTime if not a discharged patient", function() {

                expect(newsfeedUtils.getActivityDateTime({kind:"visit", dateTime: "19990101", stay:{dischargeDateTime:"20140101"}})).toBe("19990101");
            });

            it("should return dateTime if not a discharged patient, (no stay information)", function() {

                expect(newsfeedUtils.getActivityDateTime({kind: "visit", dateTime: "19990101"})).toBe("19990101");
            });

            it("should return stay.dischargedDateTime if a discharged patient", function() {
                expect(newsfeedUtils.getActivityDateTime({kind:"visit", dateTime: "19990101", stay:{dischargeDateTime:"20140101"}, categoryCode:"urn:va:encounter-category:AD"})).toBe("20140101");
            });
        });

        describe("Verify isImmunization returns true/false correctly", function() {
            it("should return true when kind is immunization", function() {
                var model = {kind: "immunization"};
                expect(newsfeedUtils.isImmunization(model)).toBe(true);
            });
            it("should return true when the model is a Backbone.Model", function() {
                var model = new Backbone.Model({kind: "Immunization"});
                expect(newsfeedUtils.isImmunization(model)).toBe(true);
            });
            it("should return false when kind is not immunization", function() {
                var model = {kind: "Visit"};
                expect(newsfeedUtils.isImmunization(model)).toBe(false);
            });
        });

        describe("Verify isVisit returns true/false correctly", function() {
            it("should return true when kind is visit", function() {
                var model = {kind: "visiT"};
                expect(newsfeedUtils.isVisit(model)).toBe(true);
            });
            it("should return true when kind is admission", function() {
                var model = {kind: "adMISSion"};
                expect(newsfeedUtils.isVisit(model)).toBe(true);
            });
            it("should return true when the model is a Backbone.Model", function() {
                var model = new Backbone.Model({kind: "visit"});
                expect(newsfeedUtils.isVisit(model)).toBe(true);
            });
            it("should return false when kind is not visit or admission", function() {
                var model = {kind: "immunization"};
                expect(newsfeedUtils.isVisit(model)).toBe(false);
            });
        });

        describe("verify isSurgery returns true/false correctly", function() {
            it("should return true when kind is surgery", function() {
                var model = {kind: "sUrgerY"};
                expect(newsfeedUtils.isSurgery(model)).toBe(true);
            });
            it("should return false when kind is not surgery", function() {
                var model = {kind: "immunization"};
                expect(newsfeedUtils.isSurgery(model)).toBe(false);
            });
            it("should return true when the model is a Backbone.Model", function() {
                var model = new Backbone.Model({kind: "Surgery"});
                expect(newsfeedUtils.isSurgery(model)).toBe(true);
            });
            it("should return false when kind is not defined", function() {
                var model = {};
                expect(newsfeedUtils.isSurgery(model)).toBe(false);
            });
        });

        describe("verify isConsult returns true/false correctly", function() {
            it("should return true when kind is consult", function() {
                var model = {kind: "cOnsULT"};
                expect(newsfeedUtils.isConsult(model)).toBe(true);
            });
            it("should return false when kind is not consult", function() {
                var model = {kind: "procedure"};
                expect(newsfeedUtils.isConsult(model)).toBe(false);
            });
            it("should return true when the model is a Backbone.Model", function() {
                var model = new Backbone.Model({kind: "CONsuLT"});
                expect(newsfeedUtils.isConsult(model)).toBe(true);
            });
            it("should return false when kind is not defined", function() {
                var model = {};
                expect(newsfeedUtils.isConsult(model)).toBe(false);
            });
        });
        describe("verify isProcedure returns true/false correctly", function() {
            it("should return true when kind is procedure", function() {
                var model = {kind: "pROCedure"};
                expect(newsfeedUtils.isProcedure(model)).toBe(true);
            });
            it("should return false when kind is not procedure", function() {
                var model = {kind: "consult"};
                expect(newsfeedUtils.isProcedure(model)).toBe(false);
            });
            it("should return true when the model is a Backbone.Model", function() {
                var model = new Backbone.Model({kind: "procedure"});
                expect(newsfeedUtils.isProcedure(model)).toBe(true);
            });
            it("should return false when kind is not defined", function() {
                var model = {};
                expect(newsfeedUtils.isProcedure(model)).toBe(false);
            });
        });
        describe("verify getPrimaryProviderDisplay returns the appropriate primaryProvider display name", function() {
            it("should return undefined when primaryProvider is undefined in the response", function() {
                var model = {};
                expect(newsfeedUtils.getPrimaryProviderDisplay(model)).toBe(undefined);

            });
            it("should return undefined when primaryProvider.providerDisplayName is undefined in the response", function() {
                var model = {primaryProvider:{}};
                expect(newsfeedUtils.getPrimaryProviderDisplay(model)).toBe(undefined);

            });
            it("should return the primaryProvider.providerDisplayName", function() {
                var model = {primaryProvider:{providerDisplayName:"test"}};
                expect(newsfeedUtils.getPrimaryProviderDisplay(model)).toBe("test");

            });
        });
        describe("Verify getDisplayType returns the appropriate type value", function() {
            it("should return 'appointment' when the kind is visit and the uid is an appointment uid", function() {
                var model = { kind: 'Visit', uid: 'urn:va:appointment:9E7A:1:101010101' };
                expect(newsfeedUtils.getDisplayType(model)).toBe('Appointment');
            });
            it("should return 'visit' when the kind is visit and the uid is a visit uid", function() {
                var model = { kind: 'Visit', uid: 'urn:va:visit:9E7A:1:101010101' };
                expect(newsfeedUtils.getDisplayType(model)).toBe('Visit');
            });
            it("should return the kind when the kind is not visit", function() {
                var model = { kind: 'Laboratory', uid: 'urn:va:lab:9E7A:1:101010101' };
                expect(newsfeedUtils.getDisplayType(model)).toBe('Laboratory');
            });
        });

    });
