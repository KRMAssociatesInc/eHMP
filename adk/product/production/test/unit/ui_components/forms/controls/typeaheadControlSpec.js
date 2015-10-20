'use strict';

// Jasmine Unit Testing Suite
define([
    'jquery',
    'backbone',
    'marionette',
    'main/ui_components/components',
    'api/UIComponents',
    'jasminejquery',
    'typeahead'
], function($, Backbone, Marionette, UI, JasmineQuery, Typeahead) {
    var $form, form, mockSubmit;

    var statesArray = [{
        value: 'AL',
        label: 'Alabama'
    }, {
        value: 'AK',
        label: 'Alaska'
    }, {
        value: 'AZ',
        label: 'Arizona'
    }, {
        value: 'AR',
        label: 'Arkansas'
    }, {
        value: 'CA',
        label: 'California'
    }, {
        value: 'MD',
        label: 'Maryland'
    }, {
        value: 'MA',
        label: 'Massachusetts'
    }, {
        value: 'MI',
        label: 'Michigan'
    }, {
        value: 'VA',
        label: 'Virginia'
    }, {
        value: 'WA',
        label: 'Washington'
    }];

    var statesArrayReduced = [{
        value: 'AL',
        label: 'Alabama'
    }, {
        value: 'AK',
        label: 'Alaska'
    }, {
        value: 'AZ',
        label: 'Arizona'
    }];

    var statesCollection = new Backbone.Collection(statesArray);

    var statesCollectionWithCustomAttributeMapping = new Backbone.Collection([{
        code: 'AL',
        description: 'Alabama'
    }, {
        code: 'AK',
        description: 'Alaska'
    }, {
        code: 'AZ',
        description: 'Arizona'
    }, {
        code: 'AR',
        description: 'Arkansas'
    }, {
        code: 'CA',
        description: 'California'
    }, {
        code: 'MD',
        description: 'Maryland'
    }, {
        code: 'MA',
        description: 'Massachusetts'
    }, {
        code: 'MI',
        description: 'Michigan'
    }, {
        code: 'VA',
        description: 'Virginia'
    }, {
        code: 'WA',
        description: 'Washington'
    }]);

    var typeAheadControlDefinitionBasic = {
        name: 'typeAhead1',
        label: 'typeaheadValue',
        control: 'typeahead',
        pickList: statesCollection,
        placeholder: 'Search',
        title: 'This is a typeahead',
        showFilter: true
    };

    var typeAheadControlDefinitionBasicSrOnlyLabel = {
        name: 'typeAhead1',
        label: 'typeaheadValue',
        control: 'typeahead',
        pickList: statesCollection,
        placeholder: 'Search',
        title: 'This is a typeahead',
        srOnlyLabel: true
    };

    var typeAheadControlDefinitionWithCustomAttributeMapping = _.defaults({
        name: 'typeAhead2',
        pickList: statesCollectionWithCustomAttributeMapping,
        attributeMapping: {
            label: 'description',
            value: 'code'
        }
    }, typeAheadControlDefinitionBasic);


    var typeAheadControlDefinitionWithArray = _.defaults({
        name: 'typeAhead3',
        pickList: statesArray
    }, typeAheadControlDefinitionBasic);

    var typeAheadControlDefinitionWithExtraClasses = _.defaults({
        name: 'typeAhead4',
        label: 'typeahead (with extra classes)',
        extraClasses: ['special-class-1', 'special-class-2']
    }, typeAheadControlDefinitionBasic);

    var typeAheadControlDefinitionDiabled = _.defaults({
        name: 'typeAhead5',
        label: 'typeahead (disabled)',
        disabled: true
    }, typeAheadControlDefinitionBasic);

    var typeAheadControlDefinitionRequired = _.defaults({
        name: 'typeAhead6',
        label: 'typeahead (disabled)',
        required: true
    }, typeAheadControlDefinitionBasic);

    var typeAheadControlDefinitionReadonly = _.defaults({
        name: 'typeAhead7',
        label: 'typeahead (disabled)',
        readonly: true
    }, typeAheadControlDefinitionBasic);

    var typeAheadControlDefinitionHelpMessage = _.defaults({
        name: 'typeAhead8',
        label: 'typeahead (disabled)',
        helpMessage: 'This is a help message.'
    }, typeAheadControlDefinitionBasic);

    var formModelWithInitialDate = new Backbone.Model({
        typeAhead1: 'MD'
    });

    var formModelCleanSlate = new Backbone.Model();

    describe('A typeahead', function() {
        afterEach(function() {
            form.remove();
        });

        describe('basic', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionBasic]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains an input field', function() {
                expect($form.find('input').length).toBe(1);
            });

            it('contains a twitter typeahead css classes', function() {
                expect($form.find('span.twitter-typeahead').length).toBe(1);
                expect($form.find('span.tt-dropdown-menu').length).toBe(1);
                expect($form.find('div.tt-dataset-value').length).toBe(1);
            });

            it('contains a title on the input field', function() {
                expect($form.find('input').attr('title')).toBe('This is a typeahead');
            });

            it('open and close typeahead suggestion', function() {
                $form.find('#typeAhead1').focus();
                $form.find('#typeAhead1').typeahead('val', 'Ma');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(3);

                $form.find('#typeAhead1').blur();
                expect($form.find('span.tt-dropdown-menu')).toBeHidden();
            });

            it('contains correct wrapper', function() {
                expect($form.find('.control').length).toBe(1);
            });

            it('contains correct label', function() {
                expect($form.find('label').length).toBe(1);
                expect($form.find('label')).toHaveText('typeaheadValue');
                expect($form.find('label')).toHaveAttr('for', 'typeAhead1');
            });

            it('change a label', function() {
                expect($form.find('label').length).toBe(1);
                expect($form.find('label')).toHaveText('typeaheadValue');
                $form.find('#typeAhead1').trigger('control:label', ['typeaheadValue2']);
                expect($form.find('label')).toHaveText('typeaheadValue2');
            });

            it('contains correct title', function() {
                expect($form.find('input').length).toBe(1);
                expect($form.find('input')).toHaveAttr('title', 'This is a typeahead');
            });
        });

        describe('custom attribute mapping', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionWithCustomAttributeMapping]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains an input field', function() {
                expect($form.find('input').length).toBe(1);
            });

            it('contains a twitter typeahead css classes', function() {
                expect($form.find('span.twitter-typeahead').length).toBe(1);
                expect($form.find('span.tt-dropdown-menu').length).toBe(1);
            });

            it('contains a title on the input field', function() {
                expect($form.find('input').attr('title')).toBe('This is a typeahead');
            });

            it('open and close typeahead suggestion', function() {
                $form.find('#typeAhead2').focus();
                $form.find('#typeAhead2').typeahead('val', 'Ma');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(3);

                $form.find('#typeAhead2').blur();
                expect($form.find('span.tt-dropdown-menu')).toBeHidden();
            });

            it('contains correct wrapper', function() {
                expect($form.find('.control').length).toBe(1);
            });

            it('contains correct label', function() {
                expect($form.find('label').length).toBe(1);
                expect($form.find('label')).toHaveText('typeaheadValue');
                expect($form.find('label')).toHaveAttr('for', 'typeAhead2');
            });

            it('contains correct title', function() {
                expect($form.find('input').length).toBe(1);
                expect($form.find('input')).toHaveAttr('title', 'This is a typeahead');
            });
        });

        describe('array', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionWithArray]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains an input field', function() {
                expect($form.find('input').length).toBe(1);
            });

            it('contains a twitter typeahead css classes', function() {
                expect($form.find('span.twitter-typeahead').length).toBe(1);
                expect($form.find('span.tt-dropdown-menu').length).toBe(1);
                expect($form.find('div.tt-dataset-value').length).toBe(1);
            });

            it('contains a title on the input field', function() {
                expect($form.find('input').attr('title')).toBe('This is a typeahead');
            });

            it('open and close typeahead suggestion', function() {
                $form.find('#typeAhead3').focus();
                $form.find('#typeAhead3').typeahead('val', 'Ma');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(3);

                $form.find('#typeAhead3').blur();
                expect($form.find('span.tt-dropdown-menu')).toBeHidden();
            });

            it('contains correct wrapper', function() {
                expect($form.find('.control').length).toBe(1);
            });

            it('contains correct label', function() {
                expect($form.find('label').length).toBe(1);
                expect($form.find('label')).toHaveText('typeaheadValue');
                expect($form.find('label')).toHaveAttr('for', 'typeAhead3');
            });

            it('contains correct title', function() {
                expect($form.find('input').length).toBe(1);
                expect($form.find('input')).toHaveAttr('title', 'This is a typeahead');
            });
        });

        describe('with extra classes', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionWithExtraClasses]
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
                    fields: [typeAheadControlDefinitionDiabled]
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
                    fields: [typeAheadControlDefinitionRequired]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct attribute', function() {
                expect($form.find('#typeAhead6')).toHaveAttr('required', 'required');
            });
        });

        describe('readonly', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionReadonly]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct attribute', function() {
                expect($form.find('input')).toHaveAttr('readonly', 'readonly');
            });
        });

        describe('with initial value', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelWithInitialDate,
                    fields: [typeAheadControlDefinitionBasic]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('puts a correct initial selection value', function() {

                expect(_.isEqual($form.find('#typeAhead1').typeahead('val'), 'Maryland')).toBe(true);

            });
        });

        describe('with help message', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionHelpMessage]
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

        describe('field name change notification', function() {
            var formTestModel = new Backbone.Model({
                typeAhead1: 'MD'
            });

            beforeEach(function() {
                form = new UI.Form({
                    model: formTestModel,
                    fields: [typeAheadControlDefinitionBasic]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('listen to model change', function() {
                var testIndex = 1;
                formTestModel.set('typeAhead1', 'VA');
                expect($form.find('#typeAhead1').val()).toBe('Virginia');
            });
        });

        describe('replace picklist', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionWithArray]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('has a correct number of matching list', function() {
                $form.find('#typeAhead3').focus();
                $form.find('#typeAhead3').typeahead('val', 'A');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(10);
            });

            it('is replaced with new picklist by calling api', function() {
                form.callControlFunction({
                    controlType: 'typeahead',
                    controlName: 'typeAhead3',
                    functionName: 'setPickList',
                    options: {
                        pickList: statesArrayReduced
                    }
                });

                $form.find('#typeAhead3').focus();
                $form.find('#typeAhead3').typeahead('val', 'A');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(3);
            });

            it('is replaced with new picklist by triggering an event', function() {
                $form.find('#typeAhead3').trigger('control:picklist:set', [statesArrayReduced]);

                $form.find('#typeAhead3').focus();
                $form.find('#typeAhead3').typeahead('val', 'A');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(3);
            });
        });
        describe('basic', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionBasicSrOnlyLabel]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct label with sr-only label', function() {
                expect($form.find('label').length).toBe(1);
                expect($form.find('label')).toHaveText('typeaheadValue');
                expect($form.find('label')).toHaveAttr('for', 'typeAhead1');
                expect($form.find('label')).toHaveClass('sr-only');
            });
        });
        describe("using trigger to dynamically change attributes", function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionBasic]
                });
                $form = form.render().$el;
                $("body").append($form);
            });

            it("required", function() {
                $form.find('.typeAhead1').trigger("control:required", true);
                expect($form.find('.tt-input')).toHaveAttr('required');
                $form.find('.typeAhead1').trigger("control:required", false);
                expect($form.find('.tt-input')).not.toHaveAttr('required');
            });
            it("disabled", function() {
                $form.find('.typeAhead1').trigger("control:disabled", true);
                expect($form.find('input')).toHaveAttr('disabled');
                $form.find('.typeAhead1').trigger("control:disabled", false);
                expect($form.find('input')).not.toHaveAttr('disabled');
            });
            it("label", function() {
                $form.find('.typeAhead1').trigger("control:label", 'newLabel');
                expect($form.find('label')).toHaveText('newLabel');
                $form.find('.typeAhead1').trigger("control:label", '');
                expect($form.find('label')).not.toHaveText('newLabel');
            });
            it("picklist", function() {
                $form.find('#typeAhead1').focus();
                $form.find('#typeAhead1').typeahead('val', 'A');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(10);
                $form.find('.typeAhead1').trigger("control:picklist:set", statesArrayReduced);
                $form.find('#typeAhead1').focus();
                $form.find('#typeAhead1').typeahead('val', 'A');
                expect($form.find('span.tt-dropdown-menu')).toBeVisible();
                expect($form.find('div.tt-suggestion').length).toBe(1);
            });
        });
        describe("with error", function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [typeAheadControlDefinitionBasic]
                });
                $form = form.render().$el;
                $("body").append($form);
            });
            it("contains error", function() {
                form.model.errorModel.set('typeAhead1', 'Example error');
                expect($form.find('span.error')).toExist();
                expect($form.find('span.error')).toHaveText('Example error');
            });
            it("error is removed", function() {
                expect($form.find('span.error')).toHaveText('Example error');
                $form.find('#typeAhead1').typeahead('val', "VA").trigger('change');
                expect($form.find('span.error')).not.toExist();
            });
        });
    });
});