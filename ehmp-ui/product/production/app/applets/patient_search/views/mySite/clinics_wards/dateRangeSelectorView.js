define([
    'jquery',
    'jquery.inputmask',
    'bootstrap-datepicker',
    'moment',
    'backbone',
    'marionette',
    'underscore',
    "hbs!app/applets/patient_search/templates/mySite/clinics_wards/dateRangeSelectorTemplate"
], function($, InputMask, DatePicker, moment, Backbone, Marionette, _, dateRangeSelectorTemplate) {

    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            fromDate: moment().format('YYYYMMDD'),
            toDate: moment().format('YYYYMMDD')
        }
    });

    var FilterDateRangeView = Backbone.Marionette.ItemView.extend({
        model: new DateRangeModel(),
        template: dateRangeSelectorTemplate,
        className: 'grid-filter-daterange',
        events: {
            'click button': 'clickPresetRange',
            'keydown button': 'handleEnterOrSpaceBar'
        },
        initialize: function(options){
            this.parent = options.parent;
        },
        setDefaultDateRangeFilter: function(setInitialDateRange) {
            if (setInitialDateRange == '1yr') {
                this.$el.find('button#1yr-range-global').click();
            }
        },
        handleEnterOrSpaceBar: function(event) {
            var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;

            if (keyCode == 13 || keyCode == 32) {
                var targetElement = this.$el.find('#' + event.currentTarget.id);
                targetElement.focus();
                targetElement.trigger('click');
            }
        },
        clickPresetRange: function(event) {
            this.$el.find('button').removeClass('active-range');

            this.$el.find('#' + event.currentTarget.id).addClass('active-range');
            var fromDate;
            var toDate = moment().format('YYYYMMDD');

            switch (event.currentTarget.id) {
                case 'past-month-clinicDate':
                    fromDate = moment().subtract('months', 1).format('YYYYMMDD');
                    break;
                case 'past-week-clinicDate':
                    fromDate = moment().subtract('days', 7).format('YYYYMMDD');
                    break;
                case 'yesterday-clinicDate':
                    fromDate = moment().subtract('days', 1).format('YYYYMMDD');
                    break;
                case 'today-clinicDate':
                    fromDate = moment().format('YYYYMMDD');
                    break;
                case 'tomorrow-clinicDate':
                    fromDate = moment().format('YYYYMMDD');
                    toDate = moment().add('days', 1).format('YYYYMMDD');
                    break;
                case 'next-week-clinicDate':
                    fromDate = moment().format('YYYYMMDD');
                    toDate = moment().add('days', 7).format('YYYYMMDD');
                    break;
                default:
                    break;
            }
            this.setDateRange(fromDate, toDate);
            if (this.parent.selectedLocationModel) {
                var criteria = {
                    "refId": this.parent.selectedLocationModel.attributes.refId,
                    "locationUid": this.parent.selectedLocationModel.attributes.uid
                };
                this.parent.executeSearch(criteria);
            }
        },
        setDateRange: function(fromDate, toDate) {
            this.model.set({
                fromDate: fromDate,
                toDate: toDate
            });
        },
        onRender: function(event) {

        }
    });

    return FilterDateRangeView;
});
