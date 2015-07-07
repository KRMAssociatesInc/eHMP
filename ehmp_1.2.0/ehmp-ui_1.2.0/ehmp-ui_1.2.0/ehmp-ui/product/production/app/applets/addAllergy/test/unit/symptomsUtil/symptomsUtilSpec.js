/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn, loadFixtures, setFixtures, jasmine */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery", "app/applets/addAllergy/utils/symptomsUtil"],
    function($, Backbone, Marionette, modalView, SymptomsUtil) {
        beforeEach(function() {
            jasmine.getFixtures().fixturesPath = "app/applets/addAllergy/test/unit/symptomsUtil";
            loadFixtures('symptomsUtilFixture.html');
        });

        afterEach(function(done) {
            done();
        });

        describe("SymptomsUtil.addIdCountToModel", function() {
            it("adds count to all models with startIndex 0", function() {
                var BaseModel = Backbone.Model.extend({});
                var BaseCollection = Backbone.Collection.extend({
                    mode: BaseModel
                });

                var model1 = new BaseModel();
                var model2 = new BaseModel();
                var model3 = new BaseModel();
                var collection = new BaseCollection([model1, model2, model3]);

                SymptomsUtil.addIdCountToModel(collection, 0);
                expect(collection.at(0).get('count')).toEqual(0);
                expect(collection.at(1).get('count')).toEqual(1);
                expect(collection.at(2).get('count')).toEqual(2);
            });

            it("adds count to all models with startIndex 23", function() {
                var BaseModel = Backbone.Model.extend({});
                var BaseCollection = Backbone.Collection.extend({
                    mode: BaseModel
                });

                var model1 = new BaseModel();
                var model2 = new BaseModel();
                var model3 = new BaseModel();
                var collection = new BaseCollection([model1, model2, model3]);

                SymptomsUtil.addIdCountToModel(collection, 23);
                expect(collection.at(0).get('count')).toEqual(23);
                expect(collection.at(1).get('count')).toEqual(24);
                expect(collection.at(2).get('count')).toEqual(25);
            });

            it("does nothing with empty collection", function() {
                var BaseModel = Backbone.Model.extend({});
                var BaseCollection = Backbone.Collection.extend({
                    mode: BaseModel
                });

                var collection = new BaseCollection();

                SymptomsUtil.addIdCountToModel(collection, 0);
                expect(collection.models.length).toEqual(0);
            });

        describe("SymptomsUtil.enableLoadingIndictor", function() {
            it("is enabled", function() {
                var prop = spyOn($.fn, 'prop');
                var show = spyOn($.fn, 'show');
                SymptomsUtil.enableLoadingIndictor(true);
                expect(show).toHaveBeenCalled();
            });

            it("is disabled", function() {
                var prop = spyOn($.fn, 'prop');
                var hide = spyOn($.fn, 'hide');
                var focus = spyOn($.fn, 'focus');
                SymptomsUtil.enableLoadingIndictor(false);
                expect(hide).toHaveBeenCalled();
                expect(focus).toHaveBeenCalled();
            });
        });
        });
    });
