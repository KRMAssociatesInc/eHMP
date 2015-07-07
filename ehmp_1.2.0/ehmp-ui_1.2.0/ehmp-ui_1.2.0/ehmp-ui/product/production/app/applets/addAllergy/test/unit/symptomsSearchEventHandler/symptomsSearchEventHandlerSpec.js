/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn, loadFixtures, setFixtures, jasmine */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "testUtil"],
    function($, Backbone, Marionette, modalView, testUtil) {
        var symptomsSearchEventHandler;
        var fixture;

        beforeEach(function(done) {
            jasmine.getFixtures().fixturesPath = "app/applets/addAllergy/test/unit/symptomsSearchEventHandler";
            loadFixtures('symptomsSearchEventHandlerFixture.html');

            testUtil.stub('app/applets/addAllergy/utils/symptomsUtil', {
                addIdCountToModel: function(collection, startIndex) {},
                enableLoadingIndictor: function(isEnabled) {}
            });

            testUtil.stub('app/applets/addAllergy/models/symptomsCollection', function() {
                return {
                    url: function(string) {},
                    fetch: function(fetchOptions) {}
                };
            });

            testUtil.loadWithCurrentStubs('app/applets/addAllergy/symptomsSearchEventHandler', function(loadedModule) {
                symptomsSearchEventHandler = loadedModule;
                done();
            });
        });

        afterEach(function(done) {
            testUtil.reset();
            done();
        });

        describe("symptomsSearchEventHandler is called", function() {
            it('fetchOptions.criteria.param is set to {dir:1,from:"cough"}', function() {
                var searchBox = $("#symptomSearchInput");
                searchBox.val('cough');
                symptomsSearchEventHandler.symptomsEventHandler({
                    type: "keyup",
                    which: 13,
                    target: searchBox
                });
                expect(symptomsSearchEventHandler.fetchOptions.data).toEqual(//{
                    'param=%7B%22dir%22%3A1%2C%22from%22%3A%22cough%22%7D'
                );
            });
        });
    });
