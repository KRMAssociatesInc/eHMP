/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn groupByBody*/


define([
    "backbone",
    "marionette",
    "underscore",
    "jasminejquery",
    "main/backgrid/extensions/groupBy/groupByHelper",
], function(Backbone, Marionette, _, jasmine, GroupByHelper) {
    'use strict';


    var dateFunc = function(item) {
        return item.date;
    };


    describe("isEmptyCollection returns true when it should", function() {
        it("should return false when the collection has more than one element", function() {
            var orderedData = [ "not", "empty"];
           expect(GroupByHelper.isEmptyCollection(orderedData)).toBe(false);
        });
        it("should return true when the collection has no elements in it", function() {
            var orderedData = [];
            expect(GroupByHelper.isEmptyCollection(orderedData)).toBe(true);
        });
    });
    describe("aggregateBy correctly aggregates", function() {

        it("an array of objects sorted by the groupKey should preserve the", function() {
            var orderedData = [ {date:"1992", name:"moe"}, {date:"1992", name:"shep"}, {date:"2002", name:"larry"}, {date:"2012", name:"curly"}];
            var expectedData = [["1992", [{date:"1992", name:"moe"}, {date:"1992", name:"shep"}]],
                ["2002", [ {date:"2002", name:"larry"}]], ["2012", [ {date:"2012", name:"curly"}]]];

            expect(GroupByHelper.aggregateBy(orderedData, dateFunc)).toEqual(expectedData);
        });

        it("an array of objects should be sorted by the first appearance of the groupKey", function() {
            var orderedData = [ {date:"1992", name:"moe"}, {date:"1992", name:"shep"}, {date:"2002", name:"larry"},
                {date:"2012", name:"curly"}, {date:"2002", name:"lenny"}, {date:"1991", name:"darkwing"}];

            var expectedData = [["1992", [{date:"1992", name:"moe"}, {date:"1992", name:"shep"}]], ["2002", [{date:"2002", name:"larry"}, {date:"2002", name:"lenny"}]],
                ["2012", [{date:"2012", name:"curly"}]], ["1991", [{date:"1991", name:"darkwing"}]]];

            expect(GroupByHelper.aggregateBy(orderedData, dateFunc)).toEqual(expectedData);
        });
    });
});