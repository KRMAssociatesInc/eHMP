/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

// Jasmine Unit Testing Suite
define([
    "backbone",
    "marionette",
    "underscore",
    "jasminejquery",
    "_assets/templates/helpers/formatSSN"
], function(Backbone, Marionette, _, jasmine, formatSSN) {
    'use strict';

    describe("SSN Format Helper", function() {

        it("formates ssn correctly with mask", function() {
            var ssn = "000112222";
            var mask = true;
            expect(formatSSN(ssn, mask)).toBe("***-**-2222");
        });
        
        it("formates ssn correctly with no mask", function() {
            var ssn = "000112222";
            var mask = false;
            expect(formatSSN(ssn, mask)).toBe("000-11-2222");
        });

        it("retrieves an empty string when theres no ssn or mask", function() {
            expect(formatSSN(null, {})).toBe("");
        });
    });


});