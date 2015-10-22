/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "handlebars", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $form, form;

        var checkboxControlDefinition_1 = {
                control: "checkbox",
                name: "checkboxValue",
                label: "checkbox label",
                title: "Example basic checkbox."
            },
            checkboxControlDefinition_2 = {
                control: "checkbox",
                name: "checkboxValue",
                label: "checkbox label",
                title: "Example basic checkbox.",
                extraClasses: ["special-class-1", "special-class-2"]
            },
            checkboxControlDefinition_3 = {
                control: "checkbox",
                name: "checkboxValue",
                label: "checkbox label",
                title: "Example basic checkbox.",
                disabled: true
            },
            formModel_1 = new Backbone.Model(),
            formModel_2 = new Backbone.Model({
                checkboxValue: true
            });

        describe("A checkbox control", function() {
            afterEach(function() {
                form.remove();
            });

            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checkboxControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct wrapper", function() {
                    expect($form.find('.control').length).toBe(1);
                });
                it("contains correct label", function() {
                    expect($form.find('label').length).toBe(1);
                    expect($form.find('label')).toHaveText('checkbox label');
                    expect($form.find('label')).toHaveAttr('for', 'checkboxValue');
                });
                it("contains correct title", function() {
                    expect($form.find('input').length).toBe(1);
                    expect($form.find('input')).toHaveAttr('title', 'Example basic checkbox.');
                });
                it("contains correct initial value", function() {
                    expect($form.find('input:checkbox')).not.toBeChecked();
                });
                it("updates model after value change", function() {
                    $form.find('input:checkbox').click().trigger('change');
                    expect($form.find('input:checkbox')).toBeChecked();
                    expect(form.model.get('checkboxValue')).toBe(true);
                });
                it("contains correct id", function() {
                    expect($form.find('input')).toHaveId('checkboxValue');
                });
                it("contains correct type", function() {
                    expect($form.find('input')).toHaveProp('type','checkbox');
                });
            });
            describe("with extra classes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checkboxControlDefinition_2]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct classes", function() {
                    expect($form.find('div')).toHaveClass("special-class-1");
                    expect($form.find('div')).toHaveClass("special-class-2");
                });
                it("input does not have the same classes", function() {
                    expect($form.find('input')).not.toHaveClass("special-class-1");
                    expect($form.find('input')).not.toHaveClass("special-class-2");
                });
            });
            describe("disabled", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checkboxControlDefinition_3]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('input')).toBeDisabled();
                });
            });
            describe("with initial value", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_2,
                        fields: [checkboxControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("initial model value set correctly", function() {
                    expect($form.find('input:checkbox')).toBeChecked();
                });
            });
            describe("with error", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checkboxControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains error", function() {
                    form.model.errorModel.set('checkboxValue', 'Example error');
                    expect($form.find('span.error')).toExist();
                    expect($form.find('span.error')).toHaveText('Example error');
                });
                it("error is removed", function() {
                    expect($form.find('span.error')).toHaveText('Example error');
                    $form.find('input:checkbox').click().trigger('change');
                    expect($form.find('span.error')).not.toExist();
                });
            });
            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checkboxControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("hidden", function() {
                    $form.find('.checkboxValue').trigger("control:hidden", true);
                    expect($form.find('.checkboxValue')).toHaveClass('hidden');
                    $form.find('.checkboxValue').trigger("control:hidden", false);
                    expect($form.find('.checkboxValue')).not.toHaveClass('hidden');

                });
                it("label", function() {
                    $form.find('.checkboxValue').trigger("control:label", 'newLabel');
                    expect($form.find('label')).toHaveText('newLabel');
                    $form.find('.checkboxValue').trigger("control:label", '');
                    expect($form.find('label')).not.toHaveText('newLabel');
                });
            });
        });
    });
