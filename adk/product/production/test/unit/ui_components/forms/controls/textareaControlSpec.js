/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "handlebars", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $form, form;

        var textareaControlDefinition_1 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                title: "Enter message here"
            },
            textareaControlDefinition_2 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                extraClasses: ["special-class-1", "special-class-2"]
            },
            textareaControlDefinition_3 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                disabled: true
            },
            textareaControlDefinition_4 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                required: true
            },
            textareaControlDefinition_5 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                rows: 5,
                cols: 3
            },
            textareaControlDefinition_6 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                maxlength: 20
            },
            textareaControlDefinition_7 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                helpMessage: "This is a help message."
            },
            textareaControlDefinition_8 = {
                control: "textarea",
                name: "textareaValue",
                label: "textarea label",
                placeholder: "Enter text...",
                title: "Enter message here",
                srOnlyLabel: true
            },
            formModel_1 = new Backbone.Model(),
            formModel_2 = new Backbone.Model({
                textareaValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas blandit ex purus, quis cursus augue tempor vitae. Integer commodo tincidunt.'
            });

        describe("A textarea control", function() {
            afterEach(function() {
                form.remove();
            });

            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct wrapper", function() {
                    expect($form.find('.control').length).toBe(1);
                });
                it("contains correct label", function() {
                    expect($form.find('label').length).toBe(1);
                    expect($form.find('label')).toHaveText('textarea label');
                    expect($form.find('label')).toHaveAttr('for', 'textareaValue');
                });
                it("contains correct title", function() {
                    expect($form.find('textarea').length).toBe(1);
                    expect($form.find('textarea')).toHaveAttr('title', 'Enter message here');
                });
                it("contains correct initial text", function() {
                    expect($form.find('textarea')).toBeEmpty();
                });
                it("updates model after value change", function() {
                    $form.find('textarea').text('New Text String').trigger('change');
                    expect(form.model.get('textareaValue')).toBe('New Text String');
                });
                it("contains default maxlength", function() {
                    expect($form.find('textarea')).toHaveAttr('maxlength', '4000');
                });
                it("contains correct id", function() {
                    expect($form.find('textarea')).toHaveId('textareaValue');
                });
                it("contains correct class", function() {
                    expect($form.find('textarea')).toHaveClass('form-control');
                });
            });
            describe("with extra classes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_2]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct classes", function() {
                    expect($form.find('div')).toHaveClass("special-class-1");
                    expect($form.find('div')).toHaveClass("special-class-2");
                });
                it("textarea does not have the same classes", function() {
                    expect($form.find('textarea')).not.toHaveClass("special-class-1");
                    expect($form.find('textarea')).not.toHaveClass("special-class-2");
                });
            });
            describe("disabled", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_3]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('textarea')).toBeDisabled();
                });
            });
            describe("required", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_4]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('textarea')).toHaveAttr('required', 'required');
                });
            });
            describe("set cols and rows", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_5]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('textarea')).toHaveAttr('cols', '3');
                    expect($form.find('textarea')).toHaveAttr('rows', '5');
                });
            });
            describe("set maxlength", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_6]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('textarea')).toHaveAttr('maxlength', '20');
                });
            });
            describe("with help message", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_7]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("help message is in a span with proper class", function() {
                    expect($form.find('span').length).toBe(1);
                    expect($form.find('span')).toHaveClass('help-block');
                });
                it("has help message", function() {
                    expect($form.find('span.help-block')).toHaveText('This is a help message.');
                });
            });
            describe("with initial value", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_2,
                        fields: [textareaControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("initial model value set correctly", function() {

                    expect($form.find('textarea')).toHaveText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas blandit ex purus, quis cursus augue tempor vitae. Integer commodo tincidunt.');
                });
            });
            describe("basic with sr-only label", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_8]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct label", function() {
                    expect($form.find('label').length).toBe(1);
                    expect($form.find('label')).toHaveText('textarea label');
                    expect($form.find('label')).toHaveAttr('for', 'textareaValue');
                    expect($form.find('label')).toHaveClass('sr-only');
                });
            });
            describe("with error", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains error", function() {
                    form.model.errorModel.set('textareaValue', 'Example error');
                    expect($form.find('span.error')).toExist();
                    expect($form.find('span.error')).toHaveText('Example error');
                });
                it("error is removed", function() {
                    expect($form.find('span.error')).toHaveText('Example error');
                    $form.find('textarea').text('New Text String').trigger('change');
                    expect($form.find('span.error')).not.toExist();
                });
            });
            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [textareaControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("hidden", function() {
                    $form.find('.textareaValue').trigger("control:hidden", true);
                    expect($form.find('.textareaValue')).toHaveClass('hidden');
                    $form.find('.textareaValue').trigger("control:hidden", false);
                    expect($form.find('.textareaValue')).not.toHaveClass('hidden');

                });
                it("placeholder", function() {
                    $form.find('.textareaValue').trigger("control:placeholder", 'new place');
                    expect($form.find('textarea')).toHaveAttr("placeholder", 'new place');
                    $form.find('.textareaValue').trigger("control:placeholder", '');
                    expect($form.find('textarea')).not.toHaveAttr('placeholder','new place');
                });
                it("rows", function() {
                    $form.find('.textareaValue').trigger("control:rows", 4);
                    expect($form.find('textarea')).toHaveAttr('rows', '4');
                    $form.find('.textareaValue').trigger("control:rows", 7);
                    expect($form.find('textarea')).toHaveAttr('rows', '7');
                });
            });
        });
    });
