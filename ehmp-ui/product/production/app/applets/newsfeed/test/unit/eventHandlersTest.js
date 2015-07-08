/*jslint node: true, nomen: true, unparam: true */
/*global global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn, loadFixtures, setFixtures, jasmine */

'use strict';

define(["jquery","backbone", "marionette", "jasminejquery", "app/applets/newsfeed/eventHandlers" ],
    function($, Backbone, Marionette, jasminejquery, EventHandlers) {

        describe("Verify isDateBefore returns true when the date is equal or less than the activityDateTime", function() {
            it("should return true when date is before activityDateTime", function() {
                expect(EventHandlers.isDateBefore("20131230", {
                    kind:"immunization",
                    activityDateTime: "20140102120000"
                })).toBe(true);
            });
            it("should return true when date is equal to activityDateTime", function() {
                expect(EventHandlers.isDateBefore("20140227", {
                    kind:"immunization",
                    activityDateTime: "20140227120000"
                })).toBe(true);
            });

            it("should return false when date is after activityDateTime", function() {
                expect(EventHandlers.isDateBefore("201403", {
                    kind:"immunization",
                    activityDateTime: "20140203120000"
                })).toBe(false);
            });

            it("should return false when undefined", function() {
                expect(EventHandlers.isDateBefore("201401", undefined)).toBe(false);
            });

            it("should return false when activityDateTime is undefined", function() {
                expect(EventHandlers.isDateBefore("201401", {
                    kind:"stopCode"
                })).toBe(false);
            });
        });

        describe("Verify isDateAfter returns true when the date is equal or greater than the activityDateTime", function() {
            it("should return false when date is before activityDateTime", function() {
                expect(EventHandlers.isDateAfter("20131230", {
                    kind:"immunization",
                    activityDateTime: "20140102120000"
                })).toBe(false);
            });
            it("should return true when date is equal to activityDateTime", function() {
                expect(EventHandlers.isDateAfter("20140114", {
                    kind:"immunization",
                    activityDateTime: "20140114120000"
                })).toBe(true);
            });

            it("should return true when date is after activityDateTime", function() {
                expect(EventHandlers.isDateAfter("201402", {
                    kind:"immunization",
                    activityDateTime: "20140101120000"
                })).toBe(true);
            });

            it("should return false when undefined", function() {
                expect(EventHandlers.isDateAfter("201401", undefined)).toBe(false);
            });

            it("should return false when activityDateTime is undefined", function() {
                expect(EventHandlers.isDateAfter("201401", {
                    kind:"stopCode"
                })).toBe(false);
            });
        });

        describe("Verify isValidDate true if the date has at least year and month", function() {
            it("should return false when date doesn't have year and month", function() {
                expect(EventHandlers.isValidDate({
                    activityDateTime: "2014"
                })).toBe(false);
            });
            it("should return false when the date is undefined", function() {
                expect(EventHandlers.isValidDate( {
                })).toBe(false);
            });

            it("should return true when date has a month and year", function() {
                expect(EventHandlers.isValidDate({
                    activityDateTime: "201402"
                })).toBe(true);
            });

            it("should return true when date has a month, year, day, hour, and minute", function() {
                expect(EventHandlers.isValidDate({
                    activityDateTime: "20140101120000"
                })).toBe(true);
            });
        });


    });
