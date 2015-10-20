/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "handlebars", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $form, form;

        var pickList1 = new Backbone.Collection([{
            unique: 'first-thing',
            label: 'First Thing',
            value: false
        }, {
            unique: 'second-thing',
            label: 'Second Thing',
            value: false,
            disabled: true
        }, {
            unique: 'third-thing',
            label: 'Third Thing',
            value: undefined
        }]);

        var checklistControlDefinition_1 = {
                name: "checklistValue",
                label: "checklist label",
                control: "checklist",
                collection: pickList1
            },
            checklistControlDefinition_2 = {
                name: "checklistValue",
                label: "checklist label",
                control: "checklist",
                collection: pickList1,
                extraClasses: ["fancy", "BIGGGG"],
                attributeMapping: {
                    unique: 'itemName',
                    value: 'itemValue',
                    label: 'itemLabel'
                }
            },
            formModel_1 = new Backbone.Model(),
            formModel_2 = new Backbone.Model({
                checklistValue: new Backbone.Collection([{
                    itemName: '005',
                    itemLabel: 'Vehu, Five',
                    itemValue: true
                }, {
                    itemName: '001',
                    itemLabel: 'Vehu, One',
                    itemValue: false,
                    disabled: true
                }, {
                    itemName: '010',
                    itemLabel: 'Vehu, Ten',
                    itemValue: undefined
                }]),
            });

        describe("A checklist control", function() {
            afterEach(function() {
                form.remove();
            });

            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checklistControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct wrapper", function() {
                    expect($form.find('.checklistValue').length).toBe(1);
                });
                it("contains correct label", function() {
                    expect($form.find('legend').length).toBe(1);
                    expect($form.find('legend')).toHaveText('checklist label');
                });
                it("contains correct initial value", function() {
                    expect($form.find('input:checkbox')).not.toBeChecked();
                });
                it("contains correct amount of checkboxes", function() {
                    expect($form.find('.childView-container .control').length).toBe(3);
                });
                it("updates model after value change", function() {
                    $form.find('#checkbox-First-Thing').click().trigger('change');
                    expect($form.find('#checkbox-First-Thing')).toBeChecked();
                    expect($form.find('#checkbox-Second-Thing')).not.toBeChecked();
                    expect($form.find('#checkbox-Third-Thing')).not.toBeChecked();

                    $form.find('#checkbox-Second-Thing').click().trigger('change');
                    expect($form.find('#checkbox-Second-Thing')).not.toBeChecked();

                    $form.find('#checkbox-Third-Thing').click().trigger('change');
                    expect($form.find('#checkbox-Third-Thing')).toBeChecked();

                    // expect(form.model.get('checkboxValue')).toBe(true);
                });
                it("contains correct class", function() {
                    expect($form.find('fieldset')).toHaveClass('checklistValue');
                });
            });
            describe("disabled", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checklistControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('#checkbox-Second-Thing')).toBeDisabled();
                });
            });
            describe("with extra classes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checklistControlDefinition_2]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct classes", function() {
                    expect($form.find('fieldset')).toHaveClass("fancy");
                    expect($form.find('fieldset')).toHaveClass("BIGGGG");
                });
                it("input does not have the same classes", function() {
                    expect($form.find('input')).not.toHaveClass("fancy");
                    expect($form.find('input')).not.toHaveClass("BIGGGG");
                });
            });
            describe("with initial value set in model", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_2,
                        fields: [checklistControlDefinition_2]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("initial model value set correctly", function() {
                    expect($form.find('#checkbox-Vehu-Five')).toExist();
                    expect($form.find('#checkbox-Vehu-One')).toExist();
                    expect($form.find('#checkbox-Vehu-Ten')).toExist();
                });
                it("has correct attribute", function() {
                    expect($form.find('#checkbox-Vehu-One')).toBeDisabled();
                });
            });
            describe("with error", function() { 
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checklistControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains error", function() {
                    form.model.errorModel.set('checklistValue', 'Example error');
                    expect($form.find('span.error')).toExist();
                    expect($form.find('span.error')).toHaveText('Example error');
                });
                it("error is removed", function() {
                    expect($form.find('span.error')).toHaveText('Example error');
                    $form.find('#checkbox-First-Thing').click().trigger('change');
                    expect($form.find('span.error')).not.toExist();
                });
            });
            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [checklistControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("hidden", function() {
                    $form.find('.checklistValue').trigger("control:hidden", true);
                    expect($form.find('.checklistValue')).toHaveClass('hidden');
                    $form.find('.checklistValue').trigger("control:hidden", false);
                    expect($form.find('.checklistValue')).not.toHaveClass('hidden');
                });
            });
        });

    });