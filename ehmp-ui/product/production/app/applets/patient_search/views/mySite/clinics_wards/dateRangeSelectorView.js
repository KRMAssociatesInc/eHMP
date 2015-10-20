define([
    'jquery', 
    'jquery.inputmask', 
    'bootstrap-datepicker', 
    'moment', 
    'backbone', 
    'marionette', 
    'underscore', 
    'hbs!app/applets/patient_search/templates/mySite/clinics_wards/dateRangeSelectorTemplate'
], function($, InputMask, DatePicker, moment, Backbone, Marionette, _, dateRangeSelectorTemplate) {
    var dateFormat = 'YYYYMMDD';
    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            'date.start': moment().format('YYYYMMDD'),
            'date.end': moment().format('YYYYMMDD')
        }
    });
    var FilterDateRangeView = Backbone.Marionette.ItemView.extend({
        fetchOptions: {},
        model: new DateRangeModel(),
        template: dateRangeSelectorTemplate,
        className: 'grid-filter-daterange',
        events: {
            'click button': 'clickPresetRange',
            'keydown input': 'handleEnterOrSpaceBar',
            'change input': 'monitorCustomDateRange'
        },
        initialize: function(options) {
            this.parent = options.parent;
        },
        monitorCustomDateRange: function(event) {
            var start = moment(this.$el.find('#filter-from-date-clinic').val(), 'MM/DD/YYYY', true);
            var end = moment(this.$el.find('#filter-to-date-clinic').val(), 'MM/DD/YYYY', true);
            if (start.isValid() && end.isValid() && start.isBefore(end)) {
                this.model.set('date.start', start.format(dateFormat));
                this.model.set('date.end', end.format(dateFormat));
                this.$el.find('#custom-range-apply').removeAttr('disabled');
            } else {
                this.$el.find('#custom-range-apply').prop('disabled', true);
            }
        },
        isCustomDateRangeValid: function() {
            var hasCustomRangeValuesBeenSetCorrectly = false;
            var customFromDate = this.$el.find('#filter-from-date-clinic').val();
            var customToDate = this.$el.find('#filter-to-date-clinic').val();
            var start =  moment(customFromDate, 'MM/DD/YYYY', true);
            var end = moment(customToDate, 'MM/DD/YYYY', true);
            if (start.isValid()) {
                if (end.isValid()) {
                    if (start.isBefore(end)) {
                        this.model.set('date.start', moment(customFromDate, 'MM/DD/YYYY').format(dateFormat));
                        this.model.set('date.end', moment(customToDate,'MM/DD/YYYY').format(dateFormat));
                        hasCustomRangeValuesBeenSetCorrectly = true;
                    }
                }
            }
            return hasCustomRangeValuesBeenSetCorrectly;
        },
        handleEnterOrSpaceBar: function(event) {
            var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;
            var spacebar = 13;
            var returnKey = 32;
            if (keyCode !== spacebar && keyCode !== returnKey) {
                $("[id^=custom-date-]").datepicker('hide');
            }
            if (keyCode == spacebar || keyCode == returnKey) {
                var targetElement = this.$el.find('#' + event.currentTarget.id);
                targetElement.focus();
                targetElement.trigger('click');
            }
        },
        clickPresetRange: function(event) {
            this.$el.find('button').removeClass('active-range');
            this.$el.find('#' + event.currentTarget.id).addClass('active-range');
            var fromDate;
            var toDate;
            var now = moment().format(dateFormat);
            if (event.currentTarget.id.indexOf('-clinicDate') !== -1 && event.currentTarget.id.indexOf('custom-range-apply') === -1) {
                this.$el.find('#filter-from-date-clinic').val('');
                this.$el.find('#filter-to-date-clinic').val('');
                this.$el.find('#custom-range-apply').prop('disabled', true);
            }
            switch (event.currentTarget.id) {
                case 'past-month-clinicDate':
                    fromDate = moment().subtract('months', 1).format(dateFormat);
                    toDate = now;
                    break;
                case 'past-week-clinicDate':
                    fromDate = moment().subtract('days', 7).format(dateFormat);
                    toDate = now;
                    break;
                case 'yesterday-clinicDate':
                    fromDate = moment().subtract('days', 1).format(dateFormat);
                    toDate = now;
                    break;
                case 'today-clinicDate':
                    fromDate = now;
                    toDate = now;
                    break;
                case 'tomorrow-clinicDate':
                    fromDate = now;
                    toDate = moment().add('days', 1).format(dateFormat);
                    break;
                case 'next-week-clinicDate':
                    fromDate = now;
                    toDate = moment().add('days', 7).format(dateFormat);
                    break;
                default:
                    fromDate = this.model.get('date.start');
                    toDate = this.model.get('date.end');
                    break;
            }
            this.setDateRange(fromDate, toDate);
            if (this.parent.selectedLocationModel) {
                var criteria = {
                    "ref.id": this.parent.selectedLocationModel.attributes.refId,
                    "uid": this.parent.selectedLocationModel.attributes.uid
                };
                this.parent.executeSearch(criteria);
            }
        },
        setDateRange: function(fromDate, toDate) {
            this.model.set({
                'date.start': fromDate,
                'date.end': toDate
            });
        },
        setDatePickers: function(fromDate, toDate) {
            this.$('.input-group.date#custom-date-from-clinic').datepicker({
                format: 'mm/dd/yyyy'
            }).on('changeDate', function(ev) {
                $(this).datepicker('hide');
                $($(this).context.lastElementChild).focus();
            });
            if (fromDate !== null) {
                this.$('.input-group.date#custom-date-from-clinic').datepicker('update', fromDate);
            }
            this.$('.input-group.date#custom-date-to-clinic').datepicker({
                format: 'mm/dd/yyyy'
            }).on('changeDate', function(ev) {
                $(this).datepicker('hide');
                $($(this).context.lastElementChild).focus();
            });
            if (toDate !== null) {
                this.$('.input-group.date#custom-date-to-clinic').datepicker('update', toDate);
            }
            this.$('#filter-from-date-clinic').datepicker('remove');
            this.$('#filter-to-date-clinic').datepicker('remove');
        },
        onRender: function(event) {
            this.$('#filter-from-date-clinic').inputmask('m/d/y', {
                'placeholder': 'MM/DD/YYYY'
            });
            this.$('#filter-to-date-clinic').inputmask('m/d/y', {
                'placeholder': 'MM/DD/YYYY'
            });
            var selectedId = this.model.get('selectedId');
            var customFromDate = this.model.get('customFromDate');
            var customToDate = this.model.get('customToDate');
            if (selectedId !== undefined && selectedId !== null) {
                this.setDatePickers(customFromDate, customToDate);
                this.$el.find('#' + selectedId).click();
            } else {
                var globalDate = ADK.SessionStorage.getModel('globalDate');
                selectedId = globalDate.get('selectedId');
                this.model.set('selectedId', selectedId);
                this.setDatePickers(customFromDate, customToDate);
            }
        }
    });
    return FilterDateRangeView;
});