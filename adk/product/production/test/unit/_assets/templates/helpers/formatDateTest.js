/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

// Jasmine Unit Testing Suite
define([
    "backbone",
    "marionette",
    "underscore",
    "jasminejquery",
    "_assets/templates/helpers/formatDate"
], function(Backbone, Marionette, _, jasmine, formatDate) {
    'use strict';

    describe("Date Format Helper", function() {
        var date,
            displayFormat,
            sourceFormat;

        it("formates date correctly", function() {
            date = "20031213";
            displayFormat = "DD-MM-YYYY";
            sourceFormat = "YYYYMMDD";
            expect(formatDate(date, displayFormat, sourceFormat)).toBe("13-12-2003");
        });
        it("formates date correctly with no formats", function() {
            date = "20031213";
            expect(formatDate(date, {}, {})).toBe("12/13/2003");
        });
        it("formates date correctly with no source formats", function() {
            date = "20031213";
            displayFormat = "MM DD, YYYY";
            expect(formatDate(date, displayFormat, {})).toBe("12 13, 2003");
        });
        it("formates date correctly with unique source format", function() {
            date = "2003-12-13";
            displayFormat = "DDMMYYYY";
            sourceFormat = "YYYY-MM-DD";
            expect(formatDate(date, displayFormat, sourceFormat)).toBe("13122003");
        });
        it("works against null params", function() {
            expect(formatDate(null)).toBe("");
        });
    });

});
