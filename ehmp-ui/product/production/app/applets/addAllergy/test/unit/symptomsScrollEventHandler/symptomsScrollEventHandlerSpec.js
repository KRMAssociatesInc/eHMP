/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn, loadFixtures, setFixtures, jasmine */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "testUtil"],
    function($, Backbone, Marionette, modalView, testUtil) {
        var symptomsScrollEventHandler;

        beforeEach(function(done) {
            jasmine.getFixtures().fixturesPath = "app/applets/addAllergy/test/unit/symptomsScrollEventHandler";
            loadFixtures('symptomsScrollEventHandlerFixture.html');

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

            testUtil.loadWithCurrentStubs('app/applets/addAllergy/symptomsScrollEventHandler', function(loadedModule) {
                symptomsScrollEventHandler = loadedModule;
                done();
            });
        });

        afterEach(function(done) {
            testUtil.reset();
            done();
        });

        describe("symptomsScrollEventHandler is called", function() {
            it('fetchOptions.criteria.param is set to {"dir":"1","from":"5"}', function() {
                var param = {
                    dir: '1',
                    from: '5'
                };
                symptomsScrollEventHandler.doFetch(param);
                expect(symptomsScrollEventHandler.fetchOptions.data).toEqual('param=%7B%22dir%22%3A%221%22%2C%22from%22%3A%225%22%7D');
            });
        });
    });
