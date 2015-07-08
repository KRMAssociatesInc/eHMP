/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, xit, expect, beforeEach, afterEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "testUtil"],
    function($, Backbone, Marionette, jasminejquery, testUtil) {
        var allergiesUtil;

        beforeEach(function(done) {
            testUtil.loadWithCurrentStubs('app/applets/addAllergy/utils/allergiesUtil', function(loadedModule) {
                allergiesUtil = loadedModule;
                done();
            });
        });

        afterEach(function(done) {
            testUtil.reset();
            done();
        });

        describe("allergiesUtil", function() {

            it("returns a string for current rdk date", function() {
                var ret = allergiesUtil.currentRdkEventDate();
                expect(ret.length).toBe(8);
            });

            it("returns a string for current rdk time", function() {
                var ret = allergiesUtil.currentRdkEventTime();
                expect(ret.length).toBe(6);
            });

            it("returns true for correct timestamp from date and time strings", function() {
                var test = allergiesUtil.rdkObservedTimestampFromDateTimeStrings("09/25/2014", "09:15 a");
                expect(test).toBe("201409250915");
            });
        });
    });
