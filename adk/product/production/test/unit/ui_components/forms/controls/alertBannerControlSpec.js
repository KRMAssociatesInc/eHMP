/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Backbone, Marionette, UI) {

        var $form, form;

        var alertBannerControlDefinition = {
            control: "alertBanner",
            name: "alertMessage",
            type: "success",
            title: 'Alert title',
            icon: 'fa-check',
            extraClasses:["special-class"]
        };

        var formModel = new Backbone.Model();

        describe("An alertBanner control", function() {
            afterEach(function() {
                form.remove();
                formModel.set('alertMessage', 'Example alert message');
            });
            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [alertBannerControlDefinition]
                    });

                    $form = form.render().$el;
                    $("body").append($form);

                });
                it("contains correct wrapper", function() {
                    expect($form.find('div.alertBanner-control').length).toBe(1);
                });
                it("has same number of controls as defined", function() {
                    expect($form.find('div.control').length).toBe(1);
                });
                it("is empty by default, with an empty model value", function() {
                    form.model.unset('alertMessage');
                    $form = form.render().$el;
                    expect($form.find('div.alertBanner-control')).toBeEmpty();
                    formModel.set('alertMessage', 'Example alert message');
                });
                it("contains same message specified in model", function() {
                    expect($form.find('.alert')).toContainText(form.model.get('alertMessage'));
                });
                it("contains correct extra classes", function() {
                    expect($form.find('.control')).toHaveClass(alertBannerControlDefinition.extraClasses[0]);
                });
                it("contains correct title text", function() {
                    expect($form.find('.alert strong')).toHaveText(alertBannerControlDefinition.title);
                });
                it("contains icon class", function() {
                    expect($form.find('i')).toHaveClass(alertBannerControlDefinition.icon);
                });
                it("contains correct type class", function() {
                    expect($form.find('.alert')).toHaveClass('alert-' + alertBannerControlDefinition.type);
                });

            });

            describe("dismissible", function() {
                beforeEach(function() {
                    var dismissibleAlertBannerControlDefinition = {
                        control: "alertBanner",
                        name: "alertMessage",
                        extraClasses: ["alert-info"],
                        dismissible: true
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [dismissibleAlertBannerControlDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains a dismiss / x button", function() {
                    expect($form.find('button.close')).toBeVisible();
                });
                it("dismiss event occurs on click of dismiss button and dismisses the alert", function() {
                    var spyEvent = spyOnEvent('button.close', 'click');
                    $('button.close').click();
                    expect('click').toHaveBeenTriggeredOn('button.close');
                    expect(spyEvent).toHaveBeenTriggered();
                    expect($form.find('div.alertBanner-control')).toBeEmpty();
                });
            });
            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [alertBannerControlDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("dismissible", function() {
                    $form.find('.alertMessage').trigger("control:dismissible", true);
                    expect($form.find('.alert')).toHaveClass('alert-dismissible');
                    $form.find('.alertMessage').trigger("control:dismissible", false);
                    expect($form.find('.alert')).not.toHaveClass('alert-dismissible');
                });
                it("title", function() {
                    $form.find('.alertMessage').trigger("control:title", 'newTitle');
                    expect($form.find('strong')).toHaveText('newTitle');
                    $form.find('.alertMessage').trigger("control:title", '');
                    expect($form.find('strong')).not.toHaveText('newTitle');
                });
            });
        });
    });
