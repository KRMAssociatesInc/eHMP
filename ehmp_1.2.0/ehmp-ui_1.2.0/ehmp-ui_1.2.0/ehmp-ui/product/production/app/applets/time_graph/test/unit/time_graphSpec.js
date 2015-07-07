/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "app/applets/time_graph/appHelper"],
    function ($, Backbone, Marionette, jasmine, appHelper) {


    describe("Test Time Line Chart settings", function() {

        it("chart credits switched off", function() {
            expect(appHelper.chartOptions.credits.enabled).toBe(false);
        });
        it("chart title switched off", function() {
            expect(appHelper.chartOptions.title.enabled).toBe(false);
        });
        it("chart type should be column", function() {
            expect(appHelper.chartOptions.chart.type).toBe("column");
        });
        it("chart zoom type should be along xAxis", function() {
            expect(appHelper.chartOptions.chart.zoomType).toBe("x");
        });

    });

    describe("Test date sorting and aggrigation", function() {
        var testDateSet= [
                            {attributes:{activityDateTime: "20130515000000", kind: "Visit"}}, 
                            {attributes:{activityDateTime: "20130515000000", kind: "Immunization"}},
                            {attributes:{activityDateTime: "20130515000000", kind: "Admission"}}, 
                            {attributes:{activityDateTime: "20140809000000", kind: "Admission"}},
                            {attributes:{activityDateTime: "19930704000000", kind: "Visit"}}];
        var firstItem = "19930704";
        var lastItem  = "20140809";
        var result = appHelper.dateAggregation(testDateSet);

        it("sort array correctly by date", function() {
            expect(result.agrData[0][0]).toBe(firstItem);
            expect(result.agrData[2][0]).toBe(lastItem);
        });
        it("check number elements in the array", function() {
            expect(result.agrData.length).toBe(3);
        });
        it("aggrigate date correctly by date", function() {
            expect(result.agrData[0][1].total).toBe(1);  //"19930704";
            expect(result.agrData[1][1].total).toBe(3);  //"20130515";
        });
        it("aggrigate types of events correctly", function() {
            expect(result.agrData[0][1].event_types[0]).toBe('Visit');          //"19930704";
            expect(result.agrData[2][1].event_types[0]).toBe('Admission');      //"20140809";
            expect(result.agrData[1][1].event_types).toContain("Immunization"); //"20130515";
            expect(result.agrData[1][1].event_types).toContain("Visit");        //"20130515";
            expect(result.agrData[1][1].event_types).toContain("Admission");    //"20130515";
        });
        it("check for first event in the dataset", function() {
            expect(result.firstEvent).toBe(firstItem);
        });
         it("check for number of agrigated events", function() {
            expect(result.nEvents).toBe(3);
        });
        it("check for number of event types in the dataset", function() {
            expect(result.eventsByType.length).toBe(3);
        });
    });

});
