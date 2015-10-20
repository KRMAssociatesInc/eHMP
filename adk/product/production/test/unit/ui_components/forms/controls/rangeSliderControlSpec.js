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

    var rangeSliderControlDefinition = {
        control: "rangeSlider",
        name: "rangeValue"
            // density: 10,
            // decimals: 0
    };

    var formModel = new Backbone.Model();

    describe('A rangeSlider', function() {
        afterEach(function() {
            form.remove();
        });

        describe('basic', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [rangeSliderControlDefinition]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains an input field', function() {
                expect($form.find('input').length).toBe(1);
            });

            it('defaults value to min if initial value not set', function() {
                expect($form.find('input')).toHaveValue(form.fields.get('min') || '0');
            });

            it('has min default correctly if min is not specified', function() {
                expect($form.find('input')).toHaveAttr('min', '0');
            });

            it('has max default correctly if max is not specified', function() {
                expect($form.find('input')).toHaveAttr('max', '10');
            });

            it('has maxlength correctly configured', function() {
                expect($form.find('input')).toHaveAttr('maxlength', '2');
            });

            it('has the slider correctly positioned with no initial value', function() {
                // the slider is moved along the range using css left: % of width
                // slider should start at the min value if not initial value
                // the "start" property on the slider library determines the default start value
                expect($form.find('.noUi-origin')[0].style['left']).toBe('0%');
            });

            it('sets value in model when input is changed', function() {
                $form.find('input').val('5');
                $form.find('input').trigger('change');
                expect(form.model).toBe(formModel);
                expect(form.model.get('rangeValue')).toBe('5');
                expect($form.find('.noUi-origin')[0].style['left']).toBe('50%');
                // only unset if not doing it elsewhere
                form.model.unset('rangeValue');
            });

        });
        describe('with initial value', function() {
            beforeEach(function() {
                formModel.set('rangeValue', 3);
                form = new UI.Form({
                    model: formModel,
                    fields: [rangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('starts with a correct initial range value', function() {
                // cannot be .toHaveValue because .val returns a string and the model
                // value could be an int
                expect(parseInt($form.find('input').val())).toBe(form.model.get('rangeValue'));
            });

            it('has the slider correctly positioned', function() {
                // the slider is moved along the range using css left: % of width
                expect($form.find('.noUi-origin')[0].style['left']).toBe('30%');
            });
        });

        describe('with extra classes', function() {
            var extraClassesRangeSliderControlDefinition = {
                control: "rangeSlider",
                name: "rangeValue",
                extraClasses: ["special-class-1", "special-class-2"]
            };
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [extraClassesRangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct classes', function() {
                expect($form.find('.form-group')).toHaveClass('special-class-1');
                expect($form.find('.form-group')).toHaveClass('special-class-2');
            });

            it('input does not have the same classes', function() {
                expect($form.find('input')).not.toHaveClass('special-class-1');
                expect($form.find('input')).not.toHaveClass('special-class-2');
            });
        });

        describe('with id, title, and label specified in config', function() {
            var iDTitleLabelRangeSliderControlDefinition = {
                control: "rangeSlider",
                name: "rangeValue",
                sliderTitle: 'Example Range Slider',
                id: "exampleSlider",
                label: "This example slider"
            };
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [iDTitleLabelRangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct id', function() {
                expect($form.find('.range-slider')).toHaveId(iDTitleLabelRangeSliderControlDefinition.id);
            });

            it('has correct title', function() {
                expect($form.find('.form-group').text()).toContain(iDTitleLabelRangeSliderControlDefinition.sliderTitle);
            });

            it('has correct label', function() {
                expect($form.find('.control label')).toHaveText(iDTitleLabelRangeSliderControlDefinition.label);
            });
        });

        describe('with min, max, and step specified in config', function() {
            var minMaxStepRangeSliderControlDefinition = {
                control: "rangeSlider",
                name: "rangeValue",
                min: 0,
                max: 100,
                step: 1
            };
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [minMaxStepRangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct min value on input', function() {
                expect($form.find('input')).toHaveAttr('min', String(minMaxStepRangeSliderControlDefinition.min));
            });

            it('has correct max value on input', function() {
                expect($form.find('input')).toHaveAttr('max', String(minMaxStepRangeSliderControlDefinition.max));
            });

            it('has correct step value on input', function() {
                expect($form.find('input')).toHaveAttr('step', String(minMaxStepRangeSliderControlDefinition.step));
            });

            it('has maxlength correctly configured', function() {
                expect($form.find('input')).toHaveAttr('maxlength', '3');
            });
        });

        describe('with step not dividing evenly into range', function() {
            var unevenStepRangeSliderControlDefinition = {
                control: "rangeSlider",
                name: "rangeValue",
                min: 0,
                max: 10,
                step: 3
            };
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [unevenStepRangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('step defaults to 1', function() {
                expect($form.find('input')).toHaveAttr('step', '1');
            });
        });

        describe('with decimal specified in config', function() {
            var decimalRangeSliderControlDefinition = {
                control: "rangeSlider",
                name: "rangeValue",
                min: 0,
                max: 10,
                decimals: 2
            };
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [decimalRangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has maxlength correctly configured', function() {
                expect($form.find('input').attr('maxlength')).toBe('5');
            });
        });

        describe('with decimal specified in config', function() {
            var decimalRangeSliderControlDefinition = {
                control: "rangeSlider",
                name: "rangeValue",
                min: 0,
                max: 10,
                decimals: 2
            };
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [decimalRangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has maxlength correctly configured', function() {
                expect($form.find('input').attr('maxlength')).toBe('5');
            });
        });

        describe('required', function() {
            var requiredRangeSliderControlDefinition = {
                control: "rangeSlider",
                name: "rangeValue",
                required: true
            };
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [requiredRangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct attribute', function() {
                expect($form.find('input')).toHaveAttr('required');
            });
        });
        describe("using trigger to dynamically change attributes", function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [rangeSliderControlDefinition]
                });
                $form = form.render().$el;
                $("body").append($form);
            });

            it("hidden", function() {
                $form.find('.rangeValue').trigger("control:hidden", true);
                expect($form.find('.rangeValue')).toHaveClass('hidden');
                $form.find('.rangeValue').trigger("control:hidden", false);
                expect($form.find('.rangeVale')).not.toHaveClass('hidden');
            });
        });
    });
});
