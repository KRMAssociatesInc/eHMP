/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "moment", "testUtil"], function ($, Backbone, Marionette, jasminejquery, Moment, testUtil) {
    var dateUtil;

    beforeEach(function(done) {
        testUtil.loadWithCurrentStubs('app/applets/addVitals/utils/dateTimeUtil', function(loadedModule) {
            dateUtil = loadedModule;
            done();
        });
    });

    afterEach(function(done) {
        testUtil.reset();
        done();
    });


    describe("dateTimeUtil", function() {

        it("returns a string for current rdk date", function() {
            var ret = dateUtil.currentObservedTimeString();
            expect(ret.length).toBe(7);
        });

        it("returns true for correctly formatted time", function() {
            var test = "10:00 a";
            expect(dateUtil.requiredTimeFormat(test)).toBe(true);
        });
        it("returns true for correctly formatted time", function() {
            var test = "10:00 p";
            expect(dateUtil.requiredTimeFormat(test)).toBe(true);
        });
        it("returns false for incorrectly formatted time", function() {
            var test = "10:00";
            expect(dateUtil.requiredTimeFormat(test)).toBe(false);
        });
        it("returns false for incorrectly formatted time", function() {
            var test = "1:00 p";
            expect(dateUtil.requiredTimeFormat(test)).toBe(false);
        });

    });
});
