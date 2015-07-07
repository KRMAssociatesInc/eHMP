/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

// Jasmine Unit Testing Suite
define([
    "backbone",
    "marionette",
    "underscore",
    "jasminejquery",
    "_assets/templates/helpers/getAge"
],
function(Backbone, Marionette, _, jasmine, getAge) {
    'use strict';

    describe("Get Age Format Helper", function() {
        var dateOfBirth,
            sourceFormat;

        dateOfBirth = new Date();
        dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 10);
        dateOfBirth.setDate(dateOfBirth.getDate() - 1);
        var month = dateOfBirth.getMonth();
        if (dateOfBirth.getMonth() + 1 < 10) {
            month = '0' + (dateOfBirth.getMonth() + 1);
        } else {
            month = dateOfBirth.getMonth() + 1;
        }
        dateOfBirth = dateOfBirth.getFullYear() + "" + month + "" + dateOfBirth.getDate();

        it("retrieves age correctly with date and source format params.", function() {
            sourceFormat = "YYYYMDD";
            expect(getAge(dateOfBirth, sourceFormat)).toBe(10);
        });
        it("retrieves age correctly with no source format", function() {
            expect(getAge(dateOfBirth, {})).toBe(10);
        });
        it("retrieves an empty string when theres no source format or date", function() {
            expect(getAge(null, {})).toBe("");
        });
    });

});