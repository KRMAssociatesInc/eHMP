define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addVitals/templates/dateTimeRegionTemplate',
    'app/applets/addVitals/utils/modelUtils',
    'app/applets/addVitals/utils/dateTimeUtil',
    'app/applets/addVitals/utils/viewHelper',
    'moment'
], function(Backbone, Marionette, _, dateTimeTemplate, modelUtils, DateUtil, viewHelper, Moment) {
    'use strict';

    var util = modelUtils;
    var dateUtil = DateUtil;
    var helper = viewHelper;
    var currField;

    return Backbone.Marionette.ItemView.extend({
        tagName: 'div',
        template: dateTimeTemplate,

        events: {
            'click #patient-on-pass-btn': 'handleClick',
            'blur #vitals-obs-date': 'dateEntered',
            'blur #vitals-obs-time': 'timeEntered',
            'change #vitals-obs-date': 'dateFieldChanged',
        },

        initialize: function() {
            this.model.on('change:on-pass', this.togglePoP, this);
            this.model.on('change:date-time-error', this.dateTimeErrorChange, this);
        },


        onRender: function() {
            var dateString = dateUtil.currentObservedDateString();
            var timeString = dateUtil.currentObservedTimeString();
            this.model.setDate(dateString);
            this.model.setTime(timeString);
            var that = this;
            setTimeout(function() {
                var obsDate = $('#vitals-obs-date'),
                    toEnd = new Moment().format(ADK.utils.dateUtils.defaultOptions().endDate);

                ADK.utils.dateUtils.datepicker(obsDate, {
                    'endDate': toEnd
                });
                obsDate.datepicker('update', toEnd);

                obsDate.datepicker().on('changeDate', function(ev) {
                    that.model.setDate(dateUtil.getDateString(ev.date));
                });
                obsDate.parent().find('.glyphicon-calendar').on('click', function() {
                    obsDate.datepicker('show');
                });

                $('#vitals-obs-time').inputmask('Regex', {
                    'placeholder': 'hh:mm a/p'
                });

                $('#vitals-obs-time').val(timeString);
            }, 100);

        },

        dateFieldChanged: function() {
            currField = 'date';
            var newVal = $('#vitals-obs-date').val();
            if (!newVal) {
                $('#vitals-obs-date').val(this.model.getDate());
            } else {
                this.model.setDate(newVal);
            }
        },

        dateEntered: function() {
            currField = 'date';
            var newVal = $('#vitals-obs-date').val();
            if (!newVal) {
                $('#vitals-obs-date').val(this.model.getDate());
            } else {
                this.model.setDate(newVal);
            }
        },

        timeEntered: function() {
            currField = 'time';
            this.model.setTime($('#vitals-obs-time').val());
        },

        dateTimeErrorChange: function() {
            var err = this.model.getDateTimeError();
            var field = currField === 'date' ? $('#vitals-date-err') : $('#vitals-time-err');
            if (err) {
                //$('#vitals-date-time-err').css('display', 'inline');
                //$('#vitals-date-time-err').text(err);
                field.attr('aria-hidden', 'false');
                field.text(err);
                $('#patient-on-pass-btn').prop('disabled', true);
            } else {
                //$('#vitals-date-time-err').css('display', 'none');
                //$('#vitals-date-time-err').text("");
                field.attr('aria-hidden', 'true');
                field.text('');
                $('#patient-on-pass-btn').prop('disabled', false);
            }
        },

        enablePoP: function() {
            $('#patient-on-pass-btn').prop('disabled', !this.model.hasValidDateTime());
        },

        togglePoP: function() {
            helper.selectBtn($('#patient-on-pass-btn'), this.model.get('on-pass'));

        },

        handleClick: function(evt) {
            evt.preventDefault();
            this.model.toggleOnPass();
        }
    });
});
