/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn, loadFixtures, setFixtures, jasmine */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "testUtil"],
    function($, Backbone, Marionette, modalView, testUtil) {
        var allergenSearchEventHandler;
        var fixture;

        beforeEach(function(done) {
            jasmine.getFixtures().fixturesPath = "app/applets/addAllergy/test/unit/allergenSearchEventHandler";
            loadFixtures('allergenSearchEventHandlerFixture.html');

            testUtil.stub('app/applets/addAllergy/utils/allergiesUtil', {
                addIdCountToModel: function(collection, startIndex) {},
                enableLoadingIndictor: function(isEnabled) {}
            });

            testUtil.loadWithCurrentStubs('app/applets/addAllergy/allergenSearchEventHandler', function(loadedModule) {
                allergenSearchEventHandler = loadedModule;
                done();
            });
        });

        afterEach(function(done) {
            testUtil.reset();
            done();
        });

        describe("allergenSearchEventHandler test runs", function() {
            it('and does not throw an error', function() {
                expect(true).toEqual(true);
            });
        });
    });
