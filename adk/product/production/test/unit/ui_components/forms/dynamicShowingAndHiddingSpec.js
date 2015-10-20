/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "handlebars", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $form, form;

        var FIELDS = [{
            control: "select",
            name: "perferredMethodOfContact",
            label: "What is your perferred method of contact?",
            options: [{
                label: "Email",
                value: "email"
            }, {
                label: "Phone",
                value: "phone"
            }],
            required: true
        }, {
            control: "input",
            name: "email",
            label: "Email Address",
            placeholder: "Enter youremail...",
            type: "email",
            extraClasses: ["hidden"],
            required: true
        }, {
            control: "input",
            name: "phoneNumber",
            label: "Phone Number",
            placeholder: "Enter your phone number...",
            type: "input",
            extraClasses: ["hidden"],
            required: true
        }];

        var FormModel = Backbone.Model.extend({
            defaults: {
                perferredMethodOfContact: '',
                email: '',
                phoneNumber: ''
            }
        });

        xdescribe("Dynamic Showing and Hiding of Controls", function() {
            afterEach(function() {
                form.remove();
            });
            beforeEach(function() {
                form = new UI.Form({
                    model: new FormModel(),
                    fields: FIELDS,
                    modelEvents: {
                        'change:perferredMethodOfContact': function() {
                            var method = this.model.get('perferredMethodOfContact');
                            if (method === "email") {
                                this.$('.phoneNumber').addClass('hidden');
                                this.$('.email').removeClass('hidden');
                            } else if (method === "phone") {
                                this.$('.email').addClass('hidden');
                                this.$('.phoneNumber').removeClass('hidden');
                            } else {
                                this.$('.email').addClass('hidden');
                                this.$('.phoneNumber').addClass('hidden');
                            }
                        }
                    }
                });
                $form = form.render().$el;
                $("body").append($form);
            });
            it("selecting option triggers model event", function() {
                $form.find('select').val('"' + FIELDS[0].options[0].value + '"').trigger('change');
                expect(form.model.get('perferredMethodOfContact')).toBe(FIELDS[0].options[0].value);
                expect($form.find('.email')).not.toHaveClass('hidden');
                expect($form.find('.phoneNumber')).toHaveClass('hidden');
            });
            it("selecting second option triggers model event again", function() {
                $form.find('select').val('"' + FIELDS[0].options[1].value + '"').trigger('change');
                expect(form.model.get('perferredMethodOfContact')).toBe(FIELDS[0].options[1].value);
                expect($form.find('.email')).toHaveClass('hidden');
                expect($form.find('.phoneNumber')).not.toHaveClass('hidden');
            });
        });
    });
