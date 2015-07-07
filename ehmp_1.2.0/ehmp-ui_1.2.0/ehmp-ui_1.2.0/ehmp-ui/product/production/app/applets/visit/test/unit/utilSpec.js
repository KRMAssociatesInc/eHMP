/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, xit, expect, beforeEach, afterEach, spyOn, ADK */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "testUtil"],
    function($, Backbone, Marionette, jasminejquery, testUtil) {

        describe("Visit util test suite", function() {
            var util;

            beforeEach(function(done) {
                testUtil.loadWithCurrentStubs('applets/visit/util', function(loadedModule) {
                    util = loadedModule;
                    done();
                });
            });

            afterEach(function(done) {
                testUtil.reset();
                done();
            });

        });
    });
