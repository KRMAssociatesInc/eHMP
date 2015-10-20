define([
    'backbone',
    'puppetForm',
    'handlebars',
    'main/adk_utils/dateUtils',
    'underscore',
    'moment',
    'jquery',
    'jquery.inputmask',
    'bootstrap-datepicker'
], function(Backbone, PuppetForm, Handlebars, DateUtils,_, Moment, $, InputMask, DatePicker) {
    'use strict';

    var DatepickerControl = PuppetForm.DatepickerControl = PuppetForm.DefaultInputControl.extend({
        defaults: {
            type: 'text',
            label: '',
            options: {
                todayBtn: 'linked',
                orientation: 'top left',
                autoclose: true,
                todayHighlight: true,
                showOnFocus: false,
                endDate: '12/31/2099'
            },
            extraClasses: [],
            helpMessage: '',
            title: 'Please enter in a date in the following format, MM/DD/YYYY'
        },
        template: Handlebars.compile([
            '{{ui-form-label (add-required-indicator label required) forID=(clean-for-id name) classes=(is-sr-only-label srOnlyLabel)}}',
            '<div id="{{clean-for-id name}}-calendar-container" class="input-group date">',
                '<span class="input-group-addon" aria-hidden="true" for="{{clean-for-id name}}"><i class="fa fa-calendar"></i></span>',
                '<input type="{{type}}" id="{{clean-for-id name}}" name="{{name}}" maxlength="{{maxlength}}" value="{{value}}"' +
                    ' class="{{PuppetForm "controlClassName"}}"' +
                    ' id="{{clean-for-id name}}" name="{{name}}" maxlength="{{maxlength}}" value="{{value}}"' +
                    '{{#if title}} title="{{title}}"{{/if}}' +
                    '{{#if placeholder}} placeholder="{{placeholder}}"{{/if}}' +
                    '{{#if disabled}} disabled{{/if}}' +
                    '{{#if required}} required{{/if}}' +
                    '{{#if readonly}} readonly{{/if}}/>',
            '</div>',
            '{{#if helpMessage}} <span {{#if (has-puppetForm-prop "helpMessageClassName")}}class="{{PuppetForm "helpMessageClassName"}}"{{/if}}>{{helpMessage}}</span>{{/if}}'
        ].join("\n")),
        events: _.defaults({
                //Events to be Triggered By User
                'control:required': function(event, booleanValue) {
                    this.setBooleanFieldOption('required', booleanValue, event);
                },
                'control:disabled': function(event, booleanValue) {
                    this.setBooleanFieldOption('disabled', booleanValue, event);
                },
                'control:title': function(event, stringValue) {
                    this.setStringFieldOption('title', stringValue, event);
                },
                'control:placeholder': function(event, stringValue) {
                    this.setStringFieldOption('placeholder', stringValue, event);
                },
                'control:helpMessage': function(event, stringValue) {
                    this.setStringFieldOption('helpMessage', stringValue, event);
                },
                'click .input-group-addon': function (event) {
                    this.$('input').datepicker('show');
                },
                'change input': function (event) {
                    var newVal = this.getValueFromDOM();
                    if (this.currVal === newVal) {
                        event.stopPropagation();
                    } else {
                        this.currVal = newVal;
                        PuppetForm.DefaultInputControl.prototype.onChange.call(this, event);
                    }
                }
            },
            PuppetForm.DefaultInputControl.prototype.events),
        render: function() {
            PuppetForm.DefaultInputControl.prototype.render.apply(this, arguments);

            var customOptions = this.field.get('options') || {};
            customOptions.container = '#' + this.field.get('name') + '-calendar-container';
            customOptions = _.defaults(customOptions, this.defaults.options);

            //var self = this;
            //var eventOptions = [
            //    {
            //        type: 'show',
            //        handler: function(e) {
            //            var calendarIconWidth = self.$('.input-group-addon').css('width');
            //            console.log('calendarIconWidth', calendarIconWidth);
            //            self.$('div.datepicker').css('left', calendarIconWidth);
            //        }
            //    }
            //];
            //DateUtils.datepicker(this.$('input'), customOptions, eventOptions);

            DateUtils.datepicker(this.$('input'), customOptions);

            this.currVal = this.getValueFromDOM();

            return this;
        },
        getValueFromDOM: function() {
            var value = this.$el.find('#' + this.field.get('name')).val();
            return value;
        }
    });

    return DatepickerControl;
});