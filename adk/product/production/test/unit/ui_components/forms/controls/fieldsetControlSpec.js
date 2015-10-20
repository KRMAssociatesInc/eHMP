/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "handlebars", "backbone", "marionette", "main/ui_components/components", "puppetForm", "api/UIComponents", "jasminejquery"],
    function($, Handlebars, Backbone, Marionette, UI, PuppetForm) {

        var $form, form;

        var fieldsetControlDefinition_1 = {
                control: "fieldset",
                items: [{
                    control: "button"
                }, {
                    control: "button"
                }]
            },
            fieldsetControlDefinition_2 = {
                control: "fieldset",
                extraClasses: ["special-class-1", "special-class-2"],
            },
            formModel_1 = new Backbone.Model();

        describe("A fieldset control", function() {
            afterEach(function() {
                form.remove();
            });

            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [fieldsetControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct number of controls", function() {
                    expect($form.find('.control').length).toBe(2);
                });
                it("contains correct controls", function() {
                    expect($form.find('button:submit').length).toBe(2);
                });
            });

            describe("with extra classes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [fieldsetControlDefinition_2]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct number of controls", function() {
                    expect($form.find('.controls').length).toBe(0);
                });
                it("has correct classes", function() {
                    expect($form.find('fieldset')).toHaveClass("special-class-1");
                    expect($form.find('fieldset')).toHaveClass("special-class-2");
                });
            });

            describe('fieldset event testing', function() {
              beforeEach(function() {
                form = new UI.Form({
                  model: formModel_1,
                  fields: [fieldsetControlDefinition_1]
                });
                this.model = {
                  control: 'button',
                  name: 'test'
                };
                $form = form.render().$el;
                $('body').append($form);
              });
              it('should correctly add a new control to the fieldset collection', function() {
                expect($form.find('button').length).toBe(2); 
                $('fieldset').trigger('control:items:add', this.model);
                expect($form.find('button').length).toBe(3); 
              });
              it('should correctly remove a control from the fieldset collection', function() {
                expect($form.find('button').length).toBe(2); 
                $('fieldset').trigger('control:items:add', this.model);
                expect($form.find('button').length).toBe(3); 
                $('fieldset').trigger('control:items:remove', this.model);
                expect($form.find('button').length).toBe(2); 
              });
              it('should correctly update a fieldsets collection', function() {
                expect($form.find('button').length).toBe(2); 
                $('fieldset').trigger('control:items:update', this.model);
                expect($form.find('button').length).toBe(1); 
              });

            });
        });

    });
