/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

define(["jquery", "backbone", "marionette", "jasminejquery", "app/applets/search/searchUtil"], function($, Backbone, Marionette, jasmine, searchUtil) {

    describe("Test date format", function() {
        var rawDate;

        it("formats date correctly with mask", function() {
            rawDate = "20070621142601";

            expect(searchUtil.doDatetimeConversion(rawDate)).toBe("06/21/2007 - 14:26");
        });
        it("formats date correctly with mask", function() {
            rawDate = "200706211426";

            expect(searchUtil.doDatetimeConversion(rawDate)).toBe("06/21/2007 - 14:26");
        });
        it("formats date correctly with mask", function() {
            rawDate = "2007062114";

            expect(searchUtil.doDatetimeConversion(rawDate)).toBe("06/21/2007 - 14:00");
        });
        it("formats date correctly with mask", function() {
            rawDate = "20070621";

            expect(searchUtil.doDatetimeConversion(rawDate)).toBe("06/21/2007");
        });
    });
});
