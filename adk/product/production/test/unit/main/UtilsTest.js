/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

// Jasmine Unit Testing Suite
define([
    "backbone",
    "marionette",
    "underscore",
    "jasminejquery",
    "main/Utils",
    "moment",
    "backbone.paginator"
], function(Backbone, Marionette, _, jasmine, utils, Moment) {
    'use strict';

    describe("Extract Utility", function() {
        var testResponse,
            response = {},
            responseObject = {
                test1: "a",
                test2: "b"
            },
            attributesObject = {
                one: "test1",
                two: "test2"
            };
        it("extract with all params.", function() {
            testResponse = utils.extract(response, responseObject, attributesObject);
            expect(testResponse.one).toBe("a");
            expect(testResponse.two).toBe("b");
        });

        it("extract with no params", function() {
            testResponse = utils.extract(response, null, null);
            expect(testResponse).toBe(response);
        });
    });

    var date = new Date();
    var testDate = date.getFullYear() + '0101';
    var mockCollection = new Backbone.Collection([{
        name: "Aspirin",
        dose: "2TSP",
        medStatusName: "Active",
        lastFilled: testDate
    }, {
        name: "Aspirin",
        dose: "2TSP",
        medStatusName: "Expired",
        lastFilled: "20100101"
    }]);

    mockCollection.originalModels = mockCollection.toJSON();

    describe("eventHandler", function() {
        it("filterCollectionByDays filters collection", function() {
            utils.filterCollectionByDays(mockCollection, 500, 'lastFilled');
            expect(mockCollection.length).toBe(1);
        });

        it("filterCollectionByDateRange filters collection", function() {
            utils.filterCollectionByDateRange(mockCollection, new Date(2010, 0, 1), new Date(2010, 0, 2), 'lastFilled');
            expect(mockCollection.length).toBe(1);
        });

        it("filterCollectionByDateRange filters collection", function() {
            utils.filterCollectionByDateRange(mockCollection, new Date(2011, 0, 1), new Date(2011, 0, 2), 'lastFilled');
            expect(mockCollection.length).toBe(0);
        });

        it("filterCollectionByValue filters collection", function() {
            utils.filterCollectionByValue(mockCollection, 'medStatusName', 'Active');
            expect(mockCollection.length).toBe(1);
        });

        it("filterCollectionBeginsWith filters collection", function() {
            utils.filterCollectionBeginsWith(mockCollection, 'medStatusName', 'A');
            expect(mockCollection.length).toBe(1);
        });

        it("filterCollectionBeginsWith filters collection", function() {
            utils.filterCollectionBeginsWith(mockCollection, 'name', 'A');
            expect(mockCollection.length).toBe(2);
        });

        it("filterCollectionSubstring filters collection", function() {
            utils.filterCollectionSubstring(mockCollection, 'medStatusName', 'tiv');
            expect(mockCollection.length).toBe(1);
        });

        it("filterCollectionSubstring filters collection", function() {
            utils.filterCollectionSubstring(mockCollection, 'name', 'spir');
            expect(mockCollection.length).toBe(2);
        });

        it("filterCollectionSubstring filters collection", function() {
            utils.filterCollectionSubstring(mockCollection, 'name', 'cet');
            expect(mockCollection.length).toBe(0);
        });

        it("filterCollectionNoSubstring filters collection", function() {
            utils.filterCollectionNoSubstring(mockCollection, 'medStatusName', 'pir');
            expect(mockCollection.length).toBe(1);
        });

        it("filterCollectionNoSubstring filters collection", function() {
            utils.filterCollectionNoSubstring(mockCollection, 'medStatusName', 'spir');
            expect(mockCollection.length).toBe(2);
        });

        it("filterCollectionNoSubstring filters collection", function() {
            utils.filterCollectionNoSubstring(mockCollection, 'name', 'spir');
            expect(mockCollection.length).toBe(0);
        });

        it("resetCollection resets collection", function() {
            utils.resetCollection(mockCollection);
            expect(mockCollection.length).toBe(2);
        });

        it("sortCollection sorts collection ascending", function() {
            utils.sortCollection(mockCollection, 'medStatusName', 'alphabetical', true);
            expect(mockCollection.at(0).attributes['medStatusName']).toBe('Active');
            expect(mockCollection.at(1).attributes['medStatusName']).toBe('Expired');
        });

        it("sortCollection sorts collection decending", function() {
            utils.sortCollection(mockCollection, 'medStatusName', 'alphabetical', false);
            expect(mockCollection.at(0).attributes['medStatusName']).toBe('Expired');
            expect(mockCollection.at(1).attributes['medStatusName']).toBe('Active');
        });
    });

    describe("dateUtils", function() {
        it("dateUtils has correct default configuration", function() {
            var dateUtilsConfig = utils.dateUtils.defaultOptions(),
                myopts = {
                    format: 'mm/dd/yyyy',
                    placeholder: 'MM/DD/YYYY',
                    regex: /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/g,
                    clearIncomplete: true,
                    todayHighlight: true,
                    endDate: new Moment().format('MM/DD/YYYY'),
                    startDate: new Moment('01/01/1900', 'MM/DD/YYYY').format('MM/DD/YYYY'),
                    keyboardNavigation: false,
                    onincomplete: 1,
                    inputmask: 'm/d/y',
                    autoclose: true
                };
            //function reference won't match so just nuke it
            dateUtilsConfig.onincomplete = 1;
            expect(_.isEqual(myopts, dateUtilsConfig)).toBe(true);
        });
    });

    describe('nullUtils', function () {
        it('undefined checking works', function () {
            var testingObject;
            expect(utils.isNotUndefinedAndNotNull(testingObject)).toBe(false);
        });

        it('null checking works', function () {
            var testingObject = null;
            expect(utils.isNotUndefinedAndNotNull(testingObject)).toBe(false);
        });

        it('non null checking works', function () {
            var testingObject = 'ACME';
            expect(utils.isNotUndefinedAndNotNull(testingObject)).toBe(true);
        });
    });
});