'use strict';
define([
    'jquery',
    'backbone',
    'marionette',
    'main/ui_components/components',
    'api/UIComponents',
    'jasminejquery'
], function($, Backbone, Marionette, UI) {
    var $form, form;

    var datePickerControlDefinitionBasic = {
        name: 'datePicker0',
        label: 'datepicker',
        control: 'datepicker'
    };

    var datePickerControlDefinitionBasicSrOnlyLabel = {
        name: 'datePicker0',
        label: 'datepicker',
        control: 'datepicker',
        srOnlyLabel: true
    };

    var datePickerControlDefinitionWithMoreOptions = {
        name: 'datePicker1',
        label: 'datepicker',
        control: 'datepicker',
        options: {
            autoclose: false
        }
    };

    var datePickerControlDefinitionWithExtraClasses = {
        name: 'datePicker2',
        label: 'datepicker (with extra classes)',
        control: 'datepicker',
        extraClasses: ['special-class-1', 'special-class-2']
    };

    var datePickerControlDefinitionDiabled = {
        name: 'datePicker3',
        label: 'datepicker (disabled)',
        disabled: true,
        control: 'datepicker'
    };

    var datePickerControlDefinitionRequired = {
        name: 'datePicker4',
        label: 'datepicker (required)',
        required: true,
        control: 'datepicker'
    };

    var datePickerControlDefinitionReadonly = {
        name: 'datePicker5',
        label: 'datepicker (readonly)',
        readonly: true,
        control: 'datepicker'
    };

    var datePickerControlDefinitionHelpMessage = {
        name: 'datePicker6',
        label: 'datepicker (readonly)',
        control: 'datepicker',
        helpMessage: 'This is a help message.'
    };

    var formModelCleanSlate = new Backbone.Model();

    var formModelWithInitialDate = new Backbone.Model({
        datePicker0: '11/11/2000'
    });

    describe('A datepicker', function() {
        afterEach(function() {
            form.remove();
        });

        describe('basic', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionBasic]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains an input field', function() {
                expect($form.find('input').length).toBe(1);
            });

            it('does not pop up a calendar picker', function() {
                $form.find('input').focus();
                expect($form.find('div.datepicker-dropdown').length).toBe(0);
            });

            it('closes a calendar picker', function() {
                $form.find('input').focusout();
                expect($form.find('div.datepicker-dropdown').length).toBe(0);
            });

            it('allows valid date from being typed into a date field', function() {
                var validDate = '12/31/2015';
                $form.find('input').val(validDate);
                expect(_.isEqual($form.find('input').val(), validDate)).toBe(true);
            });

            it('prevents invalid date from being typed into a date field', function() {
                var invalidDate = '12/32/2015';
                $form.find('input').val(invalidDate);
                expect(_.isEqual($form.find('input').val(), invalidDate)).toBe(false);
            });

            it('sets value in model when input is changed', function() {
                $form.find('input').datepicker('update', '05/12/1999');
                expect(form.model.get('datePicker0')).toBe('05/12/1999');
            });

            it('contains a title on the input field', function() {
                expect($form.find('input').attr('title')).toBe('Please enter in a date in the following format, MM/DD/YYYY');
            });
        });

        describe('with initial value', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelWithInitialDate,
                    fields: [datePickerControlDefinitionBasic]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('puts a correct initial date value', function() {
                expect(_.isEqual($form.find('input').val(), '11/11/2000')).toBe(true);
            });

            it('update to a new date value', function() {
                formModelWithInitialDate.set('datePicker0', '12/20/2014');
                expect(_.isEqual($form.find('input').val(), '12/20/2014')).toBe(true);
            });
        });

        describe('with bootstrap-datepicker option', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionWithMoreOptions]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('verify endDate extra option value', function() {
                expect(_.isEqual($form.find('input').data('autoclose'), false)).toBe(true);
            });
        });

        describe('with extra classes', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionWithExtraClasses]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct classes', function() {
                expect($form.find('div')).toHaveClass('special-class-1');
                expect($form.find('div')).toHaveClass('special-class-2');
            });
            it('input does not have the same classes', function() {
                expect($form.find('input')).not.toHaveClass('special-class-1');
                expect($form.find('input')).not.toHaveClass('special-class-2');
            });
        });

        describe('disabled', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionDiabled]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct attribute', function() {
                expect($form.find('input')).toBeDisabled();
            });
        });

        describe('required', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionRequired]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct attribute', function() {
                expect($form.find('input')).toHaveAttr('required', 'required');
            });
        });

        describe('readonly', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionReadonly]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct attribute', function() {
                expect($form.find('input')).toHaveAttr('readonly', 'readonly');
            });
        });

        describe('with help message', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionHelpMessage]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('help message is in a span with proper class', function() {
                expect($form.find('span:last')).toHaveClass('help-block');
            });

            it('has help message', function() {
                expect($form.find('span:last.help-block')).toHaveText('This is a help message.');
            });
        });
        describe('basic with sr-only label', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionBasicSrOnlyLabel]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct label with sr-only class', function() {
                expect($form.find('label')).toHaveText('datepicker');
                expect($form.find('label').attr('for')).toBe('datePicker0');
                expect($form.find('label')).toHaveClass('sr-only');
            });
        });
        describe("using trigger to dynamically change attributes", function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionBasic]
                });
                $form = form.render().$el;
                $("body").append($form);
            });

            it("required", function() {
                $form.find('.datePicker0').trigger("control:required", true);
                expect($form.find('input')).toHaveAttr('required');
                $form.find('.datePicker0').trigger("control:required", false);
                expect($form.find('input')).not.toHaveAttr('required');

            });
            it("hidden", function() {
                $form.find('.datePicker0').trigger("control:hidden", true);
                expect($form.find('.datePicker0')).toHaveClass('hidden');
                $form.find('.datePicker0').trigger("control:hidden", false);
                expect($form.find('.datePicker0')).not.toHaveClass('hidden');

            });
            it("disabled", function() {
                $form.find('.datePicker0').trigger("control:disabled", true);
                expect($form.find('input')).toHaveAttr('disabled');
                $form.find('.datePicker0').trigger("control:disabled", false);
                expect($form.find('input')).not.toHaveAttr('disabled');
            });
            it("title", function() {
                $form.find('.datePicker0').trigger("control:title", 'newTitle');
                expect($form.find('input')).toHaveAttr('title', 'newTitle');
                $form.find('.datePicker0').trigger("control:title", '');
                expect($form.find('input')).not.toHaveAttr('title');
            });
        });
        describe("with error", function() {
            beforeEach(function() {
                var datePickerControlDefinitionwithError = {
                    name: 'datePicker0',
                    label: 'datepicker',
                    control: 'datepicker'
                };
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [datePickerControlDefinitionwithError]
                });
                $form = form.render().$el;
                $("body").append($form);
            });
            it("contains error", function() {
                form.model.errorModel.set('datePicker0', 'Example error');
                expect($form.find('span.error')).toExist();
                expect($form.find('span.error')).toHaveText('Example error');
            });
            it("error is removed", function() {
                expect($form.find('span.error')).toHaveText('Example error');
                $form.find('.input-group-addon').focus().click();
                $form.find('.day').focus().click();
                expect($form.find('span.error')).not.toExist();
            });
        });
    });
});