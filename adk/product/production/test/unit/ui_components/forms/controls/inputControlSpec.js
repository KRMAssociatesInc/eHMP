/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "handlebars", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $form, form;

        var inputControlDefinition_1 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter text..."
            },
            inputControlDefinition_2 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter text...",
                readonly: true
            },
            inputControlDefinition_3 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter text...",
                extraClasses: ["special-class-1", "special-class-2"]
            },
            inputControlDefinition_4 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter text...",
                disabled: true
            },
            inputControlDefinition_5 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter text...",
                required: true
            },
            inputControlDefinition_6 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter text...",
                helpMessage: "This is a help message."
            },
            inputControlDefinition_7 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter a number...",
                type: 'number'
            },
            inputControlDefinition_8 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter your email",
                placeholder: "Enter a email...",
                type: 'email'
            },
            inputControlDefinition_9 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter number...",
                type: 'url'
            },
            inputControlDefinition_10 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter your password",
                placeholder: "Enter password...",
                type: 'password'
            },
            inputControlDefinition_11 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter number...",
                type: 'number',
                units: 'minutes'
            },
            inputControlDefinition_12 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter number...",
                type: 'number',
                units: [{
                    label: "F",
                    value: "f",
                    title: "F Units"
                }, {
                    label: "C",
                    value: "c",
                    title: "C Units"
                }]
            },
            inputControlDefinition_13 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter some text...",
                maxlength: 60,
                charCount: true
            },
            inputControlDefinition_14 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter some text...",
                srOnlyLabel: true
            },
            inputControlDefinition_15 = {
                control: "input",
                name: "inputValue",
                label: "input label",
                title: "Please enter a value",
                placeholder: "Enter number...",
                type: 'number',
                units: [{
                    label: "A",
                    value: "a",
                    title: "A Units"
                }, {
                    label: "B",
                    value: "b",
                    title: "B Units"
                }, {
                    label: "C",
                    value: "c",
                    title: "C Units"
                }, {
                    label: "D",
                    value: "d",
                    title: "D Units"
                }, {
                    label: "E",
                    value: "e",
                    title: "E Units"
                }]
            },
            formModel_1 = new Backbone.Model(),
            formModel_2 = new Backbone.Model({
                inputValue: 'Initial Input Value'
            }),
            formModel_3 = new Backbone.Model({
                inputValue: '6a'
            }),
            formModel_4 = new Backbone.Model();


        describe("An input control", function() {
            afterEach(function() {
                form.remove();
            });

            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct wrapper", function() {
                    expect($form.find('.control').length).toBe(1);
                    expect($form.find('.inputValue').length).toBe(1);
                });
                it("contains correct label", function() {
                    expect($form.find('label').length).toBe(1);
                    expect($form.find('label')).toHaveText('input label');
                    expect($form.find('label').attr('for')).toBe('inputValue');
                });
                it("contains correct placeholder", function() {
                    expect($form.find('input').length).toBe(1);
                    expect($form.find('input')).toHaveAttr('placeholder', 'Enter text...');
                });
                it("contains correct title", function() {
                    expect($form.find('input').length).toBe(1);
                    expect($form.find('input')).toHaveAttr('title', 'Please enter a value');
                });
                it("contains default maxlength", function() {
                    expect($form.find('input').length).toBe(1);
                    expect($form.find('input')).toHaveAttr('maxlength', '255');
                });
                it("contains correct initial value", function() {
                    expect($form.find('input:text')).toHaveValue('');
                });
                it("updates model after value change", function() {
                    $form.find('input:text').val('Test Input String!').trigger('change');
                    expect($form.find('input:text')).toHaveValue('Test Input String!');
                    expect(form.model.get('inputValue')).toBe("Test Input String!");
                });
                it("contains correct id", function() {
                    expect($form.find('input')).toHaveId('inputValue');
                });
                it("does not contain charCount span", function() {
                    expect($form.find('.input-char-count')).toHaveLength(0);
                });
                //trigger with hidden
                //describe triggering events to dynamically change model attributes 
            });
            describe("uneditable", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_2]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct attribute", function() {
                    expect($form.find('input')).toHaveAttr('readonly', 'readonly');
                });
            });
            describe("with extra classes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_3]
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
                        fields: [inputControlDefinition_4]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('input')).toBeDisabled();
                });
            });
            describe("required", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_5]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("has correct attribute", function() {
                    expect($form.find('input')).toHaveAttr('required', 'required');
                });
            });
            describe("with help message", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_6]
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
            describe("type number", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_7]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("type attribute set correctly", function() {
                    expect($form.find('input')).toHaveAttr('type', 'number');
                });
            });
            describe("type email", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_8]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("type attribute set correctly", function() {
                    expect($form.find('input')).toHaveAttr('type', 'email');
                });
            });
            describe("type url", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_9]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("type attribute set correctly", function() {
                    expect($form.find('input')).toHaveAttr('type', 'url');
                });
            });
            describe("type password", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_10]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("type attribute set correctly", function() {
                    expect($form.find('input')).toHaveAttr('type', 'password');
                });
            });
            describe("with initial value", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_2,
                        fields: [inputControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("initial model value set correctly", function() {
                    expect($form.find('input')).toHaveValue('Initial Input Value');
                });
            });
            describe("with units - string", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_11]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("input add-on set correctly", function() {
                    expect($form.find('.input-group').length).toBe(1);
                    expect($form.find('.input-group-addon').length).toBe(1);
                    expect($form.find('.input-group-addon')).toHaveText('minutes');
                });
            });
            describe("with units - array", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_12]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("type attribute set correctly", function() {
                    expect($form.find('.radio-and-input').length).toBe(1);
                    expect($form.find('.radio-inline').length).toBe(2);
                    expect($form.find('.radio-units')[0]).toHaveText('F');
                    expect($form.find('.radio-units')[1]).toHaveText('C');
                });
                it("doesn't include unit until input has value", function() {
                    $form.find('input:radio[id="inputValue-c-radio"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect(form.model.get('inputValue')).toBe('');
                });
                it("it includes the correct unit in the value", function() {
                    $form.find('input[id="inputValue"]').val('300').trigger('change');
                    $form.find('input:radio[id="inputValue-c-radio"]').click();
                    $form.find('input:radio').trigger('change)');
                    expect(form.model.get('inputValue')).toBe('300c');
                    form.model.unset('inputValue');
                });
            });
            describe("with char count enabled", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_13]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains correct span class", function() {
                    expect($form.find('.input-char-count')).toHaveLength(1);
                });
                it("shows correct count when initialized without a value", function() {
                    expect($form.find('.input-char-count')).toHaveText("60");
                });
                it("shows correct count when initialized with a value", function() {
                    form.remove();
                    form = new UI.Form({
                        model: formModel_2,
                        fields: [inputControlDefinition_13]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                    expect($form.find('.input-char-count')).toHaveText("41");
                });
                it("shows correct count when input is entered", function() {
                    var string = 'Test string';
                    $form.find('input').val(string);
                    $form.find('input').trigger('keyup');
                    expect($form.find('.input-char-count')).toHaveText($form.find('input').attr('maxlength') - string.length);
                });
            });
            describe("basic with sr-only label", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_14]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("label contains class of sr-only", function() {
                    expect($form.find('label').length).toBe(1);
                    expect($form.find('label')).toHaveText('input label');
                    expect($form.find('label').attr('for')).toBe('inputValue');
                    expect($form.find('label')).toHaveClass('sr-only');
                });
            });
            describe("with units - array length > 2", function() {
                afterEach(function() {
                    formModel_3.set(inputControlDefinition_15.name, '6a');
                });
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_3,
                        fields: [inputControlDefinition_15]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("options set correctly", function() {
                    expect($form.find('.input-group-btn').length).toBe(1);
                    expect($form.find('.control.inputValue option').length).toBe(5);
                    expect($form.find('.control.inputValue option')[0]).toHaveText('A');
                    expect($form.find('.control.inputValue option')[1]).toHaveText('B');
                    expect($form.find('.control.inputValue option')[2]).toHaveText('C');
                    expect($form.find('.control.inputValue option')[3]).toHaveText('D');
                    expect($form.find('.control.inputValue option')[4]).toHaveText('E');
                });
                it("doesn't include unit until input has value", function() {
                    form.model.set(inputControlDefinition_15.name, '');
                    $form.find('select').val(inputControlDefinition_15.units[1].value).trigger('change');
                    expect(form.model.get('inputValue')).toBe('');
                });
                it("it includes the correct unit in the value", function() {

                    /*
                     * NEED TO FIGURE OUT !!!
                     */

                    var modelName = inputControlDefinition_15.name;

                    expect(form.model.get(modelName)).toBe('6a');
                    $form.find('input').val('7').trigger('change');
                    expect(form.model.get(modelName)).toBe('7a');
                    $form.find('select').val('b').trigger('change');
                    expect(form.model.get(modelName)).toBe('7b');
                });
            });
            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [inputControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("required", function() {
                    $form.find('.inputValue').trigger("control:required", true);
                    expect($form.find('input')).toHaveAttr('required');
                    $form.find('.inputValue').trigger("control:required", false);
                    expect($form.find('input')).not.toHaveAttr('required');

                });
                it("hidden", function() {
                    $form.find('.inputValue').trigger("control:hidden", true);
                    expect($form.find('.inputValue')).toHaveClass('hidden');
                    $form.find('.inputValue').trigger("control:hidden", false);
                    expect($form.find('.inputValue')).not.toHaveClass('hidden');

                });
                it("readonly", function() {
                    $form.find('.inputValue').trigger("control:readonly", true);
                    expect($form.find('input')).toHaveAttr('readonly');
                    $form.find('.inputValue').trigger("control:readonly", false);
                    expect($form.find('input')).not.toHaveAttr('readonly');
                });
                it("disabled", function() {
                    $form.find('.inputValue').trigger("control:disabled", true);
                    expect($form.find('input')).toHaveAttr('disabled');
                    $form.find('.inputValue').trigger("control:disabled", false);
                    expect($form.find('input')).not.toHaveAttr('disabled');
                });
                it("title", function() {
                    $form.find('.inputValue').trigger("control:title", 'newTitle');
                    expect($form.find('input')).toHaveAttr('title','newTitle');
                    $form.find('.inputValue').trigger("control:title", '');
                    expect($form.find('input')).not.toHaveAttr('title');
                });
                it("maxlength", function() {
                    $form.find('.inputValue').trigger('control:maxlength', 10);
                    expect($form.find('input')).toHaveAttr('maxlength', '10');
                });
            });
            describe("with error", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_4,
                        fields: [inputControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("contains error", function() {
                    form.model.errorModel.set('inputValue','Example error');
                    expect($form.find('span.error')).toExist();
                    expect($form.find('span.error')).toHaveText('Example error');
                });
                it("error is removed", function() {
                    expect($form.find('span.error')).toHaveText('Example error');
                    $form.find('input:text').val('Test Input String!').trigger('change');
                    expect($form.find('span.error')).not.toExist();
                    expect($form.find('span.error')).not.toHaveText('Example error');
                });
            });
        });
    });