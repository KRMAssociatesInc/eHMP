/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn, loadFixtures, setFixtures, jasmine */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "app/applets/add_nonVA_med/utils/searchUtil"],
    function($, Backbone, Marionette, modalView, SearchUtil) {
        beforeEach(function() {
            jasmine.getFixtures().fixturesPath = "app/applets/add_nonVA_med/test/unit/search";
            loadFixtures('medsSearchFixture.html');
        });

        afterEach(function(done) {
            done();
        });

        describe("SearchUtil.enableLoadingIndicator", function() {
            it("is enabled", function() {
                var prop = spyOn($.fn, 'prop');
                var show = spyOn($.fn, 'show');
                SearchUtil.enableLoadingIndicator(true);
                expect(show).toHaveBeenCalled();
            });

            it("is disabled", function() {
                var prop = spyOn($.fn, 'prop');
                var hide = spyOn($.fn, 'hide');
                var focus = spyOn($.fn, 'focus');
                SearchUtil.enableLoadingIndicator(false);
                expect(hide).toHaveBeenCalled();
                expect(focus).toHaveBeenCalled();
            });
        });
    });
