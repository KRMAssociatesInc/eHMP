/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "testUtil"],
    function ($, Backbone, Marionette, jasminejquery, testUtil) {
        var docUtils;

        beforeEach(function(done) {
            testUtil.loadWithCurrentStubs('app/applets/documents/docUtils', function(loadedModule) {
                docUtils = loadedModule;
                done();
            });
        });

        afterEach(function(done) {
            testUtil.reset();
            done();
        });

        describe("Consults view has a method", function() {
            it('that returns true if the consults collection contains a document entry for the summary consult document id.', function() {
                    expect(docUtils.hasDocIdRecord(validActivity, validDocId)).toBe(true);
            });

            it('that returns false if the consults collection does not contain a document entry for the summary consult document id.', function() {
                    expect(docUtils.hasDocIdRecord(validActivity, invalidDocId)).toBe(false);
            });
        });

        var validDocId    = "urn:va:document:C877:8:1091",
            invalidDocId  = "urn:va:document:C877:8:1091bogus";

        var validActivity = [{
            "dateTime": 19990513130638,
            "entered": 19990513130638,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "ENTERED IN CPRS",
            "responsible": "PROVIDER,TWOHUNDREDNINETYSEVEN"
        }, {
            "dateTime": 19990513130638,
            "device": "",
            "entered": 19990513130638,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "PRINTED TO"
        }, {
            "dateTime": 19990513131536,
            "entered": 19990513131536,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "COMPLETE/UPDATE",
            "responsible": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "resultUid": "urn:va:document:C877:8:1090"
        }, {
            "dateTime": 19990513141448,
            "entered": 19990513141448,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "NEW NOTE ADDED",
            "responsible": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "resultUid": "urn:va:document:C877:8:1091"
        }];

        var invalidActivity = [{
            "dateTime": 19990513130638,
            "entered": 19990513130638,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "ENTERED IN CPRS",
            "responsible": "PROVIDER,TWOHUNDREDNINETYSEVEN"
        }, {
            "dateTime": 19990513130638,
            "device": "",
            "entered": 19990513130638,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "PRINTED TO"
        }, {
            "dateTime": 19990513131536,
            "entered": 19990513131536,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "COMPLETE/UPDATE",
            "responsible": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "resultUid": "urn:va:document:C877:8:1090"
        }, {
            "dateTime": 19990513141448,
            "entered": 19990513141448,
            "enteredBy": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "name": "NEW NOTE ADDED",
            "responsible": "PROVIDER,TWOHUNDREDNINETYSEVEN",
            "resultUid": "urn:va:document:someInvalidNumber"
        }];
    });
