/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

define([
    'jquery',
    'backbone',
    'marionette',
    'jasminejquery',
    'app/applets/lab_results_grid/appletHelpers',
    'moment'
], function($, Backbone, Marionette, jasminejquery, appletHelpers, Moment) {

    describe("Determine if getDateForChart function is getting the argument in the correct date format. Ex: yyyymmdd", function() {
        it("should return true if argument is in correct format", function() {
            var getDateForChartArgument = '201409191300';
            expect(getDateForChartArgument).toMatch(/\d{12,}/);
        });

        it("running getDateforChart should return a date formatted as MMM DD YYYY", function() {
            expect(appletHelpers.getDateForChart('201409221300')).toMatch(/\w{3}\s\d{2}\s\d{4}\s\d{2}:\d{2}/);
        });
    });

    describe("Determine if a given value is NaN", function() {
        it("should return true because value is not a number", function() {
            var foo = 'canceled';
            expect(_.isNaN(foo * 1)).toEqual(true);
        });

        it("should return false because value is a number", function() {
            var foo = '20';
            expect(_.isNaN(foo * 1)).toEqual(false);
        });


        it("should return false because value is a number", function() {
            var foo = '0.05';
            expect(_.isNaN(foo * 1)).toEqual(false);
        });

    });
});
