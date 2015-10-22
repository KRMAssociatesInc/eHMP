define([
    'backbone',
    'puppetForm',
    'handlebars',
    'nouislider'
], function(Backbone, PuppetForm, Handlebars, NoUiSlider) {
    'use strict';

    var RangeSliderControlPrototype = {
        defaults: {
            type: "number",
            label: "",
            sliderTitle: "",
            maxlength: 2,
            extraClasses: [],
            min: 0,
            max: 10,
            step: 1,
            density: 10,
            decimals: 0,
            stepPrefix: '',
            stepPostfix: '',
            filter: function(value, type) {
                return 1;
            }
        },
        template: Handlebars.compile([
            '{{#if sliderTitle}}{{sliderTitle}}{{/if}}' +
            '<div id="{{#if id}}{{clean-for-id id}}{{else}}{{clean-for-id name}}{{/if}}" class="range-slider"></div>',
            '<label for="range-slider-input" class="sr-only">{{#if label}}{{label}}{{else}}Enter in the level using the slider or input.{{/if}}</label>',
            '<input type="number" id="range-slider-input" value="{{value}}" name="{{name}}" class="range-value-input form-control input-sm" ' +
            'maxlength="{{maxlength}}" min="{{min}}" max="{{max}}" step="{{step}}" {{#if required}} required{{/if}}/>'
        ].join('\n')),
        events: _.defaults({
            'change @ui.RangeSlider': 'onChange',
            'change @ui.RangeSliderInput': 'onChange',
            'focus @ui.RangeSliderInput': 'clearInvalid'
        }, PuppetForm.CommonPrototype.events),
        ui: {
            'RangeSlider': '.range-slider',
            'RangeSliderInput': '.range-value-input'
        },
        initialize: function(options) {
            this.initOptions(options);
            this.setFormatter();
            this.listenToFieldName();
            this.listenToFieldOptions();
            this.setExtraClasses();
            // if the range is not divided by the step size, set the step equal to 1
            if (((this.field.get('max') || this.defaults.max) - (this.field.get('min') || this.defaults.min)) % (this.field.get('step') || this.defaults.step) > 0) {
                this.field.set('step', 1);
            }
            // set max length dynamically
            if (!this.field.get('maxlength')) {
                var numberOfDigits = Math.floor(Math.log(this.field.get('max') || this.defaults.max) / Math.LN10 + 1);
                this.field.set('maxlength', numberOfDigits + ((this.field.get('decimals') || this.defaults.decimals) > 0 ? (this.field.get('decimals') || this.defaults.decimals) + 1 : 0));
            }
        },
        commonOnRender: PuppetForm.CommonPrototype.onRender,
        onRender: function() {
            this.commonOnRender();
            this.initSlider();
        },
        initSlider: function() {
            var self = this;
            var slider = this.ui.RangeSlider;

            slider.noUiSlider({
                start: this.serializeModel(this.model).value || 0,
                step: this.field.get('step') || this.defaults.step,
                range: {
                    min: this.field.get('min') || this.defaults.min,
                    max: this.field.get('max') || this.defaults.max
                },
                format: wNumb({
                    decimals: this.field.get('decimals') || 0
                })
            }, this);
            // this can be used to create the pip values using the 'values' mode
            var getSliderValues = function(element) {
                var values = [];
                var options = element.noUiSlider('options');
                for (var i = options.range.min; i <= options.range.max; i += options.step) {
                    values.push(i);
                }
                if (!_.contains(values, options.range.max)) {
                    values.push(options.range.max);
                }
                return values;
            };
            slider.noUiSlider_pips({
                mode: 'steps',
                // values: getSliderValues(slider),
                density: this.field.get('density') || this.defaults.density,
                filter: this.field.get('filter') || this.defaults.filter,
                format: wNumb({
                    decimals: this.field.get('decimals') || this.defaults.decimals,
                    prefix: this.field.get('stepPrefix') || this.defaults.stepPrefix,
                    postfix: this.field.get('stepPostfix') || this.defaults.stepPostfix
                })
            });
            slider.Link('lower').to(this.ui.RangeSliderInput, null, wNumb({
                decimals: this.field.get('decimals') || this.defaults.decimals
            }));
        },
        className: function() {
            return PuppetForm.CommonPrototype.className() + ' form-group-slider';
        }
    };

    var RangeSliderControl = PuppetForm.RangeSliderControl = PuppetForm.DefaultInputControl.extend(
        _.defaults(RangeSliderControlPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return RangeSliderControl;
});
