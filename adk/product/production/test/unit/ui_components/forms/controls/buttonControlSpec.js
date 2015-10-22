/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Backbone, Marionette, UI) {

        var $form, form;

        var buttonControlDefinition = {
            control: "button",
            label: "button label",
            name: "formStatus",
            type: "button"
        };

        var formModel = new Backbone.Model();


        describe("A button control", function() {
            afterEach(function() {
                form.remove();
            });
            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [buttonControlDefinition]
                    });

                    $form = form.render().$el;

                    //GOTCHA: had to do this to make mutually exclusive radio button test to work
                    //unresolved phantomjs bug does NOT implement correctly mutually exclusive buttons
                    //per bug in https://github.com/ariya/phantomjs/issues/12039
                    $("body").append($form);

                });
                it("contains correct wrapper", function() {
                    expect($form.find('.control').length).toBe(1);
                });
                it("has same number of controls as defined", function() {
                    expect($form.find('button').length).toBe(1);
                });
                it("contains label text", function() {
                    expect($form.find('button')).toHaveText('button label');
                });

                it("contains the correct type attribute", function() {
                    expect($form.find('button')).toHaveAttr('type', 'button');
                });

                it("contains a title attribute", function() {
                    expect($form.find('button')).toHaveAttr('title', 'button label');
                });
                it("contains correct title", function() {
                    expect($form.find('button')).toHaveAttr('title', buttonControlDefinition.label);
                });
                it("contains correct class", function() {
                    expect($form.find('button')).toHaveClass('btn');
                });
            });

            describe("submit event", function() {
                var mockSubmit = null;
                beforeEach(function() {
                    mockSubmit = jasmine.createSpy("Mock Submit");
                    var submitButtonDefinition = {
                        control: "button",
                        label: "Submit",
                        name: "formStatus"
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [submitButtonDefinition],
                        events: {
                            "submit": mockSubmit
                        }
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("fires a submit event when pressed", function() {
                    expect(mockSubmit).not.toHaveBeenCalled();
                    $form.find('button').trigger('submit');
                    expect(mockSubmit).toHaveBeenCalled();
                    expect(mockSubmit.calls.count()).toEqual(1);
                });
                it("contains the correct type attribute", function() {
                    expect($form.find('button')).toHaveAttr('type', 'submit');
                });
            });
            describe("disabled", function() {
                beforeEach(function() {
                    var disabledButtonDefinition = {
                        control: "button",
                        label: "Submit",
                        name: "formStatus",
                        disabled: true
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [disabledButtonDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("is disabled", function() {
                    expect($form.find('button')).toBeDisabled();
                });
            });
            describe("with icon", function() {
                beforeEach(function() {
                    var iconButtonDefinition = {
                        control: "button",
                        type: "button",
                        label: "Button with Icon",
                        icon: "fa-th"
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [iconButtonDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains a icon class", function() {
                    expect($form.find('button i')).toHaveClass('fa-th');
                });
            });
            describe("with size", function() {
                beforeEach(function() {
                    var sizeButtonDefinition = {
                        control: "button",
                        type: "button",
                        label: "Large",
                        size: "lg"
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [sizeButtonDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains a size class", function() {
                    expect($form.find('button')).toHaveClass('btn-lg');
                });
            });
            describe("with extra classes", function() {
                beforeEach(function() {
                    var extraClassButtonDefinition = {
                        control: "button",
                        type: "button",
                        label: "Danger",
                        extraClasses: ["btn-danger", "something-special"]
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [extraClassButtonDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains the classes defined", function() {
                    expect($form.find('button')).toHaveClass('btn-danger');
                    expect($form.find('button')).toHaveClass('something-special');
                });
            });

            describe("with id", function() {
                beforeEach(function() {
                    var idButtonDefinition = {
                        control: "button",
                        type: "button",
                        label: "Button",
                        id: "example-button-id"
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [idButtonDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains the id specified", function() {
                    expect($form.find('button')).toHaveId('example-button-id');
                });
            });

            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [buttonControlDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("hidden", function() {
                    $form.find('.formStatus').trigger("control:hidden", true);
                    expect($form.find('.formStatus')).toHaveClass('hidden');
                    $form.find('.formStatus').trigger("control:hidden", false);
                    expect($form.find('.formStatus')).not.toHaveClass('hidden');

                });
                it("disabled", function() {
                    $form.find('.formStatus').trigger("control:disabled", true);
                    expect($form.find('button')).toHaveAttr('disabled');
                    $form.find('.formStatus').trigger("control:disabled", false);
                    expect($form.find('button')).not.toHaveAttr('disabled');
                });
                it("icon", function() {
                    $form.find('.formStatus').trigger("control:icon", 'newIcon');
                    expect($form.find('i')).toHaveClass('newIcon');
                    $form.find('.formStatus').trigger("control:icon", '');
                    expect($form.find('button')).not.toHaveClass('newIcon');
                });
                it("label", function() {
                    $form.find('.formStatus').trigger("control:label", 'newLabel');
                    expect($form.find('button')).toHaveText('newLabel');
                    $form.find('.formStatus').trigger("control:label", '');
                    expect($form.find('button')).not.toHaveText('newLabel');
                });
            });
        });
    });