/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery"],
    function ($, Backbone, Marionette) {

        describe("A suite", function() {
            it("contains spec with an expectation", function() {
                expect(true).toBe(true);
            });
        });
    });