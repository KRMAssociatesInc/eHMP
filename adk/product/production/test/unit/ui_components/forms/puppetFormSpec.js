/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function ($, Backbone, Marionette, UI) {

        var $form, form;

        var puppetFormDefinition = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter text..."
        };

        var formModel = new Backbone.Model();

        beforeEach(function(){
            form = new UI.Form({
                model:  formModel,
                fields: [puppetFormDefinition]
            });

            $form = form.render().$el;

            $("body").append($form);
        });

        afterEach(function(){
            form.remove();
        });

        describe("Puppetform", function() {
            it("has form tag", function() {
                expect(form.tagName).toBe('form');
            });
        });

    });