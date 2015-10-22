/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', '_assets/templates/helpers/compare', 'jasminejquery'],
    function($, Backbone, Marionette, UI) {

        var $form, form;

        var radioControlDefinition = {
            name: 'salutation',
            label: 'Salutation',
            control: 'radio',
            options: [{
                label: 'Mr.',
                value: 'Mr'
            }, {
                label: 'Mrs.',
                value: 'Mrs'
            }, {
                label: 'Mme.',
                value: 'Mme'
            }]
        };

        var formModel = new Backbone.Model();

        describe('A radio control', function() {
            afterEach(function() {
                form.remove();
            });
            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [radioControlDefinition]
                    });

                    $form = form.render().$el;

                    //GOTCHA: had to do this to make mutually exclusive radio button test to work
                    //unresolved phantomjs bug does NOT implement correctly mutually exclusive buttons
                    //per bug in https://github.com/ariya/phantomjs/issues/12039
                    $('body').append($form);
                });
                it('contains the same number of radio controls defined, in this case 3', function() {
                    expect($form.find('input:radio').length).toBe(3);
                });

                it('each radio button should have the same name so they are mutually exclusive', function() {
                    var radioButtons = $form.find('input:radio');
                    for (var i = 0; i < radioButtons.length; i++) {
                        expect($(radioButtons[i])).toHaveAttr('name', 'salutation');
                    }
                });

                it('each radio button should have the same name so they are mutually exclusive', function() {
                    var radioButtons = $form.find('input:radio');
                    for (var i = 0; i < radioButtons.length; i++) {
                        expect($(radioButtons[i])).toHaveAttr('name', 'salutation');
                    }
                });

                it('each radio button should have id based on provided name and value, and value set to provided value', function() {
                    expect($form.find('input:radio[id="salutation-Mr"]')).toHaveValue('"Mr"');
                    expect($form.find('input:radio[id="salutation-Mrs"]')).toHaveValue('"Mrs"');
                    expect($form.find('input:radio[id="salutation-Mme"]')).toHaveValue('"Mme"');
                });

                it('each radio button should have label with provided label', function() {
                    expect($form.find('label[for="salutation-Mr"]')).toHaveText('Mr.');
                    expect($form.find('label[for="salutation-Mrs"]')).toHaveText('Mrs.');
                    expect($form.find('label[for="salutation-Mme"]')).toHaveText('Mme.');
                });

                it('radio buttons should be mutually exclusive', function() {
                    //Please refer to GOTCHA in beforeEach for workaround to make exclusive radio buttons work on PhantomJS

                    $form.find('input:radio[id="salutation-Mr"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect($form.find('input[type=radio]:checked')).toHaveValue('"Mr"');

                    $form.find('input:radio[id="salutation-Mrs"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect($form.find('input[type=radio]:checked')).toHaveValue('"Mrs"');

                    $form.find('input:radio[id="salutation-Mme"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect($form.find('input[type=radio]:checked')).toHaveValue('"Mme"');
                });

                it('model should have value of selected radio button', function() {
                    //Please refer to GOTCHA in beforeEach for workaround to make exclusive radio buttons work on PhantomJS
                    $form.find('input:radio[id="salutation-Mr"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect(form.model.get('salutation')).toBe("Mr");

                    $form.find('input:radio[id="salutation-Mrs"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect(form.model.get('salutation')).toBe("Mrs");

                    $form.find('input:radio[id="salutation-Mme"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect(form.model.get('salutation')).toBe("Mme");
                });
            });
            describe("with extra classes", function() {
                beforeEach(function() {
                    var extraClassRadioControlDefinition = {
                        control: "radio",
                        name: "radio2",
                        label: "radio (with extra classes)",
                        options: [{
                            label: "Option 1",
                            value: "opt1",
                            title: "Option 1"
                        }, {
                            label: "Option 2",
                            value: "opt2",
                            title: "Option 2"
                        }, {
                            label: "Option 3",
                            value: "opt3",
                            title: "Option 3"
                        }],
                        extraClasses: ["class1", "class2"]
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [extraClassRadioControlDefinition]
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });
                it("contains correct extra classes", function() {
                    expect($form.find('.control')).toHaveClass('class1');
                    expect($form.find('.control')).toHaveClass('class2');
                });
            });
            describe("all disabled", function() {
                beforeEach(function() {
                    var allDisabledRadioControlDefinition = {
                        control: "radio",
                        name: "radio3",
                        label: "radio (all options disabled)",
                        options: [{
                            label: "Option 1",
                            value: "opt1",
                            title: "Option 1"
                        }, {
                            label: "Option 2",
                            value: "opt2",
                            title: "Option 2"
                        }, {
                            label: "Option 3",
                            value: "opt3",
                            title: "Option 3"
                        }],
                        disabled: true
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [allDisabledRadioControlDefinition]
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });
                it("has all options disabled", function() {
                    var radioOptions = $form.find('.checkbox input');
                    for (var i = 0; i < radioOptions.length; i++) {
                        expect($(radioOptions[i])).toBeDisabled();
                    }
                });
            });
            describe("single disabled", function() {
                var oneDisabledRadioControlDefinition = null;
                beforeEach(function() {
                    oneDisabledRadioControlDefinition = {
                        control: "radio",
                        name: "radio4",
                        label: "radio (one option disabled)",
                        options: [{
                            label: "Option 1",
                            value: "opt1",
                            title: "Option 1"
                        }, {
                            label: "Option 2",
                            value: "opt2",
                            title: "Option 2",
                            disabled: true
                        }, {
                            label: "Option 3",
                            value: "opt3",
                            title: "Option 3"
                        }]
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [oneDisabledRadioControlDefinition]
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });
                it("has one option disabled", function() {
                    var radioOptions = $form.find('.checkbox input');
                    for (var i = 0; i < radioOptions.length; i++) {
                        if (oneDisabledRadioControlDefinition.options[i].disabled) {
                            expect($(radioOptions[i])).toBeDisabled();
                        } else {
                            expect($(radioOptions[i])).not.toBeDisabled();
                        }
                    }
                });
            });
            describe("with help message", function() {
                beforeEach(function() {
                    var helpMessageRadioControlDefinition = {
                        control: "radio",
                        name: "radio5",
                        label: "radio (with help message)",
                        options: [{
                            label: "Option 1",
                            value: "opt1",
                            title: "Option 1"
                        }, {
                            label: "Option 2",
                            value: "opt2",
                            title: "Option 2"
                        }, {
                            label: "Option 3",
                            value: "opt3",
                            title: "Option 3"
                        }],
                        helpMessage: "This is a help message."
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [helpMessageRadioControlDefinition]
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });
                it("help message is in a span with proper class", function() {
                    expect($form.find('span').length).toBe(1);
                    expect($form.find('span')).toHaveClass('help-block');
                });
                it("has help message", function() {
                    expect($form.find('span.help-block')).toHaveText('This is a help message.');
                });
            });
            describe("basic with sr-only", function() {
                beforeEach(function() {
                    var basicSrOnlyControlDefinition = {
                        control: "radio",
                        name: "radio5",
                        label: "radio with sr-only label",
                        options: [{
                            label: "Option 1",
                            value: "opt1",
                            title: "Option 1"
                        }, {
                            label: "Option 2",
                            value: "opt2",
                            title: "Option 2"
                        }, {
                            label: "Option 3",
                            value: "opt3",
                            title: "Option 3"
                        }],
                        srOnlyLabel: true
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [basicSrOnlyControlDefinition]
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });
                it("contains label with sr-only class", function() {
                    expect($form.find('p')).toHaveText('radio with sr-only label');
                    expect($form.find('p')).toHaveClass('sr-only');
                });
            });
            describe("with error", function() {
                beforeEach(function() {
                    var basicRadioControlDefinition = {
                        control: "radio",
                        name: "radioValue",
                        label: "radio",
                        options: [{
                            label: "Option 1",
                            value: "opt1",
                            title: "Option 1"
                        }, {
                            label: "Option 2",
                            value: "opt2",
                            title: "Option 2"
                        }, {
                            label: "Option 3",
                            value: "opt3",
                            title: "Option 3"
                        }]
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [basicRadioControlDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains error", function() {
                    form.model.errorModel.set('radioValue', 'Example error');
                    expect($form.find('span.error')).toExist();
                    expect($form.find('span.error')).toHaveText('Example error');
                });
                it("error is removed", function() {
                    expect($form.find('span.error')).toHaveText('Example error');
                    $form.find('input:radio[id="radioValue-opt2"]').click();
                    expect($form.find('span.error')).not.toExist();
                });
            });
            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    var basicRadioControlDefinition = {
                        control: "radio",
                        name: "radioValue",
                        label: "radio",
                        options: [{
                            label: "Option 1",
                            value: "opt1",
                            title: "Option 1"
                        }, {
                            label: "Option 2",
                            value: "opt2",
                            title: "Option 2"
                        }, {
                            label: "Option 3",
                            value: "opt3",
                            title: "Option 3"
                        }]
                    };
                    form = new UI.Form({
                        model: formModel,
                        fields: [basicRadioControlDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("required", function() {
                    $form.find('.radioValue').trigger("control:required", true);
                    expect($form.find('input')).toHaveAttr('required');
                    $form.find('.radioValue').trigger("control:required", false);
                    expect($form.find('input')).not.toHaveAttr('required');

                });
                it("label", function() {
                    $form.find('.radioValue').trigger("control:label", 'newLabel');
                    expect($form.find('p.faux-label')).toHaveText('newLabel');
                    $form.find('.radioValue').trigger("control:label", '');
                    expect($form.find('p.faux-label')).not.toHaveAttr('newLabel');
                });
            });
        });
    });